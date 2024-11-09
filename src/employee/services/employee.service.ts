import { Injectable } from '@nestjs/common';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateEmployeeInput } from '../dtos/create-employee-input.dto';
import { EmployeeOutput } from '../dtos/create-employee-output.dto';
import { EmployeeHierarchyOutput } from '../dtos/get-employees-output.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';

@Injectable()
export class EmployeeService {
  constructor(
    private repository: EmployeeRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(EmployeeService.name);
  }

  async getDirectReports(
    ctx: RequestContext,
    id: number,
  ): Promise<EmployeeHierarchyOutput[]> {
    this.logger.log(ctx, `${this.getDirectReports.name} was called`);

    this.logger.log(ctx, `calling ${EmployeeRepository.name}.getById`);
    const rootEmployee = await this.repository.getById(id);

    this.logger.log(
      ctx,
      `calling ${EmployeeRepository.name}.getDirectReportsByEmployee`,
    );
    const directReports =
      await this.repository.getDirectReportsByEmployee(rootEmployee);

    return directReports;
  }

  async createEmployee(
    ctx: RequestContext,
    input: CreateEmployeeInput,
  ): Promise<EmployeeOutput> {
    this.logger.log(ctx, `${this.createEmployee.name} was called`);

    const employee = new Employee();
    employee.name = input.name;
    employee.positionName = input.positionName;

    if (input.supervisorId) {
      this.logger.log(ctx, `calling ${EmployeeRepository.name}.getById`);

      const supervisor = await this.repository.getById(input.supervisorId);
      employee.positionId = supervisor.positionId + 1;
      employee.supervisor = supervisor;
    }

    if (!employee.supervisor) {
      employee.positionId = 1;
    }

    this.logger.log(ctx, `calling ${EmployeeRepository.name}.save`);
    const savedEmployee = await this.repository.save(employee);
    return savedEmployee;
  }
}
