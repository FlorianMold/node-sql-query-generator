import {UserFacade} from "./example/UserFacade";
import {SQLComparisonOperator} from "../src/db/sql/enums/SQLComparisonOperator";
import {SQLOperator} from "../src/db/sql/enums/SQLOperator";
import {SQLOrder} from "../src/db/sql/enums/SQLOrder";
import {RecipeCompositeFacade} from "./example/RecipeCompositeFacade";

describe("CompositeFacade Tests", () => {
    describe("Test select-query.", () => {

        it("Test select by id.", () => {
            const facade = new RecipeCompositeFacade();
            const query = facade.getById(1);
            expect(query.query)
                .toEqual("SELECT rec.id AS idrec, rec.created_at AS created_atrec, rec.modified_at AS modified_atrec, rec.name AS namerec, rec.description AS descriptionrec, rec.difficulty_id AS difficulty_idrec, rec.mealtime AS mealtimerec, recing.created_at AS created_atrecing, recing.modified_at AS modified_atrecing, recing.recipe_id AS recipe_idrecing, recing.ingredient_id AS ingredient_idrecing, ig.id AS idig, ig.created_at AS created_atig, ig.modified_at AS modified_atig, ig.name AS nameig, ig.image_id AS image_idig, ig.food_category_id AS food_category_idig FROM recipes AS rec LEFT JOIN recipes_ingredients recing ON ( recing.recipe_id = rec.id ) LEFT JOIN ingredients ig ON ( ig.id = recing.ingredient_id ) WHERE (( rec.id = ? ))")
            expect(query.params).toContain(1);
        });

        it("Test select.", () => {
            const facade = new RecipeCompositeFacade();
            const query = facade.get();
            expect(query.query)
                .toEqual("SELECT rec.id AS idrec, rec.created_at AS created_atrec, rec.modified_at AS modified_atrec, rec.name AS namerec, rec.description AS descriptionrec, rec.difficulty_id AS difficulty_idrec, rec.mealtime AS mealtimerec, recing.created_at AS created_atrecing, recing.modified_at AS modified_atrecing, recing.recipe_id AS recipe_idrecing, recing.ingredient_id AS ingredient_idrecing, ig.id AS idig, ig.created_at AS created_atig, ig.modified_at AS modified_atig, ig.name AS nameig, ig.image_id AS image_idig, ig.food_category_id AS food_category_idig FROM recipes AS rec LEFT JOIN recipes_ingredients recing ON ( recing.recipe_id = rec.id ) LEFT JOIN ingredients ig ON ( ig.id = recing.ingredient_id ) ")
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
            filter.addFilterCondition(
                "email",
                "testmail@example.org",
                SQLComparisonOperator.EQUAL,
                SQLOperator.AND
            );
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
                .toEqual("SELECT u.id AS idu, u.password AS passwordu, u.forename AS forenameu, u.lastname AS lastnameu, u.gender AS genderu, u.last_login AS last_loginu, u.failed_login_attempts AS failed_login_attemptsu, u.login_cooldown AS login_cooldownu, u.status AS statusu, u.resetcode AS resetcodeu, u.resetcode_validuntil AS resetcode_validuntilu FROM users AS u ");
            expect(query.params).toHaveLength(0);
        });

    });
});