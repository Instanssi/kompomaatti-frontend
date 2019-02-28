import React from 'react';
import { observer } from 'mobx-react';
import { action, runInAction, observable, computed } from 'mobx';
import { Redirect } from 'react-router';

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

    @observable success = false;

    @action.bound
    handleSubmit(event) {
        this.form.submit().then(
            (success) => runInAction(() => {
                console.info('success:', success);
                // TODO: Show a toast or something
                this.props.eventInfo.myEntries.refresh();
                this.success = true;
            }),
        );
    }

    @computed
    get helpValues() {
        const { compo } = this.props;
        return {
            entryFormats: compo.entry_format_list.join(', '),
            entryMaxSize: Math.floor(compo.max_entry_size / 1024),
            imageFormats: compo.image_format_list.join(', '),
            imageMaxSize: Math.floor(compo.max_image_size / 1024),
            sourceFormats: compo.source_format_list.join(', '),
            sourceMaxSize: Math.floor(compo.max_source_size / 1024),
        };
    }

    render() {
        const { compo } = this.props;
        const { form, helpValues } = this;

        if (this.success) {
            return <Redirect to={this.props.eventInfo.getCompoURL(this.props.compo)} />;
        }

        return (
            <Form form={form} onSubmit={this.handleSubmit} leavePrompt>
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
                    help={<L text="data.entry.entryfile.help" values={helpValues} />}
                    name="entryfile"
                    type="file"
                    maxFileSize={compo.max_entry_size}
                />
                <FormGroup
                    label={<L text="data.entry.sourcefile.title" />}
                    help={<L text="data.entry.sourcefile.help" values={helpValues} />}
                    name="sourcefile"
                    type="file"
                    maxFileSize={compo.max_source_size}
                />
                {compo.is_imagefile_allowed && <FormGroup
                    label={<L text="data.entry.imagefile_original.title" />}
                    help={<L
                        text="data.entry.imagefile_original.help"
                        values={helpValues}
                    />}
                    name="imagefile_original"
                    type="file"
                    maxFileSize={compo.max_image_size}
                />}
                <div>
                    <button className="btn btn-primary" disabled={form.isPending}>
                        <L text="common.submit" />
                    </button>
                    {form.isPending && <>
                        &ensp;
                        <span className="fa fa-fw fa-spin fa-spinner" />
                    </>}
                </div>
            </Form>
        );
    }
}

