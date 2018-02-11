import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Switch, Route, withRouter } from 'react-router';

import { IEvent, PrimaryKey } from 'src/api/interfaces';
import globalState from 'src/state';
import { FormatTime } from 'src/common';

import EventOverview from './EventOverview';
import EventCompo from './EventCompo';


export interface IEventViewProps {
    eventId?: string;
    match?: any;
}

@(withRouter as any)
@observer
export default class EventView extends React.Component<IEventViewProps> {
    @observable isLoading = false;
    @observable.ref event: IEvent | null = null;

    componentWillMount() {
        this.refresh();
    }

    get eventIdParsed(): PrimaryKey {
        const id = this.props.match!.params.eventId;
        return Number.parseInt(id!, 10);
    }

    get viewTitle() {
        const { event } = this;
        return event && event.name || '?';
    }

    async refresh() {
        const { api } = globalState;
        const { eventIdParsed } = this;

        this.isLoading = true;
        try {
            this.event = await api.events.get(eventIdParsed);
        } catch (error) {
            // TODO: Spec how to handle errors nicely.
            this.isLoading = false;
            throw error;
        }
        this.isLoading = false;
        return this.event;
    }

    render() {
        const { event } = this;
        const { match } = this.props;

        if(!event) {
            return null;
        }

        return (
            <div className="event-view">
                {event && <div className="event-title">
                    <h1>{ event.name }</h1>
                    <p>
                        <FormatTime value={event.date} format="LL" />
                    </p>
                </div>}
                <Switch>
                    <Route path={match.url + '/compos/:compoId'}>
                        <EventCompo event={event} />
                    </Route>
                    <Route>
                        { event && <EventOverview event={event} /> }
                    </Route>
                </Switch>
            </div>
        );
    }
}
