import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
// import createRouterContext from 'react-router-test-context';

import { mockCompoEntry, mockCompo } from 'src/tests/mocks';
import globalState from 'src/state';
import CompoEntry from './';


describe(CompoEntry.name, () => {
    let wrapper: ShallowWrapper;
    let mockProps;

    beforeEach(() => {
        jest.spyOn(globalState.api.compoEntries, 'get')
            .mockReturnValue(Promise.resolve(mockCompoEntry));

        mockProps = {
            eventInfo: {
                event: {},
            },
            compo: mockCompo,
            match: {
                params: {
                    entryId: '' + mockCompoEntry.id,
                },
            },
        };

        const _CompoEntry = (CompoEntry as any).WrappedComponent;

        wrapper = shallow(<_CompoEntry {...mockProps} />);
    });

    it('renders', () => {
        expect(wrapper.is('.compo-entry')).toBe(true);
    });

    it('calls the API to fetch entry details', () => {
        expect(globalState.api.compoEntries.get)
            .toHaveBeenCalledWith(mockCompoEntry.id);
    });
});
