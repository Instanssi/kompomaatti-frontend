import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';

import L from '../L';

import './timezone.scss';

/**
 * Shows the UTC offset used to display times-of-day for a specific date.
 *
 * The date is required because of daylight savings time.
 *
 * @todo Allow switching the time zone to the party time via this?
 */
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
            <span className="timezone-indicator" title={L.getText('timeZone.yourTZ')}>
                <span className="fa fa-clock-o" />
                {' '}
                UTC{offsetStr}
            </span>
        );
    }
}
