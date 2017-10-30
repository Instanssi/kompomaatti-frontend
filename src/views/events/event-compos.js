import template from './event-compos.html';
import globalState from 'src/state';

export default {
    template,
    props: {
        eventId: Number,
    },
    data: () => ({
        globalState,
        compos: [],
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
            return this.$route.path + '/compos/' + compo.id;
        }
    }
};
