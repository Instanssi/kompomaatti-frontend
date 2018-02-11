import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Link, match, withRouter } from 'react-router-dom';

import { ICompo, IEvent } from 'src/api/interfaces';
import globalState from 'src/state';


export interface IEventComposProps {
    event: IEvent;
    match?: match<any>;
}

@(withRouter as any)
@observer
export default class EventCompos extends React.Component<IEventComposProps> {
    @observable.ref compos: ICompo[] = [];
    @observable.ref lastError: any;
    @observable isPending = false;

    componentWillMount() {
        this.refresh();
    }

    onEventIdChange(id) {
        this.refresh();
    }

    @action
    async refresh() {
        const { event } = this.props;

        const { api } = globalState;
        this.isPending = true;

        try {
            this.compos = await api.compos.list({ event: event.id });
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    getCompoPath(compo) {
        // tslint:disable-next-line no-shadowed-variable
        const match = this.props.match!;
        return match.url + `/compos/${compo.id}`;
    }

    render() {
        const { compos } = this;
        return (
            <ul>
                {compos.map(compo => (
                    <li key={compo.id}>
                        <Link to={this.getCompoPath(compo)}>
                            {compo.name}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }
}
