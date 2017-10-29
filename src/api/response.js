export class FetchResponse {
    /**
     * Construct a new response wrapper pretending to be a HTTP response.
     * @param {number} code - Status code.
     * @param {object|null} [payload] - Response payload.
     */
    constructor(code, payload) {
        this._code = code;
        this._payload = payload;
    }
    /**
     * True if request was successful.
     * @type {boolean}
     */
    get successful() {
        const { code } = this;
        return code >= 200 && code < 300;
    }
    /**
     * HTTP response code, if any. Success = 200-299. Network error = 0.
     * @type {number}
     */
    get code() {
        return this._code;
    }
    /**
     * Response payload.
     * @type {object}
     */
    get payload() {
        return this._payload;
    }
}
