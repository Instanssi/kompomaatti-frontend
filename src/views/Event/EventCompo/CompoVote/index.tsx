import React from 'react';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';

import { ICompo } from 'src/api/interfaces';
import { L } from 'src/common';
import EventInfo from 'src/state/EventInfo';


@observer
export default class CompoVote extends React.Component<{
    eventInfo: EventInfo;
    compo: ICompo;
}> {
    @action.bound
    handleSubmit(event) {
        event.preventDefault();
    }

    @computed
    get votes() {
        const { eventInfo } = this.props;
        return eventInfo.event;
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2><L text="compo.vote" /></h2>
                {JSON.stringify(this.votes)}
            </form>
        );
    }
}
