import Vue from 'vue';

import template from './frontpage.html';
import globalState from 'src/state';


const FrontpageView = Vue.extend({
    template,
    data: () => ({
        globalState,
    }),
    computed: {
        currentUser() {
            return globalState.user;
        }
    }
});

export default [
    { path: '/', component: FrontpageView },
];
