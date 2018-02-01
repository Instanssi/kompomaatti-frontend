import Vue from 'vue';

import { ICompoEntry } from 'src/api/models';
import globalState from 'src/state';

import template from './compo-entry.html';


export default Vue.extend({
    template,
    data: () => ({
        globalState,
        entry: null as (ICompoEntry | null),
        isPending: false,
        lastError: null,
    }),
    created() {
        this.refresh();
    },
    computed: {
        entryId(): number | null {
            const { params } = this.$route;
            return Number.parseInt(params.eid) || null;
        },
        viewTitle(): string {
            const { entry } = this;
            return entry && entry.name || '(unnamed entry)';
        },
    },
    methods: {
        async refresh() {
            const { entryId } = this;
            if(!entryId) {
                return Promise.reject(null);
            }
            this.isPending = true;
            try {
                this.entry = await this.globalState.api.compoEntries.get(entryId);
                this.isPending = false;
            } catch(error) {
                this.isPending = false;
                this.lastError = error;
            }
        }
    }
});
