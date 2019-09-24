import { Build } from "@stencil/core";
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
/**
 * @deprecated Use the `pickerController` exported from core.
 */
export class PickerController {
    constructor() {
        if (Build.isDev) {
            console.warn(`[DEPRECATED][ion-picker-controller] Use the pickerController export from @ionic/core:
  import { pickerController } from '@ionic/core';
  const picker = await pickerController.create({...});`);
        }
    }
    /**
     * Create a picker overlay with picker options.
     *
     * @param options The options to use to create the picker.
     */
    create(options) {
        return createOverlay('ion-picker', options);
    }
    /**
     * Dismiss the open picker overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the picker.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the picker.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the picker to dismiss. If an id is not provided, it will dismiss the most recently opened picker.
     */
    dismiss(data, role, id) {
        return dismissOverlay(document, data, role, 'ion-picker', id);
    }
    /**
     * Get the most recently opened picker overlay.
     */
    async getTop() {
        return getOverlay(document, 'ion-picker');
    }
    static get is() { return "ion-picker-controller"; }
    static get methods() { return {
        "create": {
            "complexType": {
                "signature": "(options: PickerOptions) => Promise<HTMLIonPickerElement>",
                "parameters": [{
                        "tags": [{
                                "text": "options The options to use to create the picker.",
                                "name": "param"
                            }],
                        "text": "The options to use to create the picker."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonPickerElement": {
                        "location": "global"
                    },
                    "PickerOptions": {
                        "location": "import",
                        "path": "../../interface"
                    }
                },
                "return": "Promise<HTMLIonPickerElement>"
            },
            "docs": {
                "text": "Create a picker overlay with picker options.",
                "tags": [{
                        "name": "param",
                        "text": "options The options to use to create the picker."
                    }]
            }
        },
        "dismiss": {
            "complexType": {
                "signature": "(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>",
                "parameters": [{
                        "tags": [{
                                "text": "data Any data to emit in the dismiss events.",
                                "name": "param"
                            }],
                        "text": "Any data to emit in the dismiss events."
                    }, {
                        "tags": [{
                                "text": "role The role of the element that is dismissing the picker.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the picker.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`.",
                                "name": "param"
                            }],
                        "text": "The role of the element that is dismissing the picker.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the picker.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "tags": [{
                                "text": "id The id of the picker to dismiss. If an id is not provided, it will dismiss the most recently opened picker.",
                                "name": "param"
                            }],
                        "text": "The id of the picker to dismiss. If an id is not provided, it will dismiss the most recently opened picker."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<boolean>"
            },
            "docs": {
                "text": "Dismiss the open picker overlay.",
                "tags": [{
                        "name": "param",
                        "text": "data Any data to emit in the dismiss events."
                    }, {
                        "name": "param",
                        "text": "role The role of the element that is dismissing the picker.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the picker.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "name": "param",
                        "text": "id The id of the picker to dismiss. If an id is not provided, it will dismiss the most recently opened picker."
                    }]
            }
        },
        "getTop": {
            "complexType": {
                "signature": "() => Promise<HTMLIonPickerElement | undefined>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonPickerElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLIonPickerElement | undefined>"
            },
            "docs": {
                "text": "Get the most recently opened picker overlay.",
                "tags": []
            }
        }
    }; }
}
