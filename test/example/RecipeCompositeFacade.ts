/**
 * Retrieves recipes with ingredients.
 *
 * contained Facades:
 * - RecipeFacade
 * - RecipeIngredientFacade
 * - IngredientFacade
 *
 * contained Joins:
 * - difficulties (1:1)
 * - recipes_ingredients (1:n)
 * - ingredients (1:1)
 *   - food categories (1:1)
 */
import {CompositeFacade} from "../../src/CompositeFacade";
import {RecipeFacade} from "./RecipeFacade";
import {RecipeIngredientFacade} from "./RecipeIngredientFacade";
import {IngredientFacade} from "./IngredientFacade";
import {SQLAttributes} from "../../src/db/sql/SQLAttributes";
import {Recipe} from "./Recipe";
import {SQLJoin} from "../../src/db/sql/SQLJoin";
import {SQLBlock} from "../../src/db/sql/SQLBlock";
import {JoinType} from "../../src/db/sql/enums/JoinType";
import {JoinCardinality} from "../../src/db/sql/enums/JoinCardinality";
import {Filter} from "../../src/db/filter/Filter";
import {Ordering} from "../../src/db/order/Ordering";

export class RecipeCompositeFacade extends CompositeFacade<Recipe> {

    private _recipeFacade: RecipeFacade;
    private _recipeIngredientFacade: RecipeIngredientFacade;
    private _ingredientFacade: IngredientFacade;

    private _withIngredientsJoin: boolean;
    private _withDifficultyJoin: boolean;
    private _withFoodCategoryJoin: boolean;

    /**
     * @param tableAlias table-alias of the composite facade
     */
    public constructor(tableAlias?: string) {
        if (tableAlias) {
            super("recipes", tableAlias);
        } else {
            super("recipes", "rec");
        }

        this._recipeFacade = new RecipeFacade();
        this._recipeIngredientFacade = new RecipeIngredientFacade();
        this._ingredientFacade = new IngredientFacade();

        this._withIngredientsJoin = true;
        this._withDifficultyJoin = true;
        this._withFoodCategoryJoin = true;
    }

    /**
     * Returns sql-attributes that should be retrieved from the database.
     * Combines the attributes from the joined facades.
     *
     * @param excludedSQLAttributes attributes that should not be selected
     */
    public getSQLAttributes(excludedSQLAttributes?: string[]): SQLAttributes {
        const returnAttributes: SQLAttributes = new SQLAttributes();

        returnAttributes.addSqlAttributes(this._recipeFacade.getSQLAttributes(excludedSQLAttributes));

        if (this._withIngredientsJoin) {
            returnAttributes.addSqlAttributes(this._recipeIngredientFacade.getSQLAttributes(excludedSQLAttributes));
            returnAttributes.addSqlAttributes(this._ingredientFacade.getSQLAttributes(excludedSQLAttributes));
        }

        return returnAttributes;
    }


    /**
     * Creates the joins for the recipe-facade and returns them as a list.
     */
    get joins(): SQLJoin[] {
        let joins: SQLJoin[] = [];

        joins = joins.concat(this._recipeFacade.joins); // add recipe joins (difficulties)

        if (this._withIngredientsJoin) {
            const recipesIngredientsJoin: SQLBlock = new SQLBlock();
            recipesIngredientsJoin.addText(
                `${this._recipeIngredientFacade.tableAlias}.recipe_id = ${this.tableAlias}.id`
            );
            joins.push(new SQLJoin(
                this._recipeIngredientFacade.tableName, this._recipeIngredientFacade.tableAlias, recipesIngredientsJoin,
                JoinType.JOIN, JoinCardinality.ONE_TO_MANY)
            );

            const ingredientsJoin: SQLBlock = new SQLBlock();
            ingredientsJoin.addText(
                `${this._ingredientFacade.tableAlias}.id = ${this._recipeIngredientFacade.tableAlias}.ingredient_id`
            );
            joins.push(new SQLJoin(
                this._ingredientFacade.tableName, this._ingredientFacade.tableAlias, ingredientsJoin,
                JoinType.LEFT_JOIN, JoinCardinality.ONE_TO_ONE)
            );

            joins = joins.concat(this._ingredientFacade.joins); // add ingredient joins (food_categories)
        }

        return joins;
    }


    /**
     * Returns all sub-facade filters of the facade as an array.
     */
    public get filters(): Filter[] {
        return [
            this.ingredientFilter
        ];
    }

    get ingredientFilter(): Filter {
        return this._ingredientFacade.filter;
    }

    /**
     * Returns all sub-facade order-bys of the facade as an array.
     */
    protected get orderBys(): Ordering[] {
        return [
            this.ingredientOrderBy,
        ];
    }

    get ingredientOrderBy(): Ordering {
        return this._ingredientFacade.ordering;
    }

    get withIngredientsJoin(): boolean {
        return this._withIngredientsJoin;
    }

    set withIngredientsJoin(value: boolean) {
        this._withIngredientsJoin = value;
    }

    get withDifficultyJoin(): boolean {
        return this._withDifficultyJoin;
    }

    get withFoodCategoryJoin(): boolean {
        return this._withFoodCategoryJoin;
    }
}
