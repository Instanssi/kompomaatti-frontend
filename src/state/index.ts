import Vue from 'vue';
import Component from 'vue-class-component';
import _get from 'lodash/get';
import _template from 'lodash/template';
import bind from 'lodash-decorators/bind';

import InstanssiREST from '../api';
import i18n from '../i18n';

import config from 'src/config';
import { IUser } from 'src/api/models';


const { DEFAULT_LOCALE } = config;
const api = new InstanssiREST(config.API_URL);

if (process.env.NODE_ENV === 'development') {
    (window as any)._api = api;
}








// FIXME: Save language in localstorage for now






/**
 * Application-wide state.
 *
 * Declared as a Vue component to get some global observable state without extra hassle.
 *
 * VueX could do the job here, but it's pretty obviously stuck in the pre-ES6
 * days and doesn't play nice with TypeScript either.
 */
@Component
class GlobalState extends Vue {
    /** Current user, if known. */
    user: IUser | null = null;

    /** Current language. */
    language = 'en-US';

    /** Current translation object. */
    translation: any = { };

    currentTime = new Date().valueOf();

    api = api;

    isLoading = true;

    constructor() {
        super();
        // FIXME: Try to persist the state and bring it back on reload?
        setInterval(() => {
            this.currentTime = new Date().valueOf();
        }, 500);
        this.findLanguage(this.languageCode);
        this.continueSession();
    }

    get momentLocale() {
        // TODO: Are lang codes always the same as moment locales?
        return this.language;
    }

    get languageCode() {
        return this.language;
    }

    /**
     * The one and only way to get translated text.
     * @param name Translation name, e.g. 'user.firstName'
     * @param values Optional arguments for translation (spec pending)
     * @returns Translated text string
     */
    @bind()
    translate(name: string, values?: {[key: string]: string}): string {
        const text = _get(this.translation, name, name);
        // TODO: Spec pluralisation, etc.
        if (values) {
            return _template(text)(values);
        }
        return text;
    }

    /**
     * Check for existing session, assign user, fetch translations before continuing.
     * @returns User profile after session check
     */
    async continueSession() {
        return this.setUser(await api.currentUser.get());
    }

    /**
     * Update the current user's language. May take a moment if the user is not anon.
     * @param languageCode
     */
    async setUserLanguage(languageCode: string) {
        // FIXME: Update user remote profile if non-anon (= has id)
        // console.debug('setting user language to:', languageCode);
        this.language = await this.findLanguage(languageCode);
        return;
    }

    /**
     * Assign a new session user.
     * @param user User profile.
     * @returns {Promise.<Object>} - Same user profile, after loading language files.
     */
    private async setUser(user: IUser) {
        console.info('setUser:', user);
        this.user = user;
        return user;
    }

    /**
     * Try to find a matching language and switch to it.
     * Returns whatever lang key matched closely enough (e.g. 'en' may map to 'en-GB').
     */
    private async findLanguage(code: string): Promise<string> {
        const getTranslation = i18n[code];
        if (getTranslation) {
            try {
                this.translation = await getTranslation();
                // console.debug('set translation to:', this.translation);
            } catch (e) {
                console.warn('Unable to load translation:', e);
            }
        } else {
            console.warn('No translation:', code);
            return DEFAULT_LOCALE;
        }
        return code;
    }
}

(window as any)._globalState = new GlobalState();

export default new GlobalState();
