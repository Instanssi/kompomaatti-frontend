import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import moment from 'moment';
import _orderBy from 'lodash/orderBy';
import { Link } from 'react-router-dom';

import { L, FormatTime, NoResults } from 'src/common';
import EventInfo from 'src/state/EventInfo';
import globalState from 'src/state';
import { ICompo } from 'src/api/interfaces';


export function getCompoURL(eventId, compo: ICompo) {
    return `/events/${eventId}/compos/${compo.id}`;
}


@observer
export default class FrontCompos extends React.Component<{
    event: EventInfo;
}> {
    @computed
    get list() {
        const { event } = this.props;
        const compos = event && event.compos.value;
        if (!compos) {
            return null;
        }
        const sorted = _orderBy(compos, compo => compo.compo_start);
        const now = moment(globalState.timeMin);

        const isRelevant = (compo: ICompo) => {
            // Only show compos that are somehow interesting.
            // TODO: Show events that have just started?
            // - Subtract 15 minutes from "now"?
            return moment(compo.compo_start).isAfter(now);
        };

        return sorted
            .filter(isRelevant)
            .slice(0, 8);
    }

    render() {
        const { event } = this.props;
        const { list } = this;
        const eventId = event && event.eventId;

        return (
            <div className="highlight-box">
                <h3 className="box-header">
                    <L text="dashboard.compos.title" />
                </h3>
                <div className="box-body">
                    {(list && list.length > 0) ? list.map(compo => (
                        <li key={compo.id} className="compos-item">
                            <span className="item-time">
                                <FormatTime value={compo.compo_start} format="ddd LT" />
                            </span>
                            {' '}
                            <span className="item-title">
                                <Link to={getCompoURL(eventId, compo)}>
                                    {compo.name}
                                </Link>
                            </span>
                        </li>
                    )) : <NoResults />}
                </div>
                <div className="box-footer">
                    {/*
                        <button><L text="dashboard.compos.action')}</button />-->
                    */}
                </div>
            </div>
        );
    }
}
