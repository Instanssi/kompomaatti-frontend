import qs from 'qs';

import { PrimaryKey } from 'src/api/models';


/**
 * Common code for accessing web services.
 */
export default class BaseAPI<ItemType = any> {
    url: string;
    config: any;

    constructor(baseUrl, config) {
        this.url = baseUrl;
        this.config = config || {};
    }

    list(args?): Promise<ItemType[]> {
        return this.fetch('GET', this.url, args);
    }

    get(id: PrimaryKey): Promise<ItemType> {
        return this.fetch('GET', this.url + id + '/');
    }

    /**
     * Make a HTTP request.
     * @param method HTTP method to use, if applicable
     * @param url URL to send the request to
     * @param query Optional query params
     * @param payload Optional payload
     * @returns esponse
     */
    protected fetch<T = any>(method: string, url: string, query?, payload?): Promise<T> {
        const fetchImpl = this.config.fetch || fetch;

        return fetchImpl(this.encodeQuery(url, query), {
            method,
            body: this.encodePayload(payload),
            credentials: 'include',
        }).then((res) => this.handleResponse(res),
        ).catch((err) => this.handleError(err));
    }

    /**
     * Encode query part into the URL.
     * Note that there's no standard for how to encode non-trivial data.
     * @param {string} url - URL part
     * @param {object} [query] - Query "payload"
     * @returns {string} - URL, with encoded payload if possible
     */
    protected encodeQuery(url, query?) {
        if (!query) {
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
    protected encodePayload(payload) {
        if (payload) {
            return JSON.stringify(
                payload,
                (key, val) => {
                    // prefix for implementation details in other logic
                    if (key[0] !== '_') {
                        return val;
                    }
                },
            );
        }
    }

    /**
     * Handle a HTTP/Fetch response. Note that fetch does not auto-reject
     * on error-like status code, so we do it here.
     * @param {Response} response
     */
    protected handleResponse(response) {
        const { status } = response;
        if (status === 0) {
            // timeout or other connection problem
            throw {
                _status: 0,
            };
        }
        if (status < 200 || status >= 300) {
            // into the error handler you go
            throw response;
        }
        if (status === 204 || status === 205) {
            // This is probably less accident-prone than returning null
            return {
                _status: status,
            };
        }
        // there might be some interesting payload, try to decode it
        return response.json().then((payload) => {
            // all payloads should be objects anyway to block eval() fail
            if (payload && typeof payload === 'object') {
                payload._status = status;
            }
            return payload;
        }, (error) => {
            console.warn('Unable to decode payload:', error);
            throw error;
        });
    }

    /**
     * Handle any error that may have occurred.
     * @param {Response|Error|object} error
     */
    protected handleError(errorResponse: Response) {
        // see if we got any kind of payload
        if (typeof errorResponse.json !== 'function') {
            throw errorResponse;
        }
        return errorResponse.json().then((payload) => {
            throw payload;
        }, (error) => {
            console.warn('unable to decode error payload:', error);
            throw error;
        });
    }
}
