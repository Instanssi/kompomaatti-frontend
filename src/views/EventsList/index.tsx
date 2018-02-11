import Vue from 'vue';
import Component from 'vue-class-component';
import { RouterLink } from 'vue-component-router';
import _orderBy from 'lodash/orderBy';

import { IEvent } from 'src/api/interfaces';
import globalState from 'src/state';


const { translate } = globalState;

@Component
export default class EventsListView extends Vue {
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
        const { api } = globalState;
        this.isPending = true;
        try {
            const events = await api.events.list();
            this.events = _orderBy(events, event => event.date, 'desc');
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    render(h) {
        const { events } = this;
        return (
            <div class="events-list-view">
                <h1>{translate('events.title')}</h1>
                <ul>
                    {events.map(event => (
                        <li>
                            <RouterLink to={'/kompomaatti/events/' + event.id + '/'}>
                                <span>{event.name}</span>
                            </RouterLink>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
