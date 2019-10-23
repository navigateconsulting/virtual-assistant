import { r as registerInstance, f as createEvent, h, H as Host, c as getIonMode, e as getElement } from './core-950489bb.js';
import { f as findCheckedOption, w as watchForOptions } from './watch-options-ac14b122.js';

const RadioGroup = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.inputId = `ion-rg-${radioGroupIds++}`;
        this.labelId = `${this.inputId}-lbl`;
        /**
         * If `true`, the radios can be deselected.
         */
        this.allowEmptySelection = false;
        /**
         * The name of the control, which is submitted with the form data.
         */
        this.name = this.inputId;
        this.onSelect = (ev) => {
            const selectedRadio = ev.target;
            if (selectedRadio) {
                this.value = selectedRadio.value;
            }
        };
        this.onDeselect = (ev) => {
            const selectedRadio = ev.target;
            if (selectedRadio) {
                selectedRadio.checked = false;
                this.value = undefined;
            }
        };
        this.ionChange = createEvent(this, "ionChange", 7);
    }
    valueChanged(value) {
        this.updateRadios();
        this.ionChange.emit({ value });
    }
    async connectedCallback() {
        // Get the list header if it exists and set the id
        // this is used to set aria-labelledby
        const el = this.el;
        const header = el.querySelector('ion-list-header') || el.querySelector('ion-item-divider');
        if (header) {
            const label = header.querySelector('ion-label');
            if (label) {
                this.labelId = label.id = this.name + '-lbl';
            }
        }
        if (this.value === undefined) {
            const radio = findCheckedOption(el, 'ion-radio');
            if (radio !== undefined) {
                await radio.componentOnReady();
                if (this.value === undefined) {
                    this.value = radio.value;
                }
            }
        }
        this.mutationO = watchForOptions(el, 'ion-radio', newOption => {
            if (newOption !== undefined) {
                newOption.componentOnReady().then(() => {
                    this.value = newOption.value;
                });
            }
            else {
                this.updateRadios();
            }
        });
        this.updateRadios();
    }
    disconnectedCallback() {
        if (this.mutationO) {
            this.mutationO.disconnect();
            this.mutationO = undefined;
        }
    }
    async updateRadios() {
        /**
         * Make sure we get all radios first
         * so values are up to date prior
         * to caching the radio group value
         */
        const radios = await this.getRadios();
        const { value } = this;
        let hasChecked = false;
        // Walk the DOM in reverse order, since the last selected one wins!
        for (const radio of radios) {
            if (!hasChecked && radio.value === value) {
                // correct value for this radio
                // but this radio isn't checked yet
                // and we haven't found a checked yet
                hasChecked = true;
                radio.checked = true;
            }
            else {
                // this radio doesn't have the correct value
                // or the radio group has been already checked
                radio.checked = false;
            }
        }
        // Reset value if
        if (!hasChecked) {
            this.value = undefined;
        }
    }
    getRadios() {
        return Promise.all(Array
            .from(this.el.querySelectorAll('ion-radio'))
            .map(r => r.componentOnReady()));
    }
    render() {
        return (h(Host, { role: "radiogroup", "aria-labelledby": this.labelId, onIonSelect: this.onSelect, onIonDeselect: this.allowEmptySelection ? this.onDeselect : undefined, class: getIonMode(this) }));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "value": ["valueChanged"]
    }; }
};
let radioGroupIds = 0;

export { RadioGroup as ion_radio_group };
