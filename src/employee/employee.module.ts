import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { EmployeeController } from './controllers/employee.controllers';
import { Employee } from './entities/employee.entity';
import { EmployeeRepository } from './repositories/employee.repository';
import { EmployeeService } from './services/employee.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Employee])],
  providers: [EmployeeService, JwtAuthStrategy, EmployeeRepository],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
