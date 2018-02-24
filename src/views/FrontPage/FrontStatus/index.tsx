import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import globalState from 'src/state';
import EventInfo from 'src/state/EventInfo';
import { L } from 'src/common';

import TicketCodeForm from './TicketCodeForm';


@observer
export default class FrontStatus extends React.Component<{
    event: EventInfo;
}> {
    @computed
    get hasLogin() {
        return !!globalState.user;
    }

    @computed
    get hasVoteCode() {
        const { currentEvent } = globalState;
        if (!currentEvent) {
            return null;
        }
        const { value } = currentEvent.myVoteCodes;
        return !!(value && value.length);
    }

    render() {
        const { hasLogin, hasVoteCode } = this;

        let content;

        // FIXME: If the "current" event has clearly ended, inform the user
        // about that before checking login or vote codes.

        if (!hasLogin) {
            content = this.renderNoLogin();
        } else if (!hasVoteCode) {
            content = this.renderNoVoteCode();
        } else {
            content = this.renderVoteOk();
        }

        return (
            <div className="frontpage-status">
                {content}
            </div>
        );
    }

    renderNoLogin() {
        return (
            <div className="alert alert-info">
                <span className="fa fa-info-circle" />&ensp;
                <L text="dashboard.notLoggedIn" />
                <hr />
                <div>
                    <a href="/users/login" className="btn btn-primary">
                        <L text="session.login" />
                    </a>
                </div>
            </div>
        );
    }

    renderNoVoteCode() {
        // FIXME: Render a form to enter a vote code or a request.
        return (
            <div className="alert alert-info">
                <h4><span className="fa fa-info-circle" />&ensp; <L text="voteCode.missing" /></h4>
                <p><L text="voteCode.help" /></p>
                <hr />
                <div>
                    <button type="button" className="btn btn-primary">
                        <L text="voteCode.useTicketCode" />
                    </button>
                    &ensp;
                    <button type="button" className="btn btn-link">
                        <L text="voteCode.noTicketCode" />
                    </button>
                </div>
                <TicketCodeForm event={this.props.event} />
            </div>
        );
    }

    renderVoteOk() {
        return (
            <div className="alert alert-info">
                <L text="dashboard.voteOk" />
            </div>
        );
    }
}
