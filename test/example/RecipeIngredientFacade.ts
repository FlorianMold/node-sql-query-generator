/**
 * Handles CRUD operations with the recipes-ingredients-entity.
 */
import {EntityFacade} from "../../src/EntityFacade";
import {SQLAttributes} from "../../src/db/sql/SQLAttributes";
import {SQLValueAttributes} from "../../src/db/sql/SQLValueAttributes";
import {SQLValueAttribute} from "../../src/db/sql/SQLValueAttribute";
import {RecipeIngredient} from "./RecipeIngredient";

export class RecipeIngredientFacade extends EntityFacade<RecipeIngredient> {

    /**
     * @param tableAlias table-alias of the facade
     */
    public constructor(tableAlias?: string) {
        if (tableAlias) {
            super("recipes_ingredients", tableAlias);
        } else {
            super("recipes_ingredients", "recing");
        }
    }

    /**
     * Returns sql-attributes that should be retrieved from the database.
     * Combines the attributes from the joined facades.
     *
     * @param excludedSQLAttributes attributes that should not be selected
     */
    public getSQLAttributes(excludedSQLAttributes?: string[]): SQLAttributes {
        const sqlAttributes: string[] =  ["recipe_id", "ingredient_id"];
        let excludedDefaultAttributes: string[] = ["id"];

        if (excludedSQLAttributes) {
            excludedDefaultAttributes = excludedDefaultAttributes.concat(excludedSQLAttributes);
        }

        return super.getSQLAttributes(excludedDefaultAttributes, sqlAttributes);
    }

    /**
     * Returns common sql-attributes for inserts- and updates-statement.
     *
     * @param prefix prefix before the sql-attribute
     * @param recipeIngredient entity to take values from
     */
    protected getSQLValueAttributes(prefix: string, recipeIngredient: RecipeIngredient): SQLValueAttributes {
        const attributes: SQLValueAttributes = new SQLValueAttributes();

        const recipeIdAttribute: SQLValueAttribute
            = new SQLValueAttribute("recipe_id", prefix, recipeIngredient.recipeId);
        attributes.addAttribute(recipeIdAttribute);

        const ingredientIdAttribute: SQLValueAttribute
            = new SQLValueAttribute("ingredient_id", prefix, recipeIngredient.ingredientId);
        attributes.addAttribute(ingredientIdAttribute);

        return attributes;
    }

}
