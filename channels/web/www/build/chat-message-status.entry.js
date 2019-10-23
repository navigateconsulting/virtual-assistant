import { r as registerInstance, h, H as Host } from './core-950489bb.js';

const MessageStatus = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.state = 'pending';
    }
    render() {
        const status = {
            'none': false,
            'pending': h("ion-icon", { name: 'time', class: "pending" }),
            'delivered': h("chat-check-mark", { ticks: "one" }),
            'read': h("chat-check-mark", { ticks: "two" })
        }[this.state];
        return (h(Host, { class: this.state }, status));
    }
    static get style() { return ":host {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: end;\n  align-items: flex-end;\n  width: 18px;\n  height: 18px;\n}\n\n:host(.none) {\n  display: none;\n}\n\n.pending {\n  width: 14px;\n  height: 14px;\n}"; }
};

export { MessageStatus as chat_message_status };
