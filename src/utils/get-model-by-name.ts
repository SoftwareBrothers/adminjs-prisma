import { PrismaModel } from '../types.js';

export const getModelByName = (name: string, models?: Record<string, PrismaModel>) => {
  const model = models?.[name];

  if (!model) {
    throw new Error(`Could not find model: "${name}" in Prisma Metadata!`);
  }

  return model;
};
