import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/services/prisma.service';
import { createTestApplication, testUserData } from './utils';
import * as cookieParser from 'set-cookie-parser';
import { IncomingMessage } from 'http';

const gqlEndpoint = '/graphql';

describe('Auth Resolver', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    // Clean up database.
    const prismaService = new PrismaService();
    await prismaService.user.delete({ where: { email: testUserData.email } });
    await prismaService.disconnect();
  });

  const formatGraphQLData = (data: any) =>
    JSON.stringify(data).replace(/\"([^(\")"]+)\":/g, '$1:');

  it('allows a new user to be created', () => {
    const createUserQuery = `
      mutation {
        signup(data: ${formatGraphQLData(testUserData)}) {
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
        query: createUserQuery,
      })
      .expect(
        ({
          body: {
            data: { signup },
          },
        }) => {
          expect(signup.id).toBeDefined();
          expect(signup.email).toEqual(testUserData.email);
          expect(signup.firstname).toEqual(testUserData.firstname);
          expect(signup.lastname).toEqual(testUserData.lastname);
        }
      )
      .expect(200);
  });
  it('allows a user to login', () => {
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
      .expect((res: IncomingMessage) => {
        // Ensure all cookies are set and present.
        const cookies = cookieParser.parse(res);
        const signature =
          cookies.find(i => i.name === 'signature') ||
          ({} as cookieParser.Cookie);
        const partialJwt =
          cookies.find(i => i.name === 'partialJwt') ||
          ({} as cookieParser.Cookie);

        expect(signature.name).toEqual('signature');
        expect(signature.httpOnly).toEqual(true);
        expect(signature.value).toBeDefined();

        expect(partialJwt.name).toEqual('partialJwt');
        expect(partialJwt.value).toBeDefined();
      })
      .expect(
        ({
          body: {
            data: { login },
          },
        }) => {
          expect(login.id).toBeDefined();
          expect(login.email).toEqual(testUserData.email);
          expect(login.firstname).toEqual(testUserData.firstname);
          expect(login.lastname).toEqual(testUserData.lastname);
        }
      );
  });
});
