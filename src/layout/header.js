import template from './header.html';
import i18nComponents from 'src/common/i18n';

export default {
    template,
    components: {
        // language switcher, etc.
        ...i18nComponents,
    }
};
