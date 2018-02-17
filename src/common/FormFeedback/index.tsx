import React from 'react';
import { observer } from 'mobx-react';

import FormState from 'src/state/form';


interface IFormFeedbackProps {
    /** Set to show feedback related to a specific field. Shows global feedback by default. */
    name?: string;
    /** Form state to read from. */
    form: FormState;
}

@observer
export default class FormFeedback extends React.Component<IFormFeedbackProps> {
    render() {
        // Compute relevant errors from the form state
        return 'TODO: Form feedback';
    }
}