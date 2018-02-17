import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';

import { L, LoadingWrapper } from 'src/common';
import globalState from 'src/state';
import { RemoteStore } from 'src/stores';


@observer
export default class EventsList extends React.Component<any> {
    list = new RemoteStore(this.fetch);

    componentWillMount() {
        this.list.refresh();
    }

    fetch() {
        const { api } = globalState;
        return api.events.list().then((events) => {
            return _orderBy(events, event => event.date, 'desc');
        });
    }

    render() {
        const events = this.list.value;
        return (
            <div className="events-list-view">
                <h1><L text="events.title" />}</h1>
                <LoadingWrapper store={this.list}>
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
