import { Atom, runInAction } from 'mobx';

import { IRemote } from 'src/stores';


/**
 * Like a RemoteStore, but only fetches its value once something looks at it.
 *
 * Can be used to declare some remote data without actually fetching it immediately.
 */
export default class LazyStore<T, E = any> implements IRemote<T, E> {
    protected _value: T | null;
    protected _error: E | null;
    protected _isPending = false;
    protected _lastRefresh: Date | null = null;
    protected _observed = 0;

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
        this.handleAccess();
        return this._value;
    }

    get error() {
        this.handleAccess();
        return this._error;
    }

    get isPending() {
        this.handleAccess();
        return this._isPending;
    }

    get lastRefresh() {
        this.handleAccess();
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

    protected handleAccess() {
        if (this.atom.reportObserved()) {
            return;
        } else {
            // Called from outside an observer/reaction; cycle anyway just this once.
            this.onObserved();
        }
    }

    protected maybeRefresh() {
        const { _lastRefresh, _isPending } = this;
        if (!_isPending && _lastRefresh === null) {
            // console.info('Starting refresh due to observation.', this);
            this.refresh();
        }
    }

    protected onObserved() {
        this._observed++;
        this.maybeRefresh();
    }

    protected onUnobserved() {
        // TODO: Use something smarter than promises so we can cancel fetches?
        // console.info('AtomStore unobserved.');
        this._observed--;
    }
}
