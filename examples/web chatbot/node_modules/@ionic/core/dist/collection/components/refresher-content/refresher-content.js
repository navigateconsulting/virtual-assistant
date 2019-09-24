import { Host, h } from "@stencil/core";
import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { sanitizeDOMString } from '../../utils/sanitization';
export class RefresherContent {
    componentWillLoad() {
        if (this.pullingIcon === undefined) {
            this.pullingIcon = config.get('refreshingIcon', 'arrow-down');
        }
        if (this.refreshingSpinner === undefined) {
            const mode = getIonMode(this);
            this.refreshingSpinner = config.get('refreshingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'crescent'));
        }
    }
    render() {
        return (h(Host, { class: getIonMode(this) },
            h("div", { class: "refresher-pulling" },
                this.pullingIcon &&
                    h("div", { class: "refresher-pulling-icon" },
                        h("ion-icon", { icon: this.pullingIcon, lazy: false })),
                this.pullingText &&
                    h("div", { class: "refresher-pulling-text", innerHTML: sanitizeDOMString(this.pullingText) })),
            h("div", { class: "refresher-refreshing" },
                this.refreshingSpinner &&
                    h("div", { class: "refresher-refreshing-icon" },
                        h("ion-spinner", { name: this.refreshingSpinner })),
                this.refreshingText &&
                    h("div", { class: "refresher-refreshing-text", innerHTML: sanitizeDOMString(this.refreshingText) }))));
    }
    static get is() { return "ion-refresher-content"; }
    static get properties() { return {
        "pullingIcon": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "string | null",
                "resolved": "null | string | undefined",
                "references": {}
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [],
                "text": "A static icon to display when you begin to pull down"
            },
            "attribute": "pulling-icon",
            "reflect": false
        },
        "pullingText": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string | undefined",
                "references": {}
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [],
                "text": "The text you want to display when you begin to pull down.\n`pullingText` can accept either plaintext or HTML as a string.\nTo display characters normally reserved for HTML, they\nmust be escaped. For example `<Ionic>` would become\n`&lt;Ionic&gt;`\n\nFor more information: [Security Documentation](https://ionicframework.com/docs/faq/security)"
            },
            "attribute": "pulling-text",
            "reflect": false
        },
        "refreshingSpinner": {
            "type": "string",
            "mutable": true,
            "complexType": {
                "original": "SpinnerTypes | null",
                "resolved": "\"bubbles\" | \"circles\" | \"circular\" | \"crescent\" | \"dots\" | \"lines\" | \"lines-small\" | null | undefined",
                "references": {
                    "SpinnerTypes": {
                        "location": "import",
                        "path": "../../interface"
                    }
                }
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [],
                "text": "An animated SVG spinner that shows when refreshing begins"
            },
            "attribute": "refreshing-spinner",
            "reflect": false
        },
        "refreshingText": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string | undefined",
                "references": {}
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [],
                "text": "The text you want to display when performing a refresh.\n`refreshingText` can accept either plaintext or HTML as a string.\nTo display characters normally reserved for HTML, they\nmust be escaped. For example `<Ionic>` would become\n`&lt;Ionic&gt;`\n\nFor more information: [Security Documentation](https://ionicframework.com/docs/faq/security)"
            },
            "attribute": "refreshing-text",
            "reflect": false
        }
    }; }
}
