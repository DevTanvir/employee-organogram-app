import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, TreeRepository } from 'typeorm';

import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeeRepository extends TreeRepository<Employee> {
  constructor(private dataSource: DataSource) {
    super(Employee, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Employee> {
    const employee = await this.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Supervisor with id ${id} not found`);
    }

    return employee;
  }
  async getDirectReportsByEmployee(employee: Employee): Promise<Employee[]> {
    const directReports = await this.findDescendantsTree(employee);
    return [directReports];
  }
}
