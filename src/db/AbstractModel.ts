/**
 * base model for all entities
 * contains attributes that all entities have in common
 */
export abstract class AbstractModel<Entity extends AbstractModel<Entity>> {
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

  /**
   * returns true if the object was already modified
   */
  get wasUpdated() {
    return this._modifiedAt;
  }

  /**
   * Compares two models.
   * @param other other entity to compare
   */
  public equals(other: Entity) {
    return this.id === other.id;
  }
}
