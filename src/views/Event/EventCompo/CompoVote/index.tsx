import React from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction, computed } from 'mobx';
import _orderBy from 'lodash/orderBy';
import _shuffle from 'lodash/shuffle';

import globalState from 'src/state';
import { LazyStore } from 'src/stores';
import { ICompo, ICompoEntry } from 'src/api/interfaces';
import EventInfo from 'src/state/EventInfo';
import { L } from 'src/common';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

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
    <li className={`draggable-item${!props.value ? ' divider' : ''}`}>
        <div className="item-content">
            <div className="item-number">
                {props.num}&ensp;
        </div>
            <div className="item-title flex-fill">
                {props.value.name} <span className="item-creator">by {props.value.creator}
                    {' '}
                    ({(props.value as any)._currentVote || '-'})</span>
            </div>
            <div className="item-actions">
                <a className="fa fa-play" />&ensp;
                <a className="fa fa-video" />&ensp;
                <a className="fa fa-image" />&ensp;
            </div>
        </div>
        <DragHandle />
    </li>
));

const VoteDivider = SortableElement(() => (
    <li>
        ----
    </li>
));

const VoteEntryList = SortableContainer(({ items }) => {
    let foundDivider = false;
    return (
        <ul className="list-k">
            {items.map((value, index) => {
                if (!value) {
                    foundDivider = true;
                    return <VoteDivider key={index} index={index} />;
                }
                return (
                    <VoteEntryItem
                        disabled={!value}
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

    render() {
        const { entryIds } = this;
        return (
            <form onSubmit={this.handleSubmit}>
                <h3><L text="compo.vote" /></h3>
                <p>
                    <L text="voting.help" />
                    <span className="fa fa-sort" />
                    {'. '}
                    <L text="voting.help2" />
                </p>
                <VoteEntryList
                    items={this.items}
                    onSortEnd={this.onSortEnd}
                    useDragHandle
                />
                <div>
                    <button className="btn btn-primary" disabled={entryIds.length <= 0}>
                        <L text="common.save" />
                    </button>
                    {!entryIds.length && <span>
                        &ensp;<L text="voting.atLeastOneRequired" />
                    </span>}
                </div>
            </form>
        );
    }
}
