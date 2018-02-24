import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import moment from 'moment';
import _orderBy from 'lodash/orderBy';
import { Link } from 'react-router-dom';

import { L, FormatTime, NoResults } from 'src/common';
import EventHelper from 'src/state/EventHelper';
import globalState from 'src/state';
import { ICompo, IProgrammeEvent } from 'src/api/interfaces';


export function getCompoURL(eventId, compo: ICompo) {
    return `/events/${eventId}/compos/${compo.id}`;
}

export function getProgrammeURL(eventId, progEvent: IProgrammeEvent) {
    return `/events/${eventId}/programme/${progEvent.id}`;
}

@observer
export default class FrontProgramme extends React.Component<{
    event: EventHelper;
}> {
    @computed
    get list() {
        const { event } = this.props;
        const progEvents = event && event.programme.value;
        if (!progEvents) {
            return null;
        }
        const sorted = _orderBy(progEvents, progEvent => progEvent.start);
        const now = moment(globalState.timeMin);

        const isRelevant = progEvent => {
            // Only show programme events that are somehow interesting.
            // TODO: Show events that have just started?
            // - Subtract 15 minutes from "now"?
            const start = moment(progEvent.start);
            const end = progEvent.end && moment(progEvent.end);
            return end && end.isAfter(now) || start && start.isAfter(now);
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
                    <L text="dashboard.programme.title" />
                </h3>
                <div className="box-body">
                    {(list && list.length > 0) ? list.map(progEvent => (
                        <li key={progEvent.id} className="programme-item">
                            <span className="item-time">
                                <FormatTime value={progEvent.start} format="ddd LT" />
                            </span>
                            {' '}
                            <span className="item-title">
                                <Link to={getProgrammeURL(eventId, progEvent)}>
                                    {progEvent.title}
                                </Link>
                            </span>
                        </li>
                    )) : <NoResults />}
                </div>
                <div className="box-footer">
                    {/*
                        <button><L text="dashboard.programme.action')}</button />-->
                    */}
                </div>
            </div>
        );
    }
}
