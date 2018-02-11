import { Vue, Component, Prop } from 'vue-property-decorator';

import globalState from 'src/state';

import CompoEntries from './CompoEntries';
import CompoActions from './CompoActions';
import { ICompo, IEvent } from 'src/api/interfaces';


// FIXME: Come up with a shorter name for this for convenience? "L" ?
const { translate } = globalState;

@Component
export default class CompoOverview extends Vue {
    @Prop() compo: ICompo;
    @Prop() event: IEvent;

    render(h) {
        const { compo } = this;

        if (!compo) {
            return null;
        }

        return (
            <div class="event-compo-overview">
                <div class="pull-right">
                    <CompoActions compo={compo} />
                </div>
                <div class="compo-description">
                    <h3>{translate('compo.description')}</h3>
                    <div domPropsInnerHTML={compo.description} />
                </div>
                <div class="compo-entries">
                    <h3>{translate('compo.entries')}</h3>
                    <CompoEntries compo={compo} />
                </div>
            </div>
        );
    }
}
