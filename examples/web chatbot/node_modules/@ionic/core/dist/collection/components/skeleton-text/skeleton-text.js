import { Host, h } from "@stencil/core";
import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { hostContext } from '../../utils/theme';
export class SkeletonText {
    constructor() {
        /**
         * If `true`, the skeleton text will animate.
         */
        this.animated = false;
    }
    calculateWidth() {
        // If width was passed in to the property use that first
        // tslint:disable-next-line: deprecation
        if (this.width !== undefined) {
            return {
                style: {
                    // tslint:disable-next-line: deprecation
                    width: this.width
                }
            };
        }
        return;
    }
    render() {
        const animated = this.animated && config.getBoolean('animated', true);
        const inMedia = hostContext('ion-avatar', this.el) || hostContext('ion-thumbnail', this.el);
        const mode = getIonMode(this);
        return (h(Host, Object.assign({ class: {
                [mode]: true,
                'skeleton-text-animated': animated,
                'in-media': inMedia
            } }, this.calculateWidth()),
            h("span", null, "\u00A0")));
    }
    static get is() { return "ion-skeleton-text"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["skeleton-text.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["skeleton-text.css"]
    }; }
    static get properties() { return {
        "animated": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "If `true`, the skeleton text will animate."
            },
            "attribute": "animated",
            "reflect": false,
            "defaultValue": "false"
        },
        "width": {
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
                "tags": [{
                        "text": "Use CSS instead. The width of the skeleton text. If supplied, it will override the CSS style.",
                        "name": "deprecated"
                    }],
                "text": ""
            },
            "attribute": "width",
            "reflect": false
        }
    }; }
    static get elementRef() { return "el"; }
}
