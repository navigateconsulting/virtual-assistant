import { r as registerInstance, f as createEvent, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';
import { f as findItemLabel } from './helpers-ad941782.js';
import { c as createColorClasses, h as hostContext } from './theme-215399f6.js';

const Radio = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.inputId = `ion-rb-${radioButtonIds++}`;
        /**
         * The name of the control, which is submitted with the form data.
         */
        this.name = this.inputId;
        /**
         * If `true`, the user cannot interact with the radio.
         */
        this.disabled = false;
        /**
         * If `true`, the radio is selected.
         */
        this.checked = false;
        this.onFocus = () => {
            this.ionFocus.emit();
        };
        this.onBlur = () => {
            this.ionBlur.emit();
        };
        this.onClick = () => {
            if (this.checked) {
                this.ionDeselect.emit();
            }
            else {
                this.checked = true;
            }
        };
        this.ionStyle = createEvent(this, "ionStyle", 7);
        this.ionSelect = createEvent(this, "ionSelect", 7);
        this.ionDeselect = createEvent(this, "ionDeselect", 7);
        this.ionFocus = createEvent(this, "ionFocus", 7);
        this.ionBlur = createEvent(this, "ionBlur", 7);
    }
    colorChanged() {
        this.emitStyle();
    }
    checkedChanged(isChecked) {
        if (isChecked) {
            this.ionSelect.emit({
                checked: true,
                value: this.value
            });
        }
        this.emitStyle();
    }
    disabledChanged() {
        this.emitStyle();
    }
    componentWillLoad() {
        if (this.value === undefined) {
            this.value = this.inputId;
        }
        this.emitStyle();
    }
    emitStyle() {
        this.ionStyle.emit({
            'radio-checked': this.checked,
            'interactive-disabled': this.disabled,
        });
    }
    render() {
        const { inputId, disabled, checked, color, el } = this;
        const mode = getIonMode(this);
        const labelId = inputId + '-lbl';
        const label = findItemLabel(el);
        if (label) {
            label.id = labelId;
        }
        return (h(Host, { onClick: this.onClick, role: "radio", "aria-disabled": disabled ? 'true' : null, "aria-checked": `${checked}`, "aria-labelledby": labelId, class: Object.assign(Object.assign({}, createColorClasses(color)), { [mode]: true, 'in-item': hostContext('ion-item', el), 'interactive': true, 'radio-checked': checked, 'radio-disabled': disabled }) }, h("div", { class: "radio-icon" }, h("div", { class: "radio-inner" })), h("button", { type: "button", onFocus: this.onFocus, onBlur: this.onBlur, disabled: disabled })));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "color": ["colorChanged"],
        "checked": ["checkedChanged"],
        "disabled": ["disabledChanged"]
    }; }
    static get style() { return ":host {\n  /**\n   * \@prop --color: Color of the radio\n   * \@prop --color-checked: Color of the checked radio\n   */\n  display: inline-block;\n  position: relative;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  z-index: 2;\n}\n\n:host(.radio-disabled) {\n  pointer-events: none;\n}\n\n.radio-icon {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  contain: layout size style;\n}\n\nbutton {\n  left: 0;\n  top: 0;\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  outline: none;\n}\n[dir=rtl] button, :host-context([dir=rtl]) button {\n  left: unset;\n  right: unset;\n  right: 0;\n}\n\nbutton::-moz-focus-inner {\n  border: 0;\n}\n\n.radio-icon,\n.radio-inner {\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n:host {\n  --color-checked: var(--ion-color-primary, #3880ff);\n  width: 15px;\n  height: 24px;\n}\n\n:host(.ion-color.radio-checked) .radio-inner {\n  border-color: var(--ion-color-base);\n}\n\n.item-radio.item-ios ion-label {\n  margin-left: 0;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .item-radio.item-ios ion-label {\n    margin-left: unset;\n    -webkit-margin-start: 0;\n    margin-inline-start: 0;\n  }\n}\n\n.radio-inner {\n  width: 33%;\n  height: 50%;\n}\n\n:host(.radio-checked) .radio-inner {\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n  border-width: 2px;\n  border-top-width: 0;\n  border-left-width: 0;\n  border-style: solid;\n  border-color: var(--color-checked);\n}\n\n:host(.radio-disabled) {\n  opacity: 0.3;\n}\n\n:host(.ion-focused) .radio-icon::after {\n  border-radius: 50%;\n  left: -9px;\n  top: -8px;\n  display: block;\n  position: absolute;\n  width: 36px;\n  height: 36px;\n  background: var(--ion-color-primary-tint, #4c8dff);\n  content: \"\";\n  opacity: 0.2;\n}\n:host-context([dir=rtl]):host(.ion-focused) .radio-icon::after, :host-context([dir=rtl]).ion-focused .radio-icon::after {\n  left: unset;\n  right: unset;\n  right: -9px;\n}\n\n:host(.in-item) {\n  margin-left: 8px;\n  margin-right: 11px;\n  margin-top: 8px;\n  margin-bottom: 8px;\n  display: block;\n  position: static;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host(.in-item) {\n    margin-left: unset;\n    margin-right: unset;\n    -webkit-margin-start: 8px;\n    margin-inline-start: 8px;\n    -webkit-margin-end: 11px;\n    margin-inline-end: 11px;\n  }\n}\n\n:host(.in-item[slot=start]) {\n  margin-left: 3px;\n  margin-right: 21px;\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host(.in-item[slot=start]) {\n    margin-left: unset;\n    margin-right: unset;\n    -webkit-margin-start: 3px;\n    margin-inline-start: 3px;\n    -webkit-margin-end: 21px;\n    margin-inline-end: 21px;\n  }\n}"; }
};
let radioButtonIds = 0;

export { Radio as ion_radio };
