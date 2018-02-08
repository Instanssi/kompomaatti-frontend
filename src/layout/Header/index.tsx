import Vue from 'vue';
import Component from 'vue-class-component';

import globalState from 'src/state';

import UserMenu from '../UserMenu';
import LanguageSwitch from 'src/common/i18n/LanguageSwitch';


const { translate } = globalState;

@Component
export default class Header extends Vue {
    render(h) {
        return (
            <nav class="navbar navbar-inverse">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed">
                        (open)
                    </button>
                    <router-link to="/" class="navbar-brand">
                        Kompomaatti 2.0
                    </router-link>
                </div>
                <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                        <router-link tag="li" to="/events/">
                            <a href="#">{translate('nav.events')}</a>
                        </router-link>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <UserMenu />
                    </ul>
                    <div class="navbar-form navbar-right">
                        <div class="form-group">
                            <LanguageSwitch />
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
