import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { RouterLink } from 'vue-component-router';

import { ICompo, IEvent } from 'src/api/models';
import globalState from 'src/state';


@Component
export default class EventCompos extends Vue {
    @Prop()
    event: IEvent;

    compos: ICompo[] = [];
    lastError: any;
    isPending = false;

    created() {
        this.refresh();
    }

    @Watch('event')
    onEventIdChange(id) {
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
            this.compos = await api.compos.list({ event: eventId });
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    getCompoPath(compo) {
        return `compos/${compo.id}`;
    }

    render(h) {
        const { compos } = this;
        return (
            <ul>
                {compos.map(compo => (
                    <li>
                        <RouterLink to={this.getCompoPath(compo)}>
                            {compo.name}
                        </RouterLink>
                    </li>
                ))}
            </ul>
        );
    }
}
