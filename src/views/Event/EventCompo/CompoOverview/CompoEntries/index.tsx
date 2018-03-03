import React from 'react';
import { observer } from 'mobx-react';
import { autorun, computed } from 'mobx';
import { Link, withRouter } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';
import classNames from 'classnames';

import { ICompo } from 'src/api/interfaces';
import globalState from 'src/state';
import { RemoteStore } from 'src/stores';
import { LoadingWrapper, NoResults } from 'src/common';


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

    @computed
    get allEntriesSorted() {
        return _orderBy(this.entries.value || [], entry => entry.rank);
    }

    @computed
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
                {(entries && entries.length > 0) ? <ul className="list-k">
                    {entries.map(entry => (
                        <li
                            key={entry.id}
                            className={classNames(
                                'entry-item',
                                { disqualified: entry.disqualified },
                            )}
                        >
                            <span className="item-time">
                                {entry.rank ? entry.rank + '. ' : ''}
                            </span>
                            <Link to={this.getEntryPath(entry)}>
                                {entry.name}
                            </Link>&nbsp;by&nbsp;{entry.creator}
                        </li>
                    ))}
                </ul> : <NoResults />}
            </LoadingWrapper>
        );
    }
}
