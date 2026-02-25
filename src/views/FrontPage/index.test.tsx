import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FrontPageView from './';
import { testRender } from 'src/tests';
import globalState from 'src/state';


describe('Front page', () => {
    beforeEach(async () => {
        vi.spyOn(globalState, 'events', 'get').mockImplementation(vi.fn(() => ({ value: [] })));
    });

    it('renders', async () => {
        const wrapper = testRender(<FrontPageView />);
        await expect(wrapper.findByText('Kompomaatti')).resolves.toBeTruthy();
    });
});
