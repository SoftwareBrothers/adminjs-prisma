export interface PrismaField {
  name: string;
  kind: 'scalar' | 'object' | 'enum';
  type: string;
  isList: boolean;
  isRequired: boolean;
  isId?: boolean;
  isUnique?: boolean;
  isReadOnly?: boolean;
  isUpdatedAt?: boolean;
  hasDefaultValue?: boolean;
  relationName?: string | null;
  relationFromFields?: readonly string[];
  relationToFields?: readonly string[];
}

export interface PrismaCompositePrimaryKey {
  name: string | null;
  fields: readonly string[];
}

export interface PrismaModel {
  name: string;
  fields: readonly PrismaField[];
  primaryKey?: PrismaCompositePrimaryKey | null;
}

export interface PrismaMetadata {
  models: Record<string, PrismaModel>;
  enums: Record<string, any>;
}

export type ModelManager = Record<string, (...args: any[]) => Promise<any>>;

export type Enums = Record<string, any>;
