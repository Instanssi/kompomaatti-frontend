import Vue from 'vue';
import Component from 'vue-class-component';

import template from './frontpage.html';
import globalState from 'src/state';


@Component({
    template,
})
export class FrontpageView extends Vue {
    globalState = globalState;

    get currentUser() {
        return globalState.user;
    }

    get viewTitle() {
        return { key: 'dashboard.viewTitle' };
    }
}

export default [
    {
        path: '/',
        component: FrontpageView,
        name: 'frontpageView',
    },
];
