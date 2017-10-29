import template from './event-competitions.html';
import globalState from 'src/state';

export default {
    template,
    props: {
        eventId: Number,
    },
    data: () => ({
        globalState,
        competitions: [],
    }),
    created() {
        this.refresh();
    },
    methods: {
        async refresh() {
            const { api } = this.globalState;
            this.competitions = await api.competitions.list({ event: this.eventId });
        }
    }
};
