import 'regenerator-runtime/runtime';

import 'moment/locale/en-gb';
import 'moment/locale/fi';

import './index.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import template from './index.html';

import routes from './views';
import globalState from 'src/state';
import i18nComponents from 'src/common/i18n';
import layoutComponents from 'src/layout';
import listComponents from 'src/common/list';


(window as any).BUILD_ID = process.env.BUILD_ID;

const router = new VueRouter({ routes });
Vue.use(VueRouter);

// Just register the translations component globally to save effort.
Vue.component('i-tl', i18nComponents['i-tl']);

// Same for the translation filter.
Vue.filter('translate', (key, values) => {
    return globalState.translate(key, values);
});

Object.keys(listComponents).forEach(key => {
    Vue.component(key, listComponents[key]);
});

(window as any)._app = new Vue({
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
