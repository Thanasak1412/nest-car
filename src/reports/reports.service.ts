import { Repository } from 'typeorm';

import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserDto } from '../users/dtos/user.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { FindReportDto } from './dtos/find-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  create(createReportDto: CreateReportDto, user: UserDto): Promise<Report> {
    try {
      const createReport = this.reportsRepository.create({
        ...createReportDto,
        user,
      });

      return this.reportsRepository.save(createReport);
    } catch (error) {
      console.error('Failed while create report => ', error);

      throw new BadRequestException(error);
    }
  }

  async find(findReportDto: FindReportDto): Promise<Report> {
    try {
      const find = await this.reportsRepository.findOne({
        where: findReportDto,
      });

      if (!find) {
        throw new NotFoundException(
          `Not found report with: ${JSON.stringify(findReportDto)}`,
          `Error from: ${this.find.name}`,
        );
      }

      return find;
    } catch (error) {
      console.error('Failed while find report => ', error);

      if (error.response.statusCode === HttpStatus.NOT_FOUND) {
        throw error;
      }

      throw new BadRequestException(error);
    }
  }

  async approval(
    id: number,
    approveReportDto: ApproveReportDto,
  ): Promise<Report> {
    const { status } = approveReportDto;

    try {
      const find = await this.find({ id });

      const approveReport = this.reportsRepository.create({
        ...find,
        approved: status,
      });

      return this.reportsRepository.save(approveReport);
    } catch (error) {
      console.error('Failed while approve the report => ', error);

      if (error.response?.error) {
        throw error;
      }

      throw new BadRequestException(error);
    }
  }

  async createEstimate(query: GetEstimateDto): Promise<{ price: number }> {
    const { model, make, lat, lng, mileage, year } = query;

    try {
      const execResult = await this.reportsRepository
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('model = :model', { model })
        .andWhere('make = :make', { make })
        .andWhere('lat - :lat BETWEEN -3 AND 3', { lat })
        .andWhere('lng - :lng BETWEEN -3 AND 3', { lng })
        .andWhere('year - :year BETWEEN 0 AND 5 ', { year })
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .limit(3)
        .setParameters({ mileage })
        .getRawOne<{ price: number }>();

      if (!execResult.price) {
        throw new NotFoundException(
          `Data not found with: ${JSON.stringify(query)}`,
        );
      }

      return execResult;
    } catch (error) {
      console.error('Failed while create estimate => ', error);

      if (error.response?.error) {
        throw error;
      }

      throw new BadRequestException(error.message);
    }
  }
}
