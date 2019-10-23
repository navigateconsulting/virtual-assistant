import { r as registerInstance, c as getIonMode, h, H as Host } from './core-950489bb.js';

const Footer = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, the footer will be translucent.
         * Only applies when the mode is `"ios"` and the device supports
         * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         *
         * Note: In order to scroll content behind the footer, the `fullscreen`
         * attribute needs to be set on the content.
         */
        this.translucent = false;
    }
    render() {
        const mode = getIonMode(this);
        const translucent = this.translucent;
        return (h(Host, { role: "contentinfo", class: {
                [mode]: true,
                // Used internally for styling
                [`footer-${mode}`]: true,
                [`footer-translucent`]: translucent,
                [`footer-translucent-${mode}`]: translucent,
            } }));
    }
    static get style() { return "ion-footer {\n  display: block;\n  position: relative;\n  -ms-flex-order: 1;\n  order: 1;\n  width: 100%;\n  z-index: 10;\n}\n\nion-footer ion-toolbar:last-child {\n  padding-bottom: var(--ion-safe-area-bottom, 0);\n}\n\n.footer-md::before {\n  left: 0;\n  top: -2px;\n  bottom: auto;\n  background-position: left 0 top 0;\n  position: absolute;\n  width: 100%;\n  height: 2px;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAHBAMAAADzDtBxAAAAD1BMVEUAAAAAAAAAAAAAAAAAAABPDueNAAAABXRSTlMUCS0gBIh/TXEAAAAaSURBVAjXYxCEAgY4UIICBmMogMsgFLtAAQCNSwXZKOdPxgAAAABJRU5ErkJggg==\");\n  background-repeat: repeat-x;\n  content: \"\";\n}\n[dir=rtl] .footer-md::before, :host-context([dir=rtl]) .footer-md::before {\n  left: unset;\n  right: unset;\n  right: 0;\n}\n\n[dir=rtl] .footer-md::before, :host-context([dir=rtl]) .footer-md::before {\n  background-position: right 0 top 0;\n}\n\n.footer-md[no-border]::before {\n  display: none;\n}"; }
};

export { Footer as ion_footer };
