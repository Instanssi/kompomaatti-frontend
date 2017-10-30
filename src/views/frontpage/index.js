import template from './frontpage.html';
import globalState from 'src/state';

const FrontpageView = {
    template,
    data: () => ({
        globalState,
    }),
    computed: {
        currentUser() {
            return globalState.user;
        }
    }
};

export default [
    { path: '/', component: FrontpageView },
];
