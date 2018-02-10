import Vue from 'vue';
import Component from 'vue-class-component';

import moment from 'moment';
import globalState from 'src/state';


export interface IFormatTimeProps {
    value: number | Date | string;
    format?: string;
    locale?: string;
    placeholder?: string | any;
}

/**
 * Takes a ISO 8601 or JS Unix milliseconds timestamp as 'value'
 * and formats it. Can be customized by passing:
 * - 'format': Moment.js format string. Defaults to 'LLL'.
 * - 'locale': Moment locale id. Defaults to global locale or 'en'.
 */
@Component({
    props: ['value', 'format', 'locale', 'placeholder'],
})
export default class FormatTime extends Vue<IFormatTimeProps> {
    get formatted() {
        const { value, placeholder, locale, format } = this;
        if (!value) {
            return placeholder || '-';
        }
        return moment(value)
            .locale(locale || globalState.momentLocale || 'en')
            .format(format || 'LLL');
    }

    render(h) {
        const { formatted } = this;
        return <span>{formatted}</span>;
    }
}
