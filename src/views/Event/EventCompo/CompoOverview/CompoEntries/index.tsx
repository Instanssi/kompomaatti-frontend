import React from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { Link, withRouter } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';

import { ICompo } from 'src/api/interfaces';
import globalState from 'src/state';
import { RemoteStore } from 'src/stores';
import { LoadingWrapper } from 'src/common';


@(withRouter as any)
@observer
export default class CompoEntries extends React.Component<{
    compo: ICompo; match?: any;
}> {
    entries = new RemoteStore(() => {
        return globalState.api.compoEntries.list({ compo: this.compoId });
    });

    disposers = [] as any[];

    componentWillMount() {
        this.disposers.push(autorun(() => {
            this.entries.refresh();
        }));
    }

    componentWillUnmount() {
        this.disposers.forEach(d => d());
    }

    get compoId() {
        const { compo } = this.props;
        return compo && compo.id;
    }

    get allEntriesSorted() {
        return _orderBy(this.entries.value || [], entry => entry.rank);
    }

    get qualifiedEntriesSorted() {
        return this.allEntriesSorted.filter(entry => !entry.disqualified);
    }

    getEntryPath(entry) {
        const { match } = this.props;
        return match.url + `/entries/${entry.id}`;
    }

    render() {
        const entries = this.allEntriesSorted;
        return (
            <LoadingWrapper store={this.entries}>
                {entries && <ul>
                    {entries.map(entry => (
                        <li key={entry.id}>
                            {entry.rank ? entry.rank + '. ' : ''}
                            <Link to={this.getEntryPath(entry)}>
                                {entry.name}
                            </Link> - {entry.creator}
                        </li>
                    ))}
                </ul>}
            </LoadingWrapper>
        );
    }
}
