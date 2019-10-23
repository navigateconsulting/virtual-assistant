import { r as registerInstance, f as createEvent, c as getIonMode, i as config, h, H as Host, e as getElement } from './core-950489bb.js';
import { d as debounceEvent } from './helpers-ad941782.js';
import { c as createColorClasses } from './theme-215399f6.js';
import { s as sanitizeDOMString } from './index-6b565e81.js';

const Searchbar = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isCancelVisible = false;
        this.shouldAlignLeft = true;
        this.focused = false;
        this.noAnimate = true;
        /**
         * If `true`, enable searchbar animation.
         */
        this.animated = false;
        /**
         * Set the input's autocomplete property.
         */
        this.autocomplete = 'off';
        /**
         * Set the input's autocorrect property.
         */
        this.autocorrect = 'off';
        /**
         * Set the cancel button icon. Only applies to `md` mode.
         */
        this.cancelButtonIcon = 'md-arrow-back';
        /**
         * Set the the cancel button text. Only applies to `ios` mode.
         */
        this.cancelButtonText = 'Cancel';
        /**
         * Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke.
         */
        this.debounce = 250;
        /**
         * If `true`, the user cannot interact with the input.
         */
        this.disabled = false;
        /**
         * A hint to the browser for which keyboard to display.
         * Possible values: `"none"`, `"text"`, `"tel"`, `"url"`,
         * `"email"`, `"numeric"`, `"decimal"`, and `"search"`.
         */
        this.inputmode = 'search';
        /**
         * Set the input's placeholder.
         * `placeholder` can accept either plaintext or HTML as a string.
         * To display characters normally reserved for HTML, they
         * must be escaped. For example `<Ionic>` would become
         * `&lt;Ionic&gt;`
         *
         * For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
         */
        this.placeholder = 'Search';
        /**
         * The icon to use as the search icon.
         */
        this.searchIcon = 'search';
        /**
         * Sets the behavior for the cancel button. Defaults to `"never"`.
         * Setting to `"focus"` shows the cancel button on focus.
         * Setting to `"never"` hides the cancel button.
         * Setting to `"always"` shows the cancel button regardless
         * of focus state.
         */
        this.showCancelButton = 'never';
        /**
         * If `true`, enable spellcheck on the input.
         */
        this.spellcheck = false;
        /**
         * Set the type of the input.
         */
        this.type = 'search';
        /**
         * the value of the searchbar.
         */
        this.value = '';
        /**
         * Clears the input field and triggers the control change.
         */
        this.onClearInput = (ev) => {
            this.ionClear.emit();
            if (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
            // wait for 4 frames
            setTimeout(() => {
                const value = this.getValue();
                if (value !== '') {
                    this.value = '';
                    this.ionInput.emit();
                }
            }, 16 * 4);
        };
        /**
         * Clears the input field and tells the input to blur since
         * the clearInput function doesn't want the input to blur
         * then calls the custom cancel function if the user passed one in.
         */
        this.onCancelSearchbar = (ev) => {
            if (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            this.ionCancel.emit();
            this.onClearInput();
            if (this.nativeInput) {
                this.nativeInput.blur();
            }
        };
        /**
         * Update the Searchbar input value when the input changes
         */
        this.onInput = (ev) => {
            const input = ev.target;
            if (input) {
                this.value = input.value;
            }
            this.ionInput.emit(ev);
        };
        /**
         * Sets the Searchbar to not focused and checks if it should align left
         * based on whether there is a value in the searchbar or not.
         */
        this.onBlur = () => {
            this.focused = false;
            this.ionBlur.emit();
            this.positionElements();
        };
        /**
         * Sets the Searchbar to focused and active on input focus.
         */
        this.onFocus = () => {
            this.focused = true;
            this.ionFocus.emit();
            this.positionElements();
        };
        this.ionInput = createEvent(this, "ionInput", 7);
        this.ionChange = createEvent(this, "ionChange", 7);
        this.ionCancel = createEvent(this, "ionCancel", 7);
        this.ionClear = createEvent(this, "ionClear", 7);
        this.ionBlur = createEvent(this, "ionBlur", 7);
        this.ionFocus = createEvent(this, "ionFocus", 7);
        this.ionStyle = createEvent(this, "ionStyle", 7);
    }
    debounceChanged() {
        this.ionChange = debounceEvent(this.ionChange, this.debounce);
    }
    valueChanged() {
        const inputEl = this.nativeInput;
        const value = this.getValue();
        if (inputEl && inputEl.value !== value) {
            inputEl.value = value;
        }
        this.ionChange.emit({ value });
    }
    showCancelButtonChanged() {
        requestAnimationFrame(() => {
            this.positionElements();
            this.el.forceUpdate();
        });
    }
    connectedCallback() {
        this.emitStyle();
    }
    componentDidLoad() {
        if (this.showCancelButton === 'false' || this.showCancelButton === false) {
            console.warn('The boolean values of showCancelButton are deprecated. Please use "never" instead of "false".');
        }
        if (this.showCancelButton === '' || this.showCancelButton === 'true' || this.showCancelButton === true) {
            console.warn('The boolean values of showCancelButton are deprecated. Please use "focus" instead of "true".');
        }
        this.positionElements();
        this.debounceChanged();
        setTimeout(() => {
            this.noAnimate = false;
        }, 300);
    }
    emitStyle() {
        this.ionStyle.emit({
            'searchbar': true
        });
    }
    /**
     * Sets focus on the specified `ion-searchbar`. Use this method instead of the global
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
    /**
     * Positions the input search icon, placeholder, and the cancel button
     * based on the input value and if it is focused. (ios only)
     */
    positionElements() {
        const value = this.getValue();
        const prevAlignLeft = this.shouldAlignLeft;
        const mode = getIonMode(this);
        const shouldAlignLeft = (!this.animated || value.trim() !== '' || !!this.focused);
        this.shouldAlignLeft = shouldAlignLeft;
        if (mode !== 'ios') {
            return;
        }
        if (prevAlignLeft !== shouldAlignLeft) {
            this.positionPlaceholder();
        }
        if (this.animated) {
            this.positionCancelButton();
        }
    }
    /**
     * Positions the input placeholder
     */
    positionPlaceholder() {
        const inputEl = this.nativeInput;
        if (!inputEl) {
            return;
        }
        const isRTL = document.dir === 'rtl';
        const iconEl = (this.el.shadowRoot || this.el).querySelector('.searchbar-search-icon');
        if (this.shouldAlignLeft) {
            inputEl.removeAttribute('style');
            iconEl.removeAttribute('style');
        }
        else {
            // Create a dummy span to get the placeholder width
            const doc = document;
            const tempSpan = doc.createElement('span');
            tempSpan.innerHTML = sanitizeDOMString(this.placeholder) || '';
            doc.body.appendChild(tempSpan);
            // Get the width of the span then remove it
            const textWidth = tempSpan.offsetWidth;
            tempSpan.remove();
            // Calculate the input padding
            const inputLeft = 'calc(50% - ' + (textWidth / 2) + 'px)';
            // Calculate the icon margin
            const iconLeft = 'calc(50% - ' + ((textWidth / 2) + 30) + 'px)';
            // Set the input padding start and icon margin start
            if (isRTL) {
                inputEl.style.paddingRight = inputLeft;
                iconEl.style.marginRight = iconLeft;
            }
            else {
                inputEl.style.paddingLeft = inputLeft;
                iconEl.style.marginLeft = iconLeft;
            }
        }
    }
    /**
     * Show the iOS Cancel button on focus, hide it offscreen otherwise
     */
    positionCancelButton() {
        const isRTL = document.dir === 'rtl';
        const cancelButton = (this.el.shadowRoot || this.el).querySelector('.searchbar-cancel-button');
        const shouldShowCancel = this.shouldShowCancelButton();
        if (cancelButton && shouldShowCancel !== this.isCancelVisible) {
            const cancelStyle = cancelButton.style;
            this.isCancelVisible = shouldShowCancel;
            if (shouldShowCancel) {
                if (isRTL) {
                    cancelStyle.marginLeft = '0';
                }
                else {
                    cancelStyle.marginRight = '0';
                }
            }
            else {
                const offset = cancelButton.offsetWidth;
                if (offset > 0) {
                    if (isRTL) {
                        cancelStyle.marginLeft = -offset + 'px';
                    }
                    else {
                        cancelStyle.marginRight = -offset + 'px';
                    }
                }
            }
        }
    }
    getValue() {
        return this.value || '';
    }
    hasValue() {
        return this.getValue() !== '';
    }
    /**
     * Determines whether or not the cancel button should be visible onscreen.
     * Cancel button should be shown if one of two conditions applies:
     * 1. `showCancelButton` is set to `always`.
     * 2. `showCancelButton` is set to `focus`, and the searchbar has been focused.
     */
    shouldShowCancelButton() {
        if (isCancelButtonSetToNever(this.showCancelButton) ||
            (isCancelButtonSetToFocus(this.showCancelButton) && !this.focused)) {
            return false;
        }
        return true;
    }
    render() {
        const animated = this.animated && config.getBoolean('animated', true);
        const mode = getIonMode(this);
        const clearIcon = this.clearIcon || (mode === 'ios' ? 'ios-close-circle' : 'md-close');
        const searchIcon = this.searchIcon;
        const cancelButton = !isCancelButtonSetToNever(this.showCancelButton) && (h("button", { "aria-label": "cancel", type: "button", tabIndex: mode === 'ios' && !this.shouldShowCancelButton() ? -1 : undefined, onMouseDown: this.onCancelSearchbar, onTouchStart: this.onCancelSearchbar, class: "searchbar-cancel-button" }, h("div", null, mode === 'md'
            ? h("ion-icon", { "aria-hidden": "true", mode: mode, icon: this.cancelButtonIcon, lazy: false })
            : this.cancelButtonText)));
        return (h(Host, { role: "search", "aria-disabled": this.disabled ? 'true' : null, class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true, 'searchbar-animated': animated, 'searchbar-disabled': this.disabled, 'searchbar-no-animate': animated && this.noAnimate, 'searchbar-has-value': this.hasValue(), 'searchbar-left-aligned': this.shouldAlignLeft, 'searchbar-has-focus': this.focused, 'searchbar-should-show-cancel': this.shouldShowCancelButton() }) }, h("div", { class: "searchbar-input-container" }, h("input", { "aria-label": "search text", disabled: this.disabled, ref: el => this.nativeInput = el, class: "searchbar-input", inputMode: this.inputmode, onInput: this.onInput, onBlur: this.onBlur, onFocus: this.onFocus, placeholder: this.placeholder, type: this.type, value: this.getValue(), autoComplete: this.autocomplete, autoCorrect: this.autocorrect, spellCheck: this.spellcheck }), mode === 'md' && cancelButton, h("ion-icon", { mode: mode, icon: searchIcon, lazy: false, class: "searchbar-search-icon" }), h("button", { "aria-label": "reset", type: "button", "no-blur": true, class: "searchbar-clear-button", onMouseDown: this.onClearInput, onTouchStart: this.onClearInput }, h("ion-icon", { "aria-hidden": "true", mode: mode, icon: clearIcon, lazy: false, class: "searchbar-clear-icon" }))), mode === 'ios' && cancelButton));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "debounce": ["debounceChanged"],
        "value": ["valueChanged"],
        "showCancelButton": ["showCancelButtonChanged"]
    }; }
    static get style() { return ".sc-ion-searchbar-ios-h {\n  \n  --placeholder-color: initial;\n  --placeholder-font-style: initial;\n  --placeholder-font-weight: initial;\n  --placeholder-opacity: .5;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  -ms-flex-align: center;\n  align-items: center;\n  width: 100%;\n  color: var(--color);\n  font-family: var(--ion-font-family, inherit);\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.ion-color.sc-ion-searchbar-ios-h {\n  color: var(--ion-color-contrast);\n}\n\n.ion-color.sc-ion-searchbar-ios-h .searchbar-input.sc-ion-searchbar-ios {\n  background: var(--ion-color-base);\n}\n\n.ion-color.sc-ion-searchbar-ios-h .searchbar-clear-button.sc-ion-searchbar-ios, .ion-color.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios, .ion-color.sc-ion-searchbar-ios-h .searchbar-search-icon.sc-ion-searchbar-ios {\n  color: inherit;\n}\n\n.searchbar-search-icon.sc-ion-searchbar-ios {\n  color: var(--icon-color);\n  pointer-events: none;\n}\n\n.searchbar-input-container.sc-ion-searchbar-ios {\n  display: block;\n  position: relative;\n  -ms-flex-negative: 1;\n  flex-shrink: 1;\n  width: 100%;\n}\n\n.searchbar-input.sc-ion-searchbar-ios {\n  font-family: inherit;\n  font-size: inherit;\n  font-style: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  text-decoration: inherit;\n  text-overflow: inherit;\n  text-transform: inherit;\n  text-align: inherit;\n  white-space: inherit;\n  color: inherit;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  display: block;\n  width: 100%;\n  border: 0;\n  outline: none;\n  background: var(--background);\n  font-family: inherit;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n.searchbar-input.sc-ion-searchbar-ios::-webkit-input-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.searchbar-input.sc-ion-searchbar-ios::-moz-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.searchbar-input.sc-ion-searchbar-ios:-ms-input-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.searchbar-input.sc-ion-searchbar-ios::-ms-input-placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.searchbar-input.sc-ion-searchbar-ios::placeholder {\n  color: var(--placeholder-color);\n  font-family: inherit;\n  font-style: var(--placeholder-font-style);\n  font-weight: var(--placeholder-font-weight);\n  opacity: var(--placeholder-opacity);\n}\n.searchbar-input.sc-ion-searchbar-ios::-webkit-search-cancel-button, .searchbar-input.sc-ion-searchbar-ios::-ms-clear {\n  display: none;\n}\n\n.searchbar-cancel-button.sc-ion-searchbar-ios {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  display: none;\n  height: 100%;\n  border: 0;\n  outline: none;\n  color: var(--cancel-button-color);\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\n.searchbar-cancel-button.sc-ion-searchbar-ios > div.sc-ion-searchbar-ios {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n\n.searchbar-clear-button.sc-ion-searchbar-ios {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-left: 0;\n  padding-right: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n  display: none;\n  min-height: 0;\n  outline: none;\n  color: var(--clear-button-color);\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\n.searchbar-has-value.searchbar-has-focus.sc-ion-searchbar-ios-h .searchbar-clear-button.sc-ion-searchbar-ios {\n  display: block;\n}\n\n.searchbar-disabled.sc-ion-searchbar-ios-h {\n  cursor: default;\n  opacity: 0.4;\n  pointer-events: none;\n}\n\n.sc-ion-searchbar-ios-h {\n  --clear-button-color: var(--ion-color-step-600, #666666);\n  --cancel-button-color: var(--ion-color-primary, #3880ff);\n  --color: var(--ion-text-color, #000);\n  --icon-color: var(--ion-color-step-600, #666666);\n  --background: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.07);\n  padding-left: 12px;\n  padding-right: 12px;\n  padding-top: 12px;\n  padding-bottom: 12px;\n  height: 60px;\n  contain: strict;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .sc-ion-searchbar-ios-h {\n    padding-left: unset;\n    padding-right: unset;\n    -webkit-padding-start: 12px;\n    padding-inline-start: 12px;\n    -webkit-padding-end: 12px;\n    padding-inline-end: 12px;\n  }\n}\n\n.searchbar-input-container.sc-ion-searchbar-ios {\n  height: 36px;\n  contain: strict;\n}\n\n.searchbar-search-icon.sc-ion-searchbar-ios {\n  margin-left: calc(50% - 60px);\n  left: 5px;\n  top: 0;\n  position: absolute;\n  width: 22px;\n  height: 100%;\n  contain: strict;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .searchbar-search-icon.sc-ion-searchbar-ios {\n    margin-left: unset;\n    -webkit-margin-start: calc(50% - 60px);\n    margin-inline-start: calc(50% - 60px);\n  }\n}\n[dir=rtl].sc-ion-searchbar-ios .searchbar-search-icon.sc-ion-searchbar-ios, [dir=rtl].sc-ion-searchbar-ios-h .searchbar-search-icon.sc-ion-searchbar-ios, [dir=rtl] .sc-ion-searchbar-ios-h .searchbar-search-icon.sc-ion-searchbar-ios {\n  left: unset;\n  right: unset;\n  right: 5px;\n}\n\n.searchbar-input.sc-ion-searchbar-ios {\n  padding-left: 28px;\n  padding-right: 28px;\n  padding-top: 0;\n  padding-bottom: 0;\n  border-radius: 10px;\n  height: 100%;\n  font-size: 17px;\n  font-weight: 400;\n  contain: strict;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .searchbar-input.sc-ion-searchbar-ios {\n    padding-left: unset;\n    padding-right: unset;\n    -webkit-padding-start: 28px;\n    padding-inline-start: 28px;\n    -webkit-padding-end: 28px;\n    padding-inline-end: 28px;\n  }\n}\n\n.searchbar-clear-button.sc-ion-searchbar-ios {\n  right: 0;\n  top: 0;\n  background-position: center;\n  position: absolute;\n  width: 30px;\n  height: 100%;\n  border: 0;\n  background-color: transparent;\n}\n[dir=rtl].sc-ion-searchbar-ios .searchbar-clear-button.sc-ion-searchbar-ios, [dir=rtl].sc-ion-searchbar-ios-h .searchbar-clear-button.sc-ion-searchbar-ios, [dir=rtl] .sc-ion-searchbar-ios-h .searchbar-clear-button.sc-ion-searchbar-ios {\n  left: unset;\n  right: unset;\n  left: 0;\n}\n\n.searchbar-clear-icon.sc-ion-searchbar-ios {\n  width: 18px;\n  height: 100%;\n}\n\n.searchbar-cancel-button.sc-ion-searchbar-ios {\n  padding-left: 8px;\n  padding-right: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  background-color: transparent;\n  font-size: 16px;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .searchbar-cancel-button.sc-ion-searchbar-ios {\n    padding-left: unset;\n    padding-right: unset;\n    -webkit-padding-start: 8px;\n    padding-inline-start: 8px;\n    -webkit-padding-end: 0;\n    padding-inline-end: 0;\n  }\n}\n\n.searchbar-left-aligned.sc-ion-searchbar-ios-h .searchbar-search-icon.sc-ion-searchbar-ios {\n  margin-left: 0;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .searchbar-left-aligned.sc-ion-searchbar-ios-h .searchbar-search-icon.sc-ion-searchbar-ios {\n    margin-left: unset;\n    -webkit-margin-start: 0;\n    margin-inline-start: 0;\n  }\n}\n\n.searchbar-left-aligned.sc-ion-searchbar-ios-h .searchbar-input.sc-ion-searchbar-ios {\n  padding-left: 30px;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .searchbar-left-aligned.sc-ion-searchbar-ios-h .searchbar-input.sc-ion-searchbar-ios {\n    padding-left: unset;\n    -webkit-padding-start: 30px;\n    padding-inline-start: 30px;\n  }\n}\n\n.searchbar-has-focus.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios, .searchbar-should-show-cancel.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios, .searchbar-animated.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios {\n  display: block;\n}\n\n.searchbar-animated.sc-ion-searchbar-ios-h .searchbar-search-icon.sc-ion-searchbar-ios, .searchbar-animated.sc-ion-searchbar-ios-h .searchbar-input.sc-ion-searchbar-ios {\n  -webkit-transition: all 300ms ease;\n  transition: all 300ms ease;\n}\n\n.searchbar-animated.searchbar-has-focus.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios, .searchbar-animated.searchbar-should-show-cancel.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios {\n  opacity: 1;\n  pointer-events: auto;\n}\n\n.searchbar-animated.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios {\n  margin-right: -100%;\n  -webkit-transform: translate3d(0,  0,  0);\n  transform: translate3d(0,  0,  0);\n  -webkit-transition: all 300ms ease;\n  transition: all 300ms ease;\n  opacity: 0;\n  pointer-events: none;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .searchbar-animated.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios {\n    margin-right: unset;\n    -webkit-margin-end: -100%;\n    margin-inline-end: -100%;\n  }\n}\n\n.searchbar-no-animate.sc-ion-searchbar-ios-h .searchbar-search-icon.sc-ion-searchbar-ios, .searchbar-no-animate.sc-ion-searchbar-ios-h .searchbar-input.sc-ion-searchbar-ios, .searchbar-no-animate.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios {\n  -webkit-transition-duration: 0ms;\n  transition-duration: 0ms;\n}\n\n.ion-color.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios {\n  color: var(--ion-color-base);\n}\n\n\@media (any-hover: hover) {\n  .ion-color.sc-ion-searchbar-ios-h .searchbar-cancel-button.sc-ion-searchbar-ios:hover {\n    color: var(--ion-color-tint);\n  }\n}\nion-toolbar.sc-ion-searchbar-ios-h, ion-toolbar .sc-ion-searchbar-ios-h {\n  padding-top: 1px;\n  padding-bottom: 15px;\n  height: 52px;\n}\nion-toolbar.ion-color.sc-ion-searchbar-ios-h:not(.ion-color), ion-toolbar.ion-color .sc-ion-searchbar-ios-h:not(.ion-color) {\n  color: inherit;\n}\n\nion-toolbar.ion-color.sc-ion-searchbar-ios-h:not(.ion-color) .searchbar-cancel-button.sc-ion-searchbar-ios, ion-toolbar.ion-color .sc-ion-searchbar-ios-h:not(.ion-color) .searchbar-cancel-button.sc-ion-searchbar-ios {\n  color: currentColor;\n}\n\nion-toolbar.ion-color.sc-ion-searchbar-ios-h .searchbar-search-icon.sc-ion-searchbar-ios, ion-toolbar.ion-color .sc-ion-searchbar-ios-h .searchbar-search-icon.sc-ion-searchbar-ios {\n  color: currentColor;\n  opacity: 0.5;\n}\n\nion-toolbar.ion-color.sc-ion-searchbar-ios-h:not(.ion-color) .searchbar-input.sc-ion-searchbar-ios, ion-toolbar.ion-color .sc-ion-searchbar-ios-h:not(.ion-color) .searchbar-input.sc-ion-searchbar-ios {\n  background: rgba(var(--ion-color-contrast-rgb), 0.07);\n  color: currentColor;\n}\n\nion-toolbar.ion-color.sc-ion-searchbar-ios-h:not(.ion-color) .searchbar-clear-button.sc-ion-searchbar-ios, ion-toolbar.ion-color .sc-ion-searchbar-ios-h:not(.ion-color) .searchbar-clear-button.sc-ion-searchbar-ios {\n  color: currentColor;\n  opacity: 0.5;\n}"; }
};
/**
 * Check if the cancel button should never be shown.
 *
 * TODO: Remove this when the `true` and `false`
 * options are removed.
 */
const isCancelButtonSetToNever = (showCancelButton) => {
    return (showCancelButton === 'never' ||
        showCancelButton === 'false' ||
        showCancelButton === false);
};
/**
 * Check if the cancel button should be shown on focus.
 *
 * TODO: Remove this when the `true` and `false`
 * options are removed.
 */
const isCancelButtonSetToFocus = (showCancelButton) => {
    return (showCancelButton === 'focus' ||
        showCancelButton === 'true' ||
        showCancelButton === true ||
        showCancelButton === '');
};

export { Searchbar as ion_searchbar };
