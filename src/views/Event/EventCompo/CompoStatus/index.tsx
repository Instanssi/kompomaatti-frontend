import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';

import globalState from 'src/state';
import EventInfo from 'src/state/EventInfo';
import { LazyStore } from 'src/stores';

import { Link } from 'react-router-dom';
import { ICompo } from 'src/api/interfaces';
import { computed } from 'mobx';
import { FormatTime, L } from 'src/common';


/**
 * Shows status info about a compo: timeframe, own entries, etc.
 *
 * @todo Merge the "compo actions" feature into this.
 */
@observer
export default class CompoStatus extends React.Component<{
    eventInfo: EventInfo;
    compo: ICompo;
}> {
    store = new LazyStore(() => globalState.api.userCompoEntries.list({
        event: this.props.eventInfo.eventId,
    }));

    @computed
    get entries() {
        const ownEntries = this.store.value;
        const compoId = this.props.compo.id;
        return ownEntries ? ownEntries.filter(entry => entry.compo === compoId) : null;
    }

    @computed
    get schedule() {
        const { compo } = this.props;
        const parse = v => v ? moment(v) : null;

        // Could just map the compo JSON into something with these sooner.
        return {
            addingEnd: parse(compo.adding_end),
            editingEnd: parse(compo.editing_end),
            compoStart: parse(compo.compo_start),
            votingStart: parse(compo.voting_start),
            votingEnd: parse(compo.voting_end),
        };
    }

    /** Check if the compo is votable at all. */
    get isVotingEnabled() {
        const { compo } = this.props;
        return compo && compo.is_votable;
    }

    @computed
    get canAddEntry() {
        const { compo } = this.props;
        const now = moment(globalState.timeMin);
        return now.isBefore(compo.adding_end);
    }

    @computed
    get canEditEntry() {
        const { compo } = this.props;
        const now = moment(globalState.timeMin);
        return now.isBefore(compo.editing_end);
    }

    @computed
    get canVoteEntry() {
        const { compo } = this.props;
        if (!compo.is_votable) {
            return;
        }
        const now = moment(globalState.timeMin);
        const { voting_end, voting_start } = compo;
        return now.isSameOrAfter(voting_start) && now.isBefore(voting_end);
    }

    render() {
        return (
            <div className="compo-status">
                {this.renderSchedule()}
                {this.renderActions()}
            </div>
        );
    }

    renderSchedule() {
        const { schedule } = this;

        const scheduleField = (title, value) => (
            <li>
                <span className="item-time">
                    <FormatTime format="ddd" value={value} />
                    {' '}
                    <FormatTime format="LT" value={value} />
                </span>
                <L text={title} />
            </li>
        );

        return (
            <div>
                <h3><L text="compo.schedule" /></h3>
                <ul className="list-k">
                    {scheduleField('compo.addingEnd', schedule.addingEnd)}
                    {scheduleField('compo.editingEnd', schedule.editingEnd)}
                    {scheduleField('compo.compoStart', schedule.compoStart)}
                    {scheduleField('compo.votingStart', schedule.votingStart)}
                    {scheduleField('compo.votingEnd', schedule.votingEnd)}
                </ul>
            </div>
        );
    }

    renderActions() {
        const { compo, eventInfo } = this.props;
        const { entries, schedule } = this;
        const now = globalState.timeMin;

        const canAdd = schedule.addingEnd && schedule.addingEnd.isAfter(now);
        const canEdit = schedule.editingEnd && schedule.editingEnd.isAfter(now);

        if (entries && entries.length > 0) {
            return (
                <div className="compo-my-entries">
                    <h3><L text="compo.myEntries" /></h3>
                    <ul className="list-k">
                        {entries.map(entry => (
                            <li key={entry.id}>
                                <div className="flex-fill">
                                    {entry.name}
                                </div>
                                <div className="item-time">
                                    {canEdit && (
                                        <Link to={eventInfo.getCompoEntryEditURL(compo, entry)}>
                                            <L text="common.edit" />
                                        </Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    {
                        canAdd ? (
                            <Link to={eventInfo.getCompoEntryAddURL(compo)} >
                                Add new
                        </Link>
                        ) : 'none'}
                </div>
            );
        } else {
            return '';
        }
    }
}
