import { DMMF } from '@prisma/client/runtime/library.js';

export type ModelManager = {
  [action in DMMF.ModelAction]: (...args: any[]) => Promise<any>;
};

export type Enums = { [key: string]: DMMF.DatamodelEnum };
