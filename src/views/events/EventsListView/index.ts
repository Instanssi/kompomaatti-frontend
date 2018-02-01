import Vue from 'vue';
import _orderBy from 'lodash/orderBy';

import globalState from 'src/state';

import template from './events-list-view.html';


export default Vue.extend({
    template,
    data: () => ({
        globalState,
        isLoading: false,
        events: [],
    }),
    computed: {
        viewTitle() {
            return { key: 'events.title' };
        }
    },
    created() {
        this.refresh();
    },
    methods: {
        async refresh() {
            const { api } = this.globalState;
            this.isLoading = true;
            try {
                const events = await api.events.list();
                this.events = _orderBy(events, event => event.date, 'desc');
            } catch(error) {
                this.events = [];
            }
            this.isLoading = false;
        }
    }
});
