import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import moment from 'moment';
import _orderBy from 'lodash/orderBy';
import { Link } from 'react-router-dom';

import { L, FormatTime, NoResults } from 'src/common';
import EventInfo from 'src/state/EventInfo';
import globalState from 'src/state';
import { ICompo } from 'src/api/interfaces';


export function getCompoURL(eventId, compo: ICompo) {
    return `/events/${eventId}/compos/${compo.id}`;
}


@observer
export default class FrontCompos extends React.Component<{
    event: EventInfo;
}> {
    @computed
    get list() {
        const { event } = this.props;
        const compos = event && event.compos.value;
        if (!compos) {
            return null;
        }
        const sorted = _orderBy(compos, compo => compo.compo_start);

        // Only show compos that are somehow interesting.
        // Subtract 15 minutes from "now" to show events that just passed.
        const now = moment(globalState.timeMin).subtract(15, 'minutes');

        const isRelevant = (compo: ICompo) => {
            const hasStarted = moment(compo.compo_start).isBefore(now);
            const hasVotingEnded = moment(compo.voting_end).isBefore(now);
            return !hasStarted || !hasVotingEnded;
        };

        return sorted
            .filter(isRelevant)
            .slice(0, 8);
    }

    render() {
        const { event } = this.props;
        const { list } = this;

        return (
            <div className="highlight-box">
                <h3 className="box-header">
                    <L text="dashboard.compos.title" />
                </h3>
                <div className="box-body">
                    {(list && list.length > 0) ? (<ul className="list-k">
                        {list.map(compo => (
                            <li key={compo.id} className="compos-item">
                                <span className="item-time">
                                    <FormatTime value={compo.compo_start} format="ddd LT" />
                                </span>
                                {' '}
                                <span className="item-title">
                                    <Link to={event.getCompoURL(compo)}>
                                        {compo.name}
                                    </Link>
                                </span>
                            </li>
                        ))}</ul>) : <NoResults />}
                </div>
                <div className="box-footer">
                    {/*
                        <button><L text="dashboard.compos.action')}</button />-->
                    */}
                </div>
            </div>
        );
    }
}
