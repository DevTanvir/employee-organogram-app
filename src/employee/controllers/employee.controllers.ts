import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateEmployeeInput } from '../dtos/create-employee-input.dto';
import { EmployeeOutput } from '../dtos/create-employee-output.dto';
import { EmployeeHierarchyOutput } from '../dtos/get-employees-output.dto';
import { EmployeeService } from '../services/employee.service';

@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(EmployeeController.name);
  }

  @Get(':id/direct-reports')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get Direct Reports API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([EmployeeHierarchyOutput]),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async getDirectReports(
    @ReqContext() ctx: RequestContext,
    @Query('id') id: number,
  ): Promise<BaseApiResponse<EmployeeHierarchyOutput[]>> {
    this.logger.log(ctx, `${this.getDirectReports.name} was called`);

    const output = await this.employeeService.getDirectReports(ctx, id);
    return { data: output, meta: {} };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Create employee API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(EmployeeOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async createEmployee(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateEmployeeInput,
  ): Promise<BaseApiResponse<EmployeeOutput>> {
    this.logger.log(ctx, `${this.createEmployee.name} was called`);

    const output = await this.employeeService.createEmployee(ctx, input);
    return { data: output, meta: {} };
  }
}
