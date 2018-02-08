import Vue from 'vue';
import Component from 'vue-class-component';

import { ICompo } from 'src/api/models';
import globalState from 'src/state';

import CompoEntries from './CompoEntries';


// FIXME: Come up with a shorter name for this for convenience? "L" ?
const { translate } = globalState;

@Component
export default class CompoOverview extends Vue {
    globalState = globalState;
    compo: ICompo | null = null;
    isPending = false;
    lastError: any;

    created() {
        this.refresh();
    }

    get eventId() {
        return Number.parseInt(this.$route.params.cid, 10);
    }

    async refresh() {
        const { api } = this.globalState;
        const { eventId } = this;

        this.isPending = true;
        try {
            this.compo = await api.compos.get(eventId);
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    render(h) {
        const { compo } = this;
        if (!compo) {
            return null;
        }
        return (
            <div class="event-compo-overview">
                <div class="compo-description">
                    <h3>{translate('compo.description')}</h3>
                    <div domPropsInnerHTML={compo.description} />
                </div>
                <div class="compo-entries">
                    <h3>{translate('compo.entries')}</h3>
                    <CompoEntries compoId={compo.id} />
                </div>
            </div>
        );
    }
}
