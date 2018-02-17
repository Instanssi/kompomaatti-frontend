import React from 'react';
import { action } from 'mobx';

import FormState from 'src/state/form';
import FormFeedback from '../FormFeedback';


interface IFormProps {
    /** Form state to connect to. */
    form: FormState;
    /** Called when the form's submit event fires. The default action is prevented before this. */
    onSubmit: (value: FormState) => {};
    /** Arbitrary content. */
    children?: any;
}

export default class Form extends React.Component<IFormProps> {
    @action.bound
    handleSubmit(event) {
        event.preventDefault();
        const { props } = this;
        props.onSubmit(props.form);
    }

    render() {
        const { props } = this;
        return (
            <form onSubmit={this.handleSubmit}>
                {props.children}
                <FormFeedback form={props.form} />
            </form>
        );
    }
}