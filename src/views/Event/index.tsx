import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Switch, Route, withRouter, RouteComponentProps, Redirect } from 'react-router';
import { Helmet } from 'react-helmet';

import globalState from 'src/state';
import { FormatTime, LoadingWrapper, L } from 'src/common';

import EventOverview from './EventOverview';
import EventCompo from './EventCompo';
import EventProgrammeEvent from './EventProgrammeEvent';
import EventCompetition from './EventCompetition';
import EventStatus from './EventStatus';


// Need this or the @observer will prevent <Route /> from working
@observer
export class EventView extends React.Component<RouteComponentProps<any> & {
    eventId: number;
    url: string;
}> {
    @computed
    get eventInfo() {
        const eventId = this.props.eventId;
        const allEvents = globalState.events.value;
        return allEvents && allEvents.find(event => event.eventId === eventId);
    }

    /** Redirect lost users (and search bots) back to safe territory. */
    defaultRedirect = () => <Redirect to={this.props.url} />;

    render() {
        const { eventInfo } = this;
        const { url } = this.props;

        return (
            <div className="event-view">
                <LoadingWrapper store={globalState.events}>
                    {eventInfo && <>
                        <Helmet>
                            <title>{eventInfo.event.name}</title>
                        </Helmet>
                        <div className="event-title">
                            <a
                                className="pull-right"
                                title={L.getText('event.mainSite')}
                                href={eventInfo.event.mainurl}
                            >
                                <span className="fa fa-fw fa-external-link" />
                            </a>
                            <h1>{eventInfo.event.name}</h1>
                            <p>
                                <FormatTime value={eventInfo.event.date} format="LL" />
                            </p>
                        </div>
                        <EventStatus event={eventInfo} showIfIrrelevant />
                        <Switch>
                            <Route path={url + '/compo/:compoId'}>
                                <EventCompo eventInfo={eventInfo} />
                            </Route>
                            <Route path={url + '/programme/:progId'}>
                                <EventProgrammeEvent eventInfo={eventInfo} />
                            </Route>
                            <Route path={url + '/competition/:cmpId'}>
                                <EventCompetition eventInfo={eventInfo} />
                            </Route>
                            <Route path={url} exact>
                                <EventOverview eventInfo={eventInfo} />
                            </Route>
                            <Route render={this.defaultRedirect} />
                        </Switch>
                    </>}
                </LoadingWrapper>
            </div>
        );
    }
}

export const EventViewWR = withRouter(EventView);

/**
 * Wrapper to get event id from URL matches and render an appropriate EventView.
 */
export class EventViewRoute extends React.Component<RouteComponentProps<{
    eventId: string;
}>> {
    get eventIdParsed() {
        const id = this.props.match.params.eventId;
        return Number.parseInt(id!, 10);
    }

    render() {
        const { match } = this.props;
        return <EventViewWR eventId={this.eventIdParsed} url={match.url} />;
    }
}

export default withRouter(EventViewRoute);
