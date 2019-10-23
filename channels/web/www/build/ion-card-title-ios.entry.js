import { r as registerInstance, c as getIonMode, h, H as Host } from './core-950489bb.js';
import { c as createColorClasses } from './theme-215399f6.js';

const CardTitle = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { role: "heading", "aria-level": "2", class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true }) }, h("slot", null)));
    }
    static get style() { return ":host {\n  /**\n   * \@prop --color: Color of the card title\n   */\n  display: block;\n  position: relative;\n  color: var(--color);\n}\n\n:host(.ion-color) {\n  color: var(--ion-color-base);\n}\n\n:host {\n  --color: var(--ion-text-color, #000);\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-left: 0;\n  padding-right: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n  font-size: 28px;\n  font-weight: 700;\n  line-height: 1.2;\n}"; }
};

export { CardTitle as ion_card_title };
