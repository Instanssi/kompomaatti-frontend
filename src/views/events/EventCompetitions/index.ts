import Vue from 'vue';

import { ICompetition } from 'src/api/models';
import globalState from 'src/state';

import template from './event-competitions.html';


export default Vue.extend({
    template,
    props: {
        eventId: Number,
    },
    data: () => ({
        globalState,
        competitions: [] as ICompetition[],
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
});
