import Vue from 'vue';

import globalState from 'src/state';
import Time from 'src/common/time';

import eventCompos from '../EventCompos';
import eventCompetitions from '../EventCompetitions';
import eventProgramme from '../EventProgramme';

import template from './event-overview.html';
import { IEvent, PrimaryKey } from 'src/api/models';


export default Vue.extend({
    template,
    components: {
        ...Time,
        eventCompos,
        eventCompetitions,
        eventProgramme
    },
    data: () => ({
        globalState,
        isLoading: false,
        event: null as (IEvent | null),
    }),
    created() {
        this.refresh();
    },
    computed: {
        eventId(): PrimaryKey {
            const { id } = this.$route.params;
            return Number.parseInt(id, 10)
        }
    },
    methods: {
        async refresh() {
            const { api } = this.globalState;
            const id = Number.parseInt(this.$route.params.id, 10);

            this.isLoading = true;
            try {
                this.event = await api.events.get(id);
            } catch(error) {
                // TODO: Spec how to handle errors nicely.
                this.isLoading = false;
                throw error;
            }
            this.isLoading = false;
        }
    }
});
