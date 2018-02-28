import React from 'react';
import { observer } from 'mobx-react';
import { action, runInAction } from 'mobx';

import globalState from 'src/state';
import { Form, FormGroup, L } from 'src/common';
import { ICompo } from 'src/api/interfaces';
import { FormStore } from 'src/stores';
import EventInfo from 'src/state/EventInfo';


@observer
export default class CompoEntryAdd extends React.Component<{
    eventInfo: EventInfo;
    compo: ICompo;
}> {
    form = new FormStore({
        name: '',
        creator: '',
        description: '',
        entryfile: null as File | null,
        imagefile_original: null as File | null,
        sourcefile: null as File | null,
    }, (formStore) => {
        return globalState.api.userCompoEntries.create({
            ...formStore.toJS(),
            compo: this.props.compo.id,
        });
    });

    @action.bound
    handleSubmit(event) {
        this.form.submit().then(
            (success) => runInAction(() => {
                console.info('success:', success);
                this.props.eventInfo.myEntries.refresh();
                // FIXME: Get back to the compo page and make sure it refreshes.
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
                    lines={5}
                />
                <FormGroup
                    label={<L text="data.entry.creator.title" />}
                    help={<L text="data.entry.creator.help" />}
                    name="creator"
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
                    <button className="btn btn-primary" disabled={this.form.isPending}>
                        <L text="common.submit" />
                    </button>
                </div>
            </Form>
        );
    }
}

