import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { withRouter, RouteComponentProps } from 'react-router';

import { FormatTime, LoadingWrapper, L } from 'src/common';

import EventInfo from 'src/state/EventInfo';


/**
 * Displays details of a single programme event within a party event.
 */
@observer
export class EventProgrammeEvent extends React.Component<{
    eventInfo: EventInfo;
} & RouteComponentProps<{ progId: string }>> {
    @computed
    get progEvent() {
        const { idParsed } = this;
        const progEvent = this.props.eventInfo.programme.value;
        return progEvent && progEvent.find(compo => compo.id === idParsed);
    }

    get idParsed() {
        return Number.parseInt(this.props.match.params.progId, 10);
    }

    @computed
    get descriptionHTML() {
        const { progEvent } = this;
        return progEvent ? {
            __html: progEvent.description || '-',
        } : undefined;
    }

    render() {
        const { progEvent } = this;

        return (
            <LoadingWrapper
                className="event-progevent"
                store={this.props.eventInfo.programme}
            >
                {progEvent && <>
                    <div className="progevent-title">
                        <h2>{progEvent.title}</h2>
                        { progEvent.end ? <p>
                            <FormatTime value={progEvent.start} format="LLL" />
                            {' - '}
                            <FormatTime value={progEvent.end} format="LT" />
                            {', '}
                            {progEvent.place}
                        </p> : <p>
                            <FormatTime value={progEvent.start} format="LLL" />
                            {', '}
                            {progEvent.place}
                        </p>}
                    </div>
                    <h3><L text="programmeEvent.presenters" /></h3>
                    <p className="progevent-presenters">
                        {progEvent.presenters_titles} {progEvent.presenters}
                    </p>
                    <h3><L text="common.description" /></h3>
                    <p
                        className="progevent-description"
                        dangerouslySetInnerHTML={this.descriptionHTML}
                    />
                </>}
            </LoadingWrapper>
        );
    }
}

export default withRouter(EventProgrammeEvent);
