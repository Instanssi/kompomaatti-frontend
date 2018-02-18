import { observable, action, computed } from 'mobx';

import InstanssiREST from 'src/api';
import { IEvent } from 'src/api/interfaces';
import { RemoteStore } from 'src/stores';


/**
 * Tries to model a party event as an ORM-ish object with helper methods and stuff.
 *
 * Most ORMs are not particularly asynchronous, though.
 */
export default class Event {
    @observable.ref event: IEvent;

    /** Vote codes related to the event. */
    eventVoteCodes = new RemoteStore(
        () => this.api.voteCodes.list({ event: this.event.id })
    );

    constructor(protected api: InstanssiREST, event: IEvent) {
        this.event = event;
        this.eventVoteCodes.refresh();
    }

    /** True if the current user has a vote code for the event. */
    @computed
    get hasVoteCode() {
        const { value } = this.eventVoteCodes;
        if (!value && !this.eventVoteCodes.isPending) {
            // Could this be triggered with a MobX atom?
            this.eventVoteCodes.refresh();
        }
        return (value && value.length > 0) || false;
    }

    async addVoteCode(ticketCode: string) {
        try {
            await this.api.voteCodes.create(this.event);
        } catch(e) {
            // How to warn the user about this? Just let some form handle it?
            throw e;
        }
    }
}
