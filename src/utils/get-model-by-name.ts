import { Prisma } from '@prisma/client';

export const getModelByName = (name: string) => {
  const dmmf = Prisma.dmmf.datamodel;

  const model = dmmf.models.find(({ name: modelName }) => modelName === name);

  if (!model) {
    throw new Error(`Could not find model: "${name}" in Prisma's DMMF!`);
  }

  return model;
};
