/* eslint-disable no-param-reassign */
import { DMMF } from '@prisma/client/runtime/library.js';
import { Filter } from 'adminjs';

import { Property } from '../Property.js';
import { safeParseJSON, safeParseNumber } from './helpers.js';

const OPERATOR_SEPARATOR = '~';

const MATCHING_PATTERNS = {
  EQ: 'equals',
  NE: 'notEquals',
  CO: 'contains',
  EW: 'endsWith',
  SW: 'startsWith',
};

const OPERATORS = {
  AND: 'and',
  OR: 'or',
};

export const convertParam = (
  property: Property,
  fields: DMMF.Model['fields'],
  value: string | boolean | number | Record<string, any> | null | undefined,
): string | boolean | number | Record<string, any> | null | undefined => {
  const type = property.type();

  if (type === 'mixed') return value;
  if (type === 'number') {
    return safeParseNumber(value);
  }
  if (type === 'reference') {
    const foreignColumn = fields.find((field) => field.name === property.foreignColumnName());
    if (!foreignColumn) return value;
    if (value === undefined || value === null) return value;

    const foreignColumnType = foreignColumn.type;
    if (foreignColumnType === 'String') return String(value);

    return safeParseNumber(value);
  }

  return value;
};

export const convertFilter = (modelFields: DMMF.Model['fields'], filterObject?: Filter): Record<string, any> => {
  if (!filterObject) return {};

  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[5|4|3|2|1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  const { filters = {} } = filterObject;
  return Object.entries(filters).reduce<{[key: string]: any}>((where, [name, filter]) => {
    if (['boolean', 'number', 'float', 'object', 'array'].includes(filter.property.type())) {
      where[name] = safeParseJSON(filter.value as string);
    } else if (['date', 'datetime'].includes(filter.property.type())) {
      if (typeof filter.value !== 'string' && filter.value.from && filter.value.to) {
        where[name] = { gte: new Date(filter.value.from), lte: new Date(filter.value.to) };
      } else if (typeof filter.value !== 'string' && filter.value.from) {
        where[name] = { gte: new Date(filter.value.from) };
      } else if (typeof filter.value !== 'string' && filter.value.to) {
        where[name] = { lte: new Date(filter.value.to) };
      }
    } else if ((filter.property as Property).isEnum()) {
      where[name] = { equals: filter.value };
    } else if (filter.property.type() === 'string' && uuidRegex.test(filter.value.toString())) {
      where[name] = { equals: filter.value };
    } else if (filter.property.type() === 'reference' && (filter.property as Property).foreignColumnName()) {
      where[(filter.property as Property).foreignColumnName() as string] = convertParam(
        filter.property as Property,
        modelFields,
        filter.value,
      );
    } else {
      const { value } = filter
      if (typeof value === 'object') {
        if (value[MATCHING_PATTERNS.SW]) {
          where[name] = { startsWith: value[MATCHING_PATTERNS.SW].toString() };
        } else if (value[MATCHING_PATTERNS.EW]) {
          where[name] = { endsWith: value[MATCHING_PATTERNS.EW].toString() };
        } else if (value[MATCHING_PATTERNS.EQ]) {
          where[name] = { equals: value[MATCHING_PATTERNS.EQ].toString() };
        } else if (value[MATCHING_PATTERNS.NE]) {
          where[name] = { not: value[MATCHING_PATTERNS.NE].toString() };
        } else {
          const orPrefix = `${OPERATORS.OR}${OPERATOR_SEPARATOR}`;
          if (value[`${orPrefix}${MATCHING_PATTERNS.SW}`]) {
            where.OR = [
              ...(where.OR || []),
              { [name]: { startsWith: value[`${orPrefix}${MATCHING_PATTERNS.SW}`].toString() } },
            ];
          } else if (value[`${orPrefix}${MATCHING_PATTERNS.EW}`]) {
            where.OR = [
              ...(where.OR || []),
              { [name]: { endsWith: value[`${orPrefix}${MATCHING_PATTERNS.EW}`].toString() } },
            ];
          } else if (value[`${orPrefix}${MATCHING_PATTERNS.EQ}`]) {
            where.OR = [
              ...(where.OR || []),
              { [name]: { equals: value[`${orPrefix}${MATCHING_PATTERNS.EQ}`].toString() } },
            ];
          } else if (value[`${orPrefix}${MATCHING_PATTERNS.NE}`]) {
            where.OR = [
              ...(where.OR || []),
              { [name]: { not: value[`${orPrefix}${MATCHING_PATTERNS.NE}`].toString() } },
            ];
          } else if (value[OPERATORS.OR]) {
            where.OR = [...(where.OR || []), { [name]: { contains: value[OPERATORS.OR].toString() } }];
          }
        }
      } else {
        where[name] = { contains: value.toString() };
      }
    }

    return where;
  }, {});
};
