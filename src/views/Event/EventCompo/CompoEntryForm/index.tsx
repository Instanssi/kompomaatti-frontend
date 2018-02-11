import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { ICompo } from 'src/api/interfaces';


interface ICompoEntryFormProps {
    compo: ICompo;
}

@observer
export default class CompoEntryForm extends React.Component<ICompoEntryFormProps> {
    @action.bound
    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Add entry</h2>

            </form>
        )
    }
}

