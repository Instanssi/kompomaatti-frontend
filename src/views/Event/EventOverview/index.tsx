import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';

import EventCompos from './EventCompos';
import EventCompetitions from './EventCompetitions';
import EventProgramme from './EventProgramme';
import { IEvent } from 'src/api/interfaces';


const { translate } = globalState;

export interface IEventOverviewProps {
    event: IEvent;
}

@observer
export default class EventOverview extends React.Component<IEventOverviewProps> {
    render() {
        const { event } = this.props;

        return (
            <div className="event-overview">
                <h2>{translate('event.compos')}</h2>
                <EventCompos event={event} />

                <h2>{translate('event.competitions')}</h2>
                <EventCompetitions event={event} />

                <h2>{translate('event.programme')}</h2>
                <EventProgramme event={event} />
            </div>
        );
    }
}
