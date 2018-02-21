import _get from 'lodash/get';
import _template from 'lodash/template';
import _orderBy from 'lodash/orderBy';
import { runInAction, computed } from 'mobx';
import { observable } from 'mobx';

import config from 'src/config';
import i18n from '../i18n';
import InstanssiREST from '../api';
import { IUser } from 'src/api/interfaces';
import { LazyStore } from 'src/stores';
import EventHelper from './EventHelper';


const api = new InstanssiREST(config.API_URL);

/**
 * Application-wide state.
 */
class GlobalState {
    /** Current user, if known. Don't even try to mutate. */
    @observable.ref user: IUser | null = null;
    /**
     * Current language code (ISO 639 style).
     * @todo Save language in local storage for now.
     */
    @observable.ref language = config.DEFAULT_LOCALE;
    /** Current translation object. Translating text looks for keys in this. */
    @observable.ref translation: any = { };
    /** Current time in milliseconds, updating once per second. */
    @observable.ref timeSec = new Date().valueOf();
    /** Current time in milliseconds, updating once per minute. */
    @observable.ref timeMin = new Date().valueOf();

    /** Several things could use a list of party events, so it's available here. */
    events = new LazyStore(async () => {
        const events = await api.events.list();
        const sorted = _orderBy(events, event => event.date, 'desc');
        return sorted.map(eventObject => new EventHelper(this.api, eventObject));
    });

    /** The site API made available here for convenience. */
    api = api;

    constructor() {
        // FIXME: Try to persist the state and bring it back on reload?
        setInterval(() => {
            this.timeSec = new Date().valueOf();
        }, 1000);
        setInterval(() => {
            this.timeMin = new Date().valueOf();
        }, 60000);
        this.setLanguage(this.languageCode);
        this.continueSession();
    }

    /**
     * Find the most relevant event, for the dashboard and other things.
     */
    @computed
    get currentEvent() {
        const events = this.events.value;
        if (!events) {
            return null;
        }
        // The events are in descending order by date, so this should be the most recent.
        return events[0];
    }

    get momentLocale() {
        // TODO: Are language codes always the same as moment locales?
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
    translate = (name: string, values?: {[key: string]: string}) => {
        const text = _get(this.translation, name, name) as string;
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
     * Change the UI language. May require fetching a new translation file.
     * @param languageCode Language code like 'fi-FI'.
     * @returns Promise that resolves when the language switch finishes.
     */
    setLanguage(code: string) {
        const lang = i18n[code];

        if (!lang) {
            throw new Error('No translation found: ' + code);
        }

        return lang.fetch().then(
            (translation) => runInAction(() => {
                this.language = code;
                this.translation = translation;
            }),
            (error) => {
                console.warn('Unable to load translation:', code, error);
                throw error;
            },
        );
    }

    /**
     * Assign a new session user.
     * @param user User profile.
     */
    private async setUser(user: IUser) {
        this.user = user;
        // TODO: If the user profiles ever get language info, call setLanguage here.
        return user;
    }
}

const globalState = new GlobalState();
export default globalState;

if (process.env.NODE_ENV === 'development') {
    // sneaky devmode trick
    (window as any)._globalState = globalState;
}
