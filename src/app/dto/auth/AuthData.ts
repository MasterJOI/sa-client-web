export class AuthData {

    constructor(private _token: string,
                public _expirationDate: Date) {}

    get token() {
        if (!this._expirationDate || new Date() > this._expirationDate) {
            return '';
        }
        return this._token;
    }

    set token(newToken: string) {
        this._token = newToken;
    }
}
