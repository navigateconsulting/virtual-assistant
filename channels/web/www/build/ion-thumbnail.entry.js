import { r as registerInstance, h, H as Host, c as getIonMode } from './core-950489bb.js';

const Thumbnail = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, { class: getIonMode(this) }, h("slot", null)));
    }
    static get style() { return ":host {\n  /**\n   * \@prop --border-radius: Border radius of the thumbnail\n   * \@prop --size: Size of the thumbnail\n   */\n  --size: 48px;\n  --border-radius: 0;\n  border-radius: var(--border-radius);\n  display: block;\n  width: var(--size);\n  height: var(--size);\n}\n\n::slotted(ion-img),\n::slotted(img) {\n  border-radius: var(--border-radius);\n  width: 100%;\n  height: 100%;\n  -o-object-fit: cover;\n  object-fit: cover;\n  overflow: hidden;\n}"; }
};

export { Thumbnail as ion_thumbnail };
