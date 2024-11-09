import { Test, TestingModule } from '@nestjs/testing';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;

  const mockedRepository = {
    save: jest.fn(),
    getDirectReportsByEmployee: jest.fn(),
    getById: jest.fn(),
  };

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: EmployeeRepository, useValue: mockedRepository },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('getDirectReports', () => {
    it('should return direct reports when found', async () => {
      const id = 1;
      const expectedOutput = {
        id: 1,
        name: 'Jhon Doe',
        positionName: 'CTO',
        positionId: '1',
        directReports: [
          {
            id: 2,
            name: 'Jhon Doe',
            positionName: 'Lead Engineer',
            positionId: '2',
            directReports: [
              {
                id: 3,
                name: 'Lang Doe',
                positionName: 'Senior Engineer',
                positionId: '3',
                directReports: [],
              },
            ],
          },
        ],
      };

      const supervisor = new Employee();
      mockedRepository.getById.mockResolvedValue(supervisor);

      mockedRepository.getDirectReportsByEmployee.mockResolvedValue([
        expectedOutput,
      ]);

      const output = await service.getDirectReports(ctx, id);
      expect(output).toEqual([expectedOutput]);
    });

    it('should fail when supervisor is not found and return the repository error', async () => {
      const id = 1;

      mockedRepository.getById.mockRejectedValue({
        message: 'error',
      });

      try {
        await service.getDirectReports(ctx, id);
      } catch (error: any) {
        expect(error.message).toEqual('error');
      }
    });
  });

  describe('createEmployee', () => {
    it('should create an employee with position 1 when supervisor id found', async () => {
      const input = {
        name: 'Jhon Doe',
        positionName: 'CTO',
      };

      const expectedOutput = {
        id: 1,
        name: 'Jhon Doe',
        positionName: 'CTO',
        positionId: 1,
      };

      const employee = new Employee();
      employee.id = 1;
      employee.positionName = 'CTO';
      employee.positionId = 1;
      employee.name = 'Jhon Doe';

      mockedRepository.save.mockResolvedValue(employee);

      const output = await service.createEmployee(ctx, input);
      expect(output).toEqual(expectedOutput);
    });

    it('should create an with supervisor position + 1 when supervisor id is given', async () => {
      const input = {
        name: 'Lang Doe',
        positionName: 'Lead Engineer',
        supervisorId: 1,
      };

      const foundSuperVisor = {
        id: 1,
        name: 'Jhon Doe',
        positionName: 'CTO',
        positionId: 1,
      };

      mockedRepository.getById.mockResolvedValue(foundSuperVisor);

      const employeeOutput = {
        id: 2,
        name: 'Lang Doe',
        positionName: 'Lead Engineer',
        positionId: 2,
        supervisorId: 1,
      };

      mockedRepository.save.mockResolvedValue(employeeOutput);

      const output = await service.createEmployee(ctx, input);
      expect(output).toEqual(employeeOutput);
    });
  });
});
