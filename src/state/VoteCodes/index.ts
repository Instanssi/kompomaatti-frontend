import InstanssiREST from 'src/api';
import { RemoteStore } from 'src/stores';

/**
 * Tracks the current user's vote codes status.
 *
 * @todo Should this instead be part of some larger "event" object?
 */
export default class VoteCodesStore {
    ticketCodes = new RemoteStore(() => this.api.voteCodes.list());
    codeRequests = new RemoteStore(() => this.api.voteCodeRequests.list());

    constructor(protected api: InstanssiREST) { }

    refresh() {
        return Promise.all([
            this.ticketCodes.refresh(),
            this.codeRequests.refresh(),
        ]);
    }

    hasCodeForEvent(eventId: number) {
        const { value } = this.ticketCodes;
        return value && value.find(code => code.event === eventId);
    }

    hasRequestForEvent(eventId: number) {
        const { value } = this.codeRequests;
        return value && value.find(request => request.event === eventId);
    }
}
