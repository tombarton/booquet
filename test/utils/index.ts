import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { Role } from '../../src/models/user';

const prisma = new PrismaService();

export const createTestApplication = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  return moduleFixture.createNestApplication();
};

export const testUserData = {
  firstname: 'Cyndey',
  lastname: 'Walters',
  email: 'cyndey.walters@gmail.com',
  password: 'helloworld',
};

export const createTestUser = async () => {
  await prisma.connect();
  await prisma.user.create({
    data: {
      ...testUserData,
      role: Role.USER,
      // @TODO: This should probably be in an env var, and not stored in git.
      password: '$2b$10$Zk0Gb0ZB2H.rySSy5l98iORXriIVBlkBoOxtHaTtw9Rm5FtCO1OES',
    },
  });
  await prisma.disconnect();
};

export const deleteTestUser = async () => {
  await prisma.connect();
  await prisma.user.delete({ where: { email: testUserData.email } });
  await prisma.disconnect();
};
