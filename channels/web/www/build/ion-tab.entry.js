import { r as registerInstance, B as Build, h, H as Host, e as getElement } from './core-950489bb.js';
import { a as attachComponent } from './framework-delegate-edc3d751.js';

const Tab = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.loaded = false;
        /** @internal */
        this.active = false;
    }
    componentWillLoad() {
        if (Build.isDev) {
            if (this.component !== undefined && this.el.childElementCount > 0) {
                console.error('You can not use a lazy-loaded component in a tab and inlined content at the same time.' +
                    `- Remove the component attribute in: <ion-tab component="${this.component}">` +
                    ` or` +
                    `- Remove the embedded content inside the ion-tab: <ion-tab></ion-tab>`);
            }
        }
    }
    /** Set the active component for the tab */
    async setActive() {
        await this.prepareLazyLoaded();
        this.active = true;
    }
    prepareLazyLoaded() {
        if (!this.loaded && this.component != null) {
            this.loaded = true;
            try {
                return attachComponent(this.delegate, this.el, this.component, ['ion-page']);
            }
            catch (e) {
                console.error(e);
            }
        }
        return Promise.resolve(undefined);
    }
    render() {
        const { tab, active, component } = this;
        return (h(Host, { role: "tabpanel", "aria-hidden": !active ? 'true' : null, "aria-labelledby": `tab-button-${tab}`, class: {
                'ion-page': component === undefined,
                'tab-hidden': !active
            } }, h("slot", null)));
    }
    get el() { return getElement(this); }
    static get style() { return ":host(.tab-hidden) {\n  /* stylelint-disable-next-line declaration-no-important */\n  display: none !important;\n}"; }
};

export { Tab as ion_tab };
