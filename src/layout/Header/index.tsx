import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { L } from 'src/common';
import UserMenu from '../UserMenu';
import LanguageSwitch from '../LanguageSwitch';
import NavLink from './NavLink';


@observer
export default class Header extends React.Component {
    @observable isOpen = false;

    @action.bound
    toggleOpen() {
        this.isOpen = !this.isOpen;
    }

    render() {
        return (
            <nav className="navbar navbar-inverse">
                <div className="navbar-header">
                    <button
                        type="button"
                        onClick={this.toggleOpen}
                        className={classNames(
                            'navbar-toggle',
                            { collapsed: !this.isOpen },
                        )}
                    >
                        <span className="fa fa-bars" />
                    </button>
                    <Link to="/" className="navbar-brand">
                        Kompomaatti
                    </Link>
                </div>
                <div
                    className={classNames(
                        'collapse navbar-collapse',
                        { in: this.isOpen },
                    )}
                >
                    <ul className="nav navbar-nav">
                        <NavLink to="/events" exact>
                            <L text="nav.events" />
                        </NavLink>
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <UserMenu />
                    </ul>
                    <div className="navbar-form navbar-right">
                        <div className="form-group">
                            <LanguageSwitch />
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
