import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';


const { translate } = globalState;

@observer
export default class NoResults extends React.Component<any> {
    render() {
        return (
            <span>
                <span className="fa fa-exclamation-triangle" />
                {' '}
                {translate('list.noResults')}
            </span>
        );
    }
}
