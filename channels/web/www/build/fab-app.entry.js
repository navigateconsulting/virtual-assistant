import { r as registerInstance, h } from './core-950489bb.js';

const Fab = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.ionicon = "code-working";
        this.showApp = true;
    }
    async close() {
        this.showApp = false;
    }
    handleClick() {
        this.showApp = !this.showApp;
    }
    render() {
        return [
            h("ion-fab-button", { class: "fab", onClick: this.handleClick.bind(this) }, h("ion-icon", { name: this.ionicon })),
            h("style", null, "::slotted(:first-child) ", '{', "display: ", this.showApp ? 'block' : 'none', ";", '}'),
            h("slot", null)
        ];
    }
    static get style() { return ".fab {\n  -webkit-transition: all 0.1s ease-in-out;\n  transition: all 0.1s ease-in-out;\n  position: fixed;\n  right: 50px;\n  bottom: 50px;\n  width: 60px;\n  height: 60px;\n}\n  \n.fab:hover {\n  -webkit-transform: scale(1.05);\n  transform: scale(1.05);\n}\n\n::slotted(:first-child) {\n  width: 400px;\n  height: 65%;\n  position: fixed;\n  right: 50px;\n  bottom: 130px;\n  -webkit-box-shadow: 0 0 0.5em 0.2em #666;\n  box-shadow: 0 0 0.5em 0.2em #666;\n  z-index: 10000;\n}\n\n\@media screen and (max-width: 700px) {\n  ::slotted(:first-child) {\n    width: 100%;\n    height: 100%;\n    right: 0;\n    bottom: 0;\n  }\n}"; }
};

export { Fab as fab_app };
