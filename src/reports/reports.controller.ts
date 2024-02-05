import { Body, Controller, Post } from '@nestjs/common';

import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('/')
  createReport(@Body() createReportDto: CreateReportDto): Promise<Report> {
    return this.reportsService.create(createReportDto);
  }
}
