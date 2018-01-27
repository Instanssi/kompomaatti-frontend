import Vue from 'vue';

import globalState from 'src/state';
import template from './user-menu.html';


export default Vue.extend({
    template,
    data: () => ({
        globalState,
    }),
    computed: {
        user() {
            return globalState.user;
        },
        hasUser() {
            return !!this.user;
        }
    }
});
