import { PrismaClient } from '@prisma/client';
import { DMMFClass } from '@prisma/client/runtime';
import { BaseProperty, BaseRecord, Filter } from 'adminjs';

import { Resource } from '../src/Resource';

describe('Resource', () => {
  let resource: Resource;
  let prisma: PrismaClient;
  let dmmf: DMMFClass;

  const data = {
    name: 'Someone',
    email: 'random@email.com',
  };

  beforeAll(async () => {
    prisma = new PrismaClient();
    dmmf = ((prisma as any)._dmmf as DMMFClass);
  });

  beforeEach(async () => {
    Resource.setClient(prisma);
    resource = new Resource(dmmf.modelMap.User);

    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.post.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('.isAdapterFor', () => {
    it('returns false if `prismaClient` is not set before', () => {
      Resource.setClient(null as any);
      expect(Resource.isAdapterFor(dmmf.modelMap.Post)).toEqual(false);
    });

    it('returns true when Entity is given and `prismaClient` is set', () => {
      Resource.setClient(prisma);
      expect(Resource.isAdapterFor(dmmf.modelMap.Post)).toEqual(true);
    });

    it('returns false for any other kind of resources', () => {
      Resource.setClient(prisma);
      expect(Resource.isAdapterFor({} as any)).toEqual(false);
    });
  });

  describe('#databaseType', () => {
    it('returns database dialect', () => {
      expect(resource.databaseType()).toEqual('postgresql');
    });
  });

  describe('#id', () => {
    it('returns the name of the entity', () => {
      expect(resource.id()).toEqual('User');
    });
  });

  describe('#properties', () => {
    it('returns all the properties', () => {
      expect(resource.properties()).toHaveLength(3);
    });

    it('returns all properties with the correct position', () => {
      expect(
        resource.properties().map((property) => property.position()),
      ).toEqual([0, 1, 2]);
    });
  });

  describe('#property', () => {
    it('returns selected property', () => {
      const property = resource.property('id');

      expect(property).toBeInstanceOf(BaseProperty);
    });
  });

  describe('#count', () => {
    it('returns number of records', async () => {
      expect(await resource.count({} as Filter)).toEqual(0);
    });
  });

  describe('#create', () => {
    it('returns params', async () => {
      const params = await resource.create(data);

      expect(params.id).toBeDefined();
    });
  });

  describe('#update', () => {
    let record: BaseRecord | null;

    it('updates record name', async () => {
      const params = await resource.create(data);
      record = await resource.findOne(params.id);
      const name = 'Michael';

      await resource.update((record && record.id()) as string, {
        name,
      });
      const recordInDb = await resource.findOne(
        (record && record.id()) as string,
      );

      expect(recordInDb && recordInDb.get('name')).toEqual(name);
    });
  });

  describe('references', () => {
    let profile;
    let user;
    let profileResource;

    beforeEach(async () => {
      user = await resource.create(data);
      profileResource = new Resource(dmmf.modelMap.Profile);
    });

    it('creates new resource', async () => {
      profile = await profileResource.create({
        bio: 'Example',
        user: user.id,
      });

      expect(profile.user).toEqual(user.id);
    });
  });

  describe('#delete', () => {
    let user;

    beforeEach(async () => {
      user = await resource.create(data);
    });

    it('deletes the resource', async () => {
      await resource.delete(user.id);
      expect(await resource.count({} as Filter)).toEqual(0);
    });
  });
});
