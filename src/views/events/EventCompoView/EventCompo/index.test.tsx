import { shallow, Wrapper } from '@vue/test-utils';

import { mockCompo } from 'src/tests/mocks';
import globalState from 'src/state';
import EventCompo from './';


describe(EventCompo.name, () => {
    let wrapper: Wrapper<EventCompo>;

    beforeEach(() => {
        jest.spyOn(globalState.api.compos, 'get')
            .mockReturnValue(Promise.resolve(mockCompo));

        const $route = {
            params: { cid: mockCompo.id },
        };

        // https://vue-test-utils.vuejs.org/en/api/options.html#mocks
        wrapper = shallow(EventCompo, {
            mocks: {
                $route,
            },
        });

    });

    it('renders', () => {
        expect(wrapper.is('.event-compo')).toBe(true);
    });

    it('calls the API to fetch compo details', () => {
        expect(globalState.api.compos.get)
            .toHaveBeenCalledWith(mockCompo.id);
    });
});
