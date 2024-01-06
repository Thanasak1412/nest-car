import { Controller, Get } from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  @Get()
  getReports() {
    return 'This is a report';
  }
}
