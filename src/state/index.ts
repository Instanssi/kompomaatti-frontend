import _get from 'lodash/get';
import _template from 'lodash/template';
import _orderBy from 'lodash/orderBy';
import { runInAction, computed, reaction, action } from 'mobx';
import { observable } from 'mobx';

import config from 'src/config';
import i18n from '../i18n';
import InstanssiREST from '../api';
import { LazyStore } from 'src/stores';
import EventInfo from './EventInfo';


const api = new InstanssiREST(config.API_URL);

export interface INotificationMessage {
    id: number;
    text: string;
    type?: string;
}

/**
 * Application-wide state.
 */
class GlobalState {
    userStore = new LazyStore(() => api.currentUser.get());

    /** Current user, if known. Don't even try to mutate. */
    get user() {
        return this.userStore.value;
    }
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
    /** Messages the user should probably see. */
    @observable.shallow messages: INotificationMessage[] = [];
    nextMessageId = 0;

    /** Several things could use a list of party events, so it's available here. */
    events = new LazyStore(async () => {
        const events = await api.events.list();
        const sorted = _orderBy(events, event => event.date, 'desc');
        return sorted.map(eventObject => new EventInfo(this.api, eventObject));
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

        this.loadPersistentState();
        // Should be only one global state, so it's ok if we don't have a way to drop this.
        reaction(
            () => this.persistentState,
            (state) => {
                this.savePersistentState(state);
            },
        );
        this.setLanguage(this.languageCode);
        this.continueSession();
    }

    get persistentState() {
        return {
            language: this.language,
        };
    }

    savePersistentState(state) {
        try {
            localStorage.setItem('kompomaatti', JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save state: ' + error);
        }
    }

    loadPersistentState() {
        try {
            const stored = localStorage.getItem('kompomaatti');
            if (stored) {
                const state = JSON.parse(stored);
                this.language = state.language || config.DEFAULT_LOCALE;
            }
        } catch (error) {
            console.warn('Failed to load state: ' + error);
        }
    }

    /**
     * Most relevant-looking event of the current events list.
     */
    @computed
    get currentEvent() {
        const events = this.events.value;
        if (!events) {
            return null;
        }
        // The events are in descending order by date.
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
        return this.userStore.refresh();
    }

    /**
     * Clear the current user's info and maybe notify them about this.
     */
    sessionExpired() {
        if (this.user) {
            this.userStore.clear();
            this.postMessage('danger', 'session.expired');
        }
    }

    @action
    postMessage(type: string, text: string) {
        this.messages.push({
            id: this.nextMessageId++,
            type,
            text,
        });
        setTimeout(action(() => {
            this.messages.splice(0, 1);
        }), 10000);
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
}

const globalState = new GlobalState();
export default globalState;

if (process.env.NODE_ENV === 'development') {
    // sneaky devmode trick
    (window as any)._globalState = globalState;
}
