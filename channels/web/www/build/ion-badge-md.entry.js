import { r as registerInstance, c as getIonMode, h, H as Host } from './core-950489bb.js';
import { c as createColorClasses } from './theme-215399f6.js';

const Badge = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true }) }, h("slot", null)));
    }
    static get style() { return ":host {\n  /**\n   * \@prop --background: Background of the badge\n   * \@prop --color: Text color of the badge\n   *\n   * \@prop --padding-top: Top padding of the badge\n   * \@prop --padding-end: Right padding if direction is left-to-right, and left padding if direction is right-to-left of the badge\n   * \@prop --padding-bottom: Bottom padding of the badge\n   * \@prop --padding-start: Left padding if direction is left-to-right, and right padding if direction is right-to-left of the badge\n   */\n  --background: var(--ion-color-primary, #3880ff);\n  --color: var(--ion-color-primary-contrast, #fff);\n  --padding-top: 3px;\n  --padding-end: 8px;\n  --padding-bottom: 3px;\n  --padding-start: 8px;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  padding-left: var(--padding-start);\n  padding-right: var(--padding-end);\n  padding-top: var(--padding-top);\n  padding-bottom: var(--padding-bottom);\n  display: inline-block;\n  min-width: 10px;\n  background: var(--background);\n  color: var(--color);\n  font-family: var(--ion-font-family, inherit);\n  font-size: 13px;\n  font-weight: bold;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  contain: content;\n  vertical-align: baseline;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host {\n    padding-left: unset;\n    padding-right: unset;\n    -webkit-padding-start: var(--padding-start);\n    padding-inline-start: var(--padding-start);\n    -webkit-padding-end: var(--padding-end);\n    padding-inline-end: var(--padding-end);\n  }\n}\n\n:host(.ion-color) {\n  background: var(--ion-color-base);\n  color: var(--ion-color-contrast);\n}\n\n:host(:empty) {\n  display: none;\n}\n\n:host {\n  --padding-top: 3px;\n  --padding-end: 4px;\n  --padding-bottom: 4px;\n  --padding-start: 4px;\n  border-radius: 4px;\n}"; }
};

export { Badge as ion_badge };
