import 'regenerator-runtime/runtime';
import './index.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import template from './index.html';

import routes from './views';
import globalState from 'src/state';
import i18nComponents from 'src/common/i18n';
import layoutComponents from 'src/layout';

console.info('Starting app with routes:', routes);

const router = new VueRouter({ routes });
Vue.use(VueRouter);

// Just register the translations component globally to save effort.
Vue.component('i-tl', i18nComponents['i-tl']);

// Same for the translation filter.
Vue.filter('translate', function(value) {
    return globalState.translate(value);
});

/* eslint-disable no-unused-vars */
const app = new Vue({
    el: '#app',
    router,
    components: {
        ...i18nComponents,
        ...layoutComponents,
    },
    data: {
        globalState,
    },
    template,
});
