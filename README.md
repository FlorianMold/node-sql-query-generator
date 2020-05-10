# node.js SQL-query generator

## Introduction
This is a node.js query-generator for mysql. It is written in TypeScript and is 100% MIT licensed.
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