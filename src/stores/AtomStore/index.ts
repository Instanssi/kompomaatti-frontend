import { Atom, runInAction } from 'mobx';

import { IRemote } from 'src/stores';


/**
 * Like a RemoteStore, but only fetches its vaue once something looks at it.
 *
 * Can be used to declare some remote data without actually fetching it immediately.
 */
export default class AtomStore<T, E = any> implements IRemote<T, E> {
    protected _value: T | null;
    protected _error: E | null;
    protected _isPending = false;
    protected _lastRefresh: Date | null = null;

    /**
     * Tracks observation.
     *
     * Call atom.reportObserved() when observable data is accessed,
     * and atom.reportChanged() then the data changes.
     */
    protected atom = new Atom(
        'AtomStore',
        () => this.onObserved(),
        () => this.onUnobserved(),
    );

    constructor(protected fetch: () => Promise<T>) { }

    get value() {
        this.atom.reportObserved();
        return this._value;
    }

    get error() {
        this.atom.reportObserved();
        return this._error;
    }

    get isPending() {
        this.atom.reportObserved();
        return this._isPending;
    }

    get lastRefresh() {
        this.atom.reportObserved();
        return this._lastRefresh;
    }

    refresh() {
        this._isPending = true;
        this.atom.reportChanged();
        return this.fetch().then(
            (result) => runInAction(() => {
                this._isPending = false;
                this._value = result;
                this._error = null;
                this._lastRefresh = new Date();
                this.atom.reportChanged();
                return result;
            }),
            (error) => runInAction(() => {
                this._isPending = false;
                this._error = error;
                this.atom.reportChanged();
                throw error;
            }),
        );
    }
    protected onObserved() {
        const { _lastRefresh, _isPending } = this;
        // We _could_ just write this check into the getters for this simple case,
        // but being able to count observers is nice for debugging.
        if (!_isPending && !_lastRefresh) {
            console.info('AtomStore starting refresh due to observation.');
            this.refresh();
        } else {
            console.info('AtomStore already refreshing.');
        }
    }

    protected onUnobserved() {
        // TODO: Use something smarter than promises so we can cancel fetches?
        console.info('AtomStore unobserved.');
    }
}
