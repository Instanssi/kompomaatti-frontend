import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import globalState from 'src/state';
import { mockEvent } from 'src/tests/mocks';

import EventView from './';


describe(EventView.name, () => {
    let wrapper: ShallowWrapper;
    let instance;
    let mockProps;

    beforeEach(() => {
        jest.spyOn(globalState.api.events, 'get')
            .mockReturnValue(Promise.resolve(mockEvent));

        mockProps = {
            match: {
                params: {
                    eventId: '' + mockEvent.id,
                },
            },
        };
        const _EventView = (EventView as any).WrappedComponent;

        wrapper = shallow(<_EventView {...mockProps} />);
        instance = wrapper.instance();
    });

    it('renders', () => {
        expect(wrapper.is('.event-view')).toBe(true);
    });

    it('calls the API to fetch event information', () => {
        instance.event.refresh();
        expect(globalState.api.events.get).toHaveBeenCalledWith(mockEvent.id);
    });
});
