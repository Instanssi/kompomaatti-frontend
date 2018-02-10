import Vue from 'vue';
import Component from 'vue-class-component';

import { NoResults } from 'src/common';
import { ICompetition } from 'src/api/models';
import globalState from 'src/state';


@Component({
    props: {
        eventId: Number,
    },
})
export default class EventCompetitions extends Vue<{ eventId: number }> {
    globalState = globalState;
    competitions: ICompetition[] = [];
    lastError: any;
    isPending = false;

    created() {
        this.refresh();
    }

    async refresh() {
        const { api } = this.globalState;
        this.isPending = true;
        try {
            this.competitions = await api.competitions.list({
                event: this.eventId,
            });
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
                    <li>{ competition.name }</li>
                ))}
                {!competitions.length && <NoResults />}
            </ul>
        );
    }
}
