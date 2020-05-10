/**
 * base model for all entities
 * contains attributes that all entities have in common
 */
export abstract class AbstractModel {
  private _id: number;
  private _createdAt: Date;
  private _modifiedAt: Date;

  protected constructor() {
    this._createdAt = new Date();
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get modifiedAt(): Date {
    return this._modifiedAt;
  }

  set modifiedAt(value: Date) {
    this._modifiedAt = value;
  }

}
