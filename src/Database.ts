/* eslint-disable class-methods-use-this */
import { BaseDatabase } from 'adminjs';

import { Resource } from './Resource.js';
import { PrismaMetadata } from './types.js';

export class Database extends BaseDatabase {
  protected client: any;

  protected metadata: PrismaMetadata;

  public constructor(args: { client: any, dmmf: PrismaMetadata }) {
    super(args);
    const { client, dmmf } = args;

    this.client = client;
    this.metadata = dmmf;
  }

  public resources(): Array<Resource> {
    if (!this.metadata?.models) return [];

    const resources: Array<Resource> = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const model of Object.values(this.metadata.models)) {
      const resource = new Resource({
        model,
        client: this.client,
        enums: this.metadata.enums ?? {},
      });
      resources.push(resource);
    }

    return resources;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static isAdapterFor(args: { client?: any, dmmf?: PrismaMetadata }): boolean {
    const { dmmf } = args;

    return !!dmmf?.models;
  }
}
