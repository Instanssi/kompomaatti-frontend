import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { L, LoadingWrapper } from 'src/common';
import globalState from 'src/state';


@observer
export default class EventsList extends React.Component<any> {
    get events() {
        return globalState.events;
    }

    componentWillMount() {
        this.events.refresh();
    }

    render() {
        const events = this.events.value;

        return (
            <div className="events-list-view">
                <h1><L text="events.title" /></h1>
                <LoadingWrapper store={this.events}>
                    <ul>
                        {events && events.map(event => (
                            <li key={event.id}>
                                <Link to={'/events/' + event.id + ''}>
                                    <span>{event.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </LoadingWrapper>
            </div>
        );
    }
}
