import globalState from 'src/state';
import i18n from 'src/i18n';

/**
 * Emits a tra
 */
const Translate = {
    props: {
        name: {
            type: String,
            required: true,
        },
        values: Object,
    },
    data: () => ({
        globalState,
    }),
    computed: {
        tl() {
            // TODO: Can we run this through some sort of I18N template library
            // to handle pluralization and so on?
            return this.globalState.translate(this.name, this.values);
        }
    },
    // TODO: Can we just output a text node?
    template: '<span>{{ tl }}</span>',
};

const LanguageSwitch = {
    data: () => ({
        globalState,
    }),
    methods: {
        setLanguage(event) {
            globalState.setUserLanguage(event.target.value);
        }
    },
    computed: {
        options: () => Object.keys(i18n),
        current: () => globalState.languageCode,
    },
    template: '<select :value="current" @change="setLanguage"><option v-for="option in options" :value="option">{{option}}</option></select>',
}

// TODO: Can we declare a custom Vue v-prop that localizes element props?

export default {
    'i-tl': Translate,
    'i-lang-switch': LanguageSwitch,
};
