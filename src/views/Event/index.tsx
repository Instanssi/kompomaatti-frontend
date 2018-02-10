import Vue from 'vue';
import Component from 'vue-class-component';
import { MatchFirst, Route } from 'vue-component-router';

import { IEvent, PrimaryKey } from 'src/api/models';
import globalState from 'src/state';
import { FormatTime } from 'src/common';

import EventOverview from './EventOverview';
import EventCompo from './EventCompo';


@Component({
    props: ['eventId']
})
export default class EventView extends Vue {
    isLoading = false;
    event: IEvent | null = null;

    created() {
        this.refresh();
    }

    get eventIdParsed(): PrimaryKey {
        const id = this.$props.eventId;
        return Number.parseInt(id, 10);
    }

    get viewTitle() {
        const { event } = this;
        return event && event.name || '?';
    }

    async refresh() {
        const { api } = globalState;
        const { eventIdParsed } = this;

        this.isLoading = true;
        try {
            this.event = await api.events.get(eventIdParsed);
        } catch (error) {
            // TODO: Spec how to handle errors nicely.
            this.isLoading = false;
            throw error;
        }
        this.isLoading = false;
        return this.event;
    }

    render(h) {
        const { event } = this;
        return (
            <div class="event-view">
                {event && <div class="event-title">
                    <h1>{ event.name }</h1>
                    <p>
                        <FormatTime value={event.date} format="LL" />
                    </p>
                </div>}
                <MatchFirst>
                    <Route path="/kompomaatti/events/:eventId/compos/:compoId">
                        <EventCompo event={event} />
                    </Route>
                    <Route>
                        <EventOverview event={event} />
                    </Route>
                </MatchFirst>
            </div>
        );
    }
}
