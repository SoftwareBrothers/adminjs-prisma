import { PrismaClient } from '@prisma/client';

import { Database } from '../src/Database';

describe('Database', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('.isAdapterFor', () => {
    it('returns true when Prisma Client is given', () => {
      expect(Database.isAdapterFor(prisma)).toEqual(true);
    });

    it('returns false for any other data', () => {
      expect(Database.isAdapterFor({} as any)).toEqual(false);
    });
  });

  describe('#resources', () => {
    it('returns all entities', async () => {
      expect(new Database(prisma).resources()).toHaveLength(3);
    });
  });
});
