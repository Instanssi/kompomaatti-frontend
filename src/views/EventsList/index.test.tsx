import React from 'react';
import { it, vi, describe, beforeEach, expect, afterEach, beforeAll } from 'vitest';
import { act, RenderResult } from '@testing-library/react';
import EventsListView from './';
import { api } from 'src/api';
import { testRender } from 'src/tests';
import globalState from 'src/state';

describe(EventsListView.name, () => {
    let rendered: RenderResult;
    let mockGetter;

    beforeAll(() => {
        vi.spyOn(api.currentUser, 'get').mockImplementation(vi.fn());
        // FIXME: Return a list of mocked event objects.
        vi.spyOn(api.events, 'list').mockImplementation(() => Promise.resolve([]));

    });

    beforeEach(async () => {
        mockGetter = vi.fn();
        vi.spyOn(globalState.events, 'value', 'get').mockImplementation(mockGetter);
        await act(async () => {
            rendered = testRender(<EventsListView />);
        })
    });

    it('renders', async () => {
        // console.info('wrapper.container:', wrapper);
        const text = await rendered.findByText('Kaikki tapahtumat');
    });

    it('accesses the global events list', () => {
        expect(mockGetter).toHaveBeenCalled();
    });
});
