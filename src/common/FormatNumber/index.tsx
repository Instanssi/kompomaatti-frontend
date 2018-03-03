import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';


@observer
export default class FormatNumber extends React.Component<{
    value: number | null | undefined,
    fallback?: string | JSX.Element;
    options?: Intl.NumberFormatOptions,
    precision: number,
}> {
    render() {
        const { value, fallback, options, precision } = this.props;
        if (typeof value !== 'number') {
            return fallback || '-';
        }
        return new Intl.NumberFormat(globalState.momentLocale, {
            maximumFractionDigits: precision,
            minimumFractionDigits: precision,
            ...options,
        }).format(value);
    }
}
