import React from 'react';
import { observer } from 'mobx-react';
import { action, runInAction } from 'mobx';

import globalState from 'src/state';
import { Form, FormGroup, L } from 'src/common';
import { ICompo } from 'src/api/interfaces';
import { FormStore } from 'src/stores';


interface ICompoEntryFormProps {
    compo: ICompo;
}

@observer
export default class CompoEntryForm extends React.Component<ICompoEntryFormProps> {
    form = new FormStore({
        name: '',
        description: '',
        entryfile: null as File | null,
        imagefile_original: null as File | null,
        sourcefile: null as File | null,
    });

    @action.bound
    handleSubmit(form) {
        // Should this be a feature of the form itself?
        // Then we could prevent the dreaded double submit by just
        // making the form refuse to submit if it's already pending.
        globalState.api.userCompoEntries.create({
            ...this.form.toJS(),
            compo: this.props.compo.id,
            creator: globalState.user!.id,
        }).then(
            (success) => runInAction(() => {
                console.info('success:', success);
            }),
            (error) => runInAction(() => {
                console.error(error);
                this.form.setError(error);
            }),
        );
    }

    render() {
        const { form } = this;
        return (
            <Form form={form} onSubmit={this.handleSubmit}>
                <h2><L text="entry.add" /></h2>
                <FormGroup
                    label={<L text="data.entry.name.title" />}
                    help={<L text="data.entry.name.help" />}
                    name="name"
                />
                <FormGroup
                    label={<L text="data.entry.description.title" />}
                    help={<L text="data.entry.description.help" />}
                    name="description"
                    input="textarea"
                />
                <FormGroup
                    label={<L text="data.entry.entryfile.title" />}
                    help={<L text="data.entry.entryfile.help" />}
                    name="entryfile"
                    type="file"
                />
                <FormGroup
                    label={<L text="data.entry.sourcefile.title" />}
                    help={<L text="data.entry.sourcefile.help" />}
                    name="sourcefile"
                    type="file"
                />
                <FormGroup
                    label={<L text="data.entry.imagefile_original.title" />}
                    help={<L text="data.entry.imagefile_original.help" />}
                    name="imagefile_original"
                    type="file"
                />
                <div>
                    <button className="btn btn-primary">
                        <L text="common.submit" />
                    </button>
                </div>
            </Form>
        );
    }
}

