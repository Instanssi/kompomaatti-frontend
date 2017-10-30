import globalState from 'src/state';
import compoEntries from './compo-entries';
import Time from 'src/common/time';

import template from './event-compo.html';


const EventCompoView = {
    template,
    components: {
        compoEntries,
        ...Time,
    },
    data: () => ({
        globalState,
        isLoading: false,
        compo: null,
    }),
    created() {
        this.refresh();
    },
    computed: {
        eventId() {
            return Number.parseInt(this.$route.params, 10);
        }
    },
    methods: {
        async refresh() {
            const { api } = this.globalState;
            const id = Number.parseInt(this.$route.params.cid, 10);

            this.isLoading = true;
            try {
                this.compo = await api.compos.get(id);
            } catch(error) {
                // TODO: Spec how to handle errors nicely.
                this.isLoading = false;
                throw error;
            }
            this.isLoading = false;
        }
    }
};

export default EventCompoView;
