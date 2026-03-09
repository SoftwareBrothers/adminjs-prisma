/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { BaseResource, Filter, BaseRecord, flat } from 'adminjs';

import { Property } from './Property.js';
import { lowerCase } from './utils/helpers.js';
import { ModelManager, Enums, PrismaModel, PrismaField } from './types.js';
import { convertFilter, convertParam } from './utils/converters.js';

// Separator used to encode composite primary keys into a single string
const COMPOSITE_KEY_SEPARATOR = '___';

export class Resource extends BaseResource {
  protected client: any;

  protected model: PrismaModel;

  protected enums: Enums;

  protected manager: ModelManager;

  protected propertiesObject: Record<string, Property>;

  protected idProperty: Property;

  // Fields that make up the composite primary key (if any)
  protected compositeKeyFields: readonly string[] | null = null;

  constructor(args: {
    model: PrismaModel;
    client: any;
    enums: Enums;
  }) {
    super(args);

    const { model, client, enums } = args;
    this.model = model;
    this.client = client;
    this.enums = enums;
    this.manager = this.client[lowerCase(model.name)];
    this.propertiesObject = this.prepareProperties();

    // Check for single @id field first
    const singleIdProperty = this.properties().find((p) => p.isId());

    if (singleIdProperty) {
      this.idProperty = singleIdProperty;
    } else if (model.primaryKey?.fields?.length) {
      // Handle composite primary key (@@id([...]))
      this.compositeKeyFields = model.primaryKey.fields;
      // Create a virtual 'id' property that AdminJS can use
      const virtualIdField: PrismaField = {
        name: 'id',
        kind: 'scalar',
        type: 'String',
        isList: false,
        isRequired: true,
        isId: true,
        isReadOnly: true,
      };
      const virtualIdProperty = new Property(virtualIdField, -1, enums);
      this.propertiesObject.id = virtualIdProperty;
      this.idProperty = virtualIdProperty;
    } else {
      // Fallback: no ID property found
      this.idProperty = undefined as any;
    }
  }

  /**
   * Encodes composite key field values into a single string ID
   */
  protected encodeCompositeId(record: Record<string, any>): string {
    if (!this.compositeKeyFields) return record.id;
    return this.compositeKeyFields
      .map((field) => String(record[field] ?? ''))
      .join(COMPOSITE_KEY_SEPARATOR);
  }

  /**
   * Decodes a composite ID string back into individual field values
   */
  protected decodeCompositeId(id: string | number): Record<string, any> {
    if (!this.compositeKeyFields) return {};
    const values = String(id).split(COMPOSITE_KEY_SEPARATOR);
    const result: Record<string, any> = {};
    this.compositeKeyFields.forEach((field, index) => {
      // Convert to appropriate type based on the field definition
      const fieldDef = this.model.fields.find((f) => f.name === field);
      const value = values[index] ?? '';
      if (fieldDef?.type === 'Int' || fieldDef?.type === 'BigInt') {
        result[field] = parseInt(value, 10);
      } else {
        result[field] = value;
      }
    });
    return result;
  }

  /**
   * Builds the Prisma 'where' clause for composite primary keys
   */
  protected buildCompositeWhereClause(id: string | number): Record<string, any> {
    if (!this.compositeKeyFields) {
      return {
        [this.idProperty.path()]: convertParam(this.idProperty, this.model.fields, id),
      };
    }
    const decodedValues = this.decodeCompositeId(id);
    // Prisma uses a special format for composite keys: fieldA_fieldB: { fieldA: val, fieldB: val }
    const compositeKeyName = this.compositeKeyFields.join('_');
    return {
      [compositeKeyName]: decodedValues,
    };
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
      (result) => new BaseRecord(this.prepareReturnValuesWithCompositeId(result), this),
    );
  }

  protected prepareReturnValuesWithCompositeId(
    result: Record<string, any>,
  ): Record<string, any> {
    const prepared = this.prepareReturnValues(result);
    // Inject virtual 'id' for composite primary keys
    if (this.compositeKeyFields) {
      prepared.id = this.encodeCompositeId(result);
    }
    return prepared;
  }

  protected buildSortBy(sort: { sortBy?: string; direction?: 'asc' | 'desc' } = {}) {
    let { sortBy: path } = sort;
    const { direction = 'desc' } = sort;

    if (!path) {
      // For composite keys, use the first field since 'id' doesn't exist as a real column
      if (this.compositeKeyFields?.length) {
        path = this.compositeKeyFields[0];
      } else {
        path = this.idProperty.path();
      }
    }

    // If path is 'id' but we have composite keys, redirect to first composite field
    if (path === 'id' && this.compositeKeyFields?.length) {
      path = this.compositeKeyFields[0];
    }

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
    if (!this.idProperty && !this.compositeKeyFields) return null;

    const whereClause = this.buildCompositeWhereClause(id);
    const result = await this.manager.findUnique({
      where: whereClause,
    });
    if (!result) return null;

    return new BaseRecord(this.prepareReturnValuesWithCompositeId(result), this);
  }

  public async findMany(
    ids: Array<string | number>,
  ): Promise<Array<BaseRecord>> {
    if (!this.idProperty && !this.compositeKeyFields) return [];

    let results: any[];

    if (this.compositeKeyFields) {
      // For composite keys, we need to use OR with each decoded key
      const orConditions = ids.map((id) => {
        const decodedValues = this.decodeCompositeId(id);
        return decodedValues;
      });
      results = await this.manager.findMany({
        where: {
          OR: orConditions,
        },
      });
    } else {
      results = await this.manager.findMany({
        where: {
          [this.idProperty.path()]: {
            in: ids.map((id) => convertParam(this.idProperty, this.model.fields, id)),
          },
        },
      });
    }

    return results.map(
      (result) => new BaseRecord(this.prepareReturnValuesWithCompositeId(result), this),
    );
  }

  public async create(
    params: Record<string, any>,
  ): Promise<Record<string, any>> {
    const preparedParams = this.prepareParams(params);

    const result = await this.manager.create({ data: preparedParams });

    return this.prepareReturnValuesWithCompositeId(result);
  }

  public async update(
    pk: string | number,
    params: Record<string, any> = {},
  ): Promise<Record<string, any>> {
    if (!this.idProperty && !this.compositeKeyFields) return {};

    const preparedParams = this.prepareParams(params);
    const whereClause = this.buildCompositeWhereClause(pk);

    const result = await this.manager.update({
      where: whereClause,
      data: preparedParams,
    });

    return this.prepareReturnValuesWithCompositeId(result);
  }

  public async delete(id: string | number): Promise<void> {
    if (!this.idProperty && !this.compositeKeyFields) return;

    const whereClause = this.buildCompositeWhereClause(id);
    await this.manager.delete({
      where: whereClause,
    });
  }

  public static isAdapterFor(args: {
    model: PrismaModel;
    client: any;
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
      // Skip readonly fields
      if (field.isReadOnly) {
        return memo;
      }

      // Skip non-list relations without FK (the "virtual" side of One-to-One/Many-to-One)
      // But KEEP list relations (One-to-Many reverse, Many-to-Many) for navigation
      if (field.relationName && !field.relationFromFields?.length && !field.isList) {
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
