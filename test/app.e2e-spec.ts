import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  // test /api/login
  it('/api/login (POST)', async () => {
    return request(app.getHttpServer())
      .post('/api/login')
      .send({ email: 'paolo.dev.projects@gmail.com', password: 'P@olo2178802' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toEqual({ token: expect.any(String) });
      });
  });

  it('/api/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/api/register')
      .send({
        name: 'paolo',
        email: 'incorrect format email',
        password: 'Password@1234',
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toEqual({
          error: 'Bad Request',
          message: ['email must be an email'],
          statusCode: 400,
        });
      });
  });

  it('/api/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'correct@email.com',
        password: 'Password@1234',
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).toEqual({
          error: 'Bad Request',
          message: [
            'name must be longer than or equal to 3 characters',
            'name must be a string',
          ],
          statusCode: 400,
        });
      });
  });
});
