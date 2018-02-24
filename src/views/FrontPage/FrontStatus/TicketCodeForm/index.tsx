import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import globalState from 'src/state';
import EventInfo from 'src/state/EventInfo';
import { FormStore } from 'src/stores';
import { Form, FormGroup } from 'src/common';


@observer
export default class TicketCodeForm extends React.Component<{
    event: EventInfo;
    onSubmit?: (response: any) => void;
}> {
    store = new FormStore({
        ticket_key: '',
    }, (formStore) => {
        return globalState.api.voteCodes.create({
            ...formStore.toJS(),
            event: this.props.event.eventId,
        });
    });

    @action.bound
    handleSubmit() {
        this.store.submit().then(() => {
            this.props.event.myVoteCodes.refresh();
        });
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit} form={this.store}>
                <FormGroup
                    name="ticket_key"
                />
            </Form>
        );
    }
}
