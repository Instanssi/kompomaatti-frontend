import Vue from 'vue';
import Component from 'vue-class-component';
import { RouterLink } from 'vue-component-router';

import globalState from 'src/state';

import UserMenu from '../UserMenu';
import LanguageSwitch from '../LanguageSwitch';


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
                    <RouterLink to="/kompomaatti" class="navbar-brand">
                        Kompomaatti 2.0
                    </RouterLink>
                </div>
                <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                        <RouterLink tag="li" to="/kompomaatti/events">
                            <a href="#">{translate('nav.events')}</a>
                        </RouterLink>
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
