import React from 'react';
import { observer, inject } from 'mobx-react';
import { action, computed } from 'mobx';
import classNames from 'classnames';
import _get from 'lodash/get';

import { FormStore } from 'src/stores';
import FormFeedback from '../FormFeedback';


export interface IFormGroupProps<T> {
    name: string;
    onChange?: (name: string, value: any) => void;
    label?: JSX.Element | string;
    help?: JSX.Element | string;

    /**
     * Set to use a custom input component.
     *
     * The class is used with props that would work with a plain <input />.
     */
    input?: React.ComponentClass<any> | string;
    /** Set to completely override the input field implementation. */
    children?: JSX.Element;

    form?: FormStore<T>;
}

/**
 * Markup for a form group.
 */
@inject('form')
@observer
export default class FormGroup<T> extends React.Component<IFormGroupProps<T>> {
    /** Get id for the form label and control. */
    get id() {
        return this.props.name;
    }

    @action.bound
    onChange(eventOrValue) {
        const { target } = eventOrValue;
        if (target) {
            // how about checkboxes? they have "checked" instead of "value" because DOM is silly
            // - do they belong in form groups anyway?
            return target.value;
        }
        return eventOrValue;
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
        const { form, name } = this.props;
        return _get(form!.value, name);
    }

    render() {
        const { id, className, props, value, onChange } = this;
        const { form, name, label, children, help, input } = props;

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
                        value,
                        onChange,
                        className: 'form-control',
                    })
                )}
                {help && (
                    // Render help text using Bootstrap 3 markup.
                    <p className="help-block">{help}</p>
                )}
                <FormFeedback form={form!} name={name} />
            </div>
        );
    }
}
