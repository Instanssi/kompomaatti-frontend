import _get from 'lodash/get';
import InstanssiREST from '../api';
import i18n from '../i18n';


// TODO: Add config file for this. Currently proxied through webpack dev server.
const api = new InstanssiREST('/api');
window._api = api;

/**
 * @typedef {object} LoginRequest
 * @prop {string} username - User name
 * @prop {string} password - Password
*/

const anon = {
    language: 'en',
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
        this._useLanguage(this.languageCode);
    }

    get momentLocale() {
        // TODO: Are lang codes always the same as moment locales?
        return this.user.language;
    }

    get languageCode() {
        return this.user.language;
    }

    /**
     * This should be the only place where we access the translations.
     */
    translate(name, values) {
        // TODO: Implement values (translation args), pluralisation, etc.
        return _get(this.translation, name, name);
    }

    /**
     * Try to log in.
     * @param {LoginRequest} request
     */
    async login(request) {
        return this._setUser(await api.session.login(request));
    }

    async logout() {
        try {
            await api.session.logout();
            this._setUser(Object.assign({}, anon));
        } catch(e) {
            // bleh
            console.warn('logout failed:', e);
            throw e;
        }

    }

    /**
     * Check for existing session, assign user, fetch translations before continuing.
     */
    async continueSession() {
        return this._setUser(await api.session.continue());
    }

    /**
     * Update the current user's language. May take a moment if the user is not anon.
     * @param {string} languageCode
     */
    async setUserLanguage(languageCode) {
        // FIXME: Update user remote profile if non-anon (= has id)
        // console.debug('setting user language to:', languageCode);
        this.user.language = languageCode;
        return this._useLanguage(this.user.language);
    }

    /**
     * Assign a new session user and fetch appropriate language files.
     * @param {Object} user - User profile.
     * @returns {Promise.<Object>} - Same user profile, after loading language files.
     */
    async _setUser(user) {
        this.user = user;
        await this._useLanguage(user.language);
        return user;
    }

    async _useLanguage(code) {
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
        }
    }
}

export default new GlobalState();
