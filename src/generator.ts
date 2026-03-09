#!/usr/bin/env node
import pkg from '@prisma/generator-helper';
const { generatorHandler } = pkg;
import type { GeneratorOptions, DMMF } from '@prisma/generator-helper';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type PrismaField = {
    name: string;
    kind: DMMF.FieldKind;
    type: string;
    isList: boolean;
    isRequired: boolean;
    isId?: true;
    isUnique?: true;
    isReadOnly?: true;
    isUpdatedAt?: true;
    hasDefaultValue?: true;
    relationName?: string;
    relationFromFields?: readonly string[];
    relationToFields?: readonly string[];
};

type PrismaCompositePrimaryKey = {
    name: string | null;
    fields: readonly string[];
};

type PrismaModel = {
    name: string;
    fields: PrismaField[];
    primaryKey?: PrismaCompositePrimaryKey | null;
};

const serializeField = (field: DMMF.Field): PrismaField => {
    const obj: any = {
        name: field.name,
        kind: field.kind,
        type: field.type,
        isList: field.isList,
        isRequired: field.isRequired,
    };

    if (field.isId) obj.isId = true;
    if (field.isUnique) obj.isUnique = true;
    if (field.isReadOnly) obj.isReadOnly = true;
    if (field.isUpdatedAt) obj.isUpdatedAt = true;
    if (field.hasDefaultValue) obj.hasDefaultValue = true;

    return obj;
};

const serializeRelation = (field: DMMF.Field): PrismaField => {
    const obj = serializeField(field);

    if (field.relationName) obj.relationName = field.relationName;
    if (field.relationFromFields?.length) obj.relationFromFields = field.relationFromFields;
    if (field.relationToFields?.length) obj.relationToFields = field.relationToFields;

    return obj;
};

generatorHandler({
    onManifest() {
        return {
            prettyName: 'AdminJS Prisma Metadata Generator',
            defaultOutput: '../generated/adminjs',
        };
    },
    async onGenerate(options: GeneratorOptions) {
        const models: Record<string, PrismaModel> = {};

        // eslint-disable-next-line no-restricted-syntax
        for (const model of options.dmmf.datamodel.models) {
            const prismaModel: PrismaModel = {
                name: model.name,
                fields: model.fields.map((f) => {
                    if (f.kind === 'object') return serializeRelation(f);
                    return serializeField(f);
                }),
            };

            // Add composite primary key if present (@@id([...]))
            if (model.primaryKey?.fields?.length) {
                prismaModel.primaryKey = {
                    name: model.primaryKey.name ?? null,
                    fields: model.primaryKey.fields,
                };
            }

            models[model.name] = prismaModel;
        }

        const enums = Object.fromEntries(
            options.dmmf.datamodel.enums.map((enm) => [enm.name, enm.values.map((v) => v.name)]),
        );

        const content = `export const prismaMetadata = ${JSON.stringify({ models, enums }, null, 2)} as const;\n`;
        const outputDir = options.generator.output?.value;

        if (!outputDir) throw new Error('No output directory defined for adminjs-prisma generator');

        mkdirSync(outputDir, { recursive: true });
        writeFileSync(join(outputDir, 'metadata.ts'), content);
    },
});
