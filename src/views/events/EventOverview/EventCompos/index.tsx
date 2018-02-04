import Vue from 'vue';
import Component from 'vue-class-component';

import { ICompo } from 'src/api/models';
import globalState from 'src/state';


@Component({
    props: {
        eventId: Number,
    },
})
export default class EventCompos extends Vue<{ eventId: number }> {
    globalState = globalState;
    compos: ICompo[] = [];
    lastError: any;
    isPending = false;

    created() {
        this.refresh();
    }

    async refresh() {
        const { api } = this.globalState;
        this.isPending = true;
        try {
            this.compos = await api.compos.list({ event: this.eventId });
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    getCompoPath(compo) {
        return this.$route.path + 'compos/' + compo.id + '/';
    }

    render(h) {
        const { compos } = this;
        return (
            <ul>
                {compos.map(compo => (
                    <li>
                        <router-link to={this.getCompoPath(compo)}>
                            {compo.name}
                        </router-link>
                    </li>
                ))}
            </ul>
        );
    }
}
