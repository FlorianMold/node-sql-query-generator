/**
 * Handles CRUD operations with the recipe-entity.
 *
 * contained Facades:
 * - DifficultyFacade
 *
 * contained Joins:
 * - difficulties (1:1)
 */
import {CompositeFacade} from "../src/CompositeFacade";
import {Recipe} from "./Recipe";
import {SQLAttributes} from "../src/db/sql/SQLAttributes";
import {SQLValueAttributes} from "../src/db/sql/SQLValueAttributes";
import {SQLValueAttribute} from "../src/db/sql/SQLValueAttribute";
import {SQLJoin} from "../src/db/sql/SQLJoin";
import {Filter} from "../src/db/filter/Filter";
import {Ordering} from "../src/db/order/Ordering";

export class RecipeFacade extends CompositeFacade<Recipe> {

    /**
     * @param tableAlias table-alias of the facade
     */
    public constructor(tableAlias?: string) {
        if (tableAlias) {
            super("recipes", tableAlias);
        } else {
            super("recipes", "rec");
        }
    }

    /**
     * Returns sql-attributes that should be retrieved from the database.
     * Combines the attributes from the joined facades.
     *
     * @param excludedSQLAttributes attributes that should not be selected
     */
    public getSQLAttributes(excludedSQLAttributes?: string[]): SQLAttributes {
        const sqlAttributes: string[] = [
            "name",
            "description",
            "difficulty_id",
            "mealtime"
        ];

        return super.getSQLAttributes(
            excludedSQLAttributes,
            sqlAttributes
        );
    }

    /**
     * Returns common sql-attributes for inserts- and updates-statement.
     *
     * @param prefix prefix before the sql-attribute
     * @param recipe entity to take values from
     */
    protected getSQLValueAttributes(prefix: string, recipe: Recipe): SQLValueAttributes {
        const attributes: SQLValueAttributes = new SQLValueAttributes();

        const nameAttribute: SQLValueAttribute = new SQLValueAttribute(
            "name",
            prefix,
            recipe.name
        );
        attributes.addAttribute(nameAttribute);

        const descriptionAttribute: SQLValueAttribute = new SQLValueAttribute(
            "description",
            prefix,
            recipe.description
        );
        attributes.addAttribute(descriptionAttribute);

        const difficultyIdAttribute: SQLValueAttribute = new SQLValueAttribute(
            "difficulty_id",
            prefix,
            recipe.difficultyId
        );
        attributes.addAttribute(difficultyIdAttribute);

        return attributes;
    }

    /**
     * Creates the joins for the recipe-facade and returns them as a list.
     */
    get joins(): SQLJoin[] {
        return [];
    }

    /**
     * Returns all sub facade filters of the facade as an array.
     */
    protected get filters(): Filter[] {
        return [];
    }

    /**
     * Returns all sub facade order-bys of the facade as an array.
     */
    protected get orderBys(): Ordering[] {
        return [];
    }
}
