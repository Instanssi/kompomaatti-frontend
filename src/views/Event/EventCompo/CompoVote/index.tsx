import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { ICompo } from 'src/api/interfaces';


interface ICompoVoteProps {
    compo: ICompo;
}

@observer
export default class CompoVote extends React.Component<ICompoVoteProps> {
    @action.bound
    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Vote</h2>

            </form>
        )
    }
}

