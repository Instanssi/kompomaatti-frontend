import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import _orderBy from 'lodash/orderBy';

import { NoResults } from 'src/common';
import { IProgrammeEvent, IEvent } from 'src/api/interfaces';
import globalState from 'src/state';


@Component
export default class EventProgramme extends Vue {
    @Prop()
    event: IEvent;

    isPending = false;
    programmeEvents = [] as IProgrammeEvent[];
    lastError: any;

    created() {
        this.refresh();
    }

    @Watch('event')
    onEventChange() {
        this.refresh();
    }

    async refresh() {
        const { event } = this;
        const id = event && event.id;
        if (!id) {
            return;
        }
        const { api } = globalState;

        this.isPending = true;
        try {
            const items = await api.programme.list({ event: id });
            this.programmeEvents = _orderBy(items, item => item.start);
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
            throw error;
        }
        this.isPending = false;
    }

    render(h) {
        const { programmeEvents } = this;
        return (
            <ul>
                {programmeEvents.map(event => (
                    <li>{event.title}</li>
                ))}
                {!programmeEvents.length && (
                    <NoResults />
                )}
            </ul>
        );
    }
}
