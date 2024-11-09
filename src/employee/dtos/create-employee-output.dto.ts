import { Expose } from 'class-transformer';

export class EmployeeOutput {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  positionName: string;

  @Expose()
  positionId: number;
}
