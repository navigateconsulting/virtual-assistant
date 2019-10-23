import { r as registerInstance, f as createEvent, B as Build, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';
import { d as debounceEvent, f as findItemLabel } from './helpers-ad941782.js';
import { c as createColorClasses } from './theme-215399f6.js';

const Input = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.inputId = `ion-input-${inputIds++}`;
        this.didBlurAfterEdit = false;
        this.hasFocus = false;
        /**
         * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
         */
        this.autocapitalize = 'off';
        /**
         * Indicates whether the value of the control can be automatically completed by the browser.
         */
        this.autocomplete = 'off';
        /**
         * Whether auto correction should be enabled when the user is entering/editing the text value.
         */
        this.autocorrect = 'off';
        /**
         * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
         */
        this.autofocus = false;
        /**
         * If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input.
         */
        this.clearInput = false;
        /**
         * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke.
         */
        this.debounce = 0;
        /**
         * If `true`, the user cannot interact with the input.
         */
        this.disabled = false;
        /**
         * The name of the control, which is submitted with the form data.
         */
        this.name = this.inputId;
        /**
         * If `true`, the user cannot modify the value.
         */
        this.readonly = false;
        /**
         * If `true`, the user must fill in a value before submitting a form.
         */
        this.required = false;
        /**
         * If `true`, the element will have its spelling and grammar checked.
         */
        this.spellcheck = false;
        /**
         * The type of control to display. The default type is text.
         */
        this.type = 'text';
        /**
         * The value of the input.
         */
        this.value = '';
        this.onInput = (ev) => {
            const input = ev.target;
            if (input) {
                this.value = input.value || '';
            }
            this.ionInput.emit(ev);
        };
        this.onBlur = () => {
            this.hasFocus = false;
            this.focusChanged();
            this.emitStyle();
            this.ionBlur.emit();
        };
        this.onFocus = () => {
            this.hasFocus = true;
            this.focusChanged();
            this.emitStyle();
            this.ionFocus.emit();
        };
        this.onKeydown = () => {
            if (this.shouldClearOnEdit()) {
                // Did the input value change after it was blurred and edited?
                if (this.didBlurAfterEdit && this.hasValue()) {
                    // Clear the input
                    this.clearTextInput();
                }
                // Reset the flag
                this.didBlurAfterEdit = false;
            }
        };
        this.clearTextInput = (ev) => {
            if (this.clearInput && !this.readonly && !this.disabled && ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            this.value = '';
            /**
             * This is needed for clearOnEdit
             * Otherwise the value will not be cleared
             * if user is inside the input
             */
            if (this.nativeInput) {
                this.nativeInput.value = '';
            }
        };
        this.ionInput = createEvent(this, "ionInput", 7);
        this.ionChange = createEvent(this, "ionChange", 7);
        this.ionBlur = createEvent(this, "ionBlur", 7);
        this.ionFocus = createEvent(this, "ionFocus", 7);
        this.ionInputDidLoad = createEvent(this, "ionInputDidLoad", 7);
        this.ionInputDidUnload = createEvent(this, "ionInputDidUnload", 7);
        this.ionStyle = createEvent(this, "ionStyle", 7);
    }
    debounceChanged() {
        this.ionChange = debounceEvent(this.ionChange, this.debounce);
    }
    disabledChanged() {
        this.emitStyle();
    }
    /**
     * Update the native input element when the value changes
     */
    valueChanged() {
        this.emitStyle();
        this.ionChange.emit({ value: this.value });
    }
    connectedCallback() {
        this.emitStyle();
        this.debounceChanged();
        if (Build.isBrowser) {
            this.el.dispatchEvent(new CustomEvent('ionInputDidLoad', {
                detail: this.el
            }));
        }
    }
    disconnectedCallback() {
        if (Build.isBrowser) {
            document.dispatchEvent(new CustomEvent('ionInputDidUnload', {
                detail: this.el
            }));
        }
    }
    /**
     * Sets focus on the specified `ion-input`. Use this method instead of the global
     * `input.focus()`.
     */
    async setFocus() {
        if (this.nativeInput) {
            this.nativeInput.focus();
        }
    }
    /**
     * Returns the native `<input>` element used under the hood.
     */
    getInputElement() {
        return Promise.resolve(this.nativeInput);
    }
    shouldClearOnEdit() {
        const { type, clearOnEdit } = this;
        return (clearOnEdit === undefined)
            ? type === 'password'
            : clearOnEdit;
    }
    getValue() {
        return this.value || '';
    }
    emitStyle() {
        this.ionStyle.emit({
            'interactive': true,
            'input': true,
            'has-placeholder': this.placeholder != null,
            'has-value': this.hasValue(),
            'has-focus': this.hasFocus,
            'interactive-disabled': this.disabled,
        });
    }
    focusChanged() {
        // If clearOnEdit is enabled and the input blurred but has a value, set a flag
        if (!this.hasFocus && this.shouldClearOnEdit() && this.hasValue()) {
            this.didBlurAfterEdit = true;
        }
    }
    hasValue() {
        return this.getValue().length > 0;
    }
    render() {
        const mode = getIonMode(this);
        const value = this.getValue();
        const labelId = this.inputId + '-lbl';
        const label = findItemLabel(this.el);
        if (label) {
            label.id = labelId;
        }
        return (h(Host, { "aria-disabled": this.disabled ? 'true' : null, class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true, 'has-value': this.hasValue(), 'has-focus': this.hasFocus }) }, h("input", { class: "native-input", ref: input => this.nativeInput = input, "aria-labelledby": labelId, disabled: this.disabled, accept: this.accept, autoCapitalize: this.autocapitalize, autoComplete: this.autocomplete, autoCorrect: this.autocorrect, autoFocus: this.autofocus, inputMode: this.inputmode, min: this.min, max: this.max, minLength: this.minlength, maxLength: this.maxlength, multiple: this.multiple, name: this.name, pattern: this.pattern, placeholder: this.placeholder || '', readOnly: this.readonly, required: this.required, spellCheck: this.spellcheck, step: this.step, size: this.size, type: this.type, value: value, onInput: this.onInput, onBlur: this.onBlur, onFocus: this.onFocus, onKeyDown: this.onKeydown }), (this.clearInput && !this.readonly && !this.disabled) && h("button", { type: "button", class: "input-clear-icon", tabindex: "-1", onTouchStart: this.clearTextInput, onMouseDown: this.clearTextInput })));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "debounce": ["debounceChanged"],
        "disabled": ["disabledChanged"],
        "value": ["valueChanged"]
    }; }
    static get style() { return ".sc-ion-input-md-h {\n  \n  --placeholder-color: initial;\n  --placeholder-font-style: initial;\n  --placeholder-font-weight: initial;\n  --placeholder-opacity: .5;\n  --padding-top: 0;\n  --padding-end: 0;\n  --padding-bottom: 0;\n  --padding-start: 0;\n  --background: transparent;\n  --color: initial;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  -ms-flex: 1;\n  flex: 1;\n  -ms-flex-align: center;\n  align-items: center;\n  width: 100%;\n  \n  padding: 0 !important;\n  background: var(--background);\n  color: var(--color);\n  font-family: var(--ion-font-family, inherit);\n  z-index: 2;\n}\n\nion-item.sc-ion-input-md-h:not(.item-label), ion-item:not(.item-label) .sc-ion-input-md-h {\n  --padding-start: 0;\n}\n\n.ion-color.sc-ion-input-md-h {\n  color: var(--ion-color-base);\n}\n\n.native-input.sc-ion-input-md {\n  border-radius: var(--border-radius);\n  padding-left: var(--padding-start);\n  padding-right: var(--padding-end);\n  padding-top: var(--padding-top);\n  padding-bottom: var(--padding-bottom);\n  font-family: inherit;\n  font-size: inherit;\n  font-style: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  text-decoration: inherit;\n  text-overflow: inherit;\n  text-transform: inherit;\n  text-align: inherit;\n  white-space: inherit;\n  color: inherit;\n  display: inline-block;\n  -ms-flex: 1;\n  flex: 1;\n  width: 100%;\n  max-width: 100%;\n  max-height: 100%;\n  border: 0;\n  outline: none;\n  background: transparent;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .native-input.sc-ion-input-md {\n    padding-left: unset;\n    padding-right: unset;\n    -webkit-padding-start: var(--padding-start);\n    padding-inline-start: var(--padding-start);\n    -webkit-padding-end: var(--padding-end);\n    padding-inline-end: var(--padding-end);\n  }\n}\n.native-input.sc-ion-input-md::-webkit-input-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.native-input.sc-ion-input-md::-moz-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.native-input.sc-ion-input-md:-ms-input-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.native-input.sc-ion-input-md::-ms-input-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.native-input.sc-ion-input-md::placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.native-input.sc-ion-input-md:-webkit-autofill {\n  background-color: transparent;\n}\n.native-input.sc-ion-input-md:invalid {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.native-input.sc-ion-input-md::-ms-clear {\n  display: none;\n}\n\n.native-input[disabled].sc-ion-input-md {\n  opacity: 0.4;\n}\n\n.cloned-input.sc-ion-input-md {\n  left: 0;\n  top: 0;\n  position: absolute;\n  pointer-events: none;\n}\n[dir=rtl].sc-ion-input-md .cloned-input.sc-ion-input-md, [dir=rtl].sc-ion-input-md-h .cloned-input.sc-ion-input-md, [dir=rtl] .sc-ion-input-md-h .cloned-input.sc-ion-input-md {\n  left: unset;\n  right: unset;\n  right: 0;\n}\n\n.input-clear-icon.sc-ion-input-md {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-left: 0;\n  padding-right: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n  background-position: center;\n  border: 0;\n  outline: none;\n  background-color: transparent;\n  background-repeat: no-repeat;\n  visibility: hidden;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\n.has-focus.has-value.sc-ion-input-md-h .input-clear-icon.sc-ion-input-md {\n  visibility: visible;\n}\n\n.has-focus.sc-ion-input-md-h {\n  pointer-events: none;\n}\n\n.has-focus.sc-ion-input-md-h input.sc-ion-input-md, .has-focus.sc-ion-input-md-h a.sc-ion-input-md, .has-focus.sc-ion-input-md-h button.sc-ion-input-md {\n  pointer-events: auto;\n}\n\n.sc-ion-input-md-h {\n  --padding-top: 10px;\n  --padding-end: 0;\n  --padding-bottom: 10px;\n  --padding-start: 8px;\n  font-size: inherit;\n}\n\n.item-label-stacked.sc-ion-input-md-h, .item-label-stacked .sc-ion-input-md-h, .item-label-floating.sc-ion-input-md-h, .item-label-floating .sc-ion-input-md-h {\n  --padding-top: 8px;\n  --padding-bottom: 8px;\n  --padding-start: 0;\n}\n\n.input-clear-icon.sc-ion-input-md {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,<svg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20512%20512\'><polygon%20fill=\'var(--ion-color-step-600,%20%23666666)\'%20points=\'405,136.798%20375.202,107%20256,226.202%20136.798,107%20107,136.798%20226.202,256%20107,375.202%20136.798,405%20256,285.798%20375.202,405%20405,375.202%20285.798,256\'/></svg>\");\n  width: 30px;\n  height: 30px;\n  background-size: 22px;\n}"; }
};
let inputIds = 0;

export { Input as ion_input };
