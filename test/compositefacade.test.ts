import {RecipeCompositeFacade} from "./example/RecipeCompositeFacade";
import {SQLOperator} from "../src/db/sql/enums/SQLOperator";

describe("CompositeFacade Tests", () => {

    it("Test join-analyzer!", () => {
        const facade = new RecipeCompositeFacade();
        const joins = facade.joinAnalyzer();

        expect(joins.innerJoinAmount).toEqual(1);
        expect(joins.leftJoinAmount).toEqual(1);
        expect(joins.oneToManyJoinAmount).toEqual(1);
        expect(joins.oneToOneJoinAmount).toEqual(1);
    });

    describe("Test select-query.", () => {

        it("Test select by id.", () => {
            const facade = new RecipeCompositeFacade();
            const query = facade.getById(1);
            expect(query.query)
                .toEqual("SELECT rec.id AS idrec, rec.created_at AS created_atrec, rec.modified_at AS modified_atrec, rec.name AS namerec, rec.description AS descriptionrec, rec.difficulty_id AS difficulty_idrec, rec.mealtime AS mealtimerec, recing.created_at AS created_atrecing, recing.modified_at AS modified_atrecing, recing.recipe_id AS recipe_idrecing, recing.ingredient_id AS ingredient_idrecing, ig.id AS idig, ig.created_at AS created_atig, ig.modified_at AS modified_atig, ig.name AS nameig, ig.image_id AS image_idig, ig.food_category_id AS food_category_idig FROM recipes AS rec JOIN recipes_ingredients recing ON ( recing.recipe_id = rec.id ) LEFT JOIN ingredients ig ON ( ig.id = recing.ingredient_id ) WHERE (( rec.id = ? ))");
            expect(query.params).toContain(1);
        });

        it("Test select.", () => {
            const facade = new RecipeCompositeFacade();
            const query = facade.get();
            expect(query.query)
                .toEqual("SELECT rec.id AS idrec, rec.created_at AS created_atrec, rec.modified_at AS modified_atrec, rec.name AS namerec, rec.description AS descriptionrec, rec.difficulty_id AS difficulty_idrec, rec.mealtime AS mealtimerec, recing.created_at AS created_atrecing, recing.modified_at AS modified_atrecing, recing.recipe_id AS recipe_idrecing, recing.ingredient_id AS ingredient_idrecing, ig.id AS idig, ig.created_at AS created_atig, ig.modified_at AS modified_atig, ig.name AS nameig, ig.image_id AS image_idig, ig.food_category_id AS food_category_idig FROM recipes AS rec JOIN recipes_ingredients recing ON ( recing.recipe_id = rec.id ) LEFT JOIN ingredients ig ON ( ig.id = recing.ingredient_id ) ");
        });

        it("Test select with multiple filters.", () => {
            const facade = new RecipeCompositeFacade();
            const filter = facade.filter;
            filter.addFilterCondition("id", 1);
            facade.ingredientFilter.addFilterCondition("name", "pepper");

            const query = facade.get();
            expect(query.query)
                .toEqual("SELECT rec.id AS idrec, rec.created_at AS created_atrec, rec.modified_at AS modified_atrec, rec.name AS namerec, rec.description AS descriptionrec, rec.difficulty_id AS difficulty_idrec, rec.mealtime AS mealtimerec, recing.created_at AS created_atrecing, recing.modified_at AS modified_atrecing, recing.recipe_id AS recipe_idrecing, recing.ingredient_id AS ingredient_idrecing, ig.id AS idig, ig.created_at AS created_atig, ig.modified_at AS modified_atig, ig.name AS nameig, ig.image_id AS image_idig, ig.food_category_id AS food_category_idig FROM recipes AS rec JOIN recipes_ingredients recing ON ( recing.recipe_id = rec.id ) LEFT JOIN ingredients ig ON ( ig.id = recing.ingredient_id ) WHERE ((( ig.name = ? )) AND (( rec.id = ? )))");
            expect(query.params).toContain("pepper");
            expect(query.params).toContain(1);
        });

        it("Test clear filters.", () => {
            const facade = new RecipeCompositeFacade();
            const filter = facade.filter;
            filter.addFilterCondition("id", 1);
            facade.ingredientFilter.addFilterCondition("name", "pepper");

            facade.clearFacadeFilters();

            for (const facadeElement of facade.filters) {
                expect(facadeElement.isEmpty).toBeTruthy();
            }
        });

        it("Test change auto-combine sql-operator.", () => {
            const facade = new RecipeCompositeFacade();
            const filter = facade.filter;
            filter.addFilterCondition("id", 1);
            facade.ingredientFilter.addFilterCondition("name", "pepper");
            facade.sqlOperator = SQLOperator.OR

            const query = facade.get();
            expect(query.query)
                .toEqual("SELECT rec.id AS idrec, rec.created_at AS created_atrec, rec.modified_at AS modified_atrec, rec.name AS namerec, rec.description AS descriptionrec, rec.difficulty_id AS difficulty_idrec, rec.mealtime AS mealtimerec, recing.created_at AS created_atrecing, recing.modified_at AS modified_atrecing, recing.recipe_id AS recipe_idrecing, recing.ingredient_id AS ingredient_idrecing, ig.id AS idig, ig.created_at AS created_atig, ig.modified_at AS modified_atig, ig.name AS nameig, ig.image_id AS image_idig, ig.food_category_id AS food_category_idig FROM recipes AS rec JOIN recipes_ingredients recing ON ( recing.recipe_id = rec.id ) LEFT JOIN ingredients ig ON ( ig.id = recing.ingredient_id ) WHERE ((( ig.name = ? )) OR (( rec.id = ? )))");
            expect(query.params).toContain("pepper");
        });

        it("Test do not auto-combine filter", () => {
            const facade = new RecipeCompositeFacade();
            const filter = facade.filter;
            filter.addFilterCondition("id", 1);
            facade.ingredientFilter.addFilterCondition("name", "pepper");
            facade.autoCombineFilter = false;

            const query = facade.get();
            expect(query.query)
                .toEqual("SELECT rec.id AS idrec, rec.created_at AS created_atrec, rec.modified_at AS modified_atrec, rec.name AS namerec, rec.description AS descriptionrec, rec.difficulty_id AS difficulty_idrec, rec.mealtime AS mealtimerec, recing.created_at AS created_atrecing, recing.modified_at AS modified_atrecing, recing.recipe_id AS recipe_idrecing, recing.ingredient_id AS ingredient_idrecing, ig.id AS idig, ig.created_at AS created_atig, ig.modified_at AS modified_atig, ig.name AS nameig, ig.image_id AS image_idig, ig.food_category_id AS food_category_idig FROM recipes AS rec JOIN recipes_ingredients recing ON ( recing.recipe_id = rec.id ) LEFT JOIN ingredients ig ON ( ig.id = recing.ingredient_id ) WHERE (( rec.id = ? ))");
            expect(query.params).toContain(1);
        });

    });
});