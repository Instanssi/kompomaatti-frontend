import 'regenerator-runtime/runtime';

import 'moment/locale/en-gb';
import 'moment/locale/fi';

import './index.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import template from './index.html';

import routes from './views';
import globalState from 'src/state';
import layoutComponents from 'src/layout';
import listComponents from 'src/common/list';


(window as any).BUILD_ID = process.env.BUILD_ID;

const router = new VueRouter({ routes });
Vue.use(VueRouter);

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
        ...layoutComponents,
    },
    data: {
        globalState,
    },
    template,
});
