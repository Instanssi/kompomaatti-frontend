import Vue from 'vue';

import { ICompo } from 'src/api/models';
import globalState from 'src/state';

import template from './event-compos.html';


export default Vue.extend({
    template,
    props: {
        eventId: Number,
    },
    data: () => ({
        globalState,
        compos: [] as ICompo[],
    }),
    created() {
        this.refresh();
    },
    methods: {
        async refresh() {
            const { api } = this.globalState;
            this.compos = await api.compos.list({ event: this.eventId });
        },
        getCompoPath(compo) {
            return this.$route.path + 'compos/' + compo.id + '/';
        }
    }
});
