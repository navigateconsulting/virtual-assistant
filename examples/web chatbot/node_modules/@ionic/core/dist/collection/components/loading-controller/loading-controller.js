import { Build } from "@stencil/core";
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
/**
 * @deprecated Use the `loadingController` exported from core.
 */
export class LoadingController {
    constructor() {
        if (Build.isDev) {
            console.warn(`[DEPRECATED][ion-loading-controller] Use the loadingController export from @ionic/core:
  import { loadingController } from '@ionic/core';
  const modal = await loadingController.create({...});`);
        }
    }
    /**
     * Create a loading overlay with loading options.
     *
     * @param options The options to use to create the loading.
     */
    create(options) {
        return createOverlay('ion-loading', options);
    }
    /**
     * Dismiss the open loading overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the loading.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the loading.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the loading to dismiss. If an id is not provided, it will dismiss the most recently opened loading.
     */
    dismiss(data, role, id) {
        return dismissOverlay(document, data, role, 'ion-loading', id);
    }
    /**
     * Get the most recently opened loading overlay.
     */
    async getTop() {
        return getOverlay(document, 'ion-loading');
    }
    static get is() { return "ion-loading-controller"; }
    static get methods() { return {
        "create": {
            "complexType": {
                "signature": "(options?: LoadingOptions | undefined) => Promise<HTMLIonLoadingElement>",
                "parameters": [{
                        "tags": [{
                                "text": "options The options to use to create the loading.",
                                "name": "param"
                            }],
                        "text": "The options to use to create the loading."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonLoadingElement": {
                        "location": "global"
                    },
                    "LoadingOptions": {
                        "location": "import",
                        "path": "../../interface"
                    }
                },
                "return": "Promise<HTMLIonLoadingElement>"
            },
            "docs": {
                "text": "Create a loading overlay with loading options.",
                "tags": [{
                        "name": "param",
                        "text": "options The options to use to create the loading."
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
                                "text": "role The role of the element that is dismissing the loading.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the loading.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`.",
                                "name": "param"
                            }],
                        "text": "The role of the element that is dismissing the loading.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the loading.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "tags": [{
                                "text": "id The id of the loading to dismiss. If an id is not provided, it will dismiss the most recently opened loading.",
                                "name": "param"
                            }],
                        "text": "The id of the loading to dismiss. If an id is not provided, it will dismiss the most recently opened loading."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<boolean>"
            },
            "docs": {
                "text": "Dismiss the open loading overlay.",
                "tags": [{
                        "name": "param",
                        "text": "data Any data to emit in the dismiss events."
                    }, {
                        "name": "param",
                        "text": "role The role of the element that is dismissing the loading.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the loading.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "name": "param",
                        "text": "id The id of the loading to dismiss. If an id is not provided, it will dismiss the most recently opened loading."
                    }]
            }
        },
        "getTop": {
            "complexType": {
                "signature": "() => Promise<HTMLIonLoadingElement | undefined>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonLoadingElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLIonLoadingElement | undefined>"
            },
            "docs": {
                "text": "Get the most recently opened loading overlay.",
                "tags": []
            }
        }
    }; }
}
