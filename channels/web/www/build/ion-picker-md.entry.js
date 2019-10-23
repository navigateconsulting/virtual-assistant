import { r as registerInstance, c as getIonMode, f as createEvent, h, H as Host, e as getElement } from './core-950489bb.js';
import './helpers-ad941782.js';
import { c as createAnimation } from './animation-0dc45050.js';
import { g as getClassMap } from './theme-215399f6.js';
import { p as prepareOverlay, a as present, b as dismiss, e as eventMethod, s as safeCall } from './overlays-a2b1b53e.js';

/**
 * iOS Picker Enter Animation
 */
const iosEnterAnimation = (baseEl) => {
    const baseAnimation = createAnimation();
    const backdropAnimation = createAnimation();
    const wrapperAnimation = createAnimation();
    backdropAnimation
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', 0.01, 0.26);
    wrapperAnimation
        .addElement(baseEl.querySelector('.picker-wrapper'))
        .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
    return baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
};

/**
 * iOS Picker Leave Animation
 */
const iosLeaveAnimation = (baseEl) => {
    const baseAnimation = createAnimation();
    const backdropAnimation = createAnimation();
    const wrapperAnimation = createAnimation();
    backdropAnimation
        .addElement(baseEl.querySelector('ion-backdrop'))
        .fromTo('opacity', 0.26, 0.01);
    wrapperAnimation
        .addElement(baseEl.querySelector('.picker-wrapper'))
        .fromTo('transform', 'translateY(0%)', 'translateY(100%)');
    return baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
};

const Picker = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.mode = getIonMode(this);
        this.presented = false;
        /**
         * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
         */
        this.keyboardClose = true;
        /**
         * Array of buttons to be displayed at the top of the picker.
         */
        this.buttons = [];
        /**
         * Array of columns to be displayed in the picker.
         */
        this.columns = [];
        /**
         * Number of milliseconds to wait before dismissing the picker.
         */
        this.duration = 0;
        /**
         * If `true`, a backdrop will be displayed behind the picker.
         */
        this.showBackdrop = true;
        /**
         * If `true`, the picker will be dismissed when the backdrop is clicked.
         */
        this.backdropDismiss = true;
        /**
         * If `true`, the picker will animate.
         */
        this.animated = true;
        this.onBackdropTap = () => {
            const cancelBtn = this.buttons.find(b => b.role === 'cancel');
            if (cancelBtn) {
                this.buttonClick(cancelBtn);
            }
            else {
                this.dismiss();
            }
        };
        prepareOverlay(this.el);
        this.didPresent = createEvent(this, "ionPickerDidPresent", 7);
        this.willPresent = createEvent(this, "ionPickerWillPresent", 7);
        this.willDismiss = createEvent(this, "ionPickerWillDismiss", 7);
        this.didDismiss = createEvent(this, "ionPickerDidDismiss", 7);
    }
    /**
     * Present the picker overlay after it has been created.
     */
    async present() {
        await present(this, 'pickerEnter', iosEnterAnimation, iosEnterAnimation, undefined);
        if (this.duration > 0) {
            this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
        }
    }
    /**
     * Dismiss the picker overlay after it has been presented.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the picker.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the picker.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     */
    dismiss(data, role) {
        if (this.durationTimeout) {
            clearTimeout(this.durationTimeout);
        }
        return dismiss(this, data, role, 'pickerLeave', iosLeaveAnimation, iosLeaveAnimation);
    }
    /**
     * Returns a promise that resolves when the picker did dismiss.
     */
    onDidDismiss() {
        return eventMethod(this.el, 'ionPickerDidDismiss');
    }
    /**
     * Returns a promise that resolves when the picker will dismiss.
     */
    onWillDismiss() {
        return eventMethod(this.el, 'ionPickerWillDismiss');
    }
    /**
     * Get the column that matches the specified name.
     *
     * @param name The name of the column.
     */
    getColumn(name) {
        return Promise.resolve(this.columns.find(column => column.name === name));
    }
    buttonClick(button) {
        // if (this.disabled) {
        //   return;
        // }
        // keep the time of the most recent button click
        // a handler has been provided, execute it
        // pass the handler the values from the inputs
        const shouldDismiss = safeCall(button.handler, this.getSelected()) !== false;
        if (shouldDismiss) {
            return this.dismiss();
        }
        return Promise.resolve(false);
    }
    getSelected() {
        const selected = {};
        this.columns.forEach((col, index) => {
            const selectedColumn = col.selectedIndex !== undefined
                ? col.options[col.selectedIndex]
                : undefined;
            selected[col.name] = {
                text: selectedColumn ? selectedColumn.text : undefined,
                value: selectedColumn ? selectedColumn.value : undefined,
                columnIndex: index
            };
        });
        return selected;
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { "aria-modal": "true", class: Object.assign({ [mode]: true,
                // Used internally for styling
                [`picker-${mode}`]: true }, getClassMap(this.cssClass)), style: {
                zIndex: `${20000 + this.overlayIndex}`
            }, onIonBackdropTap: this.onBackdropTap }, h("ion-backdrop", { visible: this.showBackdrop, tappable: this.backdropDismiss }), h("div", { class: "picker-wrapper", role: "dialog" }, h("div", { class: "picker-toolbar" }, this.buttons.map(b => (h("div", { class: buttonWrapperClass(b) }, h("button", { type: "button", onClick: () => this.buttonClick(b), class: buttonClass(b) }, b.text))))), h("div", { class: "picker-columns" }, h("div", { class: "picker-above-highlight" }), this.presented && this.columns.map(c => h("ion-picker-column", { col: c })), h("div", { class: "picker-below-highlight" })))));
    }
    get el() { return getElement(this); }
    static get style() { return ".sc-ion-picker-md-h {\n  \n  --border-radius: 0;\n  --border-style: solid;\n  --min-width: auto;\n  --width: 100%;\n  --max-width: 500px;\n  --min-height: auto;\n  --max-height: auto;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  left: 0;\n  top: 0;\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  font-family: var(--ion-font-family, inherit);\n  contain: strict;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  z-index: 1001;\n}\n[dir=rtl].sc-ion-picker-md-h, [dir=rtl] .sc-ion-picker-md-h {\n  left: unset;\n  right: unset;\n  right: 0;\n}\n\n.overlay-hidden.sc-ion-picker-md-h {\n  display: none;\n}\n\n.picker-wrapper.sc-ion-picker-md {\n  border-radius: var(--border-radius);\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: auto;\n  margin-bottom: auto;\n  -webkit-transform: translate3d(0,  100%,  0);\n  transform: translate3d(0,  100%,  0);\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  width: var(--width);\n  min-width: var(--min-width);\n  max-width: var(--max-width);\n  height: var(--height);\n  min-height: var(--min-height);\n  max-height: var(--max-height);\n  border-width: var(--border-width);\n  border-style: var(--border-style);\n  border-color: var(--border-color);\n  background: var(--background);\n  contain: strict;\n  overflow: hidden;\n  z-index: 10;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .picker-wrapper.sc-ion-picker-md {\n    margin-left: unset;\n    margin-right: unset;\n    -webkit-margin-start: auto;\n    margin-inline-start: auto;\n    -webkit-margin-end: auto;\n    margin-inline-end: auto;\n  }\n}\n\n.picker-toolbar.sc-ion-picker-md {\n  width: 100%;\n  background: transparent;\n  contain: strict;\n  z-index: 1;\n}\n\n.picker-button.sc-ion-picker-md {\n  border: 0;\n  font-family: inherit;\n}\n\n.picker-button.sc-ion-picker-md:active, .picker-button.sc-ion-picker-md:focus {\n  outline: none;\n}\n\n.picker-columns.sc-ion-picker-md {\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  -ms-flex-pack: center;\n  justify-content: center;\n  margin-bottom: var(--ion-safe-area-bottom, 0);\n  contain: strict;\n  direction: ltr;\n  overflow: hidden;\n}\n\n.picker-above-highlight.sc-ion-picker-md, .picker-below-highlight.sc-ion-picker-md {\n  display: none;\n  pointer-events: none;\n}\n\n.sc-ion-picker-md-h {\n  --background: var(--ion-background-color, #fff);\n  --border-width: 0.55px 0 0;\n  --border-color: var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-150, rgba(0, 0, 0, 0.13))));\n  --height: 260px;\n  color: var(--ion-item-color, var(--ion-text-color, #000));\n}\n\n.picker-toolbar.sc-ion-picker-md {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  height: 44px;\n}\n\n.picker-button.sc-ion-picker-md, .picker-button.activated.sc-ion-picker-md {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-left: 1.1em;\n  padding-right: 1.1em;\n  padding-top: 0;\n  padding-bottom: 0;\n  height: 44px;\n  background: transparent;\n  color: var(--ion-color-primary, #3880ff);\n  font-size: 14px;\n  font-weight: 500;\n  text-transform: uppercase;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .picker-button.sc-ion-picker-md, .picker-button.activated.sc-ion-picker-md {\n    padding-left: unset;\n    padding-right: unset;\n    -webkit-padding-start: 1.1em;\n    padding-inline-start: 1.1em;\n    -webkit-padding-end: 1.1em;\n    padding-inline-end: 1.1em;\n  }\n}\n\n.picker-columns.sc-ion-picker-md {\n  height: 216px;\n  -webkit-perspective: 1800px;\n  perspective: 1800px;\n}\n\n.picker-above-highlight.sc-ion-picker-md {\n  left: 0;\n  top: 0;\n  -webkit-transform: translate3d(0,  0,  90px);\n  transform: translate3d(0,  0,  90px);\n  position: absolute;\n  width: 100%;\n  height: 81px;\n  border-bottom: 1px solid var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-150, rgba(0, 0, 0, 0.13))));\n  background: -webkit-gradient(linear, left top, left bottom, color-stop(20%, var(--ion-background-color, #fff)), to(rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8)));\n  background: linear-gradient(to bottom, var(--ion-background-color, #fff) 20%, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8) 100%);\n  z-index: 10;\n}\n[dir=rtl].sc-ion-picker-md .picker-above-highlight.sc-ion-picker-md, [dir=rtl].sc-ion-picker-md-h .picker-above-highlight.sc-ion-picker-md, [dir=rtl] .sc-ion-picker-md-h .picker-above-highlight.sc-ion-picker-md {\n  left: unset;\n  right: unset;\n  right: 0;\n}\n\n.picker-below-highlight.sc-ion-picker-md {\n  left: 0;\n  top: 115px;\n  -webkit-transform: translate3d(0,  0,  90px);\n  transform: translate3d(0,  0,  90px);\n  position: absolute;\n  width: 100%;\n  height: 119px;\n  border-top: 1px solid var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-150, rgba(0, 0, 0, 0.13))));\n  background: -webkit-gradient(linear, left bottom, left top, color-stop(30%, var(--ion-background-color, #fff)), to(rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8)));\n  background: linear-gradient(to top, var(--ion-background-color, #fff) 30%, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8) 100%);\n  z-index: 11;\n}\n[dir=rtl].sc-ion-picker-md .picker-below-highlight.sc-ion-picker-md, [dir=rtl].sc-ion-picker-md-h .picker-below-highlight.sc-ion-picker-md, [dir=rtl] .sc-ion-picker-md-h .picker-below-highlight.sc-ion-picker-md {\n  left: unset;\n  right: unset;\n  right: 0;\n}"; }
};
const buttonWrapperClass = (button) => {
    return {
        [`picker-toolbar-${button.role}`]: button.role !== undefined,
        'picker-toolbar-button': true
    };
};
const buttonClass = (button) => {
    return Object.assign({ 'picker-button': true, 'ion-activatable': true }, getClassMap(button.cssClass));
};

export { Picker as ion_picker };
