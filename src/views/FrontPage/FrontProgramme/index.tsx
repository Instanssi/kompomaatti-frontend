import React from 'react';
import { observer } from 'mobx-react';

import { L } from 'src/common';
import EventHelper from 'src/state/EventHelper';


@observer
export default class FrontProgramme extends React.Component<{
    event: EventHelper | null;
}> {
    render() {
        const { event } = this.props;

        return (
            <div className="highlight-box">
                <h3 className="box-header">
                    <L text="dashboard.programme.title" />
                </h3>
                <div className="box-body">
                    <p>
                        {event ? (
                            event.event.name
                        ) : (
                            <L text="dashboard.programme.empty" />
                        )}
                    </p>
                </div>
                <div className="box-footer">
                    {/*
                        <button><L text="dashboard.programme.action')}</butto" />-->
                    */}
                </div>
            </div>
        );
    }
}
