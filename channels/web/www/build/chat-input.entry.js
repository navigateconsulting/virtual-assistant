import { r as registerInstance, f as createEvent, h } from './core-950489bb.js';

const Input = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.textEmpty = true;
        this.send = createEvent(this, "send", 7);
    }
    handleTextChange(event) {
        this.textEmpty = event.detail.value === '';
    }
    handleEnter(event) {
        if (event.key != 'Enter') {
            return;
        }
        event.preventDefault();
        if (event.ctrlKey) {
            this.textarea.value += '\n';
            return;
        }
        this.handleSend();
    }
    handleSend(event) {
        if (event) {
            event.preventDefault();
        }
        this.send.emit({ value: this.textarea.value });
        this.textarea.value = '';
        this.textarea.focus();
    }
    render() {
        const button = this.textEmpty ?
            ''
            :
                h("ion-icon", { name: "send", onMouseDown: event => this.handleSend(event) });
        return (h("ion-item", null, h("ion-textarea", { placeholder: "Type a message", ref: element => this.textarea = element, onIonChange: event => this.handleTextChange(event), onKeyDown: event => this.handleEnter(event) }), button));
    }
    static get style() { return ""; }
};

export { Input as chat_input };
