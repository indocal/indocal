import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const root = [
    process.env.ROOT_USER_USERNAME,
    process.env.ROOT_USER_EMAIL,
    process.env.ROOT_USER_NAME,
    process.env.ROOT_USER_PASSWORD,
  ];

  if (root.some((env) => !env)) throw new Error('Missing ROOT_USER env vars');

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(String(process.env.ROOT_USER_PASSWORD), salt);

  const permissions = [
    {
      scope: 'apiToken',
      actions: [
        'count',
        'read',
        'create',
        'update',
        'delete',
        'get-access-token',
      ],
    },
    {
      scope: 'log',
      actions: ['count', 'read'],
    },
    {
      scope: 'user',
      actions: ['count', 'read', 'create', 'update', 'delete'],
    },
    {
      scope: 'userRole',
      actions: ['count', 'read', 'create', 'update', 'delete'],
    },
    {
      scope: 'userGroup',
      actions: ['count', 'read', 'create', 'update', 'delete'],
    },
    {
      scope: 'form',
      actions: [
        'count',
        'read',
        'create',
        'update',
        'delete',
        'generate-reports',
      ],
    },
    {
      scope: 'formField',
      actions: ['count', 'read', 'create', 'update', 'delete'],
    },
    {
      scope: 'formEntry',
      actions: ['count', 'read', 'create', 'delete'],
    },
    {
      scope: 'service',
      actions: [
        'count',
        'read',
        'create',
        'update',
        'delete',
        'generate-reports',
      ],
    },
    {
      scope: 'serviceRequest',
      actions: ['count', 'read', 'create', 'update', 'delete'],
    },
    {
      scope: 'serviceCertificate',
      actions: ['count', 'read', 'create', 'update', 'delete'],
    },
    {
      scope: 'file',
      actions: ['count', 'read', 'upload', 'replace', 'update', 'delete'],
    },
    {
      scope: 'folder',
      actions: ['count', 'read', 'create', 'update', 'delete'],
    },
    {
      scope: 'comment',
      actions: ['count', 'read', 'create', 'update', 'delete'],
    },
    {
      scope: 'supply',
      actions: ['count', 'read', 'create', 'update', 'delete', 'get-prices'],
    },
    {
      scope: 'supplier',
      actions: ['count', 'read', 'create', 'update', 'delete'],
    },
    {
      scope: 'order',
      actions: ['count', 'read', 'create', 'update', 'delete', 'receive-items'],
    },
    {
      scope: 'inventoryMovement',
      actions: ['count', 'read', 'create'],
    },
    {
      scope: 'supplyRequest',
      actions: ['count', 'read', 'create', 'dispatch-items'],
    },
  ];

  await prisma.user.create({
    data: {
      username: process.env.ROOT_USER_USERNAME as string,
      email: process.env.ROOT_USER_EMAIL as string,
      name: process.env.ROOT_USER_NAME as string,
      password: hash,
      roles: {
        create: {
          type: 'developer',
          name: 'Desarrollador',
          description: 'Rol libre de restricciones con fines de desarrollo',
          config: {
            access: {
              studio: 'ALLOWED',
              hub: 'ALLOWED',
              app: 'ALLOWED',
              nobu: 'ALLOWED',
              warehouse: 'ALLOWED',
            },
          },
          permissions: {
            createMany: {
              skipDuplicates: true,
              data: permissions
                .map(({ scope, actions }) =>
                  actions.map((action) => ({
                    action: `${scope}::${action}`,
                  }))
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
