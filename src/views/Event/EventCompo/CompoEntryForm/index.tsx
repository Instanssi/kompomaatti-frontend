import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { Form, FormGroup, L } from 'src/common';
import { ICompo } from 'src/api/interfaces';
import { FormStore } from 'src/stores';


interface ICompoEntryFormProps {
    compo: ICompo;
}

@observer
export default class CompoEntryForm extends React.Component<ICompoEntryFormProps> {
    // TODO: What does this do?
    form = new FormStore({

    });

    @action.bound
    handleSubmit(form) {
    }

    render() {
        return (
            <Form form={this.form} onSubmit={this.handleSubmit}>
                <h2>Add entry</h2>
                <FormGroup
                    label={<L text="data.entry.name.title" />}
                    help={<L text="data.entry.name.help" />}
                    name="title"
                />
                <FormGroup
                    label={<L text="data.entry.description.title" />}
                    help={<L text="data.entry.description.help" />}
                    name="description"
                    input="textarea"
                />
            </Form>
        );
    }
}

