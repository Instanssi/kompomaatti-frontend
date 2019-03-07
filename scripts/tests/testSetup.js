// This is run when Jest is initializing its JS environments.
// If you need to run something _after_ that, use a framework setup file.

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({
    adapter: new Adapter(),
});

// quality mock, pls don't steal
window.localStorage = {
    setItem: () => {},
    getItem: () => {},
};
