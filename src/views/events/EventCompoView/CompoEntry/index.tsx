import Vue from 'vue';
import Component from 'vue-class-component';

import { ICompoEntry } from 'src/api/models';
import globalState from 'src/state';


const { translate } = globalState;

@Component
export default class CompoEntry extends Vue {
    globalState = globalState;
    entry: ICompoEntry | null = null;
    isPending = false;
    lastError: any;

    created() {
        this.refresh();
    }

    get entryId() {
        const { params } = this.$route;
        return Number.parseInt(params.eid) || null;
    }

    get viewTitle() {
        const { entry } = this;
        return entry && entry.name || '(unnamed entry)';
    }

    async refresh() {
        const { entryId } = this;

        if (!entryId) {
            throw new Error('entryId not set!');
        }

        this.isPending = true;
        try {
            this.entry = await this.globalState.api.compoEntries.get(entryId);
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    render(h) {
        const { entry } = this;

        return (
            <div class="compo-entry">
                {entry && <div class="entry-info">
                    <div class="entry-title">
                        <h3>{entry.name}</h3>
                        <p>{entry.creator}</p>
                    </div>
                    {entry.imagefile_medium_url && (
                        <div class="entry-image">
                            <h4>{translate('entry.image')}</h4>
                            <a target="_blank" href={entry.imagefile_original_url}>
                                <img src={entry.imagefile_medium_url} />
                            </a>
                        </div>
                    )}
                    {entry.disqualified && <div class="entry-disqualified">
                        <h4>{translate('entry.disqualified')}</h4>
                        <p>{entry.disqualified_reason}</p>
                    </div>}
                    <div class="entry-description">
                        <h4>{translate('entry.description')}</h4>
                        <p class="text-pre-wrap">{ entry.description }</p>
                    </div>
                    <div class="entry-files">
                        <h4>{translate('entry.files')}</h4>
                        { entry.entryfile_url && <p>
                            <a target="_blank" href={entry.entryfile_url}>
                                {translate('entry.entryfile')}
                            </a>
                        </p>}
                        { entry.sourcefile_url && <p>
                            <a target="_blank" href={entry.sourcefile_url}>
                                {translate('entry.sourcefile')}
                            </a>
                        </p>}
                    </div>
                </div>}
            </div>
        );
    }
}
