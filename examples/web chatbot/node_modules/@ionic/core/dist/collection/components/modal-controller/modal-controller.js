import { Build } from "@stencil/core";
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
/**
 * @deprecated Use the `modalController` exported from core.
 */
export class ModalController {
    constructor() {
        if (Build.isDev) {
            console.warn(`[DEPRECATED][ion-modal-controller] Use the modalController export from @ionic/core:
  import { modalController } from '@ionic/core';
  const modal = await modalController.create({...});`);
        }
    }
    /**
     * Create a modal overlay with modal options.
     *
     * @param options The options to use to create the modal.
     */
    create(options) {
        return createOverlay('ion-modal', options);
    }
    /**
     * Dismiss the open modal overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the modal.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the modal.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the modal to dismiss. If an id is not provided, it will dismiss the most recently opened modal.
     */
    dismiss(data, role, id) {
        return dismissOverlay(document, data, role, 'ion-modal', id);
    }
    /**
     * Get the most recently opened modal overlay.
     */
    async getTop() {
        return getOverlay(document, 'ion-modal');
    }
    static get is() { return "ion-modal-controller"; }
    static get methods() { return {
        "create": {
            "complexType": {
                "signature": "<T extends ComponentRef>(options: ModalOptions<T>) => Promise<HTMLIonModalElement>",
                "parameters": [{
                        "tags": [{
                                "text": "options The options to use to create the modal.",
                                "name": "param"
                            }],
                        "text": "The options to use to create the modal."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonModalElement": {
                        "location": "global"
                    },
                    "ComponentRef": {
                        "location": "import",
                        "path": "../../interface"
                    },
                    "ModalOptions": {
                        "location": "import",
                        "path": "../../interface"
                    },
                    "T": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLIonModalElement>"
            },
            "docs": {
                "text": "Create a modal overlay with modal options.",
                "tags": [{
                        "name": "param",
                        "text": "options The options to use to create the modal."
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
                                "text": "role The role of the element that is dismissing the modal.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the modal.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`.",
                                "name": "param"
                            }],
                        "text": "The role of the element that is dismissing the modal.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the modal.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "tags": [{
                                "text": "id The id of the modal to dismiss. If an id is not provided, it will dismiss the most recently opened modal.",
                                "name": "param"
                            }],
                        "text": "The id of the modal to dismiss. If an id is not provided, it will dismiss the most recently opened modal."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<boolean>"
            },
            "docs": {
                "text": "Dismiss the open modal overlay.",
                "tags": [{
                        "name": "param",
                        "text": "data Any data to emit in the dismiss events."
                    }, {
                        "name": "param",
                        "text": "role The role of the element that is dismissing the modal.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the modal.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "name": "param",
                        "text": "id The id of the modal to dismiss. If an id is not provided, it will dismiss the most recently opened modal."
                    }]
            }
        },
        "getTop": {
            "complexType": {
                "signature": "() => Promise<HTMLIonModalElement | undefined>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonModalElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLIonModalElement | undefined>"
            },
            "docs": {
                "text": "Get the most recently opened modal overlay.",
                "tags": []
            }
        }
    }; }
}
