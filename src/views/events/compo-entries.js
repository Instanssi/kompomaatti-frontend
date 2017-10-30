import _orderBy from 'lodash/orderBy';
import globalState from 'src/state';
import template from './compo-entries.html';


export default {
    template,
    props: {
        compoId: Number,
    },
    data: () => ({
        globalState,
        entries: [],
    }),
    created() {
        this.refresh();
    },
    computed: {
        allEntriesSorted() {
            return _orderBy(this.entries, entry => entry.rank);
        },
        qualifiedEntriesSorted() {
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
};
