import Vue from 'vue';
import Component from 'vue-class-component';

import { ICompetition } from 'src/api/models';
import globalState from 'src/state';

import template from './event-competitions.html';


@Component({
    template,
    props: {
        eventId: Number,
    },
})
export default class EventCompetitions extends Vue {
    globalState = globalState;
    competitions: ICompetition[] = [];
    lastError: any;
    isPending = false;

    created() {
        this.refresh();
    }

    async refresh() {
        const { api } = this.globalState;
        this.isPending = true;
        try {
            this.competitions = await api.competitions.list({
                event: this.$props.eventId,
            });
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }
}
