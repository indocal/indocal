import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const {
    ROOT_USER_USERNAME,
    ROOT_USER_EMAIL,
    ROOT_USER_NAME,
    ROOT_USER_PASSWORD,
  } = process.env;

  if (
    !ROOT_USER_USERNAME ||
    !ROOT_USER_EMAIL ||
    !ROOT_USER_NAME ||
    !ROOT_USER_PASSWORD
  )
    throw new Error('Missing ROOT_USER env vars');

  const models = Object.keys(prisma).filter((key) => !key.startsWith('_'));

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(ROOT_USER_PASSWORD, salt);

  // TODO: refactor seed, role-permission-panel and CASL
  await prisma.user.create({
    data: {
      username: ROOT_USER_USERNAME,
      email: ROOT_USER_EMAIL,
      name: ROOT_USER_NAME,
      password: hash,
      roles: {
        create: {
          type: 'developer',
          name: 'Desarrollador',
          description: 'Rol libre de restricciones con fines de desarrollo',
          config: {
            access: {
              studio: 'ADMIN',
              hub: 'ADMIN',
              nobu: 'ADMIN',
              events: 'ADMIN',
              trainings: 'ADMIN',
              warehouse: 'ADMIN',
            },
          },
          permissions: {
            createMany: {
              data: models
                .map((model) =>
                  ['count', 'create', 'read', 'update', 'delete'].map(
                    (action) => ({ action: `${model}::${action}` })
                  )
                )
                .flat(),
            },
          },
        },
      },
    },
  });
}

main().finally(async () => await prisma.$disconnect());
