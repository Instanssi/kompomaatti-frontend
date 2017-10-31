import _get from 'lodash/get';
import InstanssiREST from '../api';
import i18n from '../i18n';

import config from 'src/config';

const { DEFAULT_LOCALE } = config;
const api = new InstanssiREST(config.API_URL);

if(process.env.NODE_ENV === 'development') {
    window._api = api;
}

/**
 * @typedef {object} LoginRequest
 * @prop {string} username - User name
 * @prop {string} password - Password
*/

const anon = {
    language: DEFAULT_LOCALE,
};

class GlobalState {
    // This should be replaced with the content of src/i18n/(en|fi).json as needed.
    translation = {
    };
    // Anon user by default.
    // Because we don't and can't assign all possible fields here,
    // do not mutate this object; just replace it completely if the user changes.
    // Anything that wants to observe this change should inject whole globalState.
    user = Object.assign({}, anon);

    currentTime = new Date().valueOf();

    /** @type {InstanssiREST} */
    api = api;

    isLoading = true;

    constructor() {
        // FIXME: Try to persist the state and bring it back on reload?
        setInterval(() => {
            this.currentTime = new Date().valueOf();
        }, 500);
        this._findLanguage(this.languageCode);
        this.continueSession();
    }

    get momentLocale() {
        // TODO: Are lang codes always the same as moment locales?
        return this.user.language || DEFAULT_LOCALE;
    }

    get languageCode() {
        return this.user.language || DEFAULT_LOCALE;
    }

    /**
     * This should be the only place where we access the translations.
     */
    translate(name, values) {
        // TODO: Implement values (translation args), pluralisation, etc.
        return _get(this.translation, name, name);
    }

    /**
     * Check for existing session, assign user, fetch translations before continuing.
     */
    async continueSession() {
        return this._setUser(await api.currentUser.get());
    }

    /**
     * Update the current user's language. May take a moment if the user is not anon.
     * @param {string} languageCode
     */
    async setUserLanguage(languageCode) {
        // FIXME: Update user remote profile if non-anon (= has id)
        // console.debug('setting user language to:', languageCode);
        this.user.language = this._findLanguage(languageCode);
        return ;
    }

    /**
     * Assign a new session user and fetch appropriate language files.
     * @param {Object} user - User profile.
     * @returns {Promise.<Object>} - Same user profile, after loading language files.
     */
    async _setUser(user) {
        this.user = user;
        user.language = await this._findLanguage(user.language);
        return user;
    }

    /**
     * Try to switch the current language.
     * Returns whatever code matched closely enough (e.g. 'en' may map to 'en-GB').
     */
    async _findLanguage(code) {
        const getTranslation = i18n[code];
        if(getTranslation) {
            try {
                this.translation = await getTranslation();
                // console.debug('set translation to:', this.translation);
            } catch(e) {
                console.warn('Unable to load translation:', e);
            }
        } else {
            console.warn('No translation:', code);
            return DEFAULT_LOCALE;
        }
        return code;
    }
}

export default new GlobalState();
