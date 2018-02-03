import Vue from 'vue';
import Component from 'vue-class-component';

import { ICompo, PrimaryKey } from 'src/api/models';
import globalState from 'src/state';

import CompoEntries from './CompoEntries';
import Time from 'src/common/time';

import template from './compo-overview.html';


@Component({
    template,
    components: {
        CompoEntries,
        ...Time,
    },
})
export default class CompoOverview extends Vue {
    globalState = globalState;
    compo: ICompo | null = null;
    isPending = false;
    lastError: any;

    created() {
        this.refresh();
    }

    get eventId(): PrimaryKey {
        return Number.parseInt(this.$route.params.cid, 10);
    }

    async refresh() {
        const { api } = this.globalState;
        const { eventId } = this;

        this.isPending = true;
        try {
            this.compo = await api.compos.get(eventId);
            this.lastError = null;
        } catch(error) {
            this.lastError = error;
        }
        this.isPending = false;
    }
}
