import React from 'react';
import { observer } from 'mobx-react';
import globalState from 'src/state';
import L from '../L';

import './messages.scss';

@observer
export class Messages extends React.Component {
    get messages() {
        return globalState.messages;
    }

    render() {
        const { messages } = this;
        return (
            <ul className="messages">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message alert alert-${msg.type || 'info'}`}
                    >
                        <L text={msg.text} values={msg.values} />
                    </div>
                ))}
            </ul>
        );
    }
}
