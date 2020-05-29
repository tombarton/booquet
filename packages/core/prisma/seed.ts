import { PrismaClient, OrderStatus } from '@prisma/client';
import faker from 'faker';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

function randomEnum<T>(enumValue: T): T[keyof T] {
  const values = Object.keys(enumValue);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[`${randomIndex}`];
}

const addUsers = async (quantity = 15) => {
  for (let i = 0; i < quantity; ++i) {
    await prisma.user.create({
      data: {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password:
          '$2b$10$V4fiGDldOsbS/pkgJLhDhu13UDq4vzbjXSx1h1HpNmd7.5OeBjyyy', // hello-world
        role: 'USER',
        Order: {
          create: {
            items: {
              create: {
                id: faker.random.uuid(),
                title: faker.commerce.product(),
                image: faker.image.imageUrl(),
                price: parseInt(faker.commerce.price(), 10),
                quantity: faker.random.number(4),
              },
            },
            total: parseInt(faker.commerce.price()),
            status: 'PENDING',
            chargeId: null,
          },
        },
      },
    });
  }
};

const addOrders = async (quantity = 15) => {
  for (let i = 0; i < quantity; ++i) {
    await prisma.order.create({
      data: {
        items: {
          create: {
            title: faker.commerce.product(),
            image: faker.image.imageUrl(),
            price: parseInt(faker.commerce.price(), 10),
            quantity: faker.random.number(4),
          },
        },
        total: parseInt(faker.commerce.price()),
        status: randomEnum(OrderStatus),
        chargeId: null,
      },
    });
  }
};

async function main() {
  dotenv.config();
  console.info('Seeding...');

  await addUsers(40);
  await addOrders(150);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.disconnect());
