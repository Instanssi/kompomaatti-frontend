import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';

@observer
export class TimeZoneIndicator extends React.Component<{
    time: string | number | moment.Moment | Date | null;
}> {
    @computed
    get offsetHours() {
        const { time } = this.props;
        if (!time) {
            return null;
        }
        const offsetHours = moment(time).utcOffset() / 60;
        return offsetHours;
    }

    render() {
        const { offsetHours } = this;

        if (offsetHours === null) {
            return null;
        }
        const offsetStr = offsetHours >= 0 ? `+${offsetHours}` : `${offsetHours}`;
        return (
            <span className="timezone-indicator">
                <span className="fa fa-clock-o" />
                {' '}
                UTC{offsetStr}
            </span>
        );
    }
}
