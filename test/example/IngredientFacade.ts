/**
 * Handles CRUD operations with the ingredient-entity.
 *
 * contained Facades:
 * - FoodCategoryFacade
 *
 * contained Joins:
 * - food_categories (1:1)
 */
import {CompositeFacade} from "../../src/CompositeFacade";
import {Ingredient} from "./Ingredient";
import {SQLAttributes} from "../../src/db/sql/SQLAttributes";
import {SQLValueAttributes} from "../../src/db/sql/SQLValueAttributes";
import {SQLValueAttribute} from "../../src/db/sql/SQLValueAttribute";
import {SQLJoin} from "../../src/db/sql/SQLJoin";
import {Filter} from "../../src/db/filter/Filter";
import {Ordering} from "../../src/db/order/Ordering";

export class IngredientFacade extends CompositeFacade<Ingredient> {

    /**
     * @param tableAlias table-alias of the facade
     */
    public constructor(tableAlias?: string) {
        if (tableAlias) {
            super("ingredients", tableAlias);
        } else {
            super("ingredients", "ig");
        }
    }

    /**
     * Returns sql-attributes that should be retrieved from the database.
     * Combines the attributes from the joined facades.
     *
     * @param excludedSQLAttributes attributes that should not be selected
     */
    public getSQLAttributes(excludedSQLAttributes?: string[]): SQLAttributes {
        const sqlAttributes: string[] =  ["name", "image_id", "food_category_id"];

        const ingredientAttributes: SQLAttributes = super.getSQLAttributes(excludedSQLAttributes, sqlAttributes);

        return ingredientAttributes;
    }

    /**
     * Returns common sql-attributes for inserts- and updates-statement.
     *
     * @param prefix prefix before the sql-attribute
     * @param ingredient entity to take values from
     */
    protected getSQLValueAttributes(prefix: string, ingredient: Ingredient): SQLValueAttributes {
        const attributes: SQLValueAttributes = new SQLValueAttributes();

        const nameAttribute: SQLValueAttribute = new SQLValueAttribute("name", prefix, ingredient.name);
        attributes.addAttribute(nameAttribute);

        const imageIdAttribute: SQLValueAttribute = new SQLValueAttribute("image_id", prefix, ingredient.imageId);
        attributes.addAttribute(imageIdAttribute);

        const foodCategoryId: SQLValueAttribute
            = new SQLValueAttribute("food_category_id", prefix, ingredient.foodCategoryId);
        attributes.addAttribute(foodCategoryId);

        return attributes;
    }

    /**
     * Creates the joins for the ingredient-facade and returns them as a list.
     */
    get joins(): SQLJoin[] {
        return [];
    }

    /**
     * Returns all sub-facade filters of the facade as an array.
     */
    protected get filters(): Filter[] {
        return [];
    }

    /**
     * Returns all sub-facade order-bys of the facade as an array.
     */
    protected get orderBys(): Ordering[] {
        return [];
    }
}
