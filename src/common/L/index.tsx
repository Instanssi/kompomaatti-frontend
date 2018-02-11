import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';


export interface ILProps {
    text: string;
    values?: any;
}

@observer
export default class L extends React.Component<ILProps> {
    render() {
        const { text, values } = this.props;
        // This accesses observable state, so the component ends up observing it.
        return globalState.translate(text, values);
    }
}
