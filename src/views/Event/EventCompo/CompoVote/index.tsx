import React from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction, computed } from 'mobx';
import { Link } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';
import _shuffle from 'lodash/shuffle';
import moment from 'moment';
import { Prompt } from 'react-router';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

import globalState from 'src/state';
import { LazyStore } from 'src/stores';
import { ICompo, ICompoEntry } from 'src/api/interfaces';
import EventInfo from 'src/state/EventInfo';
import { L, FormatNumber } from 'src/common';

import EntryModal from '../EntryModal';
import './vote.scss';

const DragHandle = SortableHandle(() => (
    <span className="item-handle">
        <span className="fa fa-sort" />
    </span>
));

const VoteEntryItem = SortableElement((props: {
    value: ICompoEntry;
    num: string;
    pos: number | null;
    onShowDetails: (entry: ICompoEntry) => any;
}) => (
        <li className="voting-item">
            <div className="item-number">
                <div className="item-number-pos">
                    {props.num}&ensp;
                </div>
                <div className="item-number-score">
                    {typeof props.pos === 'number' &&
                        <>
                            <FormatNumber
                                value={1.0 / props.pos}
                                precision={2}
                            />
                            {' p'}
                        </>
                    }
                </div>
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
                            onClick={() => props.onShowDetails(props.value)}
                        />
                    )}
                    <button
                        className="btn btn-link"
                        type="button"
                        onClick={() => props.onShowDetails(props.value)}
                        title={L.getText('common.showDetails')}
                    >
                        <span className="fa fa-fw fa-info-circle" />
                    </button>
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

const VoteEntryList = SortableContainer((props: {
    items: any;
    entryIds: number[];
    isLocked?: boolean;
    onShowDetails: (entry: ICompoEntry) => any;
}) => {
    const { items, entryIds, isLocked } = props;
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
                        onShowDetails={props.onShowDetails}
                        num={foundDivider ? '-' : `${index + 1}.`}
                        pos={!foundDivider ? (index + 1) : null}
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
    compoEntries = new LazyStore(() => globalState.api.compoEntries.list({
        compo: this.props.compo.id,
    }));

    /** Has the user made changes to the votes? */
    @observable hasChanges = false;
    /** Is this trying to send vote changes right now? */
    @observable isSubmitting = false;
    /** Show detailed info for an entry? */
    @observable.ref showDetailsFor: ICompoEntry | null = null;

    /** In-view state. */
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

    /**
     * Fetch new info on the compo's entries list and the user's votes
     */
    refresh() {
        const { compo, eventInfo } = this.props;
        return Promise.all([
            // Let's just fetch all the votes now.
            eventInfo.myVotes.refresh(),
            // Make sure we have up-to-date info on the compo's entries.
            this.compoEntries.refresh(),
        ]).then(([allVotes, entries]) => runInAction(() => {
            const votes = allVotes.filter(userVote => userVote.compo === compo.id);
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

        if (!entryIds.length || this.isSubmitting) {
            return Promise.reject(null);
        }

        this.isSubmitting = true;

        return globalState.api.userVotes.setVotes({
            compo: this.props.compo.id,
            entries: entryIds,
        }).then(
            () => runInAction(() => {
                this.hasChanges = false;
                this.isSubmitting = false;
                globalState.postMessage('success', 'voting.saveOk');
                this.refresh();
            }),
            (error) => runInAction(() => {
                globalState.postMessage('danger', 'voting.saveFail');
                this.isSubmitting = false;
            }),
        );
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

    @action.bound
    openEntryDetails(entry: ICompoEntry) {
        this.showDetailsFor = entry;
    }

    @action.bound
    hideEntryDetails() {
        this.showDetailsFor = null;
    }

    render() {
        const { entryIds, hasChanges } = this;

        const deadline = globalState.getMoment(this.props.compo.voting_end)
            .locale(globalState.momentLocale);
        const ended = deadline.isBefore(globalState.timeMin);

        return (
            <div className="compo-vote">
                {<Prompt
                    when={hasChanges}
                    message={L.getText('voting.leaveWithoutSaving')}
                />}
                <h3><L text="compo.vote" /></h3>
                {!ended ? <div className="alert alert-info">
                    <span className="fa fa-clock-o" />&ensp;
                    <L
                        text="voting.deadline"
                        values={{
                            date: deadline.format('ddd LLL'),
                        }}
                    />
                </div> : <div className="alert alert-info"><L text="voting.ended" /></div>}
                <form onSubmit={this.handleSubmit}>
                    <ul>
                        <li>
                            <L text="voting.help" />
                            <span className="fa fa-sort" />
                            {'. '}
                            <L text="voting.help2" />
                        </li>
                        <li>
                            <L text="voting.help3" />
                            <span className="fa fa-info-circle" />
                            {'.'}
                        </li>
                    </ul>
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
                        onShowDetails={this.openEntryDetails}
                        lockAxis="y"
                        useDragHandle
                    />
                    <div>
                        <button
                            className="btn btn-primary"
                            disabled={entryIds.length <= 0 || this.isSubmitting}
                        >
                            <L text="common.save" />
                        </button>
                        &ensp;
                        {this.isSubmitting && <span className="fa fa-fw fa-spin fa-spinner" />}
                        <Link
                            className="btn btn-link"
                            to={this.props.eventInfo.eventURL}
                        >
                            <L text="voting.backToEvent" />
                        </Link>
                    </div>
                    <p>
                        {entryIds.length > 0
                            ? <span>{hasChanges && <L text="voting.hasChanges" />}</span>
                            : <span><L text="voting.atLeastOneRequired" /></span>
                        }
                    </p>
                </form>
                {this.showDetailsFor && <EntryModal
                    entry={this.showDetailsFor}
                    onClose={this.hideEntryDetails}
                />}
            </div>
        );
    }
}
