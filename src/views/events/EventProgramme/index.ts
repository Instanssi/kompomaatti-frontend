import Vue from 'vue';
import _orderBy from 'lodash/orderBy';

import { IProgrammeEvent } from 'src/api/models';
import globalState from 'src/state';

import template from './event-programme.html';


export default Vue.extend({
    template,
    props: {
        eventId: Number,
    },
    data: () => ({
        globalState,
        programmeEvents: [] as IProgrammeEvent[],
    }),
    created() {
        this.refresh();
    },
    methods: {
        async refresh() {
            const { api } = this.globalState;
            const items = await api.programme.list({ event: this.eventId });

            this.programmeEvents = _orderBy(items, item => item.start);
        }
    }
});
