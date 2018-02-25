import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import { ICompo, ICompoEntry } from 'src/api/interfaces';
import { L } from 'src/common';


interface IEntriesProps {
    compo: ICompo;
    isEditable: boolean;
}

@observer
export default class UserCompoEntries extends React.Component<IEntriesProps> {
    // TODO: Should this just be a view of the user's past entries list?
    @observable.ref entries: ICompoEntry[] | null = null;

    render() {
        const { isEditable } = this.props;
        const { entries } = this;

        return (
            <div className="user-compo-entries">
                <h4><L text="compo.myEntries" /></h4>
                <ul>
                    { entries && entries.map(entry => (
                        <li key={entry.id}>
                            <span>{ entry.name }</span>
                            {' '}
                            { isEditable && (
                                <a><L text="compo.editEntry" /></a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
