import { Vue, Component, Prop } from 'vue-property-decorator';
import { MatchFirst, Route } from 'vue-component-router';

import { ICompo, IEvent } from 'src/api/interfaces';
import { FormatTime } from 'src/common';
import globalState from 'src/state';

import CompoOverview from './CompoOverview';


/**
 * Displays details of a single compo within an event.
 */
@Component
export default class EventCompo extends Vue {
    @Prop()
    compoId: string;

    @Prop()
    event: IEvent;

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
        const { compo, event } = this;
        return (
            <div class="event-compo">
                {compo && <div class="compo-title">
                    <h2>{compo.name}</h2>
                    <p><FormatTime value={compo.compo_start} /></p>
                </div>}
                <MatchFirst>
                    <Route>
                        <CompoOverview event={event} compo={compo } />
                    </Route>
                </MatchFirst>
            </div>
        );
    }
}
