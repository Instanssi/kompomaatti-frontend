import React from 'react';
import { observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';

import { ICompo } from 'src/api/interfaces';
import { FormatDuration, L } from 'src/common';

import UserCompoEntries from './UserCompoEntries';


/**
 * Shows a summary of a compo's status and some actions the user can perform on it
 * like voting, adding/editing entries, etc.
 */
@(withRouter as any)
@observer
export default class CompoActions extends React.Component<{ compo: ICompo, match?: any }> {

    now = new Date();

    _interval: any;

    componentWillMount() {
        this._interval = setInterval(() => {
            this.now = new Date();
        }, 5000);
    }

    beforeDestroy() {
        clearInterval(this._interval);
    }

    // TODO: Should these be implemented for the compo object somehow?

    /** Check if the compo is votable at all. */
    get isVotingEnabled() {
        const { compo } = this.props;
        return compo && compo.is_votable;
    }

    get canAddEntry() {
        const { compo } = this.props;
        const now = moment(this.now);
        return now.isBefore(compo.adding_end);
    }

    get canEditEntry() {
        const { compo } = this.props;
        const now = moment(this.now);
        return now.isBefore(compo.editing_end);
    }

    get canVoteEntry() {
        const { compo } = this.props;
        if (!compo.is_votable) {
            return;
        }
        const now = moment(this.now);
        const { voting_end, voting_start } = compo;
        return now.isSameOrAfter(voting_start) && now.isBefore(voting_end);
    }

    render() {
        const { compo, match } = this.props;
        const { canAddEntry, canEditEntry, canVoteEntry } = this;

        return (
            <div className="panel panel-default compo-actions">
                <div className="panel-heading">
                    <h3 className="m-0"><L text="compo.status" /></h3>
                </div>
                <div className="panel-body">
                    <div>
                        <UserCompoEntries compo={compo} isEditable={this.canEditEntry} />
                    </div>
                    <div>
                        <span className="fa fa-fw fa-info-circle"/>{' '}
                        You have not voted yet.
                    </div>
                    <div>
                        <span className="fa fa-fw fa-clock-o" />{' '}
                        <FormatDuration to={compo.editing_end} />
                    </div>
                    <div>TODO: Add/edit/vote timeframe</div>
                    <div className="compo-timeframe">
                        <div>Can add entry: {canAddEntry ? 'yes' : 'no'}</div>
                        <div>Can edit entry: {canEditEntry ? 'yes' : 'no'}</div>
                        <div>Votable: {canVoteEntry ? 'yes' : 'no'}</div>
                    </div>
                </div>
                <div className="panel-footer">
                    { canAddEntry && (
                        <Link to={match.url + '/entries/add'} className="btn btn-default">
                            Add entry
                        </Link>
                    )}
                    { canVoteEntry && (
                        <Link to={match.url + '/vote'} className="btn btn-default">
                            Vote
                        </Link>
                    )}
                </div>
            </div>
        );
    }
}
