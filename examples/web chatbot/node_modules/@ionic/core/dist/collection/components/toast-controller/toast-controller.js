import { Build } from "@stencil/core";
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
/**
 * @deprecated Use the `toastController` exported from core.
 */
export class ToastController {
    constructor() {
        if (Build.isDev) {
            console.warn(`[DEPRECATED][ion-toast-controller] Use the toastController export from @ionic/core:
  import { toastController } from '@ionic/core';
  const toast = await toastController.create({...});`);
        }
    }
    /**
     * Create a toast overlay with toast options.
     *
     * @param options The options to use to create the toast.
     */
    create(options) {
        return createOverlay('ion-toast', options);
    }
    /**
     * Dismiss the open toast overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the toast. For example, 'cancel' or 'backdrop'.
     * @param id The id of the toast to dismiss. If an id is not provided, it will dismiss the most recently opened toast.
     */
    dismiss(data, role, id) {
        return dismissOverlay(document, data, role, 'ion-toast', id);
    }
    /**
     * Get the most recently opened toast overlay.
     */
    async getTop() {
        return getOverlay(document, 'ion-toast');
    }
    static get is() { return "ion-toast-controller"; }
    static get methods() { return {
        "create": {
            "complexType": {
                "signature": "(options?: ToastOptions | undefined) => Promise<HTMLIonToastElement>",
                "parameters": [{
                        "tags": [{
                                "text": "options The options to use to create the toast.",
                                "name": "param"
                            }],
                        "text": "The options to use to create the toast."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonToastElement": {
                        "location": "global"
                    },
                    "ToastOptions": {
                        "location": "import",
                        "path": "../../interface"
                    }
                },
                "return": "Promise<HTMLIonToastElement>"
            },
            "docs": {
                "text": "Create a toast overlay with toast options.",
                "tags": [{
                        "name": "param",
                        "text": "options The options to use to create the toast."
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
                                "text": "role The role of the element that is dismissing the toast. For example, 'cancel' or 'backdrop'.",
                                "name": "param"
                            }],
                        "text": "The role of the element that is dismissing the toast. For example, 'cancel' or 'backdrop'."
                    }, {
                        "tags": [{
                                "text": "id The id of the toast to dismiss. If an id is not provided, it will dismiss the most recently opened toast.",
                                "name": "param"
                            }],
                        "text": "The id of the toast to dismiss. If an id is not provided, it will dismiss the most recently opened toast."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<boolean>"
            },
            "docs": {
                "text": "Dismiss the open toast overlay.",
                "tags": [{
                        "name": "param",
                        "text": "data Any data to emit in the dismiss events."
                    }, {
                        "name": "param",
                        "text": "role The role of the element that is dismissing the toast. For example, 'cancel' or 'backdrop'."
                    }, {
                        "name": "param",
                        "text": "id The id of the toast to dismiss. If an id is not provided, it will dismiss the most recently opened toast."
                    }]
            }
        },
        "getTop": {
            "complexType": {
                "signature": "() => Promise<HTMLIonToastElement | undefined>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonToastElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLIonToastElement | undefined>"
            },
            "docs": {
                "text": "Get the most recently opened toast overlay.",
                "tags": []
            }
        }
    }; }
}
