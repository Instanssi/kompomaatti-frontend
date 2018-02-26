import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { FormStore } from 'src/stores';
import FormFeedback from '../FormFeedback';
import { Provider } from 'mobx-react';


@observer
export default class Form<T> extends React.Component<{
    /** Form state to connect to. */
    form: FormStore<T>;
    /**
     * Called when the form's submit event fires.
     *
     * The default action is prevented before this.
     */
    onSubmit: (value: FormStore<T>) => void;
    /** Arbitrary content. */
    children?: any;
}> {
    @action.bound
    handleSubmit(event) {
        event.preventDefault();
        const { props } = this;
        props.onSubmit(props.form);
    }

    render() {
        const { props } = this;
        return (
            <Provider formStore={this.props.form}>
                <form onSubmit={this.handleSubmit}>
                    {props.children}
                    <FormFeedback form={props.form} />
                    <FormFeedback form={props.form} name="non_field_errors" />
                </form>
            </Provider>
        );
    }
}
