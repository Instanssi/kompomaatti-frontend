import globalState from 'src/state';
import template from './user-menu.html';

export default {
    template,
    data: () => ({
        globalState,
    }),
    computed: {
        user() {
            return this.globalState.user;
        },
        hasUser() {
            return this.user.email;
        }
    }
};
