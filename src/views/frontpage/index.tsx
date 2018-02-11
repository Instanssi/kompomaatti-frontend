import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';


const { translate } = globalState;

@observer
export default class FrontPageView extends React.Component<any> {
    get currentUser() {
        return globalState.user;
    }

    get viewTitle() {
        return { key: 'dashboard.viewTitle' };
    }

    render() {
        return (
            <div className="frontpage-view">
                <h1>Kompomaatti</h1>
                <p>
                    {translate('dashboard.welcome')}
                </p>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="highlight-box">
                            <h3 className="box-header">
                                {translate('dashboard.events.title')}
                            </h3>
                            <div className="box-body">
                                <p>{translate('dashboard.events.empty')}</p>
                            </div>
                            <div className="box-footer">
                                {/*
                                    <button>{translate('dashboard.events.action')}</button> -->
                                */}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="highlight-box">
                            <h3 className="box-header">
                                {translate('dashboard.programme.title')}
                            </h3>
                            <div className="box-body">
                                <p>{translate('dashboard.programme.empty')}</p>
                            </div>
                            <div className="box-footer">
                                {/*<button>
                                    {translate('dashboard.programme.action')}
                                </button>*/}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="highlight-box">
                            <h3 className="box-header">
                                {translate('dashboard.compos.title')}
                            </h3>
                            <div className="box-body">
                                <p>{translate('dashboard.compos.empty')}</p>
                            </div>
                            <div className="box-footer">
                                {/*<button>
                                    {translate('dashboard.compos.action')}
                                </button>*/}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="highlight-box">
                            <h3 className="box-header">
                                {translate('dashboard.competitions.title')}
                            </h3>
                            <div className="box-body">
                                <p>{translate('dashboard.competitions.empty')}</p>
                            </div>
                            <div className="box-footer">
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
