import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { FormGroup } from 'src/common';
import { ICompo } from 'src/api/interfaces';
import FormState from 'src/state/form';


interface ICompoEntryFormProps {
    compo: ICompo;
}

@observer
export default class CompoEntryForm extends React.Component<ICompoEntryFormProps> {
    // TODO: What does this do?
    form: FormState;

    @action.bound
    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Add entry</h2>
                <FormGroup form={this.form} name="title" />
            </form>
        )
    }
}

