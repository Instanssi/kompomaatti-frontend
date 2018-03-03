import React from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction, computed } from 'mobx';
import _orderBy from 'lodash/orderBy';
import _shuffle from 'lodash/shuffle';
import moment from 'moment';

import globalState from 'src/state';
import { LazyStore } from 'src/stores';
import { ICompo, ICompoEntry } from 'src/api/interfaces';
import EventInfo from 'src/state/EventInfo';
import { L } from 'src/common';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import EventStatus from 'src/views/Event/EventStatus';

import './vote.scss';

// tslint:disable variable-name

const DragHandle = SortableHandle(() => (
    <span className="item-handle">
        <span className="fa fa-sort" />
    </span>
));

const VoteEntryItem = SortableElement((props: {
    value: ICompoEntry;
    num: string;
}) => (
        <li className="voting-item">
            <div className="item-number">
                {props.num}&ensp;
            </div>
            <div className="item-content">
                <div className="item-title">
                    {props.value.name} <span className="item-creator">by {props.value.creator}
                        {' '}
                        {/*({(props.value as any)._currentVote || '-'})*/}
                    </span>
                </div>
                <div className="item-actions">
                    {props.value.imagefile_thumbnail_url && (
                        <img
                            className="vote-thumbnail"
                            src={props.value.imagefile_thumbnail_url}
                        />
                    )}
                </div>
            </div>
            <DragHandle />
        </li>
    ));

const VoteDivider = SortableElement((props: { entryIds: number[] }) => (
    <li className="voting-item divider">
        <L text="voting.divider" />
    </li>
));

const VoteEntryList = SortableContainer(({ items, entryIds, isLocked }) => {
    let foundDivider = false;
    return (
        <ul className="list-k">
            {items.map((value, index) => {
                if (!value) {
                    foundDivider = true;
                    return <VoteDivider key={index} index={index} entryIds={entryIds} />;
                }
                return (
                    <VoteEntryItem
                        disabled={!value || isLocked}
                        key={index}
                        index={index}
                        value={value}
                        num={foundDivider ? '-' : `${index + 1}.`}
                    />
                );
            })}
        </ul>
    );
});

@observer
export default class CompoVote extends React.Component<{
    eventInfo: EventInfo;
    compo: ICompo;
}> {
    myCompoVotes = new LazyStore(() => globalState.api.userVotes.getVotes(this.props.compo.id));
    compoEntries = new LazyStore(() => globalState.api.compoEntries.list({
        compo: this.props.compo.id,
    }));

    @observable hasChanges = false;

    @observable.ref votes: number[] = [];
    @observable.ref entries: ICompoEntry[] = [];

    /** Items ordered by votes. */
    @observable.shallow items: Array<ICompoEntry | null> = [];

    disposers: any[] = [];

    componentWillMount() {
        this.refresh();
    }

    componentWillUnmount() {
        this.disposers.forEach(d => d());
    }

    refresh() {
        return Promise.all([
            this.myCompoVotes.refresh(),
            this.compoEntries.refresh(),
        ]).then(([votes, entries]) => runInAction(() => {
            this.votes = (votes && votes.length > 0) ? votes[0].entries : [];
            this.entries = _shuffle(entries);
            this.entries.forEach(e => {
                (e as any)._currentVote = this.votes.findIndex(v => v === e.id) + 1;
            });
            this.init();
        }));
    }

    /**
     * Initialize the sortable compo entries list.
     */
    @action
    init() {
        const { votes } = this;

        const voteIndex = {};
        votes.forEach((entryId, index) => {
            voteIndex[entryId] = index;
        });

        const filtered = this.entries.filter(entry => !entry.disqualified);

        const withDivider: Array<ICompoEntry | null> = filtered;
        withDivider.push(null);

        this.items = _orderBy(withDivider, (entry, index) => {
            if (entry === null) {
                return 9000;
            }
            // Order the list of entries and null divider so that entries already
            // voted for are positioned according to their index in the votes list.
            // The divider is placed after that, and then the remaining entries
            // are listed in their shuffled order.
            const pos = voteIndex[entry.id];
            if (typeof pos === 'number') {
                return pos;
            }
            return 9001 + index;
        });
    }

    @computed
    get entryIds() {
        const entryIds: number[] = [];
        for (const entry of this.items) {
            if (entry) {
                entryIds.push(entry.id);
            } else {
                break;
            }
        }
        return entryIds;
    }

    @action.bound
    handleSubmit(event) {
        event.preventDefault();
        const { entryIds } = this;

        if (!entryIds.length) {
            return Promise.reject(null);
        }

        return globalState.api.userVotes.setVotes({
            compo: this.props.compo.id,
            entries: entryIds,
        }).then(() => {
            this.hasChanges = false;
            this.refresh();
        });
    }

    @action.bound
    onSortEnd({ oldIndex, newIndex }) {
        this.hasChanges = true;
        this.items = arrayMove(this.items, oldIndex, newIndex);
    }

    @computed
    get isVotable() {
        return this.props.compo.is_votable;
    }

    @computed
    get votingStart() {
        return moment(this.props.compo.voting_start);
    }

    @computed
    get votingEnd() {
        return moment(this.props.compo.voting_end);
    }

    @computed
    get canVote() {
        const { isVotable, votingEnd, votingStart } = this;
        const { timeMin } = globalState;
        const now = moment(timeMin);
        const voteTime = now.isSameOrAfter(votingStart) && now.isBefore(votingEnd);
        return globalState.user && isVotable && voteTime;
    }

    render() {
        const { entryIds, hasChanges } = this;

        const deadline = moment(this.props.compo.voting_end).locale(globalState.momentLocale);
        const ended = deadline.isBefore(globalState.timeMin);

        return (
            <div className="compo-vote">
                <h3><L text="compo.vote" /></h3>
                <EventStatus event={this.props.eventInfo} />
                {!ended ? <div className="alert alert-info">
                    <span className="fa fa-clock-o" />&ensp;
                    <L
                        text="voting.deadline"
                        values={{
                            date: deadline.format('LLL'),
                        }}
                    />
                </div> : <div className="alert alert-info"><L text="voting.ended" /></div>}
                <form onSubmit={this.handleSubmit}>
                    <p>
                        <L text="voting.help" />
                        <span className="fa fa-sort" />
                        {'. '}
                        <L text="voting.help2" />
                    </p>
                    {entryIds.length === 0 && (
                        <div className="voting-item placeholder">
                            <L text="voting.placeholder" />
                        </div>
                    )}
                    <VoteEntryList
                        items={this.items}
                        onSortEnd={this.onSortEnd}
                        entryIds={entryIds}
                        isLocked={!this.canVote}
                        lockAxis="y"
                        useDragHandle
                    />
                    <div>
                        <button className="btn btn-primary" disabled={entryIds.length <= 0}>
                            <L text="common.save" />
                        </button>
                        &ensp;
                        {entryIds.length > 0
                            ? <span>{hasChanges && <L text="voting.hasChanges" />}</span>
                            : <span><L text="voting.atLeastOneRequired" /></span>}
                    </div>
                </form>
            </div>
        );
    }
}
