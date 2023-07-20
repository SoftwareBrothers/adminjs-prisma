import { Prisma } from '@prisma/client';
import { Enums } from '../types.js';

export const getEnums = (clientModule?: any): Enums => {
  const dmmf = clientModule?.Prisma.dmmf.datamodel ?? Prisma.dmmf.datamodel;

  return dmmf.enums.reduce((memo, current) => {
    // eslint-disable-next-line no-param-reassign
    memo[current.name] = current;

    return memo;
  }, {});
}
