import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _orderBy from 'lodash/orderBy';

import { NoResults } from 'src/common';
import { IProgrammeEvent, IEvent } from 'src/api/interfaces';
import globalState from 'src/state';


export interface IEventProgrammeProps {
    event: IEvent;
}

@observer
export default class EventProgramme extends React.Component<IEventProgrammeProps> {
    @observable isPending = false;
    @observable lastError: any;
    @observable.ref programmeEvents = [] as IProgrammeEvent[];

    componentWillMount() {
        this.refresh();
    }

    async refresh() {
        const { event } = this.props;
        const id = event && event.id;
        if (!id) {
            return;
        }
        const { api } = globalState;

        this.isPending = true;
        try {
            const items = await api.programme.list({ event: id });
            this.programmeEvents = _orderBy(items, item => item.start);
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
            throw error;
        }
        this.isPending = false;
    }

    render() {
        const { programmeEvents } = this;
        return (
            <ul>
                {programmeEvents.map(event => (
                    <li key={event.id}>{event.title}</li>
                ))}
                {!programmeEvents.length && (
                    <NoResults />
                )}
            </ul>
        );
    }
}
