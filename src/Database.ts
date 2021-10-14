/* eslint-disable class-methods-use-this */
import { PrismaClient } from '@prisma/client';
import { DMMF, DMMFClass } from '@prisma/client/runtime';
import { BaseDatabase } from 'adminjs';

import { Resource } from './Resource';

export class Database extends BaseDatabase {
  public constructor(public readonly prisma: PrismaClient) {
    super(prisma);
    Resource.setClient(prisma);
  }

  public resources(): Array<Resource> {
    const dmmf = (Resource.prismaClient as any)._dmmf as DMMFClass;
    const { modelMap } = dmmf;

    if (!modelMap) return [];

    return Object.values(modelMap).reduce((memo: Resource[], model: DMMF.Model) => {
      const resource = new Resource(model);
      memo.push(resource);

      return memo;
    }, []);
  }

  public static isAdapterFor(prisma: PrismaClient): boolean {
    const dmmf = ((prisma as any)._dmmf as DMMFClass);

    return !!dmmf?.modelMap && !!Object.values(dmmf?.modelMap ?? {}).length;
  }
}
