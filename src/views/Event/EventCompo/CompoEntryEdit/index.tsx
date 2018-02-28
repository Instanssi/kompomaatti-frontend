import React from 'react';
import { observer } from 'mobx-react';
import { action, runInAction, reaction, computed } from 'mobx';
import { RouteComponentProps, withRouter } from 'react-router';

import globalState from 'src/state';
import { Form, FormGroup, FormFileInput, L } from 'src/common';
import { ICompo, ICompoEntry } from 'src/api/interfaces';
import { FormStore } from 'src/stores';
import EventInfo from 'src/state/EventInfo';


@observer
export class CompoEntryEdit extends React.Component<{
    eventInfo: EventInfo;
    compo: ICompo;
    entry: ICompoEntry;
}> {
    form = new FormStore({
        name: '',
        creator: '',
        description: '',
        // FIXME: This should allow "undefined" values when the file is to remain unchanged.
        // To delete the file, set this to null, and pass a new file to replace it.
        entryfile: null as File | null,
        imagefile_original: null as File | null,
        sourcefile: null as File | null,
    }, (formStore) => {
        console.info('formStore:', formStore.toJS());
        return globalState.api.userCompoEntries.update(
            this.props.entry.id,
            {
                ...formStore.toJS(),
                compo: this.props.compo.id,
            },
        );
    });

    disposers: any[] = [];

    componentWillMount() {
        this.disposers.push(reaction(
            () => this.props.entry,
            (entry) => {
                this.updateForm(entry);
            },
            true,
        ));

        reaction(
            () => this.form.toJS(),
            (value) => console.info(value),
        );
    }

    componentWillUnmount() {
        this.disposers.forEach(d => d());
    }


    updateForm(entry: ICompoEntry) {
        this.form.setValue({
            name: entry.name || '',
            creator: entry.creator || '',
            description: entry.description || '',
            // The file inputs should show placeholders for any existing values.
            entryfile: undefined,
            imagefile_original: undefined,
            sourcefile: undefined,
        });
    }

    @action.bound
    handleSubmit(event) {
        this.form.submit().then(
            (success) => runInAction(() => {
                console.info('success:', success);
                // FIXME: Get back to the compo page and make sure it refreshes.
                this.props.eventInfo.myEntries.refresh();
            }),
            (error) => runInAction(() => {
                console.error(error);
                this.form.setError(error);
            }),
        );
    }

    render() {
        const { form } = this;
        const { sourcefile_url, entryfile_url, imagefile_original_url } = this.props.entry;

        return (
            <Form form={form} onSubmit={this.handleSubmit}>
                <h2><L text="entry.edit" /></h2>
                <FormGroup
                    name="name"
                    label={<L text="data.entry.name.title" />}
                    help={<L text="data.entry.name.help" />}
                />
                <FormGroup
                    name="description"
                    label={<L text="data.entry.description.title" />}
                    help={<L text="data.entry.description.help" />}
                    input="textarea"
                    lines={5}
                />
                <FormGroup
                    name="creator"
                    label={<L text="data.entry.creator.title" />}
                    help={<L text="data.entry.creator.help" />}
                />
                <FormGroup
                    name="entryfile"
                    label={<L text="data.entry.entryfile.title" />}
                    help={<L text="data.entry.entryfile.help" />}
                    input={FormFileInput}
                    currentFileURL={entryfile_url}
                />
                <FormGroup
                    name="sourcefile"
                    label={<L text="data.entry.sourcefile.title" />}
                    help={<L text="data.entry.sourcefile.help" />}
                    input={FormFileInput}
                    currentFileURL={sourcefile_url}
                />
                <FormGroup
                    name="imagefile_original"
                    label={<L text="data.entry.imagefile_original.title" />}
                    help={<L text="data.entry.imagefile_original.help" />}
                    input={FormFileInput}
                    currentFileURL={imagefile_original_url}
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

@observer
export class CompoEntryEditView extends React.Component<{
    eventInfo: EventInfo;
    compo: ICompo;
} & RouteComponentProps<{ entryId: string }>> {
    get idParsed() {
        return Number.parseInt(this.props.match.params.entryId, 10);
    }

    @computed
    get entry() {
        const { value } = this.props.eventInfo.myEntries;
        return value && value.find(entry => entry.id === this.idParsed);
    }

    render() {
        const { eventInfo, compo } = this.props;
        const { entry } = this;
        if (entry) {
            return (
                <CompoEntryEdit
                    eventInfo={eventInfo}
                    compo={compo}
                    entry={entry}
                />
            );
        }
        // FIXME: Show a 404 page if no entry is found in the event info.
        // - force refresh myEntries once if this happens
        return null;
    }
}

// TODO: Should this form be part of a larger component that does this?
export default withRouter(CompoEntryEditView);
