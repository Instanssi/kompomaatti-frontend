import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import moment from 'moment';
import _orderBy from 'lodash/orderBy';
import { Link } from 'react-router-dom';

import { L, FormatTime, NoResults } from 'src/common';
import EventInfo from 'src/state/EventInfo';
import globalState from 'src/state';
import { ICompetition } from 'src/api/interfaces';


export function getCompetitionURL(eventId, competition: ICompetition) {
    return `/events/${eventId}/competitions/${competition.id}`;
}


@observer
export default class FrontCompetitions extends React.Component<{
    event: EventInfo;
}> {
    @computed
    get list() {
        const { event } = this.props;
        const competitions = event && event.competitions.value;
        if (!competitions) {
            return null;
        }
        const sorted = _orderBy(competitions, compo => compo.start);
        const now = moment(globalState.timeMin);

        const isRelevant = (competition: ICompetition) => {
            // Only show competitions that are somehow interesting.
            // TODO: Show events that have just started?
            // - Subtract 15 minutes from "now"?
            return moment(competition.start).isAfter(now);
        };

        return sorted
            .filter(isRelevant)
            .slice(0, 8);
    }

    render() {
        const { event } = this.props;
        const { list } = this;
        const eventId = event && event.eventId;

        return (
            <div className="highlight-box">
                <h3 className="box-header">
                    <L text="dashboard.competitions.title" />
                </h3>
                <div className="box-body">
                    {(list && list.length > 0) ? (<ul>
                        {list.map(competition => (
                            <li key={competition.id} className="competitions-item">
                                <span className="item-time">
                                    <FormatTime value={competition.start} format="ddd LT" />
                                </span>
                                {' '}
                                <span className="item-title">
                                    <Link to={getCompetitionURL(eventId, competition)}>
                                        {competition.name}
                                    </Link>
                                </span>
                            </li>
                        ))}</ul>) : <NoResults />}
                </div>
                <div className="box-footer">
                    {/*
                        <button><L text="dashboard.competitions.action')}</button />-->
                    */}
                </div>
            </div>
        );
    }
}
