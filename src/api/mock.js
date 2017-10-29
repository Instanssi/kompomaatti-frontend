import { FetchResponse } from './response';


const mockBEState = {
    session: null,
};

/**
 * Maps methods and paths
 */
const mockEndpoints = {
    '/session': {
        POST: (payload, _query) => {
            const { username, password } = payload;
            if()
        },
        DELETE: (_payload, _query) => {
            if(mockBEState.session) {
                mockBEState.session = null;
                return new FetchResponse(205, {});
            }
            return new FetchResponse(401, null);
        },
        GET: (_payload, _query) => {
            if(mockBEState.session) {
                return new FetchResponse(200, Object.assign(mockBEState.session));
            }
            return new FetchResponse(401, null);
        }
    }
};

const mockFetchJSON = async (method, url, payload) => {
    // Try to find matching mock implementation
    // split URL into path and query
    const re = /([\/a-zA-Z0-9]+)(?:\?(.*))?/;
    const match = url.match(re);
    const path = match[1];
    const query = match[2];

    const controller = mockEndpoints[path];
    if(!controller) {
        throw new FetchResponse(404, {});
    }
    const handler = controller[method];
    if(!handler) {
        throw new FetchResponse(405, {});
    }
    try {
        return handler(payload, query);
    } catch(e) {
        throw new FetchResponse(500, e);
    }
};