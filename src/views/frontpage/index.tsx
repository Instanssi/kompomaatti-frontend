import Vue from 'vue';
import Component from 'vue-class-component';

import globalState from 'src/state';


const { translate } = globalState;

@Component
export class FrontpageView extends Vue {
    get currentUser() {
        return globalState.user;
    }

    get viewTitle() {
        return { key: 'dashboard.viewTitle' };
    }

    render(h) {
        return (
            <div class="frontpage-view">
                <h1>Kompomaatti</h1>
                <p>
                    {translate('dashboard.welcome')}
                </p>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="highlight-box">
                            <h3 class="box-header">
                                {translate('dashboard.events.title')}
                            </h3>
                            <div class="box-body">
                                <p>{translate('dashboard.events.empty')}</p>
                            </div>
                            <div class="box-footer">
                                {/*
                                    <button>{translate('dashboard.events.action')}</button> -->
                                */}
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="highlight-box">
                            <h3 class="box-header">
                                {translate('dashboard.programme.title')}
                            </h3>
                            <div class="box-body">
                                <p>{translate('dashboard.programme.empty')}</p>
                            </div>
                            <div class="box-footer">
                                {/*<button>
                                    {translate('dashboard.programme.action')}
                                </button>*/}
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="highlight-box">
                            <h3 class="box-header">
                                {translate('dashboard.compos.title')}
                            </h3>
                            <div class="box-body">
                                <p>{translate('dashboard.compos.empty')}</p>
                            </div>
                            <div class="box-footer">
                                {/*<button>
                                    {translate('dashboard.compos.action')}
                                </button>*/}
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="highlight-box">
                            <h3 class="box-header">
                                {translate('dashboard.competitions.title')}
                            </h3>
                            <div class="box-body">
                                <p>{translate('dashboard.competitions.empty')}</p>
                            </div>
                            <div class="box-footer">
                                {/*<button>
                                {translate('dashboard.competitions.action')}
                                </button>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default [
    {
        path: '/',
        component: FrontpageView,
        name: 'frontpageView',
    },
];
