import Vue from 'vue';
import Component from 'vue-class-component';
import _orderBy from 'lodash/orderBy';

import { IProgrammeEvent } from 'src/api/models';
import globalState from 'src/state';

import template from './event-programme.html';


@Component({
    template,
    props: {
        eventId: Number,
    },
})
export default class EventProgramme extends Vue<{}> {
    globalState = globalState;
    isPending = false;
    programmeEvents = [] as IProgrammeEvent[];
    lastError: any;

    created() {
        this.refresh();
    }

    async refresh() {
        const { api } = this.globalState;
        this.isPending = true;
        try {
            const items = await api.programme.list({ event: this.$props.eventId });
            this.programmeEvents = _orderBy(items, item => item.start);
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
            throw error;
        }
        this.isPending = false;
    }
}
