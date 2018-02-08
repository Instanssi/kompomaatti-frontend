import { shallow, Wrapper } from '@vue/test-utils';

import globalState from 'src/state';
import { mockEvent } from 'src/tests/mocks';

import EventView from './';


describe(EventView.name, () => {
    let wrapper: Wrapper<EventView>;

    beforeEach(() => {
        jest.spyOn(globalState.api.events, 'get')
            .mockReturnValue(Promise.resolve(mockEvent));

        const $route = {
            params: { id: mockEvent.id },
        };
        // https://vue-test-utils.vuejs.org/en/api/options.html#mocks
        wrapper = shallow(EventView, {
            mocks: {
                $route,
            },
        });
    });

    it('renders', () => {
        expect(wrapper.is('.event-view')).toBe(true);
    });

    it('calls the API to fetch event information', () => {
        expect(globalState.api.events.get).toHaveBeenCalledWith(mockEvent.id);
    });
});
