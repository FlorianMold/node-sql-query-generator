import {SQLValueAttributes} from "../../src/db/sql/SQLValueAttributes";
import {SQLValueAttribute} from "../../src/db/sql/SQLValueAttribute";
import {SQLAttributes} from "../../src/db/sql/SQLAttributes";
import {EntityFacade} from "../../src/EntityFacade";
import {User} from "./User";

export class UserFacade extends EntityFacade<User> {

    /**
     * @param tableAlias table-alias of the facade
     */
    public constructor(tableAlias?: string) {
        if (tableAlias) {
            super("users", tableAlias);
        } else {
            super("users", "u");
        }
    }

    /**
     * Returns sql-attributes that should be retrieved from the database.
     * Combines the attributes from the joined facades.
     *
     * @param excludedSQLAttributes attributes that should not be selected
     */
    public getSQLAttributes(excludedSQLAttributes?: string[]): SQLAttributes {
        const sqlAttributes: string[] =
            [
                "email", "password", "forename", "lastname",
                "gender", "last_login", "failed_login_attempts",
                "login_cooldown", "status", "resetcode", "resetcode_validuntil"
            ];
        return super.getSQLAttributes(excludedSQLAttributes, sqlAttributes);
    }


    /**
     * Returns common sql-attributes for inserts- and updates-statement.
     *
     * @param prefix prefix before the sql-attribute
     * @param user entity to take values from
     */
    public getSQLValueAttributes(prefix: string, user: User): SQLValueAttributes {
        const attributes: SQLValueAttributes = new SQLValueAttributes();

        const emailAttribute: SQLValueAttribute = new SQLValueAttribute("email", prefix, user.email);
        attributes.addAttribute(emailAttribute);

        const passwordAttribute: SQLValueAttribute = new SQLValueAttribute("password", prefix, user.password);
        attributes.addAttribute(passwordAttribute);

        const forenameAttribute: SQLValueAttribute = new SQLValueAttribute("forename", prefix, user.forename);
        attributes.addAttribute(forenameAttribute);

        const lastnameAttribute: SQLValueAttribute = new SQLValueAttribute("lastname", prefix, user.lastname);
        attributes.addAttribute(lastnameAttribute);

        const genderAttribute: SQLValueAttribute = new SQLValueAttribute("gender", prefix, user.gender);
        attributes.addAttribute(genderAttribute);

        const lastLoginAttribute: SQLValueAttribute = new SQLValueAttribute("last_login", prefix, user.lastLogin);
        attributes.addAttribute(lastLoginAttribute);

        const failedLoginAttemptsAttribute: SQLValueAttribute
            = new SQLValueAttribute("failed_login_attempts", prefix, user.failedLoginAttempts);
        attributes.addAttribute(failedLoginAttemptsAttribute);

        const loginCooldownAttribute: SQLValueAttribute
            = new SQLValueAttribute("login_cooldown", prefix, user.loginCoolDown);
        attributes.addAttribute(loginCooldownAttribute);

        const statusAttribute: SQLValueAttribute = new SQLValueAttribute("status", prefix, user.status);
        attributes.addAttribute(statusAttribute);

        const resetcodeAttribute: SQLValueAttribute = new SQLValueAttribute("resetcode", prefix, user.resetcode);
        attributes.addAttribute(resetcodeAttribute);

        const resetcodeValidUntilAttribute: SQLValueAttribute
            = new SQLValueAttribute("resetcode_validuntil", prefix, user.resetcodeValidUntil);
        attributes.addAttribute(resetcodeValidUntilAttribute);

        return attributes;
    }
}
