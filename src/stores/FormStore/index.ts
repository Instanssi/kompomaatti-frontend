import { action, observable, toJS } from 'mobx';


export default class FormStore<T extends {}> {
    @observable value: T;
    @observable.ref error: any | null;

    constructor(value: T) {
        this.value = value;
    }

    @action
    onChange(name, value) {
        if (this.value[name] === undefined) {
            throw new Error('Attempted to add new value to a form?');
        }
        console.info('onChange', name, value);
        this.value[name] = value;
    }

    @action
    setError(error) {
        console.info('setError:', error);
        this.error = error;
    }

    /**
     * Return a copy of the value as a JSON string.
     *
     * Don't expect this to work if the data isn't compatible with plain JSON.
     */
    toJSON() {
        return JSON.stringify(this.value);
    }

    /**
     * Return a copy of the value as a plain JS object.
     */
    toJS() {
        return toJS(this.value);
    }
}
