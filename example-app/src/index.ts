/* eslint-disable no-underscore-dangle */
import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import { DMMFClass } from '@prisma/client/runtime';

const PORT = process.env.port || 3000;

const prisma = new PrismaClient();

Resource.setClient(prisma);
AdminJS.registerAdapter({ Database, Resource });

const run = async () => {
  const app = express();

  const dmmf = ((prisma as any)._dmmf as DMMFClass);

  const admin = new AdminJS({
    // databases: [prisma],
    resources: [{
      resource: dmmf.modelMap.Post,
      options: {
        properties: {
          someJson: { type: 'mixed', isArray: true },
          'someJson.number': { type: 'number' },
          'someJson.string': { type: 'string' },
          'someJson.boolean': { type: 'boolean' },
          'someJson.date': { type: 'datetime' },
        },
      },
    }, {
      resource: dmmf.modelMap.Profile,
      options: {},
    }, {
      resource: dmmf.modelMap.User,
      options: {},
    }],
  });

  const router = AdminJSExpress.buildRouter(admin);

  app.use(admin.options.rootPath, router);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
};

run()
  .then(() => {
    prisma.$disconnect();
  })
  .catch(() => {
    prisma.$disconnect();
  })
