import { r as registerInstance, h } from './core-950489bb.js';

const Conversation = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    async scrollToBottom() {
        let slot = this.list.querySelector('*');
        let rootSlot = false;
        while (!rootSlot) {
            const children = slot.assignedElements();
            if (children[0].tagName === 'SLOT') {
                slot = children[0];
            }
            else {
                rootSlot = true;
            }
        }
        const children = slot.assignedElements();
        let height = 0;
        for (let i = 0; i < children.length; i++) {
            height += children[i].clientHeight;
        }
        return this.content.scrollToPoint(0, height, 800);
    }
    render() {
        return (h("ion-content", { class: "content", ref: element => this.content = element }, h("ion-list", { ref: element => this.list = element }, h("slot", null))));
    }
    static get style() { return ".content {\n  height: calc(100% - 122px);\n  --ion-background-color: #E3DFD9;\n }"; }
};

export { Conversation as chat_conversation };
