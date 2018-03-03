import React from 'react';
import { observer } from 'mobx-react';
import { action, observable, reaction, runInAction } from 'mobx';

import globalState from 'src/state';
import { LazyStore } from 'src/stores';
import { ICompo, ICompoEntry } from 'src/api/interfaces';
import EventInfo from 'src/state/EventInfo';
import { L } from 'src/common';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';


const DragHandle = SortableHandle(() => (
    <span className="item-handle">
        <span className="fa fa-sort" />
    </span>
));

const VoteEntryItem = SortableElement(({ value, index }) => (
    <li className="draggable-item">
        <div className="item-content">
            {value.name} by {value.creator}
        </div>
        <DragHandle />
    </li>
));

const VoteEntryList = SortableContainer(({ items }) => (
    <ul className="list-k">
        {items.map((value, index) => (
            <VoteEntryItem key={index} index={index} value={value} />
        ))}
    </ul>
));

@observer
export default class CompoVote extends React.Component<{
    eventInfo: EventInfo;
    compo: ICompo;
}> {
    myCompoVotes = new LazyStore(() => globalState.api.userVotes.getVotes(this.props.compo.id));
    compoEntries = new LazyStore(() => globalState.api.compoEntries.list({
        compo: this.props.compo.id,
    }));

    @observable success = false;

    @observable votes: number[] = [];
    @observable entries: ICompoEntry[] = [];

    /** Items ordered by votes. */
    @observable items: ICompoEntry[] = [];

    disposers: any[] = [];

    componentWillMount() {
        this.disposers.push(reaction(
            () => this.myCompoVotes.value,
            (userVotes) => runInAction(() => {
                this.votes = userVotes && userVotes.entries || [];
                this.init();
            }),
        ));
        this.disposers.push(reaction(
            () => this.compoEntries.value,
            (compoEntries) => runInAction(() => {
                this.entries = compoEntries || [];
                this.init();
            }),
        ));
    }

    /** Initialize the sortable compo entries list. */
    init() {
        this.items = this.entries;
        // this.currentVotes = votes && votes.entries || [];
    }

    @action.bound
    handleSubmit(event) {
        event.preventDefault();
        return globalState.api.userVotes.setVotes({
            compo: this.props.compo.id,
            entries: [], // this.entries.map(entry => entry.id),
        }).then(() => {
            this.success = true;
        });
    }

    @action.bound
    onSortEnd({ oldIndex, newIndex }) {
        this.items = arrayMove(this.items, oldIndex, newIndex);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2><L text="compo.vote" /></h2>
                <VoteEntryList
                    items={this.items}
                    onSortEnd={this.onSortEnd}
                    useDragHandle
                />
            </form>
        );
    }
}
