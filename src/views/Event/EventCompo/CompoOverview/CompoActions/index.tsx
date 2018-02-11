import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';

import globalState from 'src/state';

import { ICompo, IEvent } from 'src/api/interfaces';


// FIXME: Come up with a shorter name for this for convenience? "L" ?
const { translate } = globalState;

/**
 * Shows a summary of a compo's status and some actions the user can perform on it
 * like voting, adding/editing entries, etc.
 */
@Component
export default class CompoActions extends Vue {
    @Prop() compo: ICompo;
    @Prop() event: IEvent;

    now = new Date();

    _interval: number;

    mounted() {
        this._interval = setInterval(() => {
            this.now = new Date();
        }, 1000);
    }

    beforeDestroy() {
        clearInterval(this._interval);
    }

    // TODO: Should these be implemented for the compo object somehow?

    /** Check if the compo is votable at all. */
    get isVotingEnabled() {
        const { compo } = this;
        return compo && compo.is_votable;
    }

    get canAddEntry() {
        const { compo } = this;
        if (!compo) {
            return;
        }
        const now = moment(this.now);
        return now.isBefore(compo.adding_end);
    }

    get canEditEntry() {
        const { compo } = this;
        if (!compo) {
            return;
        }
        const now = moment(this.now);
        return now.isBefore(compo.editing_end);
    }

    get canVoteEntry() {
        const { compo } = this;
        if (!compo) {
            return;
        }
        if (!compo.is_votable) {
            return;
        }
        const now = moment(this.now);
        const { voting_end, voting_start } = compo;
        return now.isSameOrAfter(voting_start) && now.isBefore(voting_end);
    }

    render(h) {
        return (
            <div class="compo-actions">
                <h3>{translate('common.status')}</h3>
                <div>(my entries)</div>
                <div>TODO: Add/edit/vote timeframe</div>
                <div>Action buttons (VOTE, EDIT, ADD)</div>
                <div class="compo-timeframe">
                    <div>Can add entry: {this.canAddEntry ? 'yes' : 'no'}</div>
                    <div>Can edit entry: {this.canEditEntry ? 'yes' : 'no'}</div>
                    <div>Votable: {this.canVoteEntry ? 'yes' : 'no'}</div>
                </div>
            </div>
        );
    }
}
