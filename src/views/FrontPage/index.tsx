import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';
import { L } from 'src/common';

import FrontEvent from './FrontEvent';
import FrontProgramme from './FrontProgramme';
import FrontCompos from './FrontCompos';
import FrontCompetitions from './FrontCompetitions';


@observer
export default class FrontPageView extends React.Component<any> {
    componentWillMount() {
        // globalState.events.refresh();
    }

    get currentEvent() {
        return globalState.currentEvent;
    }

    get currentUser() {
        return globalState.user;
    }

    render() {
        const { currentEvent } = globalState;

        return (
            <div className="frontpage-view">
                <h1>Kompomaatti</h1>
                <p>
                    <L text="dashboard.welcome" />
                </p>
                <div className="row">
                    <div className="col-sm-6">
                        <FrontEvent event={currentEvent} />
                    </div>
                    <div className="col-sm-6">
                        <FrontProgramme event={currentEvent} />
                    </div>
                    <div className="col-sm-6">
                        <FrontCompos event={currentEvent} />
                    </div>
                    <div className="col-sm-6">
                        <FrontCompetitions event={currentEvent} />
                    </div>
                </div>
            </div>
        );
    }
}
