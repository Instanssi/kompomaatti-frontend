import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { RouterLink } from 'vue-component-router';

import _orderBy from 'lodash/orderBy';

import { ICompoEntry, ICompo } from 'src/api/models';
import globalState from 'src/state';


@Component
export default class CompoEntries extends Vue {
    @Prop()
    compo: ICompo;

    isPending = false;
    lastError: any;
    entries: ICompoEntry[] | null = null;

    created() {
        this.refresh();
    }

    @Watch('compo')
    onCompoChange() {
        this.refresh();
    }

    get compoId() {
        const { compo } = this;
        return compo && compo.id;
    }

    get allEntriesSorted() {
        return _orderBy(this.entries || [], entry => entry.rank);
    }

    get qualifiedEntriesSorted() {
        return this.allEntriesSorted.filter(entry => !entry.disqualified);
    }

    async refresh() {
        const { compoId } = this;

        if (!compoId) {
            return;
        }

        const { api } = globalState;
        this.isPending = true;
        try {
            this.entries = await api.compoEntries.list({ compo: this.compoId });
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    getEntryPath(entry) {
        return `entries/${entry.id}`;
    }

    render(h) {
        const entries = this.allEntriesSorted;
        return (
            <ul>
                {entries && entries.map(entry => (
                    <li>
                        {entry.rank ? entry.rank + '. ' : ''}
                        <RouterLink to={this.getEntryPath(entry)}>
                            {entry.name}
                        </RouterLink> - {entry.creator}
                    </li>
                ))}
            </ul>
        );
    }
}
