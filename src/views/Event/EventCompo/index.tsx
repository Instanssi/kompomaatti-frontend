import Vue from 'vue';
import Component from 'vue-class-component';

import { ICompo } from 'src/api/models';
import globalState from 'src/state';

import { FormatTime } from 'src/common';


/**
 * Displays details of a single compo within an event.
 */
@Component({
    props: {
        event: Object,
        compoId: Number,
    },
})
export default class EventCompo extends Vue {
    isPending = false;
    lastError: any;
    compo: ICompo | null = null;

    created() {
        this.refresh();
    }

    get id(): number {
        return Number.parseInt(this.$props.compoId, 10);
    }

    get viewTitle(): string {
        const { compo } = this;
        return compo && compo.name || '?';
    }

    async refresh() {
        const { api } = globalState;
        const { id } = this;

        this.isPending = true;
        try {
            this.compo = await api.compos.get(id);
            this.isPending = false;
        } catch (error) {
            this.lastError = error;
            this.isPending = false;
            throw error;
        }
    }

    render(h) {
        const { compo } = this;
        return (
            <div class="event-compo">
                {compo && <div class="compo-title">
                    <h2>{compo.name}</h2>
                    <p><FormatTime value={compo.compo_start} /></p>
                </div>}
                <router-view />
            </div>
        );
    }
}
