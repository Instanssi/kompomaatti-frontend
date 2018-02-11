import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { autorun } from 'mobx';
import { Link, withRouter } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';

import { ICompoEntry, ICompo } from 'src/api/interfaces';
import globalState from 'src/state';


@(withRouter as any)
@observer
export default class CompoEntries extends React.Component<{ compo: ICompo, match?: any }> {
    @observable.ref isPending = false;
    @observable.ref lastError: any;
    @observable.ref entries: ICompoEntry[] | null = null;

    disposers = [] as any[];

    componentWillMount() {
        this.disposers.push(autorun(() => {
            this.refresh();
        }));
    }

    componentWillUnmount() {
        this.disposers.forEach(d => d());
    }

    onCompoChange() {
        this.refresh();
    }

    get compoId() {
        const { compo } = this.props;
        return compo && compo.id;
    }

    get allEntriesSorted() {
        return _orderBy(this.entries || [], entry => entry.rank);
    }

    get qualifiedEntriesSorted() {
        return this.allEntriesSorted.filter(entry => !entry.disqualified);
    }

    async refresh() {
        const { compoId } = this;

        if (!compoId) {
            return;
        }

        const { api } = globalState;
        this.isPending = true;
        try {
            this.entries = await api.compoEntries.list({ compo: this.compoId });
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    getEntryPath(entry) {
        const { match } = this.props;
        return match.url + `/entries/${entry.id}`;
    }

    render() {
        const entries = this.allEntriesSorted;
        return (
            <ul>
                {entries && entries.map(entry => (
                    <li key={entry.id}>
                        {entry.rank ? entry.rank + '. ' : ''}
                        <Link to={this.getEntryPath(entry)}>
                            {entry.name}
                        </Link> - {entry.creator}
                    </li>
                ))}
            </ul>
        );
    }
}
