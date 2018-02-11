import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';


export interface IFormGroupProps {
    name: string;
    value: any;
    onChange: (name: string, value: any) => void;
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
            // how about checkboxes? they have "checked" instead of "value" because DOM
            // - do they belong in form groups anyway?
            return target.value;
        }
        return eventOrValue;
    }

    render() {
        const { label, children, value } = this.props;
        const { id } = this;
        return (
            <div className="form-group">
                {label && (
                    <label className="control-label" htmlFor={id}>
                        { label }
                    </label>
                )}
                { children || <input id={id} value={value} onChange={this.onChange} /> }
            </div>
        );
    }
}
