import React from 'react';
import { observer } from 'mobx-react';

import { FormStore } from 'src/stores';
import { computed } from 'mobx';


@observer
export default class FormFeedback<T = any> extends React.Component<{
    /**
     * Set to show feedback related to a specific field.
     *
     * Shows global feedback by default.
     */
    name?: string;
    /** Form state to read from. */
    form: FormStore<T>;
}> {

    @computed
    get errors() {
        const { name, form } = this.props;
        const { error } = form;
        if (!error) {
            return null;
        }
        // Any error is expected to be a map of field names to arrays of problems.
        return error[name!] as (string[] | null);
    }

    render() {
        const { errors } = this;
        if (!errors) {
            return null;
        }
        return (
            <div className="alert alert-danger">
                {errors.map(err => (
                    <p>{err}</p>
                ))}
            </div>
        );
    }
}
