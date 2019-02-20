import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import globalState from 'src/state';

import { EventView } from './';
// import EventInfo from 'src/state/EventInfo';

jest.mock('src/state', () => {
    const { mockEvent } = require('src/tests/mocks');
    const einfo = require('src/state/EventInfo').default;
    return {
        events: {
            value: [
                { eventId: mockEvent.id + 1 } as any,
                new einfo(null as any, mockEvent),
                { eventId: mockEvent.id + 2 } as any,
            ],
        },
    };
});

describe(EventView.name, () => {
    let wrapper: ShallowWrapper;
    // let instance;
    let mockProps;

    beforeEach(() => {
        mockProps = {
            match: {
                params: {
                    eventId: '' + globalState.events.value![1].eventId,
                },
            },
        };
        const EventViewInner = (EventView as any).WrappedComponent;

        wrapper = shallow(<EventViewInner {...mockProps} />);
        // instance = wrapper.instance();
    });

    it('renders', () => {
        expect(wrapper.is('.event-view')).toBe(true);
    });
});
