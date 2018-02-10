import Vue from 'vue';
import Component from 'vue-class-component';

import globalState from 'src/state';
import i18n from 'src/i18n';


const TRANSLATION_NAMES = {
    'en-US': 'English',
    'fi-FI': 'Suomi',
};

@Component
export default class LanguageSwitch extends Vue {
    globalState = globalState;

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

    render(h) {
        const { current, options } = this;
        return (
            <select
                class="form-control"
                value={current}
                onChange={this.setLanguage}
            >
                {options.map(option => (
                    <option value={option.value}>{option.label}</option>
                ))}
            </select>
        );
    }
}
