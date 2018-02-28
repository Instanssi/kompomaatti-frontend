import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Link } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';

import { LoadingWrapper, NoResults, FormatTime } from 'src/common';
import EventInfo from 'src/state/EventInfo';


@observer
export default class EventCompos extends React.Component<{
    eventInfo: EventInfo;
}> {
    get compos() {
        return this.props.eventInfo.compos;
    }

    @computed
    get sortedCompos() {
        const { value } = this.compos;
        return value && _orderBy(value, compo => compo.compo_start);
    }

    render() {
        const { eventInfo } = this.props;
        const compos = this.sortedCompos;

        return (
            <LoadingWrapper store={this.compos}>
                {(compos && compos.length > 0) ? <ul className="list-k event-compos">
                    {compos.map(compo => (
                        <li key={compo.id} className="compos-item">
                            <span className="item-time">
                                <FormatTime value={compo.compo_start} format="ddd LT" />
                            </span>
                            {' '}
                            <span className="item-title">
                                <Link to={eventInfo.getCompoURL(compo)}>
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
