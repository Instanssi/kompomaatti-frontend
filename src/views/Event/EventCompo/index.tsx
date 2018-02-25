import React from 'react';
import { observer } from 'mobx-react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router';
import { computed } from 'mobx';

import { FormatTime, LoadingWrapper } from 'src/common';

import CompoOverview from './CompoOverview';
import CompoEntry from './CompoEntry';
import CompoEntryForm from './CompoEntryForm';
import CompoVote from './CompoVote';
import EventInfo from 'src/state/EventInfo';


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
        const { compo } = this;
        const { url } = this.props.match;

        return (
            <LoadingWrapper
                className="event-compo"
                store={this.props.eventInfo.compos}
            >
                {compo && <>
                    <div className="compo-title">
                        <h2>{compo.name}</h2>
                        <p><FormatTime value={compo.compo_start} /></p>
                    </div>
                    <Switch>
                        <Route exact path={url + '/entries/add'}>
                            <CompoEntryForm compo={compo} />
                        </Route>
                        <Route path={url + '/entries/:entryId'}>
                            <CompoEntry compo={compo} />
                        </Route>
                        <Route exact path={url + '/vote'}>
                            <CompoVote compo={compo} />
                        </Route>
                        <Route>
                            <CompoOverview compo={compo} />
                        </Route>
                    </Switch>
                </>}
            </LoadingWrapper>
        );
    }
}

export default withRouter(EventCompo);
