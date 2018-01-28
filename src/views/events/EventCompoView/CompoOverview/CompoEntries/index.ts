import Vue from 'vue';
import _orderBy from 'lodash/orderBy';

import { ICompoEntry } from 'src/api/models';
import globalState from 'src/state';

import template from './compo-entries.html';


export default Vue.extend({
    template,
    props: {
        compoId: Number,
    },
    data: () => ({
        globalState,
        entries: null as (ICompoEntry[] | null),
    }),
    created() {
        this.refresh();
    },
    computed: {
        allEntriesSorted(): ICompoEntry[] {
            return _orderBy(this.entries, entry => entry.rank);
        },
        qualifiedEntriesSorted(): ICompoEntry[] {
            return this.allEntriesSorted.filter(entry => !entry.disqualified);
        }
    },
    methods: {
        async refresh() {
            const { api } = this.globalState;
            this.entries = await api.compoEntries.list({ compo: this.compoId });
        },
        getEntryPath(entry) {
            return this.$route.path + '/entries/' + entry.id;
        }
    }
});
