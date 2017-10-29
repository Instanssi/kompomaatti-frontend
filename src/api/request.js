import { FetchResponse } from './response';

/**
 * Maybe send, maybe get some JSON.
 * @param {string} method - GET/DELETE/POST/PUT
 * @param {string} url - URL or path to send request to.
 * @param {object} payload - Request body, if any.
 * @return {Promise.<object>}
 */
export async function request(method, url, payload) {
    const args = {
        method,
    };
    if(payload) {
        args.body = JSON.stringify(payload);
    }

    const response = await fetch(url, args);
    const { status } = response;

    // handle and try to parse errors
    if(status < 200 || status >= 300) {
        try {
            const responsePayload = await response.json();
            throw new FetchResponse(status, responsePayload);
        } catch(error) {
            throw new FetchResponse(status, error);
        }
    }

    // try to read JSON from response body if it wasn't 204 or 205
    let responsePayload;
    if(status !== 204 && status !== 205) {
        responsePayload = await response.json();
    }
    return new FetchResponse(status, responsePayload);
}
