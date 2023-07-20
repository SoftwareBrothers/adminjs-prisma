/* eslint-disable class-methods-use-this */
import { Prisma, PrismaClient } from '@prisma/client';
import { DMMF } from '@prisma/client/runtime/library.js';
import { BaseDatabase } from 'adminjs';

import { Resource } from './Resource.js';

export class Database extends BaseDatabase {
  private client: PrismaClient;

  private clientModule?: any;

  public constructor(args: { client: PrismaClient, clientModule?: any }) {
    super(args);
    const { client, clientModule } = args;

    this.client = client;
    this.clientModule = clientModule;
  }

  public resources(): Array<Resource> {
    const dmmf = this.clientModule?.Prisma.dmmf.datamodel ?? Prisma.dmmf.datamodel;

    if (!dmmf?.models) return [];

    return dmmf.models.map((model: DMMF.Model) => {
      const resource = new Resource({ model, client: this.client });
      return resource;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static isAdapterFor(args: { client?: PrismaClient, clientModule?: any }): boolean {
    const { clientModule } = args;

    const dmmf = clientModule?.Prisma.dmmf.datamodel ?? Prisma.dmmf.datamodel;

    return dmmf?.models?.length > 0;
  }
}
