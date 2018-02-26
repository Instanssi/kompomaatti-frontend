import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import _orderBy from 'lodash/orderBy';
import classNames from 'classnames';

import { L } from 'src/common';

import globalState from 'src/state';
import { ICompetition } from 'src/api/interfaces';
import LazyStore from 'src/stores/LazyStore';
import EventInfo from 'src/state/EventInfo';


@observer
export default class CompetitionResults extends React.Component<{
    eventInfo: EventInfo;
    competition: ICompetition;
}> {
    results = new LazyStore(() => globalState.api.competitionParticipations.list({
        competition: this.props.competition.id,
    }));

    @computed
    get resultsSorted() {
        const { value } = this.results;
        if (!value) {
            return null;
        }
        return _orderBy(value, c22n => c22n.rank, 'desc');
    }

    render() {

        return (
            <div className="competition-results">
                <h3><L text="common.results" /></h3>
                {this.resultsSorted && this.resultsSorted.length && (
                    <ul>
                        {this.resultsSorted.map(comp => (
                            <li
                                className={classNames(
                                    { disqualified: comp.disqualified },
                                )}
                            >
                                {comp.rank}. {comp.participant_name}
                                {comp.disqualified_reason ? ` ${comp.disqualified_reason}` : '?'}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}
