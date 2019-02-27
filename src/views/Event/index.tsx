import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Switch, Route, withRouter, RouteComponentProps, Redirect } from 'react-router';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import globalState from 'src/state';
import { FormatTime, LoadingWrapper, L } from 'src/common';

import EventOverview from './EventOverview';
import EventCompo from './EventCompo';
import EventProgrammeEvent from './EventProgrammeEvent';
import EventCompetition from './EventCompetition';
import EventStatus from './EventStatus';
import FrontSchedule from '../FrontPage/FrontSchedule';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


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

        const { location } = this.props;
        const locationKey = location.pathname.split('/')[2];

        return (
            <div className="event-view">
                <LoadingWrapper store={globalState.events}>
                    {eventInfo && <>
                        <Helmet>
                            <title>{eventInfo.event.name}</title>
                        </Helmet>
                        <div className="event-title">
                            {/*<a
                                className="pull-right"
                                title={L.getText('event.mainSite')}
                                href={eventInfo.event.mainurl}
                            >
                                <span className="fa fa-fw fa-external-link" />
                            </a>*/}
                            <h1 className="title-heading">{eventInfo.event.name}</h1>
                            <div className="title-shortcuts">
                                <Link to={url} className="btn btn-link">
                                    <span className="fa fa-fw fa-info-circle" />
                                    <L text="event.linkTo" />
                                </Link>
                                {!eventInfo.hasEnded &&
                                    <Link to={url + '/schedule'} className="btn btn-link">
                                        <span className="fa fa-fw fa-calendar" />
                                        <L text="common.schedule" />
                                    </Link>
                                }
                            </div>
                        </div>
                        <p>
                            <FormatTime value={eventInfo.event.date} format="LL" />
                        </p>
                        <EventStatus event={eventInfo} showIfIrrelevant />
                        <TransitionGroup className="transition-group">
                            <CSSTransition key={locationKey} classNames="route" timeout={300}>
                                <Switch location={location}>
                                    <Route path={url} exact>
                                        <EventOverview eventInfo={eventInfo} />
                                    </Route>
                                    <Route path={url + '/compo/:compoId'}>
                                        <EventCompo eventInfo={eventInfo} />
                                    </Route>
                                    <Route path={url + '/programme/:progId'}>
                                        <EventProgrammeEvent eventInfo={eventInfo} />
                                    </Route>
                                    <Route path={url + '/competition/:cmpId'}>
                                        <EventCompetition eventInfo={eventInfo} />
                                    </Route>
                                    <Route path={url + '/schedule'}>
                                        <FrontSchedule eventInfo={eventInfo} />
                                    </Route>
                                    <Route render={this.defaultRedirect} />
                                </Switch>
                            </CSSTransition>
                        </TransitionGroup>
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
        const { match, location } = this.props;
        return <EventViewWR eventId={this.eventIdParsed} url={match.url} />;
    }
}

export default withRouter(EventViewRoute);
