import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { ICompo } from 'src/api/interfaces';
import EventInfo from 'src/state/EventInfo';
import { FormatTime } from 'src/common';

@observer
export class EventComposItem extends React.Component<{
    eventInfo: EventInfo;
    compo: ICompo;
}> {
    render() {
        const { compo, eventInfo } = this.props;
        return (
            <li key={compo.id} className="compos-item">
                <span className="item-time">
                    <FormatTime value={compo.compo_start} format="ddd LT" />
                </span>
                {' '}
                <span className="item-title">
                    <Link to={eventInfo.getCompoURL(compo)}>
                        {compo.name}
                    </Link>
                </span>
            </li>
        );
    }
}