import Vue from 'vue';


export interface IFormGroupProps {
    name: string;
    // TODO: What's the Vue JSX type?
    label?: any;
    control: any;
}

/**
 * Markup for a form group.
 */
export default class FormGroup extends Vue<IFormGroupProps> {
    /** Get id for the form label and control. */
    get id() {
        return this.name;
    }

    render(h) {
        const { id } = this;
        return (
            <div class="form-group">
                {this.label && <this.label name="label" for={id} />}
                <this.control name="control" for={id} />
                {/* TODO: Form feedback */}
            </div>
        );
    }
}
