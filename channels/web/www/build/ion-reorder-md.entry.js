import { r as registerInstance, h, H as Host, c as getIonMode } from './core-950489bb.js';

const Reorder = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    onClick(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
    }
    render() {
        return (h(Host, { class: getIonMode(this) }, h("slot", null, h("ion-icon", { name: "reorder", lazy: false, class: "reorder-icon" }))));
    }
    static get style() { return ":host([slot]) {\n  display: none;\n  line-height: 0;\n  z-index: 100;\n}\n\n.reorder-icon {\n  display: block;\n  font-size: 22px;\n}\n\n.reorder-icon {\n  font-size: 31px;\n  opacity: 0.3;\n}"; }
};

export { Reorder as ion_reorder };
