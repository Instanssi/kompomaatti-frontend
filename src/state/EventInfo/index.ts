import { observable, computed } from 'mobx';

import InstanssiREST from 'src/api';
import { IEvent } from 'src/api/interfaces';
import { LazyStore } from 'src/stores';


/**
 * Tries to model a party event as an ORM-ish object with helper methods and stuff.
 *
 * Most ORMs are not particularly asynchronous, though.
 */
export default class EventInfo {
    @observable.ref event: IEvent;

    compos = new LazyStore(() => this.api.compos.list(this.query));
    competitions = new LazyStore(() => this.api.competitions.list(this.query));
    programme = new LazyStore(() => this.api.programme.list(this.query));
    myEntries = new LazyStore(() => this.api.userCompoEntries.list(this.query));
    myParticipations = new LazyStore(() => this.api.userCompetitionParticipations.list(this.query));
    myVoteCodes = new LazyStore(() => this.api.voteCodes.list(this.query));

    get eventId() {
        return this.event.id;
    }

    protected get query() {
        return { event: this.eventId };
    }

    constructor(protected api: InstanssiREST, event: IEvent) {
        this.event = event;
   }

    /**
     * True if the current user has a vote code for the event.
     */
    @computed
    get hasVoteCode() {
        const { myVoteCodes } = this;
        const { value } = myVoteCodes;
        return (value && value.length > 0);
    }

    /**
     * Try to claim a ticket vote code for the event.
     * @param ticketCode
     */
    async addVoteCode(ticketCode: string) {
        try {
            await this.api.voteCodes.create(ticketCode);
            this.myVoteCodes.refresh();
        } catch (e) {
            // How to warn the user about this? Just let some form handle it?
            throw e;
        }
    }
}
