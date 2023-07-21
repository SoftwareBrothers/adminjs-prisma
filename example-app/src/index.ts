/* eslint-disable no-underscore-dangle */
import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource, getModelByName } from '@adminjs/prisma';

// eslint-disable-next-line import/no-relative-packages
import PrismaModule from '../prisma/client-prisma/index.js';

const PORT = process.env.port || 3000;

const prisma = new PrismaModule.PrismaClient();

AdminJS.registerAdapter({ Database, Resource });

const run = async () => {
  const app = express();

  const admin = new AdminJS({
    resources: [{
      resource: { model: getModelByName('Post', PrismaModule), client: prisma, clientModule: PrismaModule },
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
      resource: { model: getModelByName('Profile', PrismaModule), client: prisma, clientModule: PrismaModule },
      options: {},
    }, {
      resource: { model: getModelByName('Publisher', PrismaModule), client: prisma, clientModule: PrismaModule },
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
