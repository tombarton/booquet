import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'set-cookie-parser';
import {
  createTestApplication,
  createTestUser,
  deleteTestUser,
  testUserData,
} from './utils';

const gqlEndpoint = '/graphql';

describe('Auth Resolver', () => {
  let app: INestApplication;
  let cookie: string[];

  beforeAll(async () => {
    app = await createTestApplication();
    await app.init();
    await createTestUser();
  });

  afterAll(async () => {
    await app.close();
    await deleteTestUser();
  });

  const formatGraphQLData = (data: any) =>
    JSON.stringify(data).replace(/\"([^(\")"]+)\":/g, '$1:');

  it('should log the user in', done => {
    const loginQuery = `
    mutation {
      login(data: ${formatGraphQLData({
        email: testUserData.email,
        password: testUserData.password,
      })}) {
        id
        email
        firstname
        lastname
      }
    }
  `;

    return request(app.getHttpServer())
      .post(gqlEndpoint)
      .send({
        operationName: null,
        query: loginQuery,
      })
      .expect(
        ({
          body: {
            data: { login },
          },
        }) => {
          expect(login.id).toBeDefined();
        }
      )
      .expect(200)
      .end((err, res) => {
        const cookies = cookieParser.parse(res.header['set-cookie']);
        cookie = [
          cookies.reduce(
            (acc, cookie) =>
              acc.concat(
                `${acc.length ? ';' : ''}${cookie.name}=${cookie.value}`
              ),
            ''
          ),
        ];

        done();
      });
  });

  it('allows a user to change their password', () => {
    const changePasswordMutation = `
      mutation {
        changePassword(data: ${formatGraphQLData({
          oldPassword: testUserData.password,
          newPassword: 'worldhello',
        })}) {
          id
        }
      }
    `;

    return request(app.getHttpServer())
      .post(gqlEndpoint)
      .set('Cookie', cookie)
      .send({
        operationName: null,
        query: changePasswordMutation,
      })
      .expect(
        ({
          body: {
            data: { changePassword },
          },
        }) => {
          expect(changePassword.id).toBeDefined();
        }
      )
      .expect(200);
  });
});
