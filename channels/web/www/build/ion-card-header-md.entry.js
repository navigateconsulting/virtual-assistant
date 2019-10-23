import { r as registerInstance, c as getIonMode, h, H as Host } from './core-950489bb.js';
import { c as createColorClasses } from './theme-215399f6.js';

const CardHeader = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, the card header will be translucent.
         * Only applies when the mode is `"ios"` and the device supports
         * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         */
        this.translucent = false;
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), { 'card-header-translucent': this.translucent, [mode]: true }) }, h("slot", null)));
    }
    static get style() { return ":host {\n  display: block;\n  position: relative;\n  background: var(--background);\n  color: var(--color);\n}\n\n:host(.ion-color) {\n  background: var(--ion-color-base);\n  color: var(--ion-color-contrast);\n}\n\n:host(.ion-color) ::slotted(ion-card-title),\n:host(.ion-color) ::slotted(ion-card-subtitle) {\n  color: currentColor;\n}\n\n:host {\n  padding-left: 16px;\n  padding-right: 16px;\n  padding-top: 16px;\n  padding-bottom: 16px;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host {\n    padding-left: unset;\n    padding-right: unset;\n    -webkit-padding-start: 16px;\n    padding-inline-start: 16px;\n    -webkit-padding-end: 16px;\n    padding-inline-end: 16px;\n  }\n}\n\n::slotted(ion-card-title:not(:first-child)),\n::slotted(ion-card-subtitle:not(:first-child)) {\n  margin-top: 8px;\n}"; }
};

export { CardHeader as ion_card_header };
