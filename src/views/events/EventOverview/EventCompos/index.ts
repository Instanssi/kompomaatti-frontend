import Vue from 'vue';
import Component from 'vue-class-component';

import { ICompo } from 'src/api/models';
import globalState from 'src/state';

import template from './event-compos.html';


@Component({
    template,
    props: {
        eventId: Number,
    },
})
export default class EventCompos extends Vue {
    globalState = globalState;
    compos: ICompo[] = [];
    lastError: any;
    isPending = false;

    created() {
        this.refresh();
    }

    async refresh() {
        const { api } = this.globalState;
        this.isPending = true;
        try {
            this.compos = await api.compos.list({ event: this.$props.eventId });
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    getCompoPath(compo) {
        return this.$route.path + 'compos/' + compo.id + '/';
    }
}
