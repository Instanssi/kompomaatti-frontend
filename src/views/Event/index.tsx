import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router';

import globalState from 'src/state';
import { FormatTime, LoadingWrapper } from 'src/common';

import EventOverview from './EventOverview';
import EventCompo from './EventCompo';
import { RemoteStore } from 'src/stores';


@observer
export class EventView extends React.Component<RouteComponentProps<{ eventId: string }>> {
    event = new RemoteStore(this.fetch);

    componentWillMount() {
        this.event.refresh();
    }

    get eventIdParsed() {
        const id = this.props.match!.params.eventId;
        return Number.parseInt(id!, 10);
    }

    @action.bound
    fetch() {
        const { eventIdParsed } = this;
        return globalState.api.events.get(eventIdParsed);
    }

    render() {
        const event = this.event.value;
        const { match } = this.props;

        return (
            <div className="event-view">
                <LoadingWrapper store={this.event}>
                    {event && <>
                        <div className="event-title">
                            <h1>{event.name}</h1>
                            <p>
                                <FormatTime value={event.date} format="LL" />
                            </p>
                        </div>
                        <Switch>
                            <Route path={match.url + '/compos/:compoId'}>
                                <EventCompo event={event} />
                            </Route>
                            <Route>
                                <EventOverview event={event} />
                            </Route>
                        </Switch>
                    </>}
                </LoadingWrapper>
            </div>
        );
    }
}

export default withRouter(EventView);
