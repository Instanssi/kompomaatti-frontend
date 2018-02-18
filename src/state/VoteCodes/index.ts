import InstanssiREST from 'src/api';
import { RemoteStore } from 'src/stores';

/**
 * Tracks the current user's vote codes status.
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
}
