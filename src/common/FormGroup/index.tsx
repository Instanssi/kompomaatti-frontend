import React from 'react';
import { observer, inject } from 'mobx-react';
import { action, computed } from 'mobx';
import classNames from 'classnames';
import _get from 'lodash/get';

import { FormStore } from 'src/stores';
import FormFeedback from '../FormFeedback';


export interface IFormGroupProps<T> {
    name: string;
    label?: JSX.Element | string;
    help?: JSX.Element | string;

    /**
     * Set to use a custom input component. A text input is rendered by default.
     *
     * The class is used with props that would work with a plain <input />.
     */
    input?: React.ComponentClass<any> | string;

    // Tempted to just make this interface extend basic HTML input attributes,
    // but most of that junk is useless and potentially confusing.
    type?: string;

    /**
     * Set to completely override the input field implementation.
     */
    children?: JSX.Element;

    /** Actually passed via MobX provider + inject (context). */
    formStore?: FormStore<T>;
}

/**
 * Markup for a form group.
 */
@inject('formStore')
@observer
export default class FormGroup<T> extends React.Component<IFormGroupProps<T> & any> {
    componentWillMount() {
        // sanity checks
        const { name, formStore } = this.props;

        if (!formStore) {
            throw new Error('No formStore provided!');
        }

        if (formStore.value[name] === undefined) {
            throw new Error('Form has no initial value for: ' + name);
        }
    }

    /** Get id for the form label and control. */
    get id() {
        return this.props.name;
    }

    @action.bound
    onChange(eventOrValue) {
        const { name, type } = this.props;
        const form = this.props.formStore!;
        const { target } = eventOrValue;

        if (target) {
            // how about checkboxes? they have "checked" instead of "value" because DOM is silly
            // - do they belong in form groups anyway?
            if (type === 'file') {
                return form.onChange(name, target.files && target.files[0]);
            } else {
                return form.onChange(name, target.value);
            }
        }
        return form.onChange(name, eventOrValue);
    }

    @computed
    get className() {
        return classNames(
            'form-group',
            // FIXME: Pick up has-error/has-warning/has-success from form state
        );
    }

    @computed
    get value() {
        const { formStore, name } = this.props;
        return _get(formStore!.value, name);
    }

    render() {
        const { id, className, props, value, onChange } = this;
        const { name, label, help, input, children, formStore, type, ...rest } = props;

        return (
            <div className={className}>
                {label && (
                    // Tie the label contents to the form input to ease navigation.
                    <label className="control-label" htmlFor={id}>
                        {label}
                    </label>
                )}
                {children || (
                    // If no input field was provided, render a text input bound to
                    // the appropriate form field. This could handle like 50% of cases.
                    React.createElement(input || 'input', {
                        id,
                        // HTML forms, please don't suck this hard
                        value: type !== 'file' ? value : (value && value.filename),
                        type,
                        onChange,
                        className: 'form-control',
                        ...rest,
                    })
                )}
                {help && (
                    // Render help text using Bootstrap 3 markup.
                    <p className="help-block">{help}</p>
                )}
                <FormFeedback form={formStore!} name={name} />
            </div>
        );
    }
}
