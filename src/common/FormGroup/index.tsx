import React from 'react';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import classNames from 'classnames';
import _get from 'lodash/get';

import FormState from 'src/state/form';


export interface IFormGroupProps {
    name: string;
    form: FormState;
    onChange?: (name: string, value: any) => void;
    label?: JSX.Element | string;
    children?: JSX.Element;
}

/**
 * Markup for a form group.
 */
@observer
export default class FormGroup extends React.Component<IFormGroupProps> {
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
        return _get(form.value, name);
    }

    render() {
        const { label, children } = this.props;
        const { id, className } = this;

        return (
            <div className={className}>
                {label && (
                    <label className="control-label" htmlFor={id}>
                        { label }
                    </label>
                )}
                { children || <input id={id} value={this.value} onChange={this.onChange} /> }
            </div>
        );
    }
}
