import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';


const { translate } = globalState;

@observer
export default class UserProfile extends React.Component<any> {
    render() {
        return (
            <div className="user-profile-view">
                <h1>{translate('user.profile')}</h1>
            </div>
        );
    }
}
