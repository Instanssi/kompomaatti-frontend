import globalState from 'src/state';
import i18n from 'src/i18n';

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
    template: '<select class="form-control" :value="current" @change="setLanguage"><option v-for="option in options" :value="option">{{option}}</option></select>',
};

export default {
    'i-lang-switch': LanguageSwitch,
};
