import 'regenerator-runtime/runtime';

import 'moment/locale/en-gb';
import 'moment/locale/fi';

import './index.scss';

import Vue from 'vue';

import { HistoryRouter } from 'vue-component-router';

// import globalState from 'src/state';
import Views from './views';
import {
    Header,
    Footer,
    // Breadcrumbs,
} from 'src/layout';

import Router from 'vue-router';
Router;

// Provide Webpack build id in the window env
(window as any).BUILD_ID = process.env.BUILD_ID;

(window as any)._app = new Vue({
    el: '#app',
    render(h) {
        return (
            <HistoryRouter>
                <div class="container">
                    <div id="top" class="app-wrap">
                        <Header />
                        <main class="p-3">
                            {/*<Breadcrumbs />*/}
                            <Views />
                        </main>
                        <Footer />
                    </div>
                </div>
            </HistoryRouter>
        );
    },
});
