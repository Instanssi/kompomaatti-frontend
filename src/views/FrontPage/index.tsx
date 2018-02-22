import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';
import { L } from 'src/common';

import FrontEvent from './FrontEvent';
import FrontProgramme from './FrontProgramme';
import FrontCompos from './FrontCompos';
import FrontCompetitions from './FrontCompetitions';

import frontpageClass from './frontpage.scss';

console.info('frontpage classname:', Object.keys(frontpageClass));


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
                <div className="frontpage-boxes">
                    <FrontEvent event={currentEvent} />
                    <FrontProgramme event={currentEvent} />
                    <FrontCompos event={currentEvent} />
                    <FrontCompetitions event={currentEvent} />
                </div>
            </div>
        );
    }
}
