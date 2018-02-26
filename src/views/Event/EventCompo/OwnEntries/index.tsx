import React from 'react';
import { observer } from 'mobx-react';


@observer
export default class OwnEntries extends React.Component<{

}> {
    render() {
        return 'own compo entries';
    }
}
