import Vue from 'vue';

import { ICompo } from 'src/api/models';
import globalState from 'src/state';

// import CompoEntries from '../CompoOverview/CompoEntries';
import Time from 'src/common/time';

import template from './event-compo-view.html';


export default Vue.extend({
    template,
    components: {
        // CompoEntries,
        ...Time,
    },
    data: () => ({
        globalState,
        isLoading: false,
        compo: null as (ICompo | null),
    }),
    created() {
        this.refresh();
    },
    computed: {
        eventId(): number {
            return Number.parseInt(this.$route.params.cid, 10);
        },
        viewTitle(): string {
            const { compo } = this;
            return compo && compo.name || '?';
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
});
