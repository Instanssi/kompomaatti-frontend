import { action, observable } from 'mobx';


export default class FormStore<T extends {}> {
    @observable value: T;
    @observable.ref error: any | null;

    constructor(value: T) {
        this.value = value;
    }

    @action
    onChange(name, value) {
        this.value[name] = value;
    }

    @action
    setError(error) {
        this.error = error;
    }

    toJSON() {
        return JSON.stringify(this.value);
    }
}
