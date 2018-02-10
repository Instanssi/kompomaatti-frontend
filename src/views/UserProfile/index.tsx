import { Vue, Component } from 'vue-property-decorator';
import globalState from 'src/state';


const { translate } = globalState;

@Component
export default class UserProfile extends Vue {
    render(h) {
        return (
            <div className="user-profile-view">
                <h1>{translate('user.profile')}</h1>
            </div>
        );
    }
}
