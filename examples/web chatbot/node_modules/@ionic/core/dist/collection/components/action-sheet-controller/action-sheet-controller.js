import { Build } from "@stencil/core";
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
/**
 * @deprecated Use the `actionSheetController` exported from core.
 */
export class ActionSheetController {
    constructor() {
        if (Build.isDev) {
            console.warn(`[DEPRECATED][ion-action-sheet-controller] Use the actionSheetController export from @ionic/core:
  import { actionSheetController } from '@ionic/core';
  const actionSheet = await actionSheetController.create({...});`);
        }
    }
    /**
     * Create an action sheet overlay with action sheet options.
     *
     * @param options The options to use to create the action sheet.
     */
    create(options) {
        return createOverlay('ion-action-sheet', options);
    }
    /**
     * Dismiss the open action sheet overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the action sheet.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the action sheet.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the action sheet to dismiss. If an id is not provided, it will dismiss the most recently opened action sheet.
     */
    dismiss(data, role, id) {
        return dismissOverlay(document, data, role, 'ion-action-sheet', id);
    }
    /**
     * Get the most recently opened action sheet overlay.
     */
    async getTop() {
        return getOverlay(document, 'ion-action-sheet');
    }
    static get is() { return "ion-action-sheet-controller"; }
    static get methods() { return {
        "create": {
            "complexType": {
                "signature": "(options: ActionSheetOptions) => Promise<HTMLIonActionSheetElement>",
                "parameters": [{
                        "tags": [{
                                "text": "options The options to use to create the action sheet.",
                                "name": "param"
                            }],
                        "text": "The options to use to create the action sheet."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonActionSheetElement": {
                        "location": "global"
                    },
                    "ActionSheetOptions": {
                        "location": "import",
                        "path": "../../interface"
                    }
                },
                "return": "Promise<HTMLIonActionSheetElement>"
            },
            "docs": {
                "text": "Create an action sheet overlay with action sheet options.",
                "tags": [{
                        "name": "param",
                        "text": "options The options to use to create the action sheet."
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
                                "text": "role The role of the element that is dismissing the action sheet.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the action sheet.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`.",
                                "name": "param"
                            }],
                        "text": "The role of the element that is dismissing the action sheet.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the action sheet.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "tags": [{
                                "text": "id The id of the action sheet to dismiss. If an id is not provided, it will dismiss the most recently opened action sheet.",
                                "name": "param"
                            }],
                        "text": "The id of the action sheet to dismiss. If an id is not provided, it will dismiss the most recently opened action sheet."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<boolean>"
            },
            "docs": {
                "text": "Dismiss the open action sheet overlay.",
                "tags": [{
                        "name": "param",
                        "text": "data Any data to emit in the dismiss events."
                    }, {
                        "name": "param",
                        "text": "role The role of the element that is dismissing the action sheet.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the action sheet.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "name": "param",
                        "text": "id The id of the action sheet to dismiss. If an id is not provided, it will dismiss the most recently opened action sheet."
                    }]
            }
        },
        "getTop": {
            "complexType": {
                "signature": "() => Promise<HTMLIonActionSheetElement | undefined>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonActionSheetElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLIonActionSheetElement | undefined>"
            },
            "docs": {
                "text": "Get the most recently opened action sheet overlay.",
                "tags": []
            }
        }
    }; }
}
