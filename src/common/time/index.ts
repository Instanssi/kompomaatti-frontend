import Vue from 'vue';

import moment from 'moment';
import globalState from 'src/state';


/**
 * Takes a ISO 8601 or JS Unix milliseconds timestamp as 'value'
 * and formats it. Can be customized by passing:
 * - 'format': Moment.js format string. Defaults to 'LLL'.
 * - 'locale': Moment locale id. Defaults to global locale or 'en'.
 */
const Time = Vue.extend({
    props: {
        value: {
            type: [Number, Date, String],
            required: true,
        },
        format: String,
        locale: String,
        placeholder: String,
    },
    template: '<span>{{ formatted }}</span>',
    data: () => ({
        globalState,
    }),
    computed: {
        formatted(): string {
            if(!this.value) {
                return this.placeholder || '-';
            }
            return moment(this.value)
                .locale(this.locale || this.globalState.momentLocale || 'en')
                .format(this.format || 'LLL');
        }
    },
});

export { Time };

export default {
    'i-time': Time,
};
