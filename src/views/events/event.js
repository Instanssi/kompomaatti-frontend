import globalState from 'src/state';
import Time from 'src/common/time';

import eventCompos from './event-compos';
import eventCompetitions from './event-competitions';

import template from './event.html';


const EventView = {
    template,
    components: {
        ...Time,
        eventCompos,
        eventCompetitions,
    },
    data: () => ({
        globalState,
        isLoading: false,
        event: null,
    }),
    created() {
        this.refresh();
    },
    computed: {
        eventId() {
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
};

export default EventView;
