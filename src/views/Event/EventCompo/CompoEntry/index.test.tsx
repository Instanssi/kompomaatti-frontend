import React from 'react';
import {  act, RenderResult, waitFor } from '@testing-library/react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { mockCompoEntry, mockCompo } from 'src/tests/mocks';
import globalState from 'src/state';
import { CompoEntry } from './';
import { testRender } from 'src/tests';


describe(CompoEntry.name, () => {
    let rendered: RenderResult;
    let mockProps;

    beforeEach(async () => {
        vi.spyOn(globalState.api.currentUser, 'get').mockImplementation(vi.fn());
        vi.spyOn(globalState.api.compoEntries, 'get')
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
        act(() => {
            rendered = testRender(<CompoEntry {...mockProps} />);
        });

    });

    it('renders after fetching the entry', async () => {
        await waitFor(() => rendered.findByText(mockCompoEntry.name));
    });

    it('calls the API to fetch entry details', async () => {
        await waitFor(() => rendered.findByText(mockCompoEntry.name));
        expect(globalState.api.compoEntries.get)
            .toHaveBeenCalledWith(mockCompoEntry.id);
    });
});
