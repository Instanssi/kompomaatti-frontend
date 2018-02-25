import React from 'react';
import { observer } from 'mobx-react';

import { L } from 'src/common';


@observer
export default class Footer extends React.Component<any> {
    scrollUp(event) {
        event.preventDefault();
        window.scroll(0, 0);
    }

    render() {
        return (
            <footer className="p-3 flex-row-even">
                <span><L text="footer.copyright" /></span>
                {' '}
                <a href="#" onClick={this.scrollUp}>
                    <L text="footer.toTop" />
                </a>
            </footer>
        );
    }
}
