import React from 'react';
import { observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';

import globalState from 'src/state';

import UserMenu from '../UserMenu';
import LanguageSwitch from '../LanguageSwitch';
import NavLink from './NavLink';


const { translate } = globalState;

@(withRouter as any)
@observer
export default class Header extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-inverse">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed">
                        (open)
                    </button>
                    <Link to="/" className="navbar-brand">
                        Kompomaatti 2.0
                    </Link>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        <NavLink to="/events">
                            {translate('nav.events')}
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
