import Vue from 'vue';

import globalState from 'src/state';


const { translate } = globalState;

export default class Footer extends Vue {
    scrollUp(event) {
        event.preventDefault();
        window.scroll(0, 0);
    }

    render(h) {
        return (
            <footer class="bg-brand p-3">
                <span>{translate('footer.copyright')}</span>
                <a href="#" onClick={this.scrollUp}>{translate('footer.toTop')}</a>
            </footer>
        );
    }
}
