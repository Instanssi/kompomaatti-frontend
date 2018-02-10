import 'regenerator-runtime/runtime';

import 'moment/locale/en-gb';
import 'moment/locale/fi';

import './index.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './views';
import globalState from 'src/state';
import {
    Header,
    Footer,
    Breadcrumbs,
} from 'src/layout';


// Provide Webpack build id in the window env
(window as any).BUILD_ID = process.env.BUILD_ID;

const router = new VueRouter({ routes });
Vue.use(VueRouter);

Vue.filter('translate', (key, values) => {
    return globalState.translate(key, values);
});


(window as any)._app = new Vue({
    el: '#app',
    router,
    data: {
        // Can we just "provide" this?
        // https://medium.com/@znck/provide-inject-in-vue-2-2-b6473a7f7816
        globalState,
    },
    render(h) {
        return (
            <div class="container">
                <div id="top" class="app-wrap">
                    <Header />
                    <main class="p-3">
                        <Breadcrumbs />
                        <router-view />
                    </main>
                    <Footer />
                </div>
            </div>
        );
    },
});
