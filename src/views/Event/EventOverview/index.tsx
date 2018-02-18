import React from 'react';
import { observer } from 'mobx-react';

import { L } from 'src/common';
import { IEvent } from 'src/api/interfaces';

import EventCompos from './EventCompos';
import EventCompetitions from './EventCompetitions';
import EventProgramme from './EventProgramme';


@observer
export default class EventOverview extends React.Component<{
    event: IEvent;
}> {
    render() {
        const { event } = this.props;

        return (
            <div className="event-overview">
                <h2><L text="event.compos" /></h2>
                <EventCompos event={event} />

                <h2><L text="event.competitions" /></h2>
                <EventCompetitions event={event} />

                <h2><L text="event.programme" /></h2>
                <EventProgramme event={event} />
            </div>
        );
    }
}
