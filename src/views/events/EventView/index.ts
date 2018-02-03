import Vue from 'vue';
import Component from 'vue-class-component';

import { IEvent, PrimaryKey } from 'src/api/models';
import globalState from 'src/state';
import Time from 'src/common/time';

import template from './event.html';


@Component({
    template,
    components: {
        ...Time,
    },
})
export default class EventView extends Vue {
    globalState = globalState;
    isLoading = false;
    event: IEvent | null = null;

    created() {
        this.refresh();
    }

    get eventId(): PrimaryKey {
        const { id } = this.$route.params;
        return Number.parseInt(id, 10);
    }

    get viewTitle() {
        const { event } = this;
        return event && event.name || '?';
    }

    async refresh() {
        const { api } = this.globalState;
        const id = Number.parseInt(this.$route.params.id, 10);

        this.isLoading = true;
        try {
            this.event = await api.events.get(id);
        } catch (error) {
            // TODO: Spec how to handle errors nicely.
            this.isLoading = false;
            throw error;
        }
        this.isLoading = false;
        return this.event;
    }
}
