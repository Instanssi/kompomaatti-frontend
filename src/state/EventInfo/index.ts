import { observable, computed } from 'mobx';
import moment from 'moment';

import InstanssiREST from 'src/api';
import {
    IEvent,
    IProgrammeEvent,
    ICompo,
    ICompetition,
    ICompoEntry,
} from 'src/api/interfaces';
import { LazyStore } from 'src/stores';


/**
 * Collects data related to a specific event under one object for easy access and caching.
 */
export default class EventInfo {
    @observable.ref event: IEvent;

    compos = new LazyStore(() => this.api.compos.list(this.query));
    competitions = new LazyStore(() => this.api.competitions.list(this.query));
    programme = new LazyStore(() => this.api.programme.list(this.query));
    myEntries = new LazyStore(() => this.api.userCompoEntries.list(this.query));
    myParticipations = new LazyStore(() => this.api.userCompetitionParticipations.list(this.query));
    myVoteCodes = new LazyStore(() => this.api.voteCodes.list(this.query));
    myCodeRequests = new LazyStore(() => this.api.voteCodeRequests.list(this.query));

    get eventId() {
        return this.event.id;
    }

    /** Get query parameters for fetching stuff related to this event. */
    protected get query() {
        return { event: this.eventId };
    }

    constructor(protected api: InstanssiREST, event: IEvent) {
        this.event = event;
   }


    @computed
    get voteCodeRequests() {
        // Should only have one of these active per event.
        return this.myCodeRequests.value;
    }

    /**
     * True if the current user has a vote code for the event.
     */
    @computed
    get noVoteCode() {
        const { value } = this.myVoteCodes;
        const { voteCodeRequests } = this;

        const hasOkRequest = voteCodeRequests && voteCodeRequests.find(vc => {
            return vc.status === 1;
        });

        return !(value && value.length) && !hasOkRequest;
    }

    get hasEnded() {
        // HACK: Events have no end date, so assume they last a week.
        // Could compute it from compos, competitions and programme I guess.
        return moment().isAfter(moment(this.event.date).add(1, 'week'));
    }

    getCompoURL(compo: ICompo) {
        return `/events/${this.eventId}/compos/${compo.id}`;
    }

    getCompoEntryAddURL(compo: ICompo) {
        return this.getCompoURL(compo) + '/entries/add';
    }

    getCompoEntryURL(compo: ICompo, entry: ICompoEntry) {
        return this.getCompoURL(compo) + '/entries/' + entry.id;
    }

    getCompoEntryEditURL(compo: ICompo, entry: ICompoEntry) {
        return this.getCompoURL(compo) + '/entries/edit/' + entry.id;
    }

    getProgrammeEventURL(progEvent: IProgrammeEvent) {
        return `/events/${this.eventId}/programme/${progEvent.id}`;
    }

    getCompetitionURL(competition: ICompetition) {
        return `/events/${this.eventId}/competitions/${competition.id}`;
    }
}
