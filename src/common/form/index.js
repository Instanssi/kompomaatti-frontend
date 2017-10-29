const FormGroup = {
    props: ['name'],
    computed: {
        /** Get id for form label and element. */
        id() {
            return this.name;
        }
    },
    template: `<div class="form-group">
        <slot name="label" :for="id" />
        <slot name="control" :for="id" />
    </div>`
}

const formComponents = {
    'i-form-group': FormGroup,
}

export default formComponents;
