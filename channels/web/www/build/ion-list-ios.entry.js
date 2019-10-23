import { r as registerInstance, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';

const List = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, the list will have margin around it and rounded corners.
         */
        this.inset = false;
    }
    /**
     * If `ion-item-sliding` are used inside the list, this method closes
     * any open sliding item.
     *
     * Returns `true` if an actual `ion-item-sliding` is closed.
     */
    async closeSlidingItems() {
        const item = this.el.querySelector('ion-item-sliding');
        if (item && item.closeOpened) {
            return item.closeOpened();
        }
        return false;
    }
    render() {
        const mode = getIonMode(this);
        const { lines, inset } = this;
        return (h(Host, { class: {
                [mode]: true,
                // Used internally for styling
                [`list-${mode}`]: true,
                'list-inset': inset,
                [`list-lines-${lines}`]: lines !== undefined,
                [`list-${mode}-lines-${lines}`]: lines !== undefined
            } }));
    }
    get el() { return getElement(this); }
    static get style() { return "ion-list {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-left: 0;\n  padding-right: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n  display: block;\n  contain: content;\n  list-style-type: none;\n}\n\nion-list.list-inset {\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n  overflow: hidden;\n}\n\n.list-ios {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: -1px;\n  margin-bottom: 32px;\n  background: var(--ion-item-background, var(--ion-background-color, #fff));\n}\n\n.list-ios.list-inset {\n  margin-left: 16px;\n  margin-right: 16px;\n  margin-top: 16px;\n  margin-bottom: 16px;\n  border-radius: 4px;\n}\n\@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0) {\n  .list-ios.list-inset {\n    margin-left: unset;\n    margin-right: unset;\n    -webkit-margin-start: 16px;\n    margin-inline-start: 16px;\n    -webkit-margin-end: 16px;\n    margin-inline-end: 16px;\n  }\n}\n\n.list-ios.list-inset ion-item {\n  --border-width: 0 0 1px 0;\n  --inner-border-width: 0;\n}\n\n.list-ios.list-inset ion-item:last-child {\n  --border-width: 0;\n  --inner-border-width: 0;\n}\n\n.list-ios.list-inset + ion-list.list-inset {\n  margin-top: 0;\n}\n.list-ios-lines-none .item {\n  --border-width: 0;\n  --inner-border-width: 0;\n}\n\n.list-ios-lines-full .item,\n.list-ios .item-lines-full {\n  --border-width: 0 0 0.55px 0;\n}\n\n.list-ios-lines-full .item {\n  --inner-border-width: 0;\n}\n\n.list-ios-lines-inset .item,\n.list-ios .item-lines-inset {\n  --inner-border-width: 0 0 0.55px 0;\n}\n\n.list-ios .item-lines-inset {\n  --border-width: 0;\n}\n\n.list-ios .item-lines-full {\n  --inner-border-width: 0;\n}\n\n.list-ios .item-lines-none {\n  --border-width: 0;\n  --inner-border-width: 0;\n}"; }
};

export { List as ion_list };
