import { r as registerInstance, c as getIonMode, h, H as Host } from './core-950489bb.js';
import { c as createColorClasses } from './theme-215399f6.js';

const ListHeader = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true }) }, h("slot", null)));
    }
    static get style() { return ":host {\n  /**\n   * \@prop --background: Background of the list header\n   * \@prop --color: Color of the list header text\n   */\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-left: 0;\n  padding-right: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n  width: 100%;\n  min-height: 40px;\n  background: var(--background);\n  color: var(--color);\n  overflow: hidden;\n}\n\n:host(.ion-color) {\n  background: var(--ion-color-base);\n  color: var(--ion-color-contrast);\n}\n\n:host {\n  --background: transparent;\n  --color: var(--ion-text-color, #000);\n  padding-left: calc(var(--ion-safe-area-left, 0px) + 16px);\n  min-height: 45px;\n  font-size: 14px;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host {\n    padding-left: unset;\n    -webkit-padding-start: calc(var(--ion-safe-area-left, 0px) + 16px);\n    padding-inline-start: calc(var(--ion-safe-area-left, 0px) + 16px);\n  }\n}"; }
};

export { ListHeader as ion_list_header };
