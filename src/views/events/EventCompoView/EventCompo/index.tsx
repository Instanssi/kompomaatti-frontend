import Vue from 'vue';
import Component from 'vue-class-component';

import { ICompo } from 'src/api/models';
import globalState from 'src/state';

import { Time } from 'src/common/time';


/**
 * Displays details of a single compo within an event.
 */
@Component
export default class EventCompo extends Vue {
    globalState = globalState;
    isPending = false;
    lastError: any;
    compo: ICompo | null = null;

    created() {
        this.refresh();
    }

    get eventId(): number {
        return Number.parseInt(this.$route.params.cid, 10);
    }

    get viewTitle(): string {
        const { compo } = this;
        return compo && compo.name || '?';
    }

    async refresh() {
        const { api } = this.globalState;
        const id = Number.parseInt(this.$route.params.cid, 10);

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
                    <p><Time value={compo.compo_start} /></p>
                </div>}
                <router-view />
            </div>
        );
    }
}
