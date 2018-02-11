import { shallow, ShallowWrapper } from 'enzyme';

import { mockCompoEntry } from 'src/tests/mocks';
import globalState from 'src/state';
import CompoEntry from './';


describe(CompoEntry.name, () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        jest.spyOn(globalState.api.compoEntries, 'get')
            .mockReturnValue(Promise.resolve(mockCompoEntry));

        const $route = {
            params: { eid: mockCompoEntry.id },
        };

        // https://vue-test-utils.vuejs.org/en/api/options.html#mocks
        wrapper = shallow(CompoEntry, {
            mocks: {
                $route,
            },
        });

    });

    it('renders', () => {
        expect(wrapper.is('.compo-entry')).toBe(true);
    });

    it('calls the API to fetch entry details', () => {
        expect(globalState.api.compoEntries.get)
            .toHaveBeenCalledWith(mockCompoEntry.id);
    });
});
