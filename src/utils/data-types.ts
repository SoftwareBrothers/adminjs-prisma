import { PropertyType } from 'adminjs';

const DATA_TYPES: Record<string, PropertyType> = {
  String: 'string',
  Boolean: 'boolean',
  Int: 'number',
  BigInt: 'number',
  Float: 'number',
  Decimal: 'number',
  DateTime: 'datetime',
  Json: 'mixed',
};

export { DATA_TYPES };
