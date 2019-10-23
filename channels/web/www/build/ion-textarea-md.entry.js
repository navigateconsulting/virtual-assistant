import { r as registerInstance, f as createEvent, B as Build, d as readTask, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';
import { d as debounceEvent, f as findItemLabel } from './helpers-ad941782.js';
import { c as createColorClasses } from './theme-215399f6.js';

const Textarea = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.inputId = `ion-input-${textareaIds++}`;
        this.didBlurAfterEdit = false;
        this.hasFocus = false;
        /**
         * Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user.
         */
        this.autocapitalize = 'none';
        /**
         * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
         */
        this.autofocus = false;
        /**
         * If `true`, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
         */
        this.clearOnEdit = false;
        /**
         * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke.
         */
        this.debounce = 0;
        /**
         * If `true`, the user cannot interact with the textarea.
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
         * If `true`, the element height will increase based on the value.
         */
        this.autoGrow = false;
        /**
         * The value of the textarea.
         */
        this.value = '';
        this.onInput = (ev) => {
            if (this.nativeInput) {
                this.value = this.nativeInput.value;
            }
            this.emitStyle();
            this.ionInput.emit(ev);
        };
        this.onFocus = () => {
            this.hasFocus = true;
            this.focusChange();
            this.ionFocus.emit();
        };
        this.onBlur = () => {
            this.hasFocus = false;
            this.focusChange();
            this.ionBlur.emit();
        };
        this.onKeyDown = () => {
            this.checkClearOnEdit();
        };
        this.ionChange = createEvent(this, "ionChange", 7);
        this.ionInput = createEvent(this, "ionInput", 7);
        this.ionStyle = createEvent(this, "ionStyle", 7);
        this.ionBlur = createEvent(this, "ionBlur", 7);
        this.ionFocus = createEvent(this, "ionFocus", 7);
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
        const nativeInput = this.nativeInput;
        const value = this.getValue();
        if (nativeInput && nativeInput.value !== value) {
            nativeInput.value = value;
        }
        this.runAutoGrow();
        this.emitStyle();
        this.ionChange.emit({ value });
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
    componentDidLoad() {
        this.runAutoGrow();
    }
    // TODO: performance hit, this cause layout thrashing
    runAutoGrow() {
        const nativeInput = this.nativeInput;
        if (nativeInput && this.autoGrow) {
            readTask(() => {
                nativeInput.style.height = 'inherit';
                nativeInput.style.height = nativeInput.scrollHeight + 'px';
            });
        }
    }
    /**
     * Sets focus on the specified `ion-textarea`. Use this method instead of the global
     * `input.focus()`.
     */
    async setFocus() {
        if (this.nativeInput) {
            this.nativeInput.focus();
        }
    }
    /**
     * Returns the native `<textarea>` element used under the hood.
     */
    getInputElement() {
        return Promise.resolve(this.nativeInput);
    }
    emitStyle() {
        this.ionStyle.emit({
            'interactive': true,
            'textarea': true,
            'input': true,
            'interactive-disabled': this.disabled,
            'has-placeholder': this.placeholder != null,
            'has-value': this.hasValue(),
            'has-focus': this.hasFocus
        });
    }
    /**
     * Check if we need to clear the text input if clearOnEdit is enabled
     */
    checkClearOnEdit() {
        if (!this.clearOnEdit) {
            return;
        }
        // Did the input value change after it was blurred and edited?
        if (this.didBlurAfterEdit && this.hasValue()) {
            // Clear the input
            this.value = '';
        }
        // Reset the flag
        this.didBlurAfterEdit = false;
    }
    focusChange() {
        // If clearOnEdit is enabled and the input blurred but has a value, set a flag
        if (this.clearOnEdit && !this.hasFocus && this.hasValue()) {
            this.didBlurAfterEdit = true;
        }
        this.emitStyle();
    }
    hasValue() {
        return this.getValue() !== '';
    }
    getValue() {
        return this.value || '';
    }
    render() {
        const mode = getIonMode(this);
        const value = this.getValue();
        const labelId = this.inputId + '-lbl';
        const label = findItemLabel(this.el);
        if (label) {
            label.id = labelId;
        }
        return (h(Host, { "aria-disabled": this.disabled ? 'true' : null, class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true }) }, h("textarea", { class: "native-textarea", ref: el => this.nativeInput = el, autoCapitalize: this.autocapitalize, autoFocus: this.autofocus, disabled: this.disabled, maxLength: this.maxlength, minLength: this.minlength, name: this.name, placeholder: this.placeholder || '', readOnly: this.readonly, required: this.required, spellCheck: this.spellcheck, cols: this.cols, rows: this.rows, wrap: this.wrap, onInput: this.onInput, onBlur: this.onBlur, onFocus: this.onFocus, onKeyDown: this.onKeyDown }, value)));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "debounce": ["debounceChanged"],
        "disabled": ["disabledChanged"],
        "value": ["valueChanged"]
    }; }
    static get style() { return ".sc-ion-textarea-md-h {\n  \n  --background: initial;\n  --color: initial;\n  --placeholder-color: initial;\n  --placeholder-font-style: initial;\n  --placeholder-font-weight: initial;\n  --placeholder-opacity: .5;\n  --padding-top: 0;\n  --padding-end: 0;\n  --padding-bottom: 0;\n  --padding-start: 0;\n  --border-radius: 0;\n  display: block;\n  position: relative;\n  -ms-flex: 1;\n  flex: 1;\n  width: 100%;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  background: var(--background);\n  color: var(--color);\n  font-family: var(--ion-font-family, inherit);\n  white-space: pre-wrap;\n  z-index: 2;\n}\n\n.ion-color.sc-ion-textarea-md-h {\n  background: initial;\n}\n\n.ion-color.sc-ion-textarea-md-h {\n  color: var(--ion-color-base);\n}\n\nion-item.sc-ion-textarea-md-h, ion-item .sc-ion-textarea-md-h {\n  -ms-flex-item-align: baseline;\n  align-self: baseline;\n}\n\nion-item.sc-ion-textarea-md-h:not(.item-label), ion-item:not(.item-label) .sc-ion-textarea-md-h {\n  --padding-start: 0;\n}\n\n.native-textarea.sc-ion-textarea-md {\n  border-radius: var(--border-radius);\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-left: var(--padding-start);\n  padding-right: var(--padding-end);\n  padding-top: var(--padding-top);\n  padding-bottom: var(--padding-bottom);\n  font-family: inherit;\n  font-size: inherit;\n  font-style: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  text-decoration: inherit;\n  text-overflow: inherit;\n  text-transform: inherit;\n  text-align: inherit;\n  white-space: inherit;\n  color: inherit;\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  max-height: 100%;\n  border: 0;\n  outline: none;\n  background: transparent;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  resize: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .native-textarea.sc-ion-textarea-md {\n    padding-left: unset;\n    padding-right: unset;\n    -webkit-padding-start: var(--padding-start);\n    padding-inline-start: var(--padding-start);\n    -webkit-padding-end: var(--padding-end);\n    padding-inline-end: var(--padding-end);\n  }\n}\n.native-textarea.sc-ion-textarea-md::-webkit-input-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.native-textarea.sc-ion-textarea-md::-moz-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.native-textarea.sc-ion-textarea-md:-ms-input-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.native-textarea.sc-ion-textarea-md::-ms-input-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.native-textarea.sc-ion-textarea-md::placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n\n.native-textarea[disabled].sc-ion-textarea-md {\n  opacity: 0.4;\n}\n\n.cloned-input.sc-ion-textarea-md {\n  left: 0;\n  top: 0;\n  position: absolute;\n  pointer-events: none;\n}\n[dir=rtl].sc-ion-textarea-md .cloned-input.sc-ion-textarea-md, [dir=rtl].sc-ion-textarea-md-h .cloned-input.sc-ion-textarea-md, [dir=rtl] .sc-ion-textarea-md-h .cloned-input.sc-ion-textarea-md {\n  left: unset;\n  right: unset;\n  right: 0;\n}\n\n.sc-ion-textarea-md-h {\n  --padding-top: 10px;\n  --padding-end: 0;\n  --padding-bottom: 11px;\n  --padding-start: 8px;\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 8px;\n  margin-bottom: 0;\n  font-size: inherit;\n}\n\n.item-label-stacked.sc-ion-textarea-md-h, .item-label-stacked .sc-ion-textarea-md-h, .item-label-floating.sc-ion-textarea-md-h, .item-label-floating .sc-ion-textarea-md-h {\n  --padding-top: 8px;\n  --padding-bottom: 8px;\n  --padding-start: 0;\n}"; }
};
let textareaIds = 0;

export { Textarea as ion_textarea };
