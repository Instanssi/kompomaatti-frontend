import Vue from 'vue';
import Component from 'vue-class-component';
import _orderBy from 'lodash/orderBy';

import { IEvent } from 'src/api/models';
import globalState from 'src/state';

import template from './events-list-view.html';


@Component({
    template,
})
export default class EventsListView extends Vue {
    globalState = globalState;
    isPending = false;
    lastError: any;
    events: IEvent[] = [];

    created() {
        this.refresh();
    }

    get viewTitle() {
        return { key: 'events.title' };
    }

    async refresh() {
        const { api } = this.globalState;
        this.isPending = true;
        try {
            const events = await api.events.list();
            this.events = _orderBy(events, event => event.date, 'desc');
            this.lastError = null;
        } catch(error) {
            this.lastError = error;
        }
        this.isPending = false;
    }
}
