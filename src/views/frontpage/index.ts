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
        },
        viewTitle() {
            return { key: 'dashboard.viewTitle' };
        }
    }
});

export default [
    {
        path: '/',
        component: FrontpageView,
        name: 'frontpageView',
    },
];
