import Vue from 'vue';
import Component from 'vue-class-component';

import globalState from 'src/state';

import CompoEntries from './CompoEntries';


// FIXME: Come up with a shorter name for this for convenience? "L" ?
const { translate } = globalState;

@Component({
    props: {
        event: Object,
        compo: Object,
    },
})
export default class CompoOverview extends Vue {
    render(h) {
        const { compo } = this.$props;
        if (!compo) {
            return null;
        }
        return (
            <div class="event-compo-overview">
                <div class="compo-description">
                    <h3>{translate('compo.description')}</h3>
                    <div domPropsInnerHTML={compo.description} />
                </div>
                <div class="compo-entries">
                    <h3>{translate('compo.entries')}</h3>
                    <CompoEntries compoId={compo.id} />
                </div>
            </div>
        );
    }
}
