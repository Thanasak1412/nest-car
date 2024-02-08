import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
  @IsOptional()
  @IsString()
  make: string;

  @IsOptional()
  @IsString()
  model: string;

  @IsOptional()
  @IsNumber()
  @IsLatitude()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsOptional()
  @IsNumber()
  @IsLongitude()
  @Min(-180)
  @Max(180)
  lng: number;

  @IsOptional()
  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear())
  year: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
