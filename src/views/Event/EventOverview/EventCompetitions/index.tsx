import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Link } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';

import { NoResults, LoadingWrapper, FormatTime } from 'src/common';
import EventInfo from 'src/state/EventInfo';


@observer
export default class EventCompetitions extends React.Component<{
    eventInfo: EventInfo;
}> {
    get competitionsStore() {
        return this.props.eventInfo.competitions;
    }

    @computed
    get sortedCompetitions() {
        const { value } = this.competitionsStore;
        return value && _orderBy(value, competition => competition.start);
    }

    render() {
        const { eventInfo } = this.props;
        const competitions = this.sortedCompetitions;

        return (
            <LoadingWrapper store={this.competitionsStore}>
                {(competitions && competitions.length > 0) ? (
                    <ul className="event-competitions">
                        {competitions.map(competition => (
                            <li key={competition.name} className="competitions-item">
                                <span className="item-time">
                                    <FormatTime value={competition.start} format="ddd LT" />
                                </span>
                                {' '}
                                <Link
                                    className="item-title"
                                    to={eventInfo.getCompetitionURL(competition)}
                                >
                                    {competition.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : <NoResults />}
            </LoadingWrapper>
        );
    }
}
