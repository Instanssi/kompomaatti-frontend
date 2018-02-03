import Vue from 'vue';
import Component from 'vue-class-component';

import globalState from 'src/state';
import Time from 'src/common/time';

import EventCompos from './EventCompos';
import EventCompetitions from './EventCompetitions';
import EventProgramme from './EventProgramme';

import template from './event-overview.html';
import { IEvent, PrimaryKey } from 'src/api/models';


@Component({
    template,
    components: {
        ...Time,
        EventCompos,
        EventCompetitions,
        EventProgramme,
    },
})
export default class EventOverview extends Vue {
    globalState = globalState;
    isPending = false;
    lastError: any;
    event: IEvent | null = null;

    created() {
        this.refresh();
    }

    get eventId(): PrimaryKey {
        const { id } = this.$route.params;
        return Number.parseInt(id, 10);
    }

    async refresh() {
        const { api } = this.globalState;
        const id = Number.parseInt(this.$route.params.id, 10);

        this.isPending = true;
        try {
            this.event = await api.events.get(id);
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }
}
