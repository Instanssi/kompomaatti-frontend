import React from 'react';
import { observer } from 'mobx-react';

import { L } from 'src/common';
import EventInfo from 'src/state/EventInfo';


@observer
export default class FrontCurrentEvent extends React.Component<{
    event: EventInfo;
}> {
    render() {
        const { event } = this.props;

        return (
            <div className="highlight-box">
                <h3 className="box-header">
                    <L text="dashboard.events.title" />
                </h3>
                <div className="box-body">
                    <p>
                        {event ? (
                            event.event.name
                        ) : (
                            <L text="dashboard.events.empty" />
                        )}
                    </p>
                </div>
                <div className="box-footer">
                    {/*
                        <button><L text="dashboard.events.action')}</butto" />-->
                    */}
                </div>
            </div>
        );
    }
}
