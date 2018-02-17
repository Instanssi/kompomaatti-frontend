import React from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { withRouter } from 'react-router';

import globalState from 'src/state';
import { ICompo } from 'src/api/interfaces';
import { RemoteStore } from 'src/stores';
import { L, LoadingWrapper } from 'src/common';


@(withRouter as any)
@observer
export default class CompoEntry extends React.Component<{
    compo: ICompo;
    match?: any;
}> {
    entry = new RemoteStore(() => {
        return globalState.api.compoEntries.get(this.entryId);
    });

    disposers = [] as any[];

    componentWillMount() {
        this.disposers = [
            autorun(() => this.entry.refresh()),
        ];
    }

    componentWillUnmount() {
        this.disposers.forEach(d => d());
    }

    get entryId() {
        return this.props.match.params.entryId;
    }

    render() {
        const entry = this.entry.value;

        return (
            <LoadingWrapper className="compo-entry" store={this.entry}>
                {entry && <div className="entry-info">
                    <div className="entry-title">
                        <h3>{entry.name}</h3>
                        <p>{entry.creator}</p>
                    </div>
                    {entry.imagefile_medium_url && (
                        <div className="entry-image">
                            <h4><L text="entry.image" />}</h4>
                            <a target="_blank" href={entry.imagefile_original_url || ''}>
                                <img src={entry.imagefile_medium_url} />
                            </a>
                        </div>
                    )}
                    {entry.disqualified && <div className="entry-disqualified">
                        <h4><L text="entry.disqualified" />}</h4>
                        <p>{entry.disqualified_reason}</p>
                    </div>}
                    <div className="entry-description">
                        <h4><L text="entry.description" />}</h4>
                        <p className="text-pre-wrap">{ entry.description }</p>
                    </div>
                    <div className="entry-files">
                        <h4><L text="entry.files" />}</h4>
                        { entry.entryfile_url && <p>
                            <a target="_blank" href={entry.entryfile_url}>
                                <L text="entry.entryfile" />}
                            </a>
                        </p>}
                        { entry.sourcefile_url && <p>
                            <a target="_blank" href={entry.sourcefile_url}>
                                <L text="entry.sourcefile" />}
                            </a>
                        </p>}
                    </div>
                </div>}
            </LoadingWrapper>
        );
    }
}
