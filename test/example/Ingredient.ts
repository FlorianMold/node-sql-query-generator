import {AbstractModel} from "../../src/db/AbstractModel";

export class Ingredient extends AbstractModel {
  private _name: string;
  private _imageId: number;
  private _foodCategoryId: number;

  public constructor() {
    super();
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get imageId(): number {
    return this._imageId;
  }

  set imageId(value: number) {
    this._imageId = value;
  }

  get foodCategoryId(): number {
    return this._foodCategoryId;
  }

  set foodCategoryId(value: number) {
    this._foodCategoryId = value;
  }

}
