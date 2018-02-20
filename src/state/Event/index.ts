import { observable, computed } from 'mobx';

import InstanssiREST from 'src/api';
import { IEvent } from 'src/api/interfaces';
import { RemoteStore } from 'src/stores';


/**
 * Tries to model a party event as an ORM-ish object with helper methods and stuff.
 *
 * Most ORMs are not particularly asynchronous, though.
 */
export default class Event {
    @observable.ref value: IEvent;

    get eventId() {
        return this.value.id;
    }

    /** Vote codes related to the event. */
    eventVoteCodes = new RemoteStore(() => this.api.voteCodes.list({ event: this.eventId }));

    ownEntries = new RemoteStore(() => this.api.userCompoEntries.list({ event: this.eventId }));

    constructor(protected api: InstanssiREST, event: IEvent) {
        this.value = event;





        // TODO: Put together a RemoteStore that only fetches its value when it becomes
        // observed (see MobX atoms)





        // this.eventVoteCodes.refresh();
        // this.ownEntries.refresh();
    }

    /**
     * True if the current user has a vote code for the event.
     */
    @computed
    get hasVoteCode() {
        const { value } = this.eventVoteCodes;
        if (!value && !this.eventVoteCodes.isPending) {
            // Could this be triggered with a MobX atom?
            this.eventVoteCodes.refresh();
        }
        return (value && value.length > 0) || false;
    }

    /**
     * Try to claim a ticket vote code for the event.
     * @param ticketCode
     */
    async addVoteCode(ticketCode: string) {
        try {
            await this.api.voteCodes.create(ticketCode);
        } catch (e) {
            // How to warn the user about this? Just let some form handle it?
            throw e;
        }
    }
}
