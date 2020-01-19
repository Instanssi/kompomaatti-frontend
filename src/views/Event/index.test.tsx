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
        const eventId = globalState.events.value![1].eventId;
        mockProps = {
            match: {
                params: {
                    eventId: String(eventId),
                },
            },
            location: {
                pathname: `/events/${eventId}`,
            }
        };

        wrapper = shallow(<EventView {...mockProps} />);
        // instance = wrapper.instance();
    });

    it('renders', () => {
        expect(wrapper.is('.event-view')).toBe(true);
    });
});
