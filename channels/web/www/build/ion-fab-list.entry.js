import { r as registerInstance, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';

const FabList = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, the fab list will show all fab buttons in the list.
         */
        this.activated = false;
        /**
         * The side the fab list will show on relative to the main fab button.
         */
        this.side = 'bottom';
    }
    activatedChanged(activated) {
        const fabs = Array.from(this.el.querySelectorAll('ion-fab-button'));
        // if showing the fabs add a timeout, else show immediately
        const timeout = activated ? 30 : 0;
        fabs.forEach((fab, i) => {
            setTimeout(() => fab.show = activated, i * timeout);
        });
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { class: {
                [mode]: true,
                'fab-list-active': this.activated,
                [`fab-list-side-${this.side}`]: true
            } }, h("slot", null)));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "activated": ["activatedChanged"]
    }; }
    static get style() { return ":host {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 66px;\n  margin-bottom: 66px;\n  display: none;\n  position: absolute;\n  top: 0;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -ms-flex-align: center;\n  align-items: center;\n  min-width: 56px;\n  min-height: 56px;\n}\n\n:host(.fab-list-active) {\n  display: -ms-flexbox;\n  display: flex;\n}\n\n::slotted(.fab-button-in-list) {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 8px;\n  margin-bottom: 8px;\n  width: 40px;\n  height: 40px;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  opacity: 0;\n  visibility: hidden;\n}\n\n:host(.fab-list-side-top) ::slotted(.fab-button-in-list),\n:host(.fab-list-side-bottom) ::slotted(.fab-button-in-list) {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n\n:host(.fab-list-side-start) ::slotted(.fab-button-in-list),\n:host(.fab-list-side-end) ::slotted(.fab-button-in-list) {\n  margin-left: 5px;\n  margin-right: 5px;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host(.fab-list-side-start) ::slotted(.fab-button-in-list),\n:host(.fab-list-side-end) ::slotted(.fab-button-in-list) {\n    margin-left: unset;\n    margin-right: unset;\n    -webkit-margin-start: 5px;\n    margin-inline-start: 5px;\n    -webkit-margin-end: 5px;\n    margin-inline-end: 5px;\n  }\n}\n\n::slotted(.fab-button-in-list.fab-button-show) {\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  opacity: 1;\n  visibility: visible;\n}\n\n:host(.fab-list-side-top) {\n  top: auto;\n  bottom: 0;\n  -ms-flex-direction: column-reverse;\n  flex-direction: column-reverse;\n}\n\n:host(.fab-list-side-start) {\n  margin-left: 66px;\n  margin-right: 66px;\n  margin-top: 0;\n  margin-bottom: 0;\n  right: 0;\n  -ms-flex-direction: row-reverse;\n  flex-direction: row-reverse;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host(.fab-list-side-start) {\n    margin-left: unset;\n    margin-right: unset;\n    -webkit-margin-start: 66px;\n    margin-inline-start: 66px;\n    -webkit-margin-end: 66px;\n    margin-inline-end: 66px;\n  }\n}\n:host-context([dir=rtl]):host(.fab-list-side-start), :host-context([dir=rtl]).fab-list-side-start {\n  left: unset;\n  right: unset;\n  left: 0;\n}\n\n:host(.fab-list-side-end) {\n  margin-left: 66px;\n  margin-right: 66px;\n  margin-top: 0;\n  margin-bottom: 0;\n  left: 0;\n  -ms-flex-direction: row;\n  flex-direction: row;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host(.fab-list-side-end) {\n    margin-left: unset;\n    margin-right: unset;\n    -webkit-margin-start: 66px;\n    margin-inline-start: 66px;\n    -webkit-margin-end: 66px;\n    margin-inline-end: 66px;\n  }\n}\n:host-context([dir=rtl]):host(.fab-list-side-end), :host-context([dir=rtl]).fab-list-side-end {\n  left: unset;\n  right: unset;\n  right: 0;\n}"; }
};

export { FabList as ion_fab_list };
