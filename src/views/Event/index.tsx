import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router';

import globalState from 'src/state';
import { FormatTime, LoadingWrapper } from 'src/common';

import EventOverview from './EventOverview';
import EventCompo from './EventCompo';
import EventProgrammeEvent from './EventProgrammeEvent';
import EventCompetition from './EventCompetition';


@observer
export class EventView extends React.Component<RouteComponentProps<{
    eventId: string;
}>> {
    get eventIdParsed() {
        const id = this.props.match.params.eventId;
        return Number.parseInt(id!, 10);
    }

    @computed
    get eventInfo() {
        const eventId = this.eventIdParsed;
        const allEvents = globalState.events.value;
        return allEvents && allEvents.find(event => event.eventId === eventId);
    }

    render() {
        const { eventInfo } = this;
        const { match } = this.props;

        return (
            <div className="event-view">
                <LoadingWrapper store={globalState.events}>
                    {eventInfo && <>
                        <div className="event-title">
                            <h1>{eventInfo.event.name}</h1>
                            <p>
                                <FormatTime value={eventInfo.event.date} format="LL" />
                            </p>
                        </div>
                        <Switch>
                            <Route path={match.url + '/compos/:compoId'}>
                                <EventCompo eventInfo={eventInfo} />
                            </Route>
                            <Route path={match.url + '/programme/:progId'}>
                                <EventProgrammeEvent eventInfo={eventInfo} />
                            </Route>
                            <Route path={match.url + '/competitions/:cmpId'}>
                                <EventCompetition eventInfo={eventInfo} />
                            </Route>
                            <Route>
                                <EventOverview eventInfo={eventInfo} />
                            </Route>
                        </Switch>
                    </>}
                </LoadingWrapper>
            </div>
        );
    }
}

export default withRouter(EventView);
