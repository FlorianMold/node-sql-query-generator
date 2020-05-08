import { BaseFacade } from "./BaseFacade";
import { Filter } from "./db/filter/Filter";
import { SQLComparisonOperator } from "./db/sql/enums/SQLComparisonOperator";
import { SQLAttributes } from "./db/sql/SQLAttributes";
import { AbstractModel } from "./db/AbstractModel";
import {Query} from "./db/Query";
import {SQLValueAttributes} from "./db/sql/SQLValueAttributes";

/**
 * Base facade for entities
 * Provides common methods for retrieving values from the database.
 */
export abstract class EntityFacade<EntityType extends AbstractModel<EntityType>> extends BaseFacade<EntityType> {

    /**
     * @param tableName table-name of the entity
     * @param tableAlias table-alias of the entity
     */
    protected constructor(tableName: string, tableAlias: string) {
        super(tableName, tableAlias);
    }

  /**
   * Returns an entity by id.
   *
   * @param id id of the entity to receive
   * @param excludedSQLAttributes attribute that should not be included in the result set
   */
    public getById(id: number, excludedSQLAttributes?: string[]): Query {
        const attributes: SQLAttributes = this.getSQLAttributes(excludedSQLAttributes);
        this.idFilter.addFilterCondition("id", id, SQLComparisonOperator.EQUAL);
        const result = this.select(attributes, this.idFilter);

        this.idFilter.clear();

        return result;
    }

    /**
     * Returns all entities that match the specified filter.
     *
     * @param excludedSQLAttributes attributes that should be excluded from the query
     */
    public get(excludedSQLAttributes?: string[]): Query {
      const attributes: SQLAttributes = this.getSQLAttributes(excludedSQLAttributes);
      return this.select(attributes, this.filter);
    }


    /**
     * Function that should be overwritten to provide insert-functionality
     * for the entities in the child-facade. If the function is not overwritten
     * than it returns undefined, which indicates that nothing was inserted.
     *
     * @param entity entity to insert
     */
    public insert(entity: EntityType): Query {
        return this.insertStatement(this.getSQLInsertValueAttributes(entity));
    }

    /**
     * Function that should be overwritten to provide update-functionality
     * for the entities in the child-facade. If the function is not overwritten
     * that it returns 0, which indicates that nothing was updated.
     *
     * @param entity entity to update
     */
    public update(entity: EntityType): Query {
        const attributes: SQLValueAttributes = this.getSQLUpdateValueAttributes(entity);
        return this.updateStatement(attributes);
    }

    /**
     * Function that should be overwritten, to provide delete-functionality
     * for the entities in the child-facade. If the function is not overwritten
     * than it returns 0, which indicates that nothing was deleted.
     */
    public delete(): Query {
        return this.deleteStatement();
    }

    /**
     * Returns the facade filter that can be used for filtering model with id.
     */
    get idFilter(): Filter {
        return this.filter;
    }

}
