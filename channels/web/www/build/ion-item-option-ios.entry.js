import { r as registerInstance, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';
import { c as createColorClasses } from './theme-215399f6.js';

const ItemOption = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, the user cannot interact with the item option.
         */
        this.disabled = false;
        /**
         * If `true`, the option will expand to take up the available width and cover any other options.
         */
        this.expandable = false;
        /**
         * The type of the button.
         */
        this.type = 'button';
        this.onClick = (ev) => {
            const el = ev.target.closest('ion-item-option');
            if (el) {
                ev.preventDefault();
            }
        };
    }
    render() {
        const { disabled, expandable, href } = this;
        const TagType = href === undefined ? 'button' : 'a';
        const mode = getIonMode(this);
        const attrs = (TagType === 'button')
            ? { type: this.type }
            : {
                download: this.download,
                href: this.href,
                target: this.target
            };
        return (h(Host, { onClick: this.onClick, class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true, 'item-option-disabled': disabled, 'item-option-expandable': expandable, 'ion-activatable': true }) }, h(TagType, Object.assign({}, attrs, { class: "button-native", disabled: disabled }), h("span", { class: "button-inner" }, h("slot", { name: "top" }), h("div", { class: "horizontal-wrapper" }, h("slot", { name: "start" }), h("slot", { name: "icon-only" }), h("slot", null), h("slot", { name: "end" })), h("slot", { name: "bottom" })), mode === 'md' && h("ion-ripple-effect", null))));
    }
    get el() { return getElement(this); }
    static get style() { return ":host {\n  /**\n   * \@prop --background: Background of the item option\n   * \@prop --color: Color of the item option\n   */\n  --background: var(--ion-color-primary, #3880ff);\n  --color: var(--ion-color-primary-contrast, #fff);\n  background: var(--background);\n  color: var(--color);\n  font-family: var(--ion-font-family, inherit);\n}\n\n:host(.in-list.item-options-end:last-child) {\n  padding-right: calc(.7em + var(--ion-safe-area-right));\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host(.in-list.item-options-end:last-child) {\n    padding-right: unset;\n    -webkit-padding-end: calc(.7em + var(--ion-safe-area-right));\n    padding-inline-end: calc(.7em + var(--ion-safe-area-right));\n  }\n}\n\n:host(.in-list.item-options-start:first-child) {\n  padding-left: calc(.7em + var(--ion-safe-area-left));\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  :host(.in-list.item-options-start:first-child) {\n    padding-left: unset;\n    -webkit-padding-start: calc(.7em + var(--ion-safe-area-left));\n    padding-inline-start: calc(.7em + var(--ion-safe-area-left));\n  }\n}\n\n:host(.ion-color) {\n  background: var(--ion-color-base);\n  color: var(--ion-color-contrast);\n}\n\n.button-native {\n  font-family: inherit;\n  font-size: inherit;\n  font-style: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  text-decoration: inherit;\n  text-overflow: inherit;\n  text-transform: inherit;\n  text-align: inherit;\n  white-space: inherit;\n  color: inherit;\n  padding-left: 0.7em;\n  padding-right: 0.7em;\n  padding-top: 0;\n  padding-bottom: 0;\n  display: inline-block;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  outline: none;\n  background: transparent;\n  cursor: pointer;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .button-native {\n    padding-left: unset;\n    padding-right: unset;\n    -webkit-padding-start: 0.7em;\n    padding-inline-start: 0.7em;\n    -webkit-padding-end: 0.7em;\n    padding-inline-end: 0.7em;\n  }\n}\n\n.button-inner {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: column nowrap;\n  flex-flow: column nowrap;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n\n.horizontal-wrapper {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: row nowrap;\n  flex-flow: row nowrap;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  width: 100%;\n}\n\n::slotted(*) {\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n}\n\n::slotted([slot=start]) {\n  margin-left: 0;\n  margin-right: 5px;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  ::slotted([slot=start]) {\n    margin-left: unset;\n    margin-right: unset;\n    -webkit-margin-start: 0;\n    margin-inline-start: 0;\n    -webkit-margin-end: 5px;\n    margin-inline-end: 5px;\n  }\n}\n\n::slotted([slot=end]) {\n  margin-left: 5px;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  ::slotted([slot=end]) {\n    margin-left: unset;\n    margin-right: unset;\n    -webkit-margin-start: 5px;\n    margin-inline-start: 5px;\n    -webkit-margin-end: 0;\n    margin-inline-end: 0;\n  }\n}\n\n::slotted([slot=icon-only]) {\n  padding-left: 0;\n  padding-right: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n  margin-left: 10px;\n  margin-right: 10px;\n  margin-top: 0;\n  margin-bottom: 0;\n  min-width: 0.9em;\n  font-size: 1.8em;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  ::slotted([slot=icon-only]) {\n    margin-left: unset;\n    margin-right: unset;\n    -webkit-margin-start: 10px;\n    margin-inline-start: 10px;\n    -webkit-margin-end: 10px;\n    margin-inline-end: 10px;\n  }\n}\n\n:host(.item-option-expandable) {\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  -webkit-transition-duration: 0;\n  transition-duration: 0;\n  -webkit-transition-property: none;\n  transition-property: none;\n  -webkit-transition-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1);\n  transition-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1);\n}\n\n:host(.item-option-disabled) {\n  pointer-events: none;\n}\n\n:host(.item-option-disabled) .button-native {\n  cursor: default;\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n:host {\n  font-size: 16px;\n}\n\n:host(.activated) {\n  background: var(--ion-color-primary-shade, #3171e0);\n}\n\n:host(.ion-color.activated) {\n  background: var(--ion-color-shade);\n}"; }
};

export { ItemOption as ion_item_option };
