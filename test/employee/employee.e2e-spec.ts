import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { AuthTokenOutput } from '../../src/auth/dtos/auth-token-output.dto';
import {
  closeDBAfterTest,
  createDBEntities,
  resetDBBeforeTest,
  seedUser,
} from '../test-utils';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let authTokenForUser: AuthTokenOutput;

  beforeAll(async () => {
    await resetDBBeforeTest();
    await createDBEntities();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    ({ authTokenForUser } = await seedUser(app));
  });

  describe('Create Employee', () => {
    const expectedOutput = {
      id: 1,
      name: 'Test Employee',
      positionName: 'Test Position',
      positionId: 1,
    };
    it('should create Employee', async () => {
      return request(app.getHttpServer())
        .post('/employees')
        .set('Authorization', 'Bearer ' + authTokenForUser.accessToken)
        .send({
          name: 'Test Employee',
          positionName: 'Test Position',
        })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.data).toEqual(expectedOutput);
        });
    });
  });

  describe('Get Direct Reports', () => {
    const output = [
      {
        id: 1,
        name: 'Test Employee',
        positionName: 'Test Position',
        positionId: 1,
        directReports: [],
      },
    ];

    it('should return direct reports when found', async () => {
      return request(app.getHttpServer())
        .get('/employees/1/direct-reports')
        .set('Authorization', 'Bearer ' + authTokenForUser.accessToken)
        .expect(HttpStatus.OK)
        .expect({ data: output, meta: {} });
    });
  });

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });
});
