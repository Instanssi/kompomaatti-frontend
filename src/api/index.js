import BaseAPI from './base';

class SessionAPI extends BaseAPI {
    constructor(baseUrl, config) {
        super(baseUrl + '/user/', config);
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

class CompoEntriesAPI extends BaseAPI {
    constructor(baseUrl, config) {
        super(baseUrl + '/compo_entries/', config);
    }
}

class CompetitionParticipationsAPI extends BaseAPI {
    constructor(baseUrl, config) {
        super(baseUrl + '/competition_participations/', config);
    }
}

class SongsAPI extends BaseAPI {
    constructor(baseUrl, config) {
        super(baseUrl + '/songs/', config);
    }
}
/**
 * Abstracts backend endpoints.
 */
export default class InstanssiREST {
    constructor(baseUrl, config) {
        this.currentUser = new SessionAPI(baseUrl, config);
        this.events = new EventsAPI(baseUrl, config);
        this.compos = new ComposAPI(baseUrl, config);
        this.competitions = new CompetitionsAPI(baseUrl, config);
        this.programme = new ProgrammeAPI(baseUrl, config);
        this.compoEntries = new CompoEntriesAPI(baseUrl, config);
        this.competitionParticipations = new CompetitionParticipationsAPI(baseUrl, config);
        this.songs = new SongsAPI(baseUrl, config);
    }
}
