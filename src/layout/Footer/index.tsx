import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';


const { translate } = globalState;

@observer
export default class Footer extends React.Component<any> {
    scrollUp(event) {
        event.preventDefault();
        window.scroll(0, 0);
    }

    render() {
        return (
            <footer className="bg-brand p-3">
                <span>{translate('footer.copyright')}</span>
                {' '}
                <a href="#" onClick={this.scrollUp}>{translate('footer.toTop')}</a>
            </footer>
        );
    }
}
