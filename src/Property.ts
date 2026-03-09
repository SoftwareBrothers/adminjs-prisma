import { BaseProperty, PropertyType } from 'adminjs';

import { Enums, PrismaField } from './types.js';
import { DATA_TYPES } from './utils/data-types.js';

export class Property extends BaseProperty {
  public column: PrismaField;

  protected enums: Enums;

  protected columnPosition: number;

  // eslint-disable-next-line default-param-last
  constructor(column: PrismaField, columnPosition = 0, enums: Enums) {
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

    const enumValues = this.enums[this.column.type];

    if (!enumValues) return null;

    return enumValues.map((value) => String(value)) ?? [];
  }

  public position(): number {
    return this.columnPosition || 0;
  }

  public isEnum(): boolean {
    return this.column.kind === 'enum';
  }

  public isArray(): boolean {
    return this.column.isList;
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
