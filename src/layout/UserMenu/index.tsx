import Vue from 'vue';

import globalState from 'src/state';


const { translate } = globalState;

export default class UserMenu extends Vue {
    globalState = globalState;

    get user() {
        return globalState.user;
    }

    render(h) {
        const { user } = this;
        return (
            <li>
                {user ? (
                    <a href="/users/profile">{ user.email }</a>
                ) : (
                    <a href="/users/login">
                        {translate('nav.login')}
                    </a>
                )}
            </li>
        );
    }
}
