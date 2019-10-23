import { r as registerInstance, f as createEvent, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';
import { c as createColorClasses } from './theme-215399f6.js';

const TabBar = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.keyboardVisible = false;
        /**
         * If `true`, the tab bar will be translucent.
         * Only applies when the mode is `"ios"` and the device supports
         * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         */
        this.translucent = false;
        this.ionTabBarChanged = createEvent(this, "ionTabBarChanged", 7);
    }
    selectedTabChanged() {
        if (this.selectedTab !== undefined) {
            this.ionTabBarChanged.emit({
                tab: this.selectedTab
            });
        }
    }
    onKeyboardWillHide() {
        setTimeout(() => this.keyboardVisible = false, 50);
    }
    onKeyboardWillShow() {
        if (this.el.getAttribute('slot') !== 'top') {
            this.keyboardVisible = true;
        }
    }
    componentWillLoad() {
        this.selectedTabChanged();
    }
    render() {
        const { color, translucent, keyboardVisible } = this;
        const mode = getIonMode(this);
        return (h(Host, { role: "tablist", "aria-hidden": keyboardVisible ? 'true' : null, class: Object.assign(Object.assign({}, createColorClasses(color)), { [mode]: true, 'tab-bar-translucent': translucent, 'tab-bar-hidden': keyboardVisible }) }, h("slot", null)));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "selectedTab": ["selectedTabChanged"]
    }; }
    static get style() { return ":host {\n  /**\n   * \@prop --background: Background of the tab bar\n   * \@prop --border: Border of the tab bar\n   * \@prop --color: Color of the tab bar\n   */\n  padding-left: var(--ion-safe-area-left);\n  padding-right: var(--ion-safe-area-right);\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  width: auto;\n  padding-bottom: var(--ion-safe-area-bottom, 0);\n  border-top: var(--border);\n  background: var(--background);\n  color: var(--color);\n  text-align: center;\n  contain: strict;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  z-index: 10;\n  /* stylelint-disable-next-line declaration-no-important */\n  -webkit-box-sizing: content-box !important;\n  box-sizing: content-box !important;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host {\n    padding-left: unset;\n    padding-right: unset;\n    -webkit-padding-start: var(--ion-safe-area-left);\n    padding-inline-start: var(--ion-safe-area-left);\n    -webkit-padding-end: var(--ion-safe-area-right);\n    padding-inline-end: var(--ion-safe-area-right);\n  }\n}\n\n:host(.ion-color) ::slotted(ion-tab-button) {\n  --background-focused: var(--ion-color-shade);\n  --color-selected: var(--ion-color-contrast);\n}\n\n:host(.ion-color) ::slotted(.tab-selected) {\n  color: var(--ion-color-contrast);\n}\n\n:host(.ion-color),\n:host(.ion-color) ::slotted(ion-tab-button) {\n  color: rgba(var(--ion-color-contrast-rgb), 0.7);\n}\n\n:host(.ion-color),\n:host(.ion-color) ::slotted(ion-tab-button) {\n  background: var(--ion-color-base);\n}\n\n:host(.ion-color) ::slotted(ion-tab-button.ion-focused),\n:host(.tab-bar-translucent) ::slotted(ion-tab-button.ion-focused) {\n  background: var(--background-focused);\n}\n\n:host(.tab-bar-translucent) ::slotted(ion-tab-button) {\n  background: transparent;\n}\n\n:host([slot=top]) {\n  padding-bottom: 0;\n  border-top: 0;\n  border-bottom: var(--border);\n}\n\n:host(.tab-bar-hidden) {\n  /* stylelint-disable-next-line declaration-no-important */\n  display: none !important;\n}\n\n:host {\n  --background: var(--ion-tab-bar-background, var(--ion-background-color, #fff));\n  --background-focused: var(--ion-tab-bar-background-focused, #e0e0e0);\n  --border: 0.55px solid var(--ion-tab-bar-border-color, var(--ion-border-color, var(--ion-color-step-150, rgba(0, 0, 0, 0.2))));\n  --color: var(--ion-tab-bar-color, var(--ion-color-step-450, #8c8c8c));\n  --color-selected: var(--ion-tab-bar-color-activated, var(--ion-color-primary, #3880ff));\n  height: 50px;\n}\n\n\@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))) {\n  :host(.tab-bar-translucent) {\n    --background: rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8);\n    -webkit-backdrop-filter: saturate(210%) blur(20px);\n    backdrop-filter: saturate(210%) blur(20px);\n  }\n\n  :host(.ion-color.tab-bar-translucent) {\n    background: rgba(var(--ion-color-base-rgb), 0.8);\n  }\n\n  :host(.tab-bar-translucent) ::slotted(ion-tab-button.ion-focused) {\n    background: rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.6);\n  }\n}"; }
};

export { TabBar as ion_tab_bar };
