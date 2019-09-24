import { Host, h } from "@stencil/core";
import { getIonMode } from '../../global/ionic-global';
export class Buttons {
    render() {
        return (h(Host, { class: getIonMode(this) }));
    }
    static get is() { return "ion-buttons"; }
    static get encapsulation() { return "scoped"; }
    static get originalStyleUrls() { return {
        "ios": ["buttons.ios.scss"],
        "md": ["buttons.md.scss"]
    }; }
    static get styleUrls() { return {
        "ios": ["buttons.ios.css"],
        "md": ["buttons.md.css"]
    }; }
}
