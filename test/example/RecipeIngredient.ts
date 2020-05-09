import {AbstractModel} from "../../src/db/AbstractModel";


export class RecipeIngredient extends AbstractModel<RecipeIngredient> {

    private _recipeId: number;
    private _ingredientId: number;

    public constructor() {
        super();
    }

    get recipeId(): number {
        return this._recipeId;
    }

    set recipeId(value: number) {
        this._recipeId = value;
    }

    get ingredientId(): number {
        return this._ingredientId;
    }

    set ingredientId(value: number) {
        this._ingredientId = value;
    }
}
