# Node.js SQL-query generator

## Introduction
This is a node.js query-generator for mysql. It is written in TypeScript and is 100% MIT licensed.

## Entity-Facade
First create an entity that is similar to the database table you want to query. 
To define the attributes for the select query, implement the getSQLAttributes(...) function. 
Id, created_at and updated_at are automatically added to the attributes. 
Um dies zu verhindern, können die unnötigen Attribute mit dem Parameter excludedSQLAttributes() entfernt werden.


```typescript
export class UserFacade extends EntityFacade<User> {
    public getSQLAttributes(excludedSQLAttributes?: string[]): SQLAttributes {
        const sqlAttributes =
            [
                "email", "password", "forename", "lastname", ...
            ];
        return super.getSQLAttributes(excludedSQLAttributes, sqlAttributes);
    }
}
```

For update/insert-queries the getSQLValueAttributes(...) function must be implemented. 
The attributes that are inserted in the query must be defined here. 

```typescript
public getSQLValueAttributes(prefix: string, user: User): SQLValueAttributes {
    const attributes: SQLValueAttributes = new SQLValueAttributes();

    const emailAttribute: SQLValueAttribute = new SQLValueAttribute("email", prefix, user.email);
    attributes.addAttribute(emailAttribute);

    const passwordAttribute: SQLValueAttribute = new SQLValueAttribute("password", prefix, user.password);
    attributes.addAttribute(passwordAttribute);

    ...attributes...

    return attributes;
}
```

## Composite-Facade
Composite facades combine several facades into one. 
These facades are usually joined together with SQL. 
The composite facades have all filters and order bys of the facades they encapsulate. 
These filters and order-bys can be accessed directly via the program code.


```typescript
export class RecipeCompositeFacade extends CompositeFacade<Recipe> {

    recipeFacade: RecipeFacade;
    recipeIngredientFacade: RecipeIngredientFacade;
    ingredientFacade: IngredientFacade;

    ...

    get joins(): SQLJoin[] {
        let joins: SQLJoin[] = [];

        joins = joins.concat(this._recipeFacade.joins); // add recipe joins (difficulties)

        const recipesIngredientsJoin: SQLBlock = new SQLBlock();
        recipesIngredientsJoin.addText(
            `${this._recipeIngredientFacade.tableAlias}.recipe_id = ${this.tableAlias}.id`
        );
        joins.push(new SQLJoin(
            this._recipeIngredientFacade.tableName, this._recipeIngredientFacade.tableAlias, recipesIngredientsJoin,
            JoinType.JOIN, JoinCardinality.ONE_TO_MANY)
        );
        ...
        return joins;
    }

    get filters(): Filter[] {
        return [
            this.ingredientFilter
        ];
    }
    get ingredientFilter(): Filter {
        return this.ingredientFacade.filter;
    }

    get orderBys(): Ordering[] {
        return [
            this.ingredientOrderBy,
        ];
    }

    get ingredientOrderBy(): Ordering {
        return this.ingredientFacade.ordering;
    }



}
```

The various filters and order-bys are automatically joined together with AND during the select operations. 
This behavior can be changed as follows.

```typescript
const compositeFacade = new CompositeFacade(tableAlias?: string);

/**
 * Sql-operator to automatically combine composite-filters with.
 *
 * @param value operator for combining filters
 */
compositeFacade.sqlOperator(value: SQLOperator);

/**
 * Enables automatic combination of the composite filters with specified sql-operator.
 *
 * @param value determines if the filters should be auto-combined with
 */
compositeFacade.autoCombineFilter(value: boolean);
```


## Select-Query

```typescript
const facade = new ExampleFacade("u");
const query = facade.get();
```

### Select by id

```typescript
const facade = new ExampleFacade("u");
const query = facade.getById(1);
```

### Select with filter
```typescript
const facade = new ExampleFacade("u");
const filter = facade.filter;
filter.addFilterCondition("email", "example@mail.com");

const query = facade.get();
```

### Select with order-by
```typescript
const facade = new ExampleFacade("u");
const ordering = facade.ordering;
ordering.addOrderBy("id", SQLOrder.ASC);

const query = facade.getById(1);
```
## Insert-Query
```typescript
const entity = new Entity();

const facade = new ExampleFacade("u");
const query = facade.insert(entity);
```

## Update-Query
```typescript
const entity = new Entity();

const facade = new ExampleFacade("u");
facade.filter.addFilterCondition("id", 1);
const query = facade.update(entity);
```

## Delete-Query
```typescript
const facade = new ExampleFacade("u");
facade.filter.addFilterCondition("id", 1);
const query = facade.delete();
```

## Filter
Every facade has a filter for all types of queries. To add a filter, simply call the method 
addFilterCondition(...). The name and value of the condition must be specified. 
Additionally, the operator can be specified. 
The equals operator is used by default, but all SQL comparison operators are supported.

```typescript
const facade = new Facade(tableAlias?: string);  
const filter = facade.filter;  
  
filter.addFilterCondition(name: string, value: any, sqlOperator: SQLComparisonOperator, operator?: SQLOperator);  
```

To add more conditions an operator must be specified to connect the two.

```typescript
filter.addOperator(operator: SQLOperator);  
```

Additionally, a sub-filter can be added to the current filter. This sub-filter is inserted into the filter as an expression and in brackets.

```typescript
filter.addSubFilter(anotherFilter);  
```

All filter clauses can be removed from the filter via the facade or directly via the filter.

```typescript
const facade = new Facade(tableAlias?: string);  
facade.clearFilter();  
  
const filter: Filter = new Filter();  
filter.clear();  
```

## Order By
The result of a query can be sorted with an order by. 
To do this, an order on an attribute must be specified directly on the facade. 
The order can be either ascending (ASC) or descending (DESC).

```typescript
const facade = new Facade(tableAlias?: string);  
facade.addOrderBy(attribute: string, order: SQLOrder);  
```
Any number of order bys can be defined.