import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import globalState from 'src/state';

import CompoEntries from './CompoEntries';
import { ICompo } from 'src/api/interfaces';


// FIXME: Come up with a shorter name for this for convenience? "L" ?
const { translate } = globalState;

export interface ICompoOverviewProps {
    compo: ICompo;
}

@observer
export default class CompoOverview extends React.Component<ICompoOverviewProps> {

    @computed
    get descriptionHTML() {
        return {
            __html: this.props.compo.description,
        };
    }

    render() {
        const { compo } = this.props;

        return (
            <div className="event-compo-overview">
                <div className="compo-description">
                    <h3>{translate('compo.description')}</h3>
                    <div dangerouslySetInnerHTML={this.descriptionHTML} />
                </div>
                <div className="compo-entries">
                    <h3>{translate('compo.entries')}</h3>
                    <CompoEntries compo={compo} />
                </div>
            </div>
        );
    }
}
