import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import { L } from 'src/common';

import { ICompo } from 'src/api/interfaces';
import CompoEntries from './CompoEntries';
import CompoActions from '../CompoActions';


@observer
export default class CompoOverview extends React.Component<{
    compo: ICompo;
}> {

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
                <div className="pull-sm-right">
                    <CompoActions compo={compo} />
                </div>
                <div className="compo-description">
                    <h3><L text="common.description" /></h3>
                    <div dangerouslySetInnerHTML={this.descriptionHTML} />
                </div>
                <div className="compo-entries">
                    <h3><L text="compo.entries" /></h3>
                    <CompoEntries compo={compo} />
                </div>
            </div>
        );
    }
}
