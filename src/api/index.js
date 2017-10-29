import BaseAPI from './base';

class SessionAPI extends BaseAPI {
    constructor(baseUrl, config) {
        super(baseUrl + '/session/', config);
    }

    login(request) {
        return this.fetch('POST', this.url, null, request);
    }

    logout() {
        return this.fetch('DELETE', this.url);
    }

    checkSession() {
        return this.fetch('GET', this.url);
    }
}

class EventsAPI extends BaseAPI {
    constructor(baseUrl, config) {
        super(baseUrl + '/events/', config);
    }
}

class ComposAPI extends BaseAPI {
    constructor(baseUrl, config) {
        super(baseUrl + '/compos/', config);
    }
}

class CompetitionsAPI extends BaseAPI {
    constructor(baseUrl, config) {
        super(baseUrl + '/competitions/', config);
    }
}

class ProgrammeAPI extends BaseAPI {
    constructor(baseUrl, config) {
        super(baseUrl + '/programme_events/', config);
    }

}

/**
 * Abstracts backend endpoints.
 */
export default class InstanssiREST {
    constructor(baseUrl, config) {
        this.session = new SessionAPI(baseUrl, config);
        this.events = new EventsAPI(baseUrl, config);
        this.compos = new ComposAPI(baseUrl, config);
        this.competitions = new CompetitionsAPI(baseUrl, config);
        this.programme = new ProgrammeAPI(baseUrl, config);
    }
}
