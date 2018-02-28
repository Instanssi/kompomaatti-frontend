import 'regenerator-runtime/runtime';

import 'moment/locale/en-gb';
import 'moment/locale/fi';

import moment from 'moment';

import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';

// import globalState from 'src/state';
import Views from './views';
import {
    Header,
    Footer,
    // Breadcrumbs,
} from 'src/layout';

// Make the Finnish locale less confusing (is 15.10 a date or a time of day?)
moment.updateLocale('fi', {
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
    } as any,
});

// Provide Webpack build id in the window env
(window as any).BUILD_ID = process.env.BUILD_ID;


export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter basename="/kompomaatti">
                <div className="container">
                    <div id="top" className="app-wrap">
                        <Header />
                        <main className="p-3">
                            {/*<Breadcrumbs />*/}
                            <Views />
                        </main>
                        <Footer />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
