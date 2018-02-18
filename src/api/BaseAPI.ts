import qs from 'qs';

import { PrimaryKey } from 'src/api/interfaces';


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
        return this.request('GET', this.url, args);
    }

    get(id: PrimaryKey): Promise<ItemType> {
        return this.request('GET', this.url + id + '/');
    }

    /**
     * Make a HTTP request.
     * @param method HTTP method to use, if applicable
     * @param url URL to send the request to
     * @param query Optional query params
     * @param payload Optional payload
     * @returns Async response
     */
    protected request<T = any>(method: string, url: string, query?, payload?): Promise<T> {
        if (process.env.NODE_ENV === 'test') {
            throw new Error('Unmocked request: ' + method + ' ' + url);
        }

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
     * @param url URL part
     * @param [query] Query "payload"
     * @returns URL, with encoded payload if possible
     */
    protected encodeQuery(url: string, query?) {
        if (!query) {
            return url;
        }
        return `${url}?${qs.stringify(query)}`;
    }

    /**
     * Encode payload object for the result body.
     * Leaves out any keys starting with an underscore ('_').
     * @param [payload] Payload to encode
     * @returns Encoded payload, if any.
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
    protected handleResponse(response: Response) {
        if (!response.ok) {
            throw response;
        }
        const { status } = response;
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
            // freeze the object; we don't want to mutate it directly anywhere
            // (this also speeds up Vue a lot)
            return Object.freeze(payload);
        }, (error) => {
            // tslint:disable-next-line no-console
            console.warn('Unable to decode payload:', error);
            throw error;
        });
    }

    /**
     * Handle any error that may have occurred.
     * @param error
     */
    protected handleError(errorResponse: Response | any) {
        // see if we got any kind of payload
        if (typeof errorResponse.json !== 'function') {
            throw errorResponse;
        }
        return errorResponse.json().then((payload) => {
            throw Object.freeze(payload);
        }, (error) => {
            // tslint:disable-next-line no-console
            console.warn('unable to decode error payload:', error);
            throw error;
        });
    }
}
