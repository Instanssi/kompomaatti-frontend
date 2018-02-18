import React from 'react';
import { observer } from 'mobx-react';
import { autorun, computed } from 'mobx';
import _orderBy from 'lodash/orderBy';

import { NoResults, LoadingWrapper, FormatTime } from 'src/common';
import { IEvent } from 'src/api/interfaces';
import { RemoteStore } from 'src/stores';
import globalState from 'src/state';


@observer
export default class EventCompetitions extends React.Component<{
    event: IEvent;
}> {
    competitions = new RemoteStore(() => {
        return globalState.api.competitions.list({ event: this.props.event.id });
    });

    disposers = [] as any[];

    componentWillMount() {
        this.disposers = [
            autorun(() => this.competitions.refresh()),
        ];
    }

    componentWillUnmount() {
        this.disposers.forEach(d => d());
    }

    @computed
    get sortedCompetitions() {
        const { value } = this.competitions;
        return value && _orderBy(value, competition => competition.start);
    }

    render() {
        const competitions = this.sortedCompetitions;

        return (
            <LoadingWrapper store={this.competitions}>
                {(competitions && competitions.length > 0) ? (
                    <ul className="event-competitions">
                        {competitions.map(competition => (
                            <li key={competition.name} className="competitions-item">
                                <span className="item-time">
                                    <FormatTime value={competition.start} format="ddd LT" />
                                </span>
                                {' '}
                                <span className="item-title">
                                    {competition.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : <NoResults />}
            </LoadingWrapper>
        );
    }
}
