import { IsBoolean } from 'class-validator';

export class ApproveReportDto {
  @IsBoolean()
  status: boolean;
}
