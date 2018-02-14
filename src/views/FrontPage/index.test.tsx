import { shallow } from 'enzyme';
import FrontPageView from './';


describe('Front page', () => {
    it('renders', () => {
        const wrapper = shallow(FrontPageView);
        expect(wrapper.is('.frontpage-view')).toBe(true);
    });
});
