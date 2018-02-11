import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Switch, Route, withRouter } from 'react-router';

import { ICompo, IEvent } from 'src/api/interfaces';
import { FormatTime } from 'src/common';
import globalState from 'src/state';

import CompoOverview from './CompoOverview';
import CompoEntry from './CompoEntry';


export interface IEventCompoProps {
    event: IEvent;
    match?: any;
}

/**
 * Displays details of a single compo within an event.
 */
@(withRouter as any)
@observer
export default class EventCompo extends React.Component<IEventCompoProps> {
    @observable.ref compo: ICompo | null = null;
    @observable.ref isPending = false;
    @observable.ref lastError: any;

    componentWillMount() {
        this.refresh();
    }

    get id(): number {
        const { compoId } = this.props.match.params;
        return Number.parseInt(compoId, 10);
    }

    get viewTitle(): string {
        const { compo } = this;
        return compo && compo.name || '?';
    }

    @action
    async refresh() {
        const { api } = globalState;
        const { id } = this;

        this.isPending = true;
        try {
            this.compo = await api.compos.get(id);
            this.isPending = false;
        } catch (error) {
            this.lastError = error;
            this.isPending = false;
            throw error;
        }
    }

    render() {
        const { compo } = this;
        const { match } = this.props;

        if (!compo) {
            return null;
        }

        return (
            <div className="event-compo">
                {compo && <div className="compo-title">
                    <h2>{compo.name}</h2>
                    <p><FormatTime value={compo.compo_start} /></p>
                </div>}
                <Switch>
                    <Route path={match.url + '/entries/:entryId'}>
                        <CompoEntry compo={compo} />
                    </Route>
                    <Route>
                        {compo && <CompoOverview compo={compo} />}
                    </Route>
                </Switch>
            </div>
        );
    }
}
