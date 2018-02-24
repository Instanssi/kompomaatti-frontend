import React from 'react';
import { observer } from 'mobx-react';
// import { computed } from 'mobx';

import EventInfo from 'src/state/EventInfo';


@observer
export default class FrontStatus extends React.Component<{
    event: EventInfo;
}> {
    render() {
        // const { event } = this.props;
        // const eventId = event && event.eventId;

        return (
            <div className="frontpage-status">

            </div>
        );
    }
}
