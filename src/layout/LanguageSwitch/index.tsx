import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';
import i18n from 'src/i18n';


const TRANSLATION_NAMES = {
    'en-US': 'English',
    'fi-FI': 'Suomi',
};

@observer
export default class LanguageSwitch extends React.Component<any> {
    setLanguage(event) {
        globalState.setUserLanguage(event.target.value);
    }

    get options() {
        return Object.keys(i18n).map(value => (
            { value, label: TRANSLATION_NAMES[value] }
        ));
    }

    get current() {
        return globalState.languageCode;
    }

    render() {
        const { current, options } = this;
        return (
            <select
                className="form-control"
                value={current}
                onChange={this.setLanguage}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    }
}
