import globalState from 'src/state';
import formComponents from 'src/common/form';
import template from './login.html';


const LoginView = {
    template,
    components: {
        ...formComponents
    },
    data: () => ({
        request: {
            username: '',
            password: '',
        },
        errors: [],
        isPending: false,
    }),
    computed: {
        valid() {
            const nonEmpty = str => str && str.length;
            const { username, password } = this.request;
            return nonEmpty(username) && nonEmpty(password);
        }
    },
    methods: {
        async submit() {
            // This gives a Vue observable but it transforms into JSON just fine.
            const { username, password } = this.request;
            this.isPending = true;
            try {
                // this.request.password = '';
                await globalState.login({ username, password });
                // TODO: Redirect at this point?
            } catch(e) {
                // FIXME: Figure out how and where to handle form errors
                this.errors.splice(0, this.errors.length, e);
            }
            this.isPending = false;
        }
    }
};

export default [
    { path: '/login', component: LoginView },
];
