import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';

import globalState from 'src/state';

import CompoEntries from './CompoEntries';
import { ICompo, IEvent } from 'src/api/interfaces';


// FIXME: Come up with a shorter name for this for convenience? "L" ?
const { translate } = globalState;

@Component
export default class CompoOverview extends Vue {
    @Prop() compo: ICompo;
    @Prop() event: IEvent;

    // TODO: Should these be implemented for the compo object somehow?

    get canVote() {
        const { compo } = this;
        return compo && compo.is_votable;
    }

    get canAddEntry() {
        const { compo } = this;
        if (!compo) {
            return;
        }
        const addingEnd = moment(compo.adding_end);
        const now = moment();
        return now.isBefore(addingEnd);
    }

    get canEditEntry() {
        const { compo } = this;
        if (!compo) {
            return;
        }
        const editingEnd = moment(compo.editing_end);
        const now = moment();
        return now.isBefore(editingEnd);
    }

    get canVoteEntry() {
        const { compo } = this;
        if (!compo) {
            return;
        }
        if (!compo.is_votable) {
            return;
        }
        const votingStart = moment(compo.voting_start);
        const votingEnd = moment(compo.voting_start);
        const now = moment();
        return now.isSameOrAfter(votingStart) && now.isBefore(votingEnd);
    }

    render(h) {
        const { compo } = this.$props;
        if (!compo) {
            return null;
        }
        return (
            <div class="event-compo-overview">
                <div class="pull-right">
                    <div>(my entries)</div>
                    <div>TODO: Add/edit/vote timeframe</div>
                    <div>Action buttons (VOTE, EDIT, ADD)</div>
                    <div class="compo-timeframe">
                        <div>Can add entry: { this.canAddEntry ? 'yes' : 'no' }</div>
                        <div>Can edit entry: { this.canEditEntry ? 'yes' : 'no' }</div>
                        <div>Votable: { this.canVoteEntry ? 'yes' : 'no' }</div>
                    </div>
                </div>
                <div class="compo-description">
                    <h3>{translate('compo.description')}</h3>
                    <div domPropsInnerHTML={compo.description} />
                </div>
                <div class="compo-entries">
                    <h3>{translate('compo.entries')}</h3>
                    <CompoEntries compo={compo} />
                </div>
            </div>
        );
    }
}
