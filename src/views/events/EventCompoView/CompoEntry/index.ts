import Vue from 'vue';
import Component from 'vue-class-component';

import { ICompoEntry } from 'src/api/models';
import globalState from 'src/state';

import template from './compo-entry.html';


@Component({
    template,
})
export default class CompoEntry extends Vue {
    globalState = globalState;
    entry: ICompoEntry | null = null;
    isPending = false;
    lastError: any;

    created() {
        this.refresh();
    }

    get entryId(): number | null {
        const { params } = this.$route;
        return Number.parseInt(params.eid) || null;
    }

    get viewTitle(): string {
        const { entry } = this;
        return entry && entry.name || '(unnamed entry)';
    }

    async refresh() {
        const { entryId } = this;

        if (!entryId) {
            throw new Error('entryId not set!')
        }

        this.isPending = true;
        try {
            this.entry = await this.globalState.api.compoEntries.get(entryId);
            this.lastError = null;
        } catch(error) {
            this.lastError = error;
        }
        this.isPending = false;
    }
}
