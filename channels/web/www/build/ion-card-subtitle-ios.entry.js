import { r as registerInstance, c as getIonMode, h, H as Host } from './core-950489bb.js';
import { c as createColorClasses } from './theme-215399f6.js';

const CardSubtitle = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { role: "heading", "aria-level": "3", class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true }) }, h("slot", null)));
    }
    static get style() { return ":host {\n  /**\n   * \@prop --color: Color of the card subtitle\n   */\n  display: block;\n  position: relative;\n  color: var(--color);\n}\n\n:host(.ion-color) {\n  color: var(--ion-color-base);\n}\n\n:host {\n  --color: var(--ion-color-step-600, #666666);\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 4px;\n  padding-left: 0;\n  padding-right: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n  font-size: 12px;\n  font-weight: 700;\n  letter-spacing: 0.4px;\n  text-transform: uppercase;\n}"; }
};

export { CardSubtitle as ion_card_subtitle };
