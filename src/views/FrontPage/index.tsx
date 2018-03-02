import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';
import { L, LoadingWrapper } from 'src/common';

import EventStatus from '../Event/EventStatus';
import FrontEvent from './FrontEvent';
import FrontProgramme from './FrontProgramme';
import FrontCompos from './FrontCompos';
import FrontCompetitions from './FrontCompetitions';

import './frontpage.scss';


@observer
export default class FrontPageView extends React.Component<any> {
    get currentEvent() {
        return globalState.currentEvent;
    }

    render() {
        const { currentEvent } = globalState;

        return (
            <div className="frontpage-view">
                <h1>Kompomaatti</h1>
                <p><L text="dashboard.welcome" /></p>
                <LoadingWrapper store={globalState.events}>
                    {currentEvent && <>
                        <EventStatus event={currentEvent} />
                        <div className="frontpage-boxes">
                            <FrontEvent event={currentEvent} />
                            <FrontProgramme event={currentEvent} />
                            <FrontCompos event={currentEvent} />
                            <FrontCompetitions event={currentEvent} />
                        </div>
                    </>}
                </LoadingWrapper>
            </div>
        );
    }
}
