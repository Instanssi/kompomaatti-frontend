import qs from 'qs';

/**
 * Common code for accessing web services.
 */
export default class BaseAPI {
    constructor(baseUrl, config) {
        this.url = baseUrl;
        this.config = config || {};
    }

    /**
     * Make a HTTP request.
     * @param {string} method - HTTP method to use, if applicable
     * @param {string} url - URL to send the request to
     * @param {object} [query]
     * @param {object} [payload]
     * @returns {Promise.<object>} - Response
     */
    fetch(method, url, query, payload) {
        const _fetch = this.config.fetch || fetch;

        return _fetch(this.encodeQuery(url, query), {
            method,
            body: this.encodePayload(payload),
        }).then(res => this.handleResponse(res),
        ).catch(err => this.handleError(err));
    }

    /**
     * Encode query part into the URL.
     * Note that there's no standard for how to encode non-trivial data.
     * @param {string} url - URL part
     * @param {object} [query] - Query "payload"
     * @returns {string} - URL, with encoded payload if possible
     */
    encodeQuery(url, query) {
        if(!query) {
            return url;
        }
        return `${url}?${qs.stringify(query)}`;
    }

    /**
     * Encode payload object for the result body.
     * Leaves out any keys starting with an underscore ('_').
     * @param {object} [payload] - Payload to encode
     * @returns {string|undefined} - Encoded payload, if any.
     */
    encodePayload(payload) {
        if(payload) {
            return JSON.stringify(
                payload,
                (key, val) => {
                    // prefix for implementation details in other logic
                    if(key[0] !== '_') {
                        return val;
                    }
                }
            );
        }
    }

    /**
     * Handle a HTTP/Fetch response. Note that fetch does not auto-reject
     * on error-like status code, so we do it here.
     * @param {Response} response
     */
    handleResponse(response) {
        const { status } = response;
        if(status === 0) {
            // timeout or other connection problem
            throw {
                _status: 0,
            };
        }
        if(status < 200 || status >= 300) {
            // into the error handler you go
            throw response;
        }
        if(status === 204 || status === 205) {
            // This is probably less accident-prone than returning null
            return {
                _status: status
            };
        }
        // there might be some interesting payload, try to decode it
        return response.json().then(payload => {
            // all payloads should be objects anyway to block eval() fail
            if(payload && typeof payload === 'object') {
                payload._status = status;
            }
            return payload;
        }, error => {
            console.warn('Unable to decode payload:', error);
            throw error;
        });
    }

    /**
     * Handle any error that may have occurred.
     * @param {Response|Error|object} error
     */
    handleError(error) {
        // see if we got any kind of payload
        if(typeof error.json !== 'function') {
            throw error;
        }
        return error.json().then(payload => {
            throw payload;
        }, error => {
            console.warn('unable to decode error payload:', error);
            throw error;
        });
    }
}
