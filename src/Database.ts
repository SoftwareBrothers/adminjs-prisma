/* eslint-disable class-methods-use-this */
import { PrismaClient } from '@prisma/client';
import { DMMF, DMMFClass } from '@prisma/client/runtime';
import { BaseDatabase } from 'adminjs';

import { Resource } from './Resource.js';

export class Database extends BaseDatabase {
  private client: PrismaClient;

  public constructor(public readonly prisma: PrismaClient) {
    super(prisma);
    this.client = prisma;
  }

  public resources(): Array<Resource> {
    const dmmf = (this.client as any)._baseDmmf as DMMFClass;
    const { modelMap } = dmmf;

    if (!modelMap) return [];

    return Object.values(modelMap).map((model: DMMF.Model) => {
      const resource = new Resource({ model, client: this.client });
      return resource;
    });
  }

  public static isAdapterFor(prisma: PrismaClient): boolean {
    const dmmf = ((prisma as any)._baseDmmf as DMMFClass);

    return !!dmmf?.modelMap && !!Object.values(dmmf?.modelMap ?? {}).length;
  }
}
