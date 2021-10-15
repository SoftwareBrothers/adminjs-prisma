/* eslint-disable no-underscore-dangle */
import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import { DMMFClass } from '@prisma/client/runtime';

const PORT = process.env.port || 3000;

const prisma = new PrismaClient();

AdminJS.registerAdapter({ Database, Resource });

const run = async () => {
  const app = express();

  const dmmf = ((prisma as any)._dmmf as DMMFClass);

  const admin = new AdminJS({
    resources: [{
      resource: { model: dmmf.modelMap.Post, client: prisma },
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
      resource: { model: dmmf.modelMap.Profile, client: prisma },
      options: {},
    }, {
      resource: { model: dmmf.modelMap.User, client: prisma },
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
  .finally(async () => {
    await prisma.$disconnect();
  });
