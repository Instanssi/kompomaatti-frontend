import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';

import { NoResults } from 'src/common';
import { ICompetition, IEvent } from 'src/api/interfaces';
import globalState from 'src/state';


@observer
export default class EventCompetitions extends React.Component<{ event: IEvent }> {
    @observable.ref competitions: ICompetition[] = [];
    @observable.ref lastError: any;
    @observable.ref isPending = false;

    componentWillMount() {
        this.refresh();
    }

    @action
    async refresh() {
        const { event } = this.props;
        const { api } = globalState;
        this.isPending = true;
        try {
            this.competitions = await api.competitions.list({ event: event.id });
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    render() {
        const { competitions } = this;
        return (
            <ul>
                {competitions.map(competition => (
                    <li key={competition.name}>{competition.name}</li>
                ))}
                {!competitions.length && <NoResults />}
            </ul>
        );
    }
}
