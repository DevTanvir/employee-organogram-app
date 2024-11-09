import { Expose } from 'class-transformer';

export class EmployeeHierarchyOutput {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  positionName: string;

  @Expose()
  positionId: number;

  @Expose()
  directReports: EmployeeHierarchyOutput[];
}
