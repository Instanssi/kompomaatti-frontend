import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Link } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';
import moment from 'moment';

import EventInfo from 'src/state/EventInfo';
import { FormatTime, L } from 'src/common';
import globalState from 'src/state';


@observer
export default class FrontSchedule extends React.Component<{
    event: EventInfo;
}> {
    @computed
    get allRows() {
        const { event } = this.props;
        const { programme, compos, competitions } = event;
        const all: Array<{
            time: Date,
            title: string | JSX.Element,
            key: string,
        }> = [];

        const title = (name, type, url) => (
            <div className="item-title">
                <Link to={url}>{name}</Link>
                {': '}
                <span><L text={type} /></span>
            </div>
        );

        for (const progEvent of programme.value || []) {
            if (!progEvent.end || progEvent.end === progEvent.start) {
                all.push({
                    key: `progEvent-${progEvent.id}-single`,
                    time: new Date(progEvent.start),
                    title: title(
                        progEvent.title,
                        'programmeEvent.event',
                        event.getProgrammeEventURL(progEvent)
                    ),
                });
            } else {
                all.push({
                    key: `progEvent-${progEvent.id}-start`,
                    time: new Date(progEvent.start),
                    title: title(
                        progEvent.title,
                        'programmeEvent.start',
                        event.getProgrammeEventURL(progEvent)
                    ),
                });
                all.push({
                    key: `progEvent-${progEvent.id}-end`,
                    time: new Date(progEvent.end),
                    title: title(
                        progEvent.title,
                        'programmeEvent.end',
                        event.getProgrammeEventURL(progEvent)
                    ),
                });
            }
        }
        for (const compo of compos.value || []) {
            if (compo.adding_end === compo.editing_end) {
                all.push({
                    key: `compo-${compo.id}-add`,
                    time: new Date(compo.adding_end),
                    title: title(
                        compo.name,
                        'compo.deadline',
                        event.getCompoURL(compo)
                    ),
                });
            } else {
                all.push({
                    key: `compo-${compo.id}-add`,
                    time: new Date(compo.adding_end),
                    title: title(
                        compo.name,
                        'compo.addingEnd',
                        event.getCompoURL(compo)
                    ),
                });

                all.push({
                    key: `compo-${compo.id}-edit`,
                    time: new Date(compo.editing_end),
                    title: title(
                        compo.name,
                        'compo.editingEnd',
                        event.getCompoURL(compo)
                    ),
                });
            }

            all.push({
                key: `compo-${compo.id}-voting-end`,
                time: new Date(compo.voting_end),
                title: title(
                    compo.name,
                    'compo.votingEnd',
                    event.getCompoURL(compo)
                ),
            });

            all.push({
                key: `compo-${compo.id}-start`,
                time: new Date(compo.compo_start),
                title: title(
                    compo.name,
                    'compo.compoStart',
                    event.getCompoURL(compo)
                ),
            });
        }
        for (const competition of competitions.value || []) {
            if(competition.participation_end) {
                all.push({
                    key: `competition-${competition.id}-partend`,
                    time: new Date(competition.participation_end),
                    title: title(
                        competition.name,
                        'competition.participationEnd',
                        event.getCompetitionURL(competition)
                    ),
                });
            }
            if (!competition.end || competition.end === competition.start) {
                all.push({
                    key: `competition-${competition.id}-time`,
                    time: new Date(competition.start),
                    title: title(
                        competition.name,
                        'competition.competition',
                        event.getCompetitionURL(competition)
                    ),
                });
            } else {
                all.push({
                    key: `competition-${competition.id}-start`,
                    time: new Date(competition.start),
                    title: title(
                        competition.name,
                        'competition.start',
                        event.getCompetitionURL(competition)
                    ),
                });
                all.push({
                    key: `competition-${competition.id}-end`,
                    time: new Date(competition.end),
                    title: title(
                        competition.name,
                        'competition.end',
                        event.getCompetitionURL(competition)
                    ),
                });
            }
        }
        return _orderBy(all, item => item.time.valueOf());
    }

    @computed
    get currentEvents() {
        const { allRows } = this;
        const now = moment(globalState.timeMin).subtract(15, 'minutes');
        return allRows.filter(item => item.time.valueOf() < now.valueOf());
    }

    @computed
    get isPending() {
        const { programme, compos, competitions } = this.props.event;
        return programme.isPending || compos.isPending || competitions.isPending;
    }

    render() {
        const { currentEvents } = this;
        return (
            <div className="front-schedule">
                <h3><L text="common.schedule" /></h3>
                <ul className="list-k">
                    {currentEvents.map(row => (
                        <li key={row.key}>
                            <div className="item-time">
                                <FormatTime value={row.time} format="ddd LT" />
                            </div>
                            {row.title}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
