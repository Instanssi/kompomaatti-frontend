import _orderBy from 'lodash/orderBy';
import template from './event-programme.html';
import globalState from 'src/state';

export default {
    template,
    props: {
        eventId: Number,
    },
    data: () => ({
        globalState,
        programmeEvents: [],
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
};
