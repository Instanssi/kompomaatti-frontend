import React from 'react';
import { observer } from 'mobx-react';

import globalState from 'src/state';
import EventInfo from 'src/state/EventInfo';
import { LazyStore } from 'src/stores';
import { NoResults } from 'src/common';
import { Link } from 'react-router-dom';
import { ICompo } from 'src/api/interfaces';
import { computed } from 'mobx';


/**
 * Shows status info about a compo: timeframe, own entries, etc.
 *
 * @todo Merge the "compo actions" feature into this.
 */
@observer
export default class CompoStatus extends React.Component<{
    eventInfo: EventInfo;
    compo: ICompo;
}> {
    store = new LazyStore(() => globalState.api.userCompoEntries.list({
        event: this.props.eventInfo.eventId,
    }));

    @computed
    get entries() {
        const ownEntries = this.store.value;
        const compoId = this.props.compo.id;
        return ownEntries ? ownEntries.filter(entry => entry.compo === compoId) : null;
    }

    render() {
        const { compo, eventInfo } = this.props;
        const { entries } = this;

        return (
            <div className="compo-own-entries">
                {(entries && entries.length > 0) ? <ul>
                    {entries.map(entry => (
                        <li>
                            <Link to={eventInfo.getCompoEntryURL(compo, entry)}>
                                {entry.name}
                            </Link>
                        </li>
                    ))}
                </ul> : <NoResults />}
            </div>
        )
    }
}
