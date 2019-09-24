import { Host, h } from "@stencil/core";
import { getIonMode } from '../../global/ionic-global';
import { createColorClasses } from '../../utils/theme';
export class ToolbarTitle {
    getMode() {
        const mode = getIonMode(this);
        const toolbar = this.el.closest('ion-toolbar');
        return (toolbar && toolbar.mode) || mode;
    }
    render() {
        const mode = this.getMode();
        return (h(Host, { class: Object.assign({ [mode]: true, [`title-${mode}`]: true }, createColorClasses(this.color)) },
            h("div", { class: "toolbar-title" },
                h("slot", null))));
    }
    static get is() { return "ion-title"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["title.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["title.css"]
    }; }
    static get properties() { return {
        "color": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "Color",
                "resolved": "string | undefined",
                "references": {
                    "Color": {
                        "location": "import",
                        "path": "../../interface"
                    }
                }
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [],
                "text": "The color to use from your application's color palette.\nDefault options are: `\"primary\"`, `\"secondary\"`, `\"tertiary\"`, `\"success\"`, `\"warning\"`, `\"danger\"`, `\"light\"`, `\"medium\"`, and `\"dark\"`.\nFor more information on colors, see [theming](/docs/theming/basics)."
            },
            "attribute": "color",
            "reflect": false
        }
    }; }
    static get elementRef() { return "el"; }
}
