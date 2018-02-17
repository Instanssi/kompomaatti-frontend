import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { IRemote } from 'src/stores';

import './loading-wrapper.scss';


@observer
export default class LoadingWrapper extends React.Component<{
    store: IRemote<any>;
    children?: any;
    className?: string | null;
}> {
    render() {
        const { store, children, className } = this.props;

        return (
            <div
                className={classNames(
                    'loading-wrapper',
                    { 'is-pending': store.isPending },
                    className,
                )}
            >
                {children}
            </div>
        );
    }
}
