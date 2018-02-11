import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Link } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';

import { IEvent } from 'src/api/interfaces';
import globalState from 'src/state';


const { translate } = globalState;

@observer
export default class EventsList extends React.Component<any> {
    @observable.ref events: IEvent[] = [];
    @observable.ref lastError: any;
    @observable.ref isPending = false;

    componentWillMount() {
        this.refresh();
    }

    get viewTitle() {
        return { key: 'events.title' };
    }

    async refresh() {
        const { api } = globalState;
        this.isPending = true;
        try {
            const events = await api.events.list();
            this.events = _orderBy(events, event => event.date, 'desc');
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    render() {
        const { events } = this;
        return (
            <div className="events-list-view">
                <h1>{translate('events.title')}</h1>
                <ul>
                    {events.map(event => (
                        <li key={event.id}>
                            <Link to={'/events/' + event.id + ''}>
                                <span>{event.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
