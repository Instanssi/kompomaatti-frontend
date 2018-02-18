import React from 'react';
import { observer } from 'mobx-react';

import { FormStore } from 'src/stores';


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
    render() {
        // Compute relevant errors from the form state
        return 'TODO: Form feedback';
    }
}
