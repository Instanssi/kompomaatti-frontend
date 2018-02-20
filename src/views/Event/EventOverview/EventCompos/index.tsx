import React from 'react';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import { Link, match, withRouter } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';

import { IEvent } from 'src/api/interfaces';
import globalState from 'src/state';
import { AtomStore } from 'src/stores';
import { LoadingWrapper, NoResults, FormatTime } from 'src/common';


export interface IEventComposProps {
    event: IEvent;
    match?: match<any>;
}

@(withRouter as any)
@observer
export default class EventCompos extends React.Component<IEventComposProps> {
    compos = new AtomStore(() => {
        return globalState.api.compos.list({ event: this.props.event.id });
    });

    disposers = [] as any[];

    componentWillMount() {
        this.disposers = [
            reaction(() => this.props.event.id, () => this.compos.refresh()),
        ];
    }

    componentWillUnmount() {
        this.disposers.forEach(d => d());
    }

    @computed
    get sortedCompos() {
        const { value } = this.compos;
        return value && _orderBy(value, compo => compo.compo_start);
    }

    render() {
        const compos = this.sortedCompos;
        const { url } = this.props.match!;

        return (
            <LoadingWrapper store={this.compos}>
                {(compos && compos.length > 0) ? <ul className="event-compos">
                    {compos.map(compo => (
                        <li key={compo.id} className="compos-item">
                            <span className="item-time">
                                <FormatTime value={compo.compo_start} format="ddd LT" />
                            </span>
                            {' '}
                            <span className="item-title">
                                <Link to={url + `/compos/${compo.id}`}>
                                    {compo.name}
                                </Link>
                            </span>
                        </li>
                    ))}
                </ul> : <NoResults />}
            </LoadingWrapper>
        );
    }
}
