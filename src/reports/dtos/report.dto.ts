import { Expose, Transform } from 'class-transformer';

import { User } from '../../users/user.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  mileage: number;

  @Expose()
  price: number;

  @Expose()
  @Transform(({ obj }) => ({ id: obj.user.id, email: obj.user.email }))
  user: User;
}
