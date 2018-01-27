import Vue from 'vue';
import template from './footer.html';


export default Vue.extend({
    template,
    methods: {
        scrollUp() {
            window.scroll(0, 0);
        }
    },
});
