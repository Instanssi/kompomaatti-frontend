import React from 'react';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import moment from 'moment';

import { ICompetition } from 'src/api/interfaces';

import EventInfo from 'src/state/EventInfo';
import { LoadingWrapper, L, NotLoggedIn } from 'src/common';
import globalState from 'src/state';
import CompetitionEnterForm from '../CompetitionEnterForm';


/**
 * Shows the status of a competition and info about the user's participation in it.
 */
@observer
export default class CompetitionStatus extends React.Component<{
    eventInfo: EventInfo;
    competition: ICompetition;
}> {
    @observable formOpen = false;

    @computed
    get isOpenForParticipation() {
        const { competition } = this.props;
        const now = globalState.timeMin;
        return moment(now).isBefore(competition.participation_end);
    }

    render() {
        const { eventInfo } = this.props;
        const { myParticipations } = eventInfo;

        const { isPending } = myParticipations;
        const participations = myParticipations.value;

        let content: JSX.Element | null;

        if (!this.isOpenForParticipation) {
            // Nothing to see here, pool's closed, etc.
            return (
                <div className="alert alert-info">
                    <L text="competition.participationClosed" />
                </div>
            );
        } else if (!globalState.user) {
            // Just render this directly instead of bothering the user with
            // errors about the failure to load user-specific participation data.
            return (
                <div className="alert alert-info">
                    <NotLoggedIn />
                </div>
            );
        } else if (participations && participations.length) {
            // Already signed up.
            content = (
                <div className="alert alert-info">
                    {participations.map(({ participant_name }) => (
                        <div>
                            <span className="fa fa-check" />&ensp;
                            <L
                                text="competition.signedUp"
                                values={{ participant_name }}
                            />
                        </div>
                    ))}
                </div>
            );
        } else if (!isPending) {
            // Competition is still open and the user doesn't seem to be
            // participating. Offer a form for signing up.
            content = this.renderSignup();
        } else {
            content = null;
        }

        return (
            <LoadingWrapper store={myParticipations}>
                {content}
            </LoadingWrapper>
        );
    }

    @action.bound
    handleFormOpen() {
        this.formOpen = true;
    }

    @action.bound
    hideForm() {
        this.formOpen = false;
    }

    renderSignup() {
        const { props } = this;
        // FIXME: Show a form on button click. Turn the row below the <hr /> into one?
        return (
            <div className="alert alert-info">
                <span className="fa fa-info-circle" />&ensp;
                <L text="competition.stillOpen" />
                <hr />
                {this.formOpen
                    ? (
                        <CompetitionEnterForm
                            eventInfo={props.eventInfo}
                            competition={props.competition}
                            onSubmit={this.hideForm}
                            onCancel={this.hideForm}
                        />
                    )
                    : (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.handleFormOpen}
                        >
                            <L text="competition.participate" />
                        </button>
                    )
                }

            </div>
        );
    }
}
