import {UserFacade} from "./example/UserFacade";
import {SQLOperator} from "../src/db/sql/enums/SQLOperator";
import {SQLComparisonOperator} from "../src/db/sql/enums/SQLComparisonOperator";
import {SQLOrder} from "../src/db/sql/enums/SQLOrder";
import {User} from "./example/User";
import {Filter} from "../src/db/filter/Filter";

describe("EntityFacade Tests", () => {

    it("Test clear filter.", () => {
        const facade = new UserFacade("u");
        facade.filter.addFilterCondition("emai", "testmail");

        expect(facade.filter.isEmpty).toBeFalsy();

        facade.clearFilter();

        expect(facade.filter.isEmpty).toBeTruthy();
    });

    it("Test get fully qualified name", () => {
        const facade = new UserFacade("u");
        const name = facade.name("password");
        expect(name).toEqual("passwordu");
    });

    describe("Test select-query.", () => {
        it("Test select by id.", () => {
            const facade = new UserFacade("u");
            const query = facade.getById(1);
            expect(query.query)
                .toEqual("SELECT u.id AS idu, u.created_at AS created_atu, u.modified_at AS modified_atu, u.email AS emailu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u WHERE (( u.id = ? ))");
            expect(query.params).toContain(1);
        });

        it("Test select by email-filter.", () => {
            const facade = new UserFacade("u");
            const filter = facade.filter;
            filter.addFilterCondition("email", "testmail@example.org");

            const query = facade.get();
            expect(query.query)
                .toEqual("SELECT u.id AS idu, u.created_at AS created_atu, u.modified_at AS modified_atu, u.email AS emailu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u WHERE (( u.email = ? ))");
            expect(query.params).toContain("testmail@example.org");
        });

        it("Test select with in-operator.", () => {
            const facade = new UserFacade("u");
            const filter = facade.filter;
            filter.addFilterCondition("gender", [1, 2, 3], SQLComparisonOperator.IN);

            const query = facade.get();
            expect(query.query)
                .toEqual("SELECT u.id AS idu, u.created_at AS created_atu, u.modified_at AS modified_atu, u.email AS emailu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u WHERE (( u.gender IN (?) ))");
        });

        it("Test select with sub-filter", () => {
            const facade = new UserFacade("u");
            const filter = facade.filter;
            filter.addFilterCondition("email", "testmail@example.org");

            filter.addOperator(SQLOperator.AND);

            const subFilter = new Filter("u");
            subFilter.addFilterCondition("forename", "John");
            subFilter.addOperator(SQLOperator.OR);
            subFilter.addFilterCondition("lastname", "Doe");

            filter.addSubFilter(subFilter);

            const query = facade.get();
            expect(query.query)
                .toEqual("SELECT u.id AS idu, u.created_at AS created_atu, u.modified_at AS modified_atu, u.email AS emailu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u WHERE (( u.email = ? ) AND (( u.forename = ? ) OR ( u.lastname = ? )))");
            expect(query.params).toContain("testmail@example.org");
        });

        it("Test select by greater-than operator.", () => {
            const facade = new UserFacade("u");
            const filter = facade.filter;
            filter.addFilterCondition("failed_login_attempts", 1, SQLComparisonOperator.GREATER_THAN);

            const query = facade.get();
            expect(query.query)
                .toEqual("SELECT u.id AS idu, u.created_at AS created_atu, u.modified_at AS modified_atu, u.email AS emailu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u WHERE (( u.failed_login_attempts > ? ))");
            expect(query.params).toContain(1);
        });

        it("Test select by email- and name-filter.", () => {
            const facade = new UserFacade("u");
            const filter = facade.filter;
            filter.addFilterCondition("email", "testmail@example.org", SQLComparisonOperator.EQUAL, SQLOperator.AND);
            filter.addFilterCondition("forename", "John");

            const query = facade.get();
            expect(query.query)
                .toEqual("SELECT u.id AS idu, u.created_at AS created_atu, u.modified_at AS modified_atu, u.email AS emailu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u WHERE (( u.email = ? ) AND ( u.forename = ? ))");
            expect(query.params).toContain("testmail@example.org");
            expect(query.params).toContain("John");
        });

        it("Test select with order-by.", () => {
            const facade = new UserFacade("u");
            const ordering = facade.ordering;
            ordering.addOrderBy("id", SQLOrder.ASC);

            const query = facade.getById(1);
            expect(query.query)
                .toEqual("SELECT u.id AS idu, u.created_at AS created_atu, u.modified_at AS modified_atu, u.email AS emailu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u WHERE (( u.id = ? )) ORDER BY u.id ASC");
            expect(query.params).toContain(1);
        });

        it("Test select with order-by directly in the facade.", () => {
            const facade = new UserFacade("u");
            facade.addOrderBy("id", SQLOrder.ASC);

            const query = facade.getById(1);
            expect(query.query)
                .toEqual("SELECT u.id AS idu, u.created_at AS created_atu, u.modified_at AS modified_atu, u.email AS emailu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u WHERE (( u.id = ? )) ORDER BY u.id ASC");
            expect(query.params).toContain(1);
        });

        it("Test select with multiple order-bys.", () => {
            const facade = new UserFacade("u");
            const ordering = facade.ordering;
            ordering.addOrderBy("id", SQLOrder.ASC);
            ordering.addOrderBy("email", SQLOrder.DESC);

            const query = facade.getById(1);
            expect(query.query)
                .toEqual("SELECT u.id AS idu, u.created_at AS created_atu, u.modified_at AS modified_atu, u.email AS emailu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u WHERE (( u.id = ? )) ORDER BY u.id ASC, u.email DESC");
            expect(query.params).toContain(1);
        });

        it("Test select with excluded sql-attributes.", () => {
            const facade = new UserFacade("u");
            const query = facade.get(["created_at", "modified_at", "email"]);
            expect(query.query)
                .toEqual("SELECT u.id AS idu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u");
            expect(query.params).toHaveLength(0);
        });

    });

    describe("Test update-query.", () => {
        it("Test update-query.", () => {
            const u = new User();
            u.email = "testmail@example.org";
            u.forename = "John";
            u.lastname = "Doe";
            u.gender = 1;

            const facade = new UserFacade("u");
            const query = facade.update(u);
            expect(query.query).toEqual("UPDATE users u SET u.`email` = ?, u.`forename` = ?, u.`lastname` = ?, u.`gender` = ?, u.`modified_at` = ?");
            expect(query.params).toContain("testmail@example.org");
            expect(query.params).toContain("John");
            expect(query.params).toContain("Doe");
            expect(query.params).toContain(1);
        });

        it("Test update-query with id.", () => {
            const u = new User();
            u.id = 1;
            u.email = "testmail@example.org";
            u.forename = "John";
            u.lastname = "Doe";
            u.gender = 1;

            const facade = new UserFacade("u");
            facade.filter.addFilterCondition("id", 1);
            const query = facade.update(u);
            expect(query.query).toEqual("UPDATE users u SET u.`email` = ?, u.`forename` = ?, u.`lastname` = ?, u.`gender` = ?, u.`modified_at` = ? WHERE (( u.id = ? ))");
            expect(query.params).toContain(u.email);
            expect(query.params).toContain(u.forename);
            expect(query.params).toContain(u.lastname);
            expect(query.params).toContain(u.id);
            u.createdAt;
            u.modifiedAt;
        });
    });

    describe("Test insert-query.", () => {
        it("Test insert-query.", () => {
            const u = new User();
            u.email = "testmail@example.org";
            u.forename = "John";
            u.lastname = "Doe";
            u.gender = 1;

            const facade = new UserFacade("u");
            const query = facade.insert(u);
            expect(query.query).toEqual("INSERT INTO users( users.email, users.forename, users.lastname, users.gender, users.created_at ) VALUES( ?, ?, ?, ?, ? )");
            expect(query.params).toContain("testmail@example.org");
            expect(query.params).toContain("John");
            expect(query.params).toContain("Doe");
            expect(query.params).toContain(1);
        });
    });

    describe("Test delete-query.", () => {
        it("Test delete-query.", () => {
            const facade = new UserFacade("u");
            const query = facade.delete();
            expect(query.query).toEqual("DELETE FROM users");
            expect(query.params).toHaveLength(0);
        });

        it("Test delete by id.", () => {
            const facade = new UserFacade("u");
            facade.filter.addFilterCondition("id", 1);
            const query = facade.delete();
            expect(query.query).toEqual("DELETE FROM users WHERE (( id = ? ))");
            expect(query.params).toContain(1);
        });

        it("Test delete by email and id.", () => {
            const facade = new UserFacade("u");
            facade.filter.addFilterCondition("id", 1);
            facade.filter.addOperator(SQLOperator.AND);
            facade.filter.addFilterCondition("email", "testmail");
            const query = facade.delete();
            expect(query.query).toEqual("DELETE FROM users WHERE (( id = ? ) AND ( email = ? ))");
            expect(query.params).toContain(1);
            expect(query.params).toContain("testmail");
        });
    });
});