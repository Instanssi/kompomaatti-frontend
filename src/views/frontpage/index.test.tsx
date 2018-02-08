import { shallow } from '@vue/test-utils';
import { FrontpageView } from './';


describe('Front page', () => {
    it('renders', () => {
        const wrapper = shallow(FrontpageView);
        expect(wrapper.is('.frontpage-view')).toBe(true);
    });
});
