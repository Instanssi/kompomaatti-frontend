import { shallow, Wrapper } from '@vue/test-utils';

import globalState from 'src/state';
import EventsListView from './';


describe(EventsListView.name, () => {
    let wrapper: Wrapper<EventsListView>;

    beforeEach(() => {
        // FIXME: Return an actual event object.
        jest.spyOn(globalState.api.events, 'list').mockReturnValue(Promise.resolve([]));
        wrapper = shallow(EventsListView);
    });

    it('renders', () => {
        expect(wrapper.is('.events-list-view')).toBe(true);
    });

    it('calls the API to fetch an events list', () => {
        expect(globalState.api.events.list).toHaveBeenCalled();
    });
});
