import { PrismaClient } from '@prisma/client';
import { DMMFClass } from '@prisma/client/runtime';

import { Property } from '../src/Property';
import { Resource } from '../src/Resource';

const findProperty = (
  properties: Array<Property>,
  field: string,
): Property | undefined => properties.find((p) => p.name() === field);

describe('Property', () => {
  let properties: Array<Property>;
  let prisma: PrismaClient;
  let resource: Resource;

  beforeAll(async () => {
    prisma = new PrismaClient();
    const dmmf = ((prisma as any)._dmmf as DMMFClass);
    resource = new Resource({ model: dmmf.modelMap.Post, client: prisma });
    properties = resource.properties();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('#name', () => {
    it('returns a name of the property', () => {
      const property = findProperty(properties, 'id');

      expect(property?.name()).toEqual('id');
    });
  });

  describe('#path', () => {
    it('returns the path of the property', () => {
      const property = findProperty(properties, 'title');

      expect(property?.path()).toEqual('title');
    });
  });

  describe('#isId', () => {
    it('returns true for primary key', () => {
      const property = findProperty(properties, 'id');

      expect(property?.isId()).toEqual(true);
    });

    it('returns false for regular column', () => {
      const property = findProperty(properties, 'title');

      expect(property?.isId()).toEqual(false);
    });
  });

  describe('#isEditable', () => {
    it('returns false for id field', async () => {
      const property = findProperty(properties, 'id');

      expect(property?.isEditable()).toEqual(false);
    });

    it('returns false for createdAt and updatedAt fields', async () => {
      const createdAt = findProperty(properties, 'createdAt');
      const updatedAt = findProperty(properties, 'updatedAt');

      expect(createdAt?.isEditable()).toEqual(false);
      expect(updatedAt?.isEditable()).toEqual(false);
    });

    it('returns true for a regular field', async () => {
      const property = findProperty(properties, 'title');

      expect(property?.isEditable()).toEqual(true);
    });
  });

  describe('#reference', () => {
    it('returns the name of the referenced resource if any', () => {
      const property = findProperty(properties, 'author');

      expect(property?.reference()).toEqual('User');
    });

    it('returns null for regular field', () => {
      const property = findProperty(properties, 'title');

      expect(property?.reference()).toEqual(null);
    });
  });

  describe('#availableValues', () => {
    it('returns null for regular field', () => {
      const property = findProperty(properties, 'title');

      expect(property?.availableValues()).toEqual(null);
    });

    it('returns available values when enum is given', () => {
      const property = findProperty(properties, 'status');

      expect(property?.availableValues()).toEqual(['ACTIVE', 'REMOVED']);
    });
  });

  describe('#type', () => {
    it('returns mixed type for an jsonb property', () => {
      const property = findProperty(properties, 'someJson');

      expect(property?.type()).toEqual('mixed');
    });
  });
});
