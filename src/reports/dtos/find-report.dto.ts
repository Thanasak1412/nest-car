import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindReportDto {
  @IsString()
  @IsOptional()
  make: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  mileage: number;

  @IsNumber()
  @IsOptional()
  year: number;
}
