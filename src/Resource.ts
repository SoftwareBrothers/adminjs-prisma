/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { BaseResource, Filter, BaseRecord, flat } from 'adminjs';
import { PrismaClient } from '@prisma/client';
import { DMMF } from '@prisma/client/runtime/library.js';

import { Property } from './Property.js';
import { lowerCase } from './utils/helpers.js';
import { ModelManager, Enums } from './types.js';
import { convertFilter, convertParam } from './utils/converters.js';
import { getEnums } from './utils/get-enums.js';

export class Resource extends BaseResource {
  protected client: PrismaClient;

  protected model: DMMF.Model;

  protected enums: Enums;

  protected manager: ModelManager;

  protected propertiesObject: Record<string, Property>;

  protected idProperty: Property;

  constructor(args: {
    model: DMMF.Model;
    client: PrismaClient;
    clientModule?: any;
  }) {
    super(args);

    const { model, client, clientModule } = args;
    this.model = model;
    this.client = client;
    this.enums = getEnums(clientModule);
    this.manager = this.client[lowerCase(model.name)];
    this.propertiesObject = this.prepareProperties();
    this.idProperty = this.properties().find((p) => p.isId())!;
  }

  public databaseName(): string {
    return 'prisma';
  }

  public databaseType(): string {
    return (this.client as any)._engineConfig?.activeProvider ?? 'database';
  }

  public id(): string {
    return this.model.name;
  }

  public properties(): Array<Property> {
    return [...Object.values(this.propertiesObject)];
  }

  public property(path: string): Property | null {
    return this.propertiesObject[path] ?? null;
  }

  public build(params: Record<string, any>): BaseRecord {
    return new BaseRecord(flat.unflatten(params), this);
  }

  public async count(filter: Filter): Promise<number> {
    return this.manager.count({
      where: convertFilter(this.model.fields, filter),
    });
  }

  public async find(
    filter: Filter,
    params: {
      limit?: number;
      offset?: number;
      sort?: {
        sortBy?: string;
        direction?: 'asc' | 'desc';
      };
    } = {},
  ): Promise<Array<BaseRecord>> {
    const { limit = 10, offset = 0, sort = {} } = params;

    const orderBy = this.buildSortBy(sort);
    const results = await this.manager.findMany({
      where: convertFilter(this.model.fields, filter),
      skip: offset,
      take: limit,
      orderBy,
    });

    return results.map(
      (result) => new BaseRecord(this.prepareReturnValues(result), this),
    );
  }

  protected buildSortBy(sort: { sortBy?: string; direction?: 'asc' | 'desc' } = {}) {
    let { sortBy: path } = sort;
    const { direction = 'desc' } = sort;

    if (!path) path = this.idProperty.path();

    const [basePath, sortBy] = path.split('.');
    const sortByProperty = this.property(basePath);

    if (
      sortByProperty?.column.relationName
      && sortByProperty?.column.kind === 'object'
      && sortByProperty.column.relationToFields?.length
    ) {
      return {
        [basePath]: {
          [sortBy ?? sortByProperty.column.relationToFields[0]]: direction,
        },
      };
    }

    return {
      [basePath]: direction,
    };
  }

  public async findOne(id: string | number): Promise<BaseRecord | null> {
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty) return null;

    const result = await this.manager.findUnique({
      where: {
        [idProperty.path()]: convertParam(idProperty, this.model.fields, id),
      },
    });
    if (!result) return null;

    return new BaseRecord(this.prepareReturnValues(result), this);
  }

  public async findMany(
    ids: Array<string | number>,
  ): Promise<Array<BaseRecord>> {
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty) return [];

    const results = await this.manager.findMany({
      where: {
        [idProperty.path()]: {
          in: ids.map((id) => convertParam(idProperty, this.model.fields, id)),
        },
      },
    });

    return results.map(
      (result) => new BaseRecord(this.prepareReturnValues(result), this),
    );
  }

  public async create(
    params: Record<string, any>,
  ): Promise<Record<string, any>> {
    const preparedParams = this.prepareParams(params);

    const result = await this.manager.create({ data: preparedParams });

    return this.prepareReturnValues(result);
  }

  public async update(
    pk: string | number,
    params: Record<string, any> = {},
  ): Promise<Record<string, any>> {
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty) return {};

    const preparedParams = this.prepareParams(params);

    const result = await this.manager.update({
      where: {
        [idProperty.path()]: convertParam(idProperty, this.model.fields, pk),
      },
      data: preparedParams,
    });

    return this.prepareReturnValues(result);
  }

  public async delete(id: string | number): Promise<void> {
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty) return;

    await this.manager.delete({
      where: {
        [idProperty.path()]: convertParam(idProperty, this.model.fields, id),
      },
    });
  }

  public static isAdapterFor(args: {
    model: DMMF.Model;
    client: PrismaClient;
  }): boolean {
    const { model, client } = args;

    return (
      !!model?.name
      && !!model?.fields.length
      && !!client?.[lowerCase(model.name)]
    );
  }

  protected prepareProperties(): { [propertyPath: string]: Property } {
    const { fields = [] } = this.model;

    const properties = fields.reduce((memo, field) => {
      if (
        field.isReadOnly
        || (field.relationName && !field.relationFromFields?.length)
      ) {
        return memo;
      }

      const property = new Property(
        field,
        Object.keys(memo).length,
        this.enums,
      );
      memo[property.path()] = property;

      return memo;
    }, {});

    return properties;
  }

  protected prepareParams(params: Record<string, any>): Record<string, any> {
    const preparedParams: Record<string, any> = {};

    for (const property of this.properties()) {
      const param = flat.get(params, property.path());
      const key = property.path();

      // eslint-disable-next-line no-continue
      if (param === undefined) continue;

      const type = property.type();
      const foreignColumnName = property.foreignColumnName();

      if (type === 'reference' && foreignColumnName) {
        preparedParams[foreignColumnName] = convertParam(
          property,
          this.model.fields,
          param,
        );

        // eslint-disable-next-line no-continue
        continue;
      }

      if (property.isArray()) {
        preparedParams[key] = param
          ? param.map((p) => convertParam(property, this.model.fields, p))
          : param;
      } else {
        preparedParams[key] = convertParam(property, this.model.fields, param);
      }
    }

    return preparedParams;
  }

  protected prepareReturnValues(
    params: Record<string, any>,
  ): Record<string, any> {
    const preparedValues: Record<string, any> = {};

    for (const property of this.properties()) {
      const param = flat.get(params, property.path());
      const key = property.path();

      if (param !== undefined && property.type() !== 'reference') {
        preparedValues[key] = param;
        // eslint-disable-next-line no-continue
        continue;
      }

      const foreignColumnName = property.foreignColumnName();
      // eslint-disable-next-line no-continue
      if (!foreignColumnName) continue;

      preparedValues[key] = params[foreignColumnName];
    }

    return preparedValues;
  }
}
