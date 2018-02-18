import React from 'react';
import { observer } from 'mobx-react';
import { autorun, computed } from 'mobx';
import _orderBy from 'lodash/orderBy';

import { NoResults, LoadingWrapper, FormatTime } from 'src/common';
import { IEvent } from 'src/api/interfaces';
import globalState from 'src/state';
import { RemoteStore } from 'src/stores';


@observer
export default class EventProgramme extends React.Component<{
    event: IEvent;
}> {
    progEvents = new RemoteStore(() => {
        return globalState.api.programme.list({ event: this.props.event.id });
    });

    disposers = [] as any[];

    componentWillMount() {
        this.disposers = [
            autorun(() => this.progEvents.refresh()),
        ];
    }

    componentWillUnmount() {
        this.disposers.forEach(d => d());
    }

    @computed
    get sortedEvents() {
        const { value } = this.progEvents;
        return value && _orderBy(value, event => event.start);
    }

    render() {
        const events = this.sortedEvents;

        return (
            <LoadingWrapper store={this.progEvents}>
                {(events && events.length > 0) ? <ul>
                    {events.map(event => (
                        <li key={event.id} className="programme-item">
                            <span className="item-time">
                                <FormatTime value={event.start} format="ddd LT" />
                            </span>
                            {' '}
                            <span className="item-title">
                                {event.title}
                            </span>
                        </li>
                    ))}
                </ul> : <NoResults />}
            </LoadingWrapper>
        );
    }
}
