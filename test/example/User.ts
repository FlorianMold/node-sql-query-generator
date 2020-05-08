import {AbstractModel} from "../../src/db/AbstractModel";

export class User extends AbstractModel<User> {
    private _email: string;
    private _password: string;
    private _forename: string;
    private _lastname: string;
    private _gender: number;
    private _lastLogin: Date;
    private _failedLoginAttempts: number;
    private _loginCoolDown: Date;
    private _status: number;
    private _resetcode: number;
    private _resetcodeValidUntil: Date;

    public constructor() {
        super();
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get forename(): string {
        return this._forename;
    }

    set forename(value: string) {
        this._forename = value;
    }

    get lastname(): string {
        return this._lastname;
    }

    set lastname(value: string) {
        this._lastname = value;
    }

    get gender(): number {
        return this._gender;
    }

    set gender(value: number) {
        this._gender = value;
    }

    get lastLogin(): Date {
        return this._lastLogin;
    }

    set lastLogin(value: Date) {
        this._lastLogin = value;
    }

    get failedLoginAttempts(): number {
        return this._failedLoginAttempts;
    }

    set failedLoginAttempts(value: number) {
        this._failedLoginAttempts = value;
    }

    get loginCoolDown(): Date {
        return this._loginCoolDown;
    }

    set loginCoolDown(value: Date) {
        this._loginCoolDown = value;
    }

    get status(): number {
        return this._status;
    }

    set status(value: number) {
        this._status = value;
    }

    get resetcode(): number {
        return this._resetcode;
    }

    set resetcode(value: number) {
        this._resetcode = value;
    }

    get resetcodeValidUntil(): Date {
        return this._resetcodeValidUntil;
    }

    set resetcodeValidUntil(value: Date) {
        this._resetcodeValidUntil = value;
    }

    get fullName() {
        return this.forename + " " + this.lastname;
    }
}
