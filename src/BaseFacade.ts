
import { Filter } from "./db/filter/Filter";
import { Ordering } from "./db/order/Ordering";
import { BakedQuery } from "./db/sql/BakedQuery";
import { DeleteQuery } from "./db/sql/DeleteQuery";
import { JoinCardinality } from "./db/sql/enums/JoinCardinality";
import { JoinType } from "./db/sql/enums/JoinType";
import { SQLOrder } from "./db/sql/enums/SQLOrder";
import { InsertQuery } from "./db/sql/InsertQuery";
import { SelectQuery } from "./db/sql/SelectQuery";
import { SQLAttributes } from "./db/sql/SQLAttributes";
import { SQLDelete } from "./db/sql/SQLDelete";
import { SQLFrom } from "./db/sql/SQLFrom";
import { SQLInsert } from "./db/sql/SQLInsert";
import { SQLJoin } from "./db/sql/SQLJoin";
import { SQLSelect } from "./db/sql/SQLSelect";
import { SQLUpdate } from "./db/sql/SQLUpdate";
import { SQLValueAttribute } from "./db/sql/SQLValueAttribute";
import { SQLValueAttributes } from "./db/sql/SQLValueAttributes";
import { SQLWhere } from "./db/sql/SQLWhere";
import { UpdateQuery } from "./db/sql/UpdateQuery";
import {AbstractModel} from "./db/AbstractModel";
import {Query} from "./db/Query";

/**
 * Base class for crud operations with the database.
 */
export abstract class BaseFacade<EntityType extends AbstractModel<EntityType>> {

    /**
     * Combine the joins of the different sub-facades and returns them as a list.
     */
    protected get joins(): SQLJoin[] {
        return [];
    }

    /**
     * Sets the filter of the facade.
     *
     * @param filter filter that should be set for the facade
     */
    set filter(filter: Filter) {
        this._filter = filter;
    }

    /**
     * Retrieves the filter for the facade.
     */
    get filter(): Filter {
        return this._filter;
    }

    /**
     * Returns the complete ordering of the facade (order-by).
     */
    get ordering(): Ordering {
        return this._ordering;
    }

    /**
     * Sets the ordering of the facade (order-by).
     *
     * @param value new order-bys of the facade
     */
    set ordering(value: Ordering) {
        this._ordering = value;
    }

    get tableName(): string {
        return this._tableName;
    }

    set tableName(value: string) {
        this._tableName = value;
    }

    get tableAlias(): string {
        return this._tableAlias;
    }

    set tableAlias(value: string) {
        this._tableAlias = value;
    }

    get attributes(): string[] {
        return this._attributes;
    }

    set attributes(value: string[]) {
        this._attributes = value;
    }

    /**
     * Creates a sql-where clause from the given filter.
     * @param filter filter to create the where clause from
     */
    private static getSQLFilter(filter: Filter): SQLWhere {
        return filter.isEmpty ? undefined : new SQLWhere(filter.getBlock());
    }

    private _tableName: string;
    private _tableAlias: string;
    private _attributes: string[];

    private _ordering: Ordering;
    private _filter: Filter;

    /**
     * @param tableName table-name of the facade
     * @param tableAlias table-alias of the facade
     */
    protected constructor(tableName: string, tableAlias: string) {
        this._tableName = tableName;
        this._tableAlias = tableAlias;

        this._filter = new Filter(tableAlias);
        this._ordering = new Ordering(tableAlias);
    }

    /**
     * Add an order-by clause.
     *
     * @param attribute attribute for ordering
     * @param order attribute sort order (ASC|DESC)
     */
    public addOrderBy(attribute: string, order: SQLOrder = SQLOrder.DESC): void {
        this.ordering.addOrderBy(attribute, order);
    }

    /**
     * Clear filter. Completly empties the filter.
     */
    public clearFilter(): void {
        this._filter.clear();
    }

    /**
     * Returns the fully qualified name (columnName + tableAlias) of a column.
     * Is used to identify the column in a result set.
     *
     * @param column name of the column
     */
    protected name(column: string): string {
        return column + this._tableAlias;
    }

    /**
     * Returns sql-columns that should be retrieved from the database.
     * Every table has default columns like id, created_at, modified_at.
     * Additional columns can be passed that are specific to the table.
     * Furthermore columns can be excluded to reduce the result set.
     *
     * @param excludedSQLAttributes attributes that should be excluded from the select query
     * @param allowedSqlAttributes attributes that should be included in the function
     */
    protected getSQLAttributes(excludedSQLAttributes?: string[], allowedSqlAttributes?: string[]): SQLAttributes {
        let sqlAttributes: string[] = ["id", "created_at", "modified_at"];

        // combine sql attributes
        sqlAttributes = sqlAttributes.concat(allowedSqlAttributes);

        // filter excluded sql attributes
        if (excludedSQLAttributes) {
            sqlAttributes = sqlAttributes.filter((x: string) => {
                return excludedSQLAttributes.indexOf(x) < 0;
            });
        }

        return new SQLAttributes(this.tableAlias, sqlAttributes);
    }

    /**
     * Executes an select query and returns the results as an array.
     * Result rows are converted to an instance of the current entity.
     * Execution time of the query is analysed and printed to the console
     * if it exceeds certain limits, that defined in the .env.
     *
     * @param attributes attributes that should be retrieved
     * @param filter filter for selected (can be different from facade filter)
     */
    protected select(attributes: SQLAttributes, filter: Filter): Query {
        this.joinAnalyzer();

        return this.getSelectQuery(attributes, filter);
    }

    /**
     * Executes multiple insert queries and returns all inserted ids as an array.
     * Watch the order of the queries. Statements are executed in this order. If no
     * additional inserts are provided, than the insert-query of the of the current facade
     * with the passed attributes is executed. Otherwise the insert-queries of the passed facades are
     * executed with given entity in the specified order.
     *
     * - facade: facade to execute insert in
     * - entity: entity to insert
     * - callBackOnInsert: callback that is executed after the insert, last callback in array will not be executed
     *
     * @param attributes name-value pairs of attributes that should be inserted
     * @param additionalInserts queries to execute in the transaction
     */
    protected insertStatement(
        attributes: SQLValueAttributes,
        additionalInserts?: Array<{facade: any; entity: any}>): Query[] {

        // array of queries
        const funcArray: Query[] = [];
        if (additionalInserts) {
            for (const insert of additionalInserts) {
                funcArray.push(insert.facade.getInsertQueryFn(insert.entity));
            }
        } else {
            funcArray.push(this.getInsertQueryFn(attributes));
        }

        return funcArray;
    }

    /**
     * Returns a function for executing an insert query.
     * Returned function can be executed to insert the specified row with the values.
     * Returned function executes one insert statement.
     *
     * @param attributes attributes to take values for the insert
     */
    protected getInsertQueryFn: (attributes: SQLValueAttributes) => Query =
        (attributes: SQLValueAttributes) => {
        return this.getInsertQuery(attributes);
    };

    /**
     * Return attributes that are common to all inserts (created_at).
     *
     * @param entity entity to take values for the insert query from
     */
    protected getSQLInsertValueAttributes(entity: EntityType): SQLValueAttributes {
        const attributes: SQLValueAttributes = this.getSQLValueAttributes(this.tableName, entity);

        const createdAtDate = new Date();
        const createdAtAttribute: SQLValueAttribute =
            new SQLValueAttribute("created_at", this.tableName, createdAtDate);
        attributes.addAttribute(createdAtAttribute);

        entity.createdAt = createdAtDate;

        return attributes;
    }

    /**
     * Executes multiple update queries and returns the number of affected rows.
     * Watch the order of the queries. Statements are executed in this order. If no
     * additional updates are provided, than the update-query of the of the current facade
     * with the passed attributes is executed. Otherwise the update-queries of the passed facades are
     * executed with the given entity in the specified order.
     *
     * facade: facade to execute update in
     * entity: entity to insert
     *
     * @param attributes name-value pairs of the entity that should be changed
     * @param additionalUpdates additionalUpdates to execute facade is for
     */
    protected updateStatement(attributes: SQLValueAttributes,
                                    additionalUpdates?: Array<{facade: any; entity: EntityType}>): Query[] {
        // array of queries
        const funcArray: Query[] = [];
        if (additionalUpdates) {
            for (const update of additionalUpdates) {
                funcArray.push(update.facade.getUpdateQueryFn(update.entity));
            }
        }  else {
            funcArray.push(this.getUpdateQueryFn(attributes));
        }

        return funcArray;
    }

    /**
     * Returns a function for executing an update-query.
     * Returned function can be executed to update the specified row(s) with the given values.
     * Returned function executes exactly one update-statement.
     *
     * Checks if the facade has a non empty filter. If not the update-query can not be performed.
     * This is a security reason that an update can't be performed on the whole table.
     *
     * @param attributes attributes for the update query
     */
    protected getUpdateQueryFn: (attributes: SQLValueAttributes) => Query = (attributes: SQLValueAttributes) => {
        return this.getUpdateQuery(attributes);
    };

    /**
     * Return attributes that are common to all updates (modified_at).
     *
     * @param entity entity to take values for the update statement
     */
    protected getSQLUpdateValueAttributes(entity: EntityType): SQLValueAttributes {
        const attributes: SQLValueAttributes = this.getSQLValueAttributes(this.tableAlias, entity);

        const modifiedAtDate = new Date();
        const modifiedAtAttribute: SQLValueAttribute =
            new SQLValueAttribute("modified_at", this.tableAlias, modifiedAtDate);
        attributes.addAttribute(modifiedAtAttribute);

        entity.modifiedAt = modifiedAtDate;

        return attributes;
    }

    /**
     * Executes multiple delete queries in a transaction and returns the number of affected rows.
     * Watch the order of the queries. Statements are executed in this order. If no
     * additional deletes are provided, than the delete-query of the of the current facade
     * with the passed attributes is executed. Otherwise the delete-queries of the passed facades are
     * executed with the given entity in the specified order.
     *
     * @param additionalFacades an array of facades that provide delete-queries that should be executed.
     */
    protected deleteStatement(additionalFacades?: any[]): Query[] {
        // array of queries
        const funcArray = [];
        if (additionalFacades) {
            for (const facade of additionalFacades) {
                funcArray.push(facade.getDeleteQueryFn());
            }
        } else {
            funcArray.push(this.getDeleteQueryFn());
        }

        return funcArray;
    }

    /**
     * Returns the function for executing delete queries.
     * Function can be executed to delete the specified entities.
     * Returned function executes exactly one update-statement.
     *
     * Checks if the facade has a non empty filter. If not the update-query can not be performed.
     * This is a security reason that an update can't be performed on the whole table.
     *
     */
    protected getDeleteQueryFn: (attributes?: SQLValueAttributes) => Query = () => {
        return this.getDeleteQuery();
    };

    /**
     * Returns sql-value attributes for insert-statements and update-statements.
     *
     * @param prefix prefix before the sql attribute
     * @param entity entity to take values from
     */
    protected getSQLValueAttributes(prefix: string, entity: EntityType): SQLValueAttributes {
        return new SQLValueAttributes();
    }

    /**
     * Creates and returns an insert-query.
     * Converts the filter of the facade to a sql-where clause and appends
     * it the query. Returns an object of IQuery, which contains the query
     * and the replacement variables as an array.
     *
     * @param attributes columns that should be inserted
     */
    protected getInsertQuery(attributes: SQLValueAttributes): Query {
        const npq: InsertQuery = new InsertQuery();
        const insert: SQLInsert = new SQLInsert(this._tableName);

        insert.attributes = attributes;
        npq.insert = insert;

        const insertQuery: BakedQuery = npq.bake();
        const params: any[] = insertQuery.fillParameters();

        return {query: insertQuery.getBakedSQL(), params};
    }

    /**
     * Creates and returns a select-query.
     * Converts the filter of the facade to a sql-where clause and appends
     * it the query. Order-by are appended to the query afterwards. Returns an
     * object of IQuery, which contains the query and the replacement
     * variables as an array.
     *
     * @param attributes columns that should be selected
     * @param filter select query where clause
     */
    private getSelectQuery(attributes: SQLAttributes, filter: Filter): Query {
        const npq: SelectQuery = new SelectQuery();

        const select: SQLSelect = new SQLSelect(attributes);
        const from: SQLFrom = new SQLFrom(this._tableName, this._tableAlias);

        npq.sqlSelect = select;
        npq.sqlFrom = from;
        npq.addJoins(this.joins);
        npq.sqlWhere = BaseFacade.getSQLFilter(filter);
        npq.sqlOrderBy = this._ordering.orderBys;

        const selectQuery: BakedQuery = npq.bake();
        const params: any[] = selectQuery.fillParameters();

        return {query: selectQuery.getBakedSQL(), params};
    }

    /**
     * Creates and returns an update-query.
     * Converts the filter of the facade to a sql-where clause and appends
     * it to the query. Returns an object of IQuery, which contains the query
     * and the replacement variables as an array.
     *
     * @param attributes columns that should be set for update
     */
    private getUpdateQuery(attributes: SQLValueAttributes): Query {
        const npq: UpdateQuery = new UpdateQuery();
        const update: SQLUpdate = new SQLUpdate(this._tableName, this._tableAlias);

        update.attributes = attributes;
        npq.update = update;
        npq.where = BaseFacade.getSQLFilter(this._filter);

        const updateQuery: BakedQuery = npq.bake();
        const params: any[] = updateQuery.fillParameters();

        return {query: updateQuery.getBakedSQL(), params};
    }

    /**
     * Creates and returns a delete-query.
     * Converts the filter of the facade to a sql-where clause and appends it
     * to the query. Returns an object of IQuery, which contains the query
     * and the replacement variables as an array.
     *
     * As a workaround the table-alias in the query is replaced, because it is
     * not allowed in a delete query.
     */
    private getDeleteQuery(): Query {
        const npq: DeleteQuery = new DeleteQuery();

        npq.delete = new SQLDelete(this._tableName, this._tableAlias);
        npq.where = BaseFacade.getSQLFilter(this._filter);

        const deleteQuery: BakedQuery = npq.bake();
        const params: any[] = deleteQuery.fillParameters();

        let queryStr: string = deleteQuery.getBakedSQL();
        const regex = new RegExp(this._tableAlias + "\\.", "g");
        queryStr = queryStr.replace(regex, ""); // workaround for delete

        return {query: queryStr, params};
    }

    /**
     * Prints performance infos about the select query.
     * Analyses the cardinality of the different joins and prints a warning or
     * an error message, if a specific limit is exceeded.
     * Counts the inner- and left-joins and prints the to the console.
     */
    private joinAnalyzer(): void {
        let oneToManyJoinAmount = 0;
        let oneToOneJoinAmount = 0;

        let leftJoinAmount = 0;
        let innerJoinAmount = 0;

        for (const join of this.joins) {
            if (join.joinCardinality === JoinCardinality.ONE_TO_MANY) {
                oneToManyJoinAmount++;
            }

            if (join.joinCardinality === JoinCardinality.ONE_TO_ONE) {
                oneToOneJoinAmount++;
            }

            if (join.joinType === JoinType.LEFT_JOIN) {
                leftJoinAmount++;
            }

            if (join.joinType === JoinType.JOIN) {
                innerJoinAmount++;
            }
        }

        if (this.joins.length > 0) {
            console.log( `Statement contains ${this.joins.length} joins! (${leftJoinAmount} left-joins, ` +
                `${innerJoinAmount} inner-joins, ${oneToManyJoinAmount} one-to-many, ` +
                `${oneToOneJoinAmount} one-to-one)!`);

            const warnToManyJoins = 5;
            if (oneToManyJoinAmount >= warnToManyJoins) {
                console.log( `Safe amount of one-to-many joins (${oneToManyJoinAmount}) exceeded!`);
            }
        }
    }
}

