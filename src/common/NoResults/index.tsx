import Vue from 'vue';
import Component from 'vue-class-component';

import globalState from 'src/state';


const { translate } = globalState;

@Component
export default class NoResults extends Vue {
    render(h) {
        return (
            <span>
                <span class="fa fa-exclamation-triangle" />
                {' '}
                {translate('list.noResults')}
            </span>
        );
    }
}
