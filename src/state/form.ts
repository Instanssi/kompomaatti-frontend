
/** The status of anything involving remote interaction. */
interface IRemote<T, E = any> {
    value: T | null;
    error: E | null;
    isPending: boolean;
}

export default class FormState<T = any, E = any> implements IRemote<T, E> {
    value: T;
    error: E | null = null;
    isPending = false;

    constructor() {

    }
}
