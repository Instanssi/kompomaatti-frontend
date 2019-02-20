// IE11 compatibility
import 'core-js/es6/promise';
import 'core-js/es6/number';
import 'core-js/es6/array';
import 'core-js/es6/object';
import 'whatwg-fetch';

import 'regenerator-runtime/runtime';

import 'moment/locale/en-gb';
import 'moment/locale/fi';

import moment from 'moment';

import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, RouteComponentProps, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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
        LLL: 'Do MMMM[ta] YYYY, [klo] HH:mm',
        LLLL : 'dddd, Do MMMM[ta] YYYY, [klo] HH:mm',
        lll : 'Do MMM YYYY, [klo] HH:mm',
        llll : 'ddd, Do MMM YYYY, [klo] HH:mm'
    } as any,
});

// Provide Webpack build id in the window env
(window as any).BUILD_ID = process.env.BUILD_ID;


export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter basename="/kompomaatti">
                <div className="container">
                    <Helmet
                        titleTemplate={'Kompomaatti - %s'}
                    >
                        <title>Kompomaatti</title>
                    </Helmet>
                    <div id="top" className="app-wrap">
                        <Header />
                        <main className="p-3">
                            {/*<Breadcrumbs />*/}
                            <Views />
                        </main>
                        <Footer />
                    </div>
                    <AutoScrollWR />
                </div>
            </BrowserRouter>
        );
    }
}

/**
 * Scroll to top when the current path changes.
 */
export class AutoScroll extends React.Component<RouteComponentProps<any>> {
    componentDidUpdate(prevProps: RouteComponentProps<any>) {
        const { props } = this;
        if (props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return null;
    }
}

const AutoScrollWR = withRouter(AutoScroll);

ReactDOM.render(<App />, document.getElementById('app'));
