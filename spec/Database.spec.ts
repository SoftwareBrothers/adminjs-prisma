import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';

import { Database } from '../src/Database.js';

jest.useFakeTimers();

describe('Database', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('.isAdapterFor', () => {
    it('returns true when Prisma is properly initialized', () => {
      expect(Database.isAdapterFor(prisma)).toEqual(true);
    });
  });

  describe('#resources', () => {
    it('returns all entities', async () => {
      expect(new Database(prisma).resources()).toHaveLength(4);
    });
  });
});
