import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import { NoResults } from 'src/common';
import { ICompetition, IEvent } from 'src/api/interfaces';
import globalState from 'src/state';


@Component
export default class EventCompetitions extends Vue {
    @Prop()
    event: IEvent;

    competitions: ICompetition[] = [];
    lastError: any;
    isPending = false;

    created() {
        this.refresh();
    }

    @Watch('event')
    onEventChange() {
        this.refresh();
    }

    get eventId() {
        const { event } = this;
        return event && event.id;
    }

    async refresh() {
        const { eventId } = this;
        if (!eventId) {
            return;
        }
        const { api } = globalState;
        this.isPending = true;
        try {
            this.competitions = await api.competitions.list({ event: eventId });
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    render(h) {
        const { competitions } = this;
        return (
            <ul>
                {competitions.map(competition => (
                    <li>{competition.name}</li>
                ))}
                {!competitions.length && <NoResults />}
            </ul>
        );
    }
}
