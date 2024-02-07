import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Serialize } from '../interceptor/serialize.interceptor';
import { UserDto } from '../users/dtos/user.dto';
import { CurrentUser } from '../users/users.decorator';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { FindReportDto } from './dtos/find-report.dto';
import { ReportDto } from './dtos/report.dto';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
@Serialize(ReportDto)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('/')
  createReport(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: UserDto,
  ): Promise<Report> {
    return this.reportsService.create(createReportDto, user);
  }

  @Get('/')
  getReports(@Query() findReportDto: FindReportDto): Promise<Report> {
    return this.reportsService.find(findReportDto);
  }

  @Patch('/:id/approve')
  approveReport(
    @Param('id') id: string,
    @Body() approveReportDto: ApproveReportDto,
  ) {
    return this.reportsService.approval(+id, approveReportDto);
  }
}
