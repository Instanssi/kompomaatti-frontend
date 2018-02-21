import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { L, LoadingWrapper, FormatTime } from 'src/common';
import globalState from 'src/state';


@observer
export default class EventsList extends React.Component<any> {
    get events() {
        return globalState.events;
    }

    render() {
        const events = this.events.value;

        return (
            <div className="events-list-view">
                <h1><L text="events.title" /></h1>
                <LoadingWrapper store={this.events}>
                    <ul className="events">
                        {events && events.map(({ event }) => (
                            <li key={event.id} className="events-item">
                                <span className="item-name">
                                    <Link to={'/events/' + event.id + ''}>
                                        <span>{event.name}</span>
                                    </Link>
                                </span>
                                {' '}
                                &ndash;
                                {' '}
                                <span className="item-time">
                                    <FormatTime value={event.date} format="l" />
                                </span>
                            </li>
                        ))}
                    </ul>
                </LoadingWrapper>
            </div>
        );
    }
}
