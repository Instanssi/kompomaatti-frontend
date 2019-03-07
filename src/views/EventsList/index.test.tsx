import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import globalState from 'src/state';
import EventsListView from './';

describe(EventsListView.name, () => {
    let wrapper: ShallowWrapper;

    let mockGetter;

    beforeEach(() => {
        mockGetter = jest.fn();
        // FIXME: Return a list of mocked event objects.
        jest.spyOn(globalState.events, 'value', 'get').mockImplementation(mockGetter);
        wrapper = shallow(<EventsListView />);
    });

    it('renders', () => {
        expect(wrapper.is('.events-list-view')).toBe(true);
    });

    it('accesses the global events list', () => {
        expect(mockGetter).toHaveBeenCalled();
    });
});
