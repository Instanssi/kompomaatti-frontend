import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import _orderBy from 'lodash/orderBy';

import { NoResults, LoadingWrapper, FormatTime } from 'src/common';
import EventInfo from 'src/state/EventInfo';


@observer
export default class EventProgramme extends React.Component<{
    eventInfo: EventInfo;
}> {
    get progEvents() {
        return this.props.eventInfo.programme;
    }

    @computed
    get sortedEvents() {
        const { value } = this.progEvents;
        return value && _orderBy(value, event => event.start);
    }

    render() {
        const events = this.sortedEvents;

        return (
            <LoadingWrapper store={this.progEvents}>
                {(events && events.length > 0) ? <ul>
                    {events.map(event => (
                        <li key={event.id} className="programme-item">
                            <span className="item-time">
                                <FormatTime value={event.start} format="ddd LT" />
                            </span>
                            {' '}
                            <span className="item-title">
                                {event.title}
                            </span>
                        </li>
                    ))}
                </ul> : <NoResults />}
            </LoadingWrapper>
        );
    }
}
