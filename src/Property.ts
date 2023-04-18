import { DMMF } from '@prisma/client/runtime';
import { BaseProperty, PropertyType } from 'adminjs';

import { Enums } from './types.js';
import { DATA_TYPES } from './utils/data-types.js';

export class Property extends BaseProperty {
  private column: DMMF.Field;

  private enums: Enums;

  private columnPosition: number;

  // eslint-disable-next-line default-param-last
  constructor(column: DMMF.Field, columnPosition = 0, enums: Enums) {
    const path = column.name;
    super({ path });
    this.column = column;
    this.enums = enums;
    this.columnPosition = columnPosition;
  }

  public isEditable(): boolean {
    return !this.isId() && this.column.name !== 'createdAt' && this.column.name !== 'updatedAt';
  }

  public isId(): boolean {
    return !!this.column.isId;
  }

  public name(): string {
    return this.column.name;
  }

  public isRequired(): boolean {
    return this.column.isRequired;
  }

  public isSortable(): boolean {
    return this.type() !== 'reference';
  }

  public reference(): string | null {
    const isRef = this.column.kind !== 'scalar' && !!this.column.relationName;

    if (isRef) {
      return this.column.type;
    }

    return null;
  }

  public referencedColumnName(): string | null {
    if (!this.reference()) return null;

    return this.column.relationToFields?.[0] ?? null;
  }

  public foreignColumnName(): string | null {
    if (!this.reference()) return null;

    return this.column.relationFromFields?.[0] ?? null;
  }

  public availableValues(): Array<string> | null {
    if (!this.isEnum()) return null;

    const enumSchema = this.enums[this.column.type];

    if (!enumSchema) return null;

    return enumSchema.values.map((value) => String(value.name)) ?? [];
  }

  public position(): number {
    return this.columnPosition || 0;
  }

  public isEnum(): boolean {
    return this.column.kind === 'enum';
  }

  public type(): PropertyType {
    let type: PropertyType = DATA_TYPES[this.column.type];

    if (this.reference()) { type = 'reference'; }
    if (this.isEnum()) { type = 'string'; }

    // eslint-disable-next-line no-console
    if (!type) { console.warn(`Unhandled type: ${this.column.type}`); }

    return type;
  }
}
