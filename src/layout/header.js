import i18nComponents from 'src/common/i18n';
import template from './header.html';
import globalState from 'src/state';
import userMenu from './user-menu';

export default {
    template,
    data: () => ({
        globalState,
    }),
    components: {
        // language switcher, etc.
        ...i18nComponents,
        userMenu,
    }
};
