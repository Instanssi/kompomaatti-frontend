import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';
import { L } from 'src/common';


@observer
export default class FrontPageView extends React.Component<any> {
    componentWillMount() {
        globalState.events.refresh();
    }

    get currentEvent() {
        return globalState.currentEvent;
    }

    get currentUser() {
        return globalState.user;
    }

    render() {
        const currentEvent = globalState.currentEvent;

        return (
            <div className="frontpage-view">
                <h1>Kompomaatti</h1>
                <p>
                    <L text="dashboard.welcome" />
                </p>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="highlight-box">
                            <h3 className="box-header">
                                <L text="dashboard.events.title" />
                            </h3>
                            <div className="box-body">
                                <p>
                                    {currentEvent ? (
                                        currentEvent.value.name
                                    ) : (
                                        <L text="dashboard.events.empty" />
                                    )}
                                </p>
                            </div>
                            <div className="box-footer">
                                {/*
                                    <button><L text="dashboard.events.action')}</butto" />-->
                                */}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="highlight-box">
                            <h3 className="box-header">
                                <L text="dashboard.programme.title" />
                            </h3>
                            <div className="box-body">
                                <p><L text="dashboard.programme.empty" /></p>
                            </div>
                            <div className="box-footer">
                                {/*<button>
                                    <L text="dashboard.programme.action" />
                                </button>*/}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="highlight-box">
                            <h3 className="box-header">
                                <L text="dashboard.compos.title" />
                            </h3>
                            <div className="box-body">
                                <p><L text="dashboard.compos.empty" /></p>
                            </div>
                            <div className="box-footer">
                                {/*<button>
                                    <L text="dashboard.compos.action" />
                                </button>*/}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="highlight-box">
                            <h3 className="box-header">
                                <L text="dashboard.competitions.title" />
                            </h3>
                            <div className="box-body">
                                <p><L text="dashboard.competitions.empty" /></p>
                            </div>
                            <div className="box-footer">
                                {/*<button>
                                <L text="dashboard.competitions.action" />
                                </button>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
