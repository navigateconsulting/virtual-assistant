import { Host, h } from "@stencil/core";
import { getIonMode } from '../../global/ionic-global';
let ids = 0;
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export class SegmentButton {
    constructor() {
        /**
         * If `true`, the segment button is selected.
         */
        this.checked = false;
        /**
         * If `true`, the user cannot interact with the segment button.
         */
        this.disabled = false;
        /**
         * Set the layout of the text and icon in the segment.
         */
        this.layout = 'icon-top';
        /**
         * The type of the button.
         */
        this.type = 'button';
        /**
         * The value of the segment button.
         */
        this.value = 'ion-sb-' + (ids++);
        this.onClick = () => {
            this.checked = true;
        };
    }
    checkedChanged(checked, prev) {
        if (checked && !prev) {
            this.ionSelect.emit();
        }
    }
    get hasLabel() {
        return !!this.el.querySelector('ion-label');
    }
    get hasIcon() {
        return !!this.el.querySelector('ion-icon');
    }
    render() {
        const { checked, type, disabled, hasIcon, hasLabel, layout } = this;
        const mode = getIonMode(this);
        return (h(Host, { onClick: this.onClick, "aria-disabled": disabled ? 'true' : null, class: {
                [mode]: true,
                'segment-button-has-label': hasLabel,
                'segment-button-has-icon': hasIcon,
                'segment-button-has-label-only': hasLabel && !hasIcon,
                'segment-button-has-icon-only': hasIcon && !hasLabel,
                'segment-button-disabled': disabled,
                'segment-button-checked': checked,
                [`segment-button-layout-${layout}`]: true,
                'ion-activatable': true,
                'ion-activatable-instant': true,
            } },
            h("button", { type: type, "aria-pressed": checked ? 'true' : null, class: "button-native", disabled: disabled },
                h("slot", null),
                mode === 'md' && h("ion-ripple-effect", null)),
            h("div", { class: "segment-button-indicator" })));
    }
    static get is() { return "ion-segment-button"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "ios": ["segment-button.ios.scss"],
        "md": ["segment-button.md.scss"]
    }; }
    static get styleUrls() { return {
        "ios": ["segment-button.ios.css"],
        "md": ["segment-button.md.css"]
    }; }
    static get properties() { return {
        "checked": {
            "type": "boolean",
            "mutable": true,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "If `true`, the segment button is selected."
            },
            "attribute": "checked",
            "reflect": false,
            "defaultValue": "false"
        },
        "disabled": {
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
                "text": "If `true`, the user cannot interact with the segment button."
            },
            "attribute": "disabled",
            "reflect": false,
            "defaultValue": "false"
        },
        "layout": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "SegmentButtonLayout",
                "resolved": "\"icon-bottom\" | \"icon-end\" | \"icon-hide\" | \"icon-start\" | \"icon-top\" | \"label-hide\" | undefined",
                "references": {
                    "SegmentButtonLayout": {
                        "location": "import",
                        "path": "../../interface"
                    }
                }
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [],
                "text": "Set the layout of the text and icon in the segment."
            },
            "attribute": "layout",
            "reflect": false,
            "defaultValue": "'icon-top'"
        },
        "type": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "'submit' | 'reset' | 'button'",
                "resolved": "\"button\" | \"reset\" | \"submit\"",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The type of the button."
            },
            "attribute": "type",
            "reflect": false,
            "defaultValue": "'button'"
        },
        "value": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The value of the segment button."
            },
            "attribute": "value",
            "reflect": false,
            "defaultValue": "'ion-sb-' + (ids++)"
        }
    }; }
    static get events() { return [{
            "method": "ionSelect",
            "name": "ionSelect",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": "Emitted when the segment button is clicked."
            },
            "complexType": {
                "original": "void",
                "resolved": "void",
                "references": {}
            }
        }]; }
    static get elementRef() { return "el"; }
    static get watchers() { return [{
            "propName": "checked",
            "methodName": "checkedChanged"
        }]; }
}
