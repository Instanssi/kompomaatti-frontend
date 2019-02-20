import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router';
import { Helmet } from 'react-helmet';

import { FormatTime, LoadingWrapper } from 'src/common';

import EventInfo from 'src/state/EventInfo';

import CompoEntry from './CompoEntry';
import CompoEntryAdd from './CompoEntryAdd';
import CompoEntryEdit from './CompoEntryEdit';
import CompoOverview from './CompoOverview';
import CompoVote from './CompoVote';

/**
 * Displays details of a single compo within an event.
 */
@observer
export class EventCompo extends React.Component<{
    eventInfo: EventInfo;
} & RouteComponentProps<{ compoId: string }>> {
    @computed
    get compo() {
        const compos = this.props.eventInfo.compos.value;
        const { idParsed } = this;
        return compos && compos.find(compo => compo.id === idParsed);
    }

    get idParsed() {
        return Number.parseInt(this.props.match.params.compoId, 10);
    }

    render() {
        const { eventInfo } = this.props;
        const { compo } = this;
        const { url } = this.props.match;

        return (
            <LoadingWrapper
                className="event-compo"
                store={eventInfo.compos}
            >
                {compo && <>
                    <Helmet>
                        <title>{`${compo.name} @ ${eventInfo.event.name}`}</title>
                        <meta
                            property="og:title"
                            content={`${compo.name} @ ${eventInfo.event.name}`}
                        />
                    </Helmet>
                    <div className="compo-title">
                        <h2>{compo.name}</h2>
                        <p><FormatTime value={compo.compo_start} /></p>
                    </div>
                    <Switch>
                        <Route exact path={url + '/entries/add'}>
                            <CompoEntryAdd
                                eventInfo={eventInfo}
                                compo={compo}
                            />
                        </Route>
                        <Route exact path={url + '/entries/edit/:entryId'}>
                            <CompoEntryEdit
                                eventInfo={eventInfo}
                                compo={compo}
                            />
                        </Route>
                        <Route path={url + '/entries/:entryId'}>
                            <CompoEntry
                                eventInfo={eventInfo}
                                compo={compo}
                            />
                        </Route>
                        <Route exact path={url + '/vote'}>
                            <CompoVote
                                eventInfo={eventInfo}
                                compo={compo}
                            />
                        </Route>
                        <Route>
                            <CompoOverview
                                compo={compo}
                                eventInfo={eventInfo}
                            />
                        </Route>
                    </Switch>
                </>}
            </LoadingWrapper>
        );
    }
}

export default withRouter(EventCompo);
