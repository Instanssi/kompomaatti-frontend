import { Vue, Component, Prop } from 'vue-property-decorator';

import globalState from 'src/state';

import EventCompos from './EventCompos';
import EventCompetitions from './EventCompetitions';
import EventProgramme from './EventProgramme';
import { IEvent } from 'src/api/interfaces';


const { translate } = globalState;

@Component
export default class EventOverview extends Vue {
    @Prop()
    event: IEvent;

    render(h) {
        const { event } = this.$props;

        return (
            <div class="event-overview">
                <h2>{translate('event.compos')}</h2>
                <EventCompos event={event} />

                <h2>{translate('event.competitions')}</h2>
                <EventCompetitions event={event} />

                <h2>{translate('event.programme')}</h2>
                <EventProgramme event={event} />
            </div>
        );
    }
}
