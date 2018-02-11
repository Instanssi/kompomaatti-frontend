import React from 'react';
import { observer } from 'mobx-react';
import { autorun, observable } from 'mobx';

import { ICompoEntry, ICompo } from 'src/api/interfaces';
import globalState from 'src/state';
import { withRouter } from 'react-router';


const { translate } = globalState;

@(withRouter as any)
@observer
export default class CompoEntry extends React.Component<{ compo: ICompo, match?: any }> {
    @observable.ref entry: ICompoEntry | null = null;
    @observable.ref isPending = false;
    @observable.ref lastError: any;

    disposers = [
        autorun(() => {
            this.refresh();
        }),
    ];

    componentWillUnmount() {
        this.disposers.forEach(d => d());
    }

    get entryId() {
        return this.props.match.params.entryId;
    }

    get viewTitle() {
        const { entry } = this;
        return entry && entry.name || '(unnamed entry)';
    }

    async refresh() {
        const { entryId } = this;

        this.isPending = true;
        try {
            this.entry = await globalState.api.compoEntries.get(entryId);
            this.lastError = null;
        } catch (error) {
            this.lastError = error;
        }
        this.isPending = false;
    }

    render() {
        const { entry } = this;

        return (
            <div className="compo-entry">
                {entry && <div className="entry-info">
                    <div className="entry-title">
                        <h3>{entry.name}</h3>
                        <p>{entry.creator}</p>
                    </div>
                    {entry.imagefile_medium_url && (
                        <div className="entry-image">
                            <h4>{translate('entry.image')}</h4>
                            <a target="_blank" href={entry.imagefile_original_url || ''}>
                                <img src={entry.imagefile_medium_url} />
                            </a>
                        </div>
                    )}
                    {entry.disqualified && <div className="entry-disqualified">
                        <h4>{translate('entry.disqualified')}</h4>
                        <p>{entry.disqualified_reason}</p>
                    </div>}
                    <div className="entry-description">
                        <h4>{translate('entry.description')}</h4>
                        <p className="text-pre-wrap">{ entry.description }</p>
                    </div>
                    <div className="entry-files">
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
