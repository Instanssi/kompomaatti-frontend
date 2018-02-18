import React from 'react';
import { observer } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router';

import { IEvent } from 'src/api/interfaces';
import { FormatTime, LoadingWrapper } from 'src/common';
import globalState from 'src/state';

import CompoOverview from './CompoOverview';
import CompoEntry from './CompoEntry';
import CompoEntryForm from './CompoEntryForm';
import CompoVote from './CompoVote';
import { RemoteStore } from 'src/stores';


/**
 * Displays details of a single compo within an event.
 */
@(withRouter as any)
@observer
export default class EventCompo extends React.Component<{
    event: IEvent;
    match?: any;
}> {
    compo = new RemoteStore(() => globalState.api.compos.get(this.id));

    componentWillMount() {
        this.compo.refresh();
    }

    get id() {
        const { compoId } = this.props.match.params;
        return Number.parseInt(compoId, 10);
    }

    render() {
        const compo = this.compo.value;
        const { url } = this.props.match;

        return (
            <LoadingWrapper className="event-compo" store={this.compo}>
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
