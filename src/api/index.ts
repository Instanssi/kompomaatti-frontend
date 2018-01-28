import BaseAPI from './base';
import {
    ICompetition,
    ICompetitionParticipation,
    ICompo,
    ICompoEntry,
    IEvent,
    IProgrammeEvent,
    IUser,
} from 'src/api/models';

class SessionAPI extends BaseAPI<IUser> {
    constructor(baseUrl, config) {
        super(baseUrl + '/current_user/', config);
    }

    get(): Promise<IUser> {
        return this.fetch('GET', this.url);
    }
}

class EventsAPI extends BaseAPI<IEvent> {
    constructor(baseUrl, config) {
        super(baseUrl + '/events/', config);
    }
}

class ComposAPI extends BaseAPI<ICompo> {
    constructor(baseUrl, config) {
        super(baseUrl + '/compos/', config);
    }
}

class CompetitionsAPI extends BaseAPI<ICompetition> {
    constructor(baseUrl, config) {
        super(baseUrl + '/competitions/', config);
    }
}

class ProgrammeAPI extends BaseAPI<IProgrammeEvent> {
    constructor(baseUrl, config) {
        super(baseUrl + '/programme_events/', config);
    }
}

class CompoEntriesAPI extends BaseAPI<ICompoEntry> {
    constructor(baseUrl, config) {
        super(baseUrl + '/compo_entries/', config);
    }
}

class CompetitionParticipationsAPI extends BaseAPI<ICompetitionParticipation> {
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
    currentUser: SessionAPI;
    events: EventsAPI;
    compos: ComposAPI;
    competitions: CompetitionsAPI;
    programme: ProgrammeAPI;
    compoEntries: CompoEntriesAPI;
    competitionParticipations: CompetitionParticipationsAPI;
    songs: SongsAPI;

    constructor(baseUrl: string, config = {}) {
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
