import Vue from 'vue';
import Vuex from 'vuex';
import _get from 'lodash/get';
import _template from 'lodash/template';
import moment from 'moment';

import i18n from 'src/i18n';
import { IUser } from 'src/api/interfaces';

Vue.use(Vuex);

const languageModule = {
    namespaced: true,
    state: {
        /** Current language code. */
        code: null as string | null,
        /** Current translation "dictionary". */
        dict: null as any,
        pending: 0,
    },
    getters: {
        /** Translate some text. Should be the only place where this is done. */
        translate: (state) => (key: string, values?: any) => {
            const { dict } = state;
            if (dict === null) {
                return key;
            }
            const text = _get(dict, key, key);
            console.info('translate', key, text);
            // TODO: Spec pluralisation, etc.
            if (values) {
                return _template(text)(values);
            }
            return text;
        },
        formatNumber: (state) => (value: number, options?: Intl.NumberFormatOptions) => {
            if (!state.code) {
                return '' + value;
            }
            const formatter = new Intl.NumberFormat(state.code, options);
            return formatter.format(value);
        },
        formatDate: (state) => (value: Date, momentFormat: string) => {
            return moment(value).format(momentFormat);
        },
        isPending(state) {
            return state.pending !== 0;
        },
    },
    mutations: {
        incPending(state) {
            state.pending++;
        },
        decPending(state) {
            state.pending--;
        },
        setLanguageCode(state, languageCode: string) {
            state.code = languageCode;
        },
        setTranslation(state, translation) {
            state.dict = translation;
        },
    },
    actions: {
        /**
         * Change the application language. May require loading a new language file.
         * @param languageCode Supported language code, e.g. 'fi-FI'.
         */
        async changeLanguage(context, languageCode: string) {
            const getTranslation = i18n[languageCode];

            if (getTranslation) {
                context.commit('incPending');
                context.commit('setLanguageCode', languageCode);
                try {
                    context.commit('setTranslation', await getTranslation());
                } catch(error) {
                    // tslint:disable-next-line no-console
                    console.warn('loading translation failed:', error);
                }
                context.commit('decPending');
            } else {
                throw new Error('Unknown language: ' + JSON.stringify(languageCode));
            }
        }
    }
};

const store = new Vuex.Store({
    // https://vuex.vuejs.org/en/strict.html
    strict: process.env.NODE_ENV !== 'production',
    state: {
        user: null as IUser | null,
    },
    mutations: {
        setUser(state, { user }: { user: IUser | null }) {
            state.user = user;
        }
    },
    modules: {
        language: languageModule,
    },
});

store.dispatch('language/changeLanguage', 'fi-FI');

export default store;
