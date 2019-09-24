import { Build } from "@stencil/core";
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
/**
 * @deprecated Use the `alertController` exported from core.
 */
export class AlertController {
    constructor() {
        if (Build.isDev) {
            console.warn(`[DEPRECATED][ion-alert-controller] Use the alertController export from @ionic/core:
  import { alertController } from '@ionic/core';
  const alert = await alertController.create({...});`);
        }
    }
    /**
     * Create an alert overlay with alert options.
     *
     * @param options The options to use to create the alert.
     */
    create(options) {
        return createOverlay('ion-alert', options);
    }
    /**
     * Dismiss the open alert overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the alert.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the alert.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the alert to dismiss. If an id is not provided, it will dismiss the most recently opened alert.
     */
    dismiss(data, role, id) {
        return dismissOverlay(document, data, role, 'ion-alert', id);
    }
    /**
     * Get the most recently opened alert overlay.
     */
    async getTop() {
        return getOverlay(document, 'ion-alert');
    }
    static get is() { return "ion-alert-controller"; }
    static get methods() { return {
        "create": {
            "complexType": {
                "signature": "(options: AlertOptions) => Promise<HTMLIonAlertElement>",
                "parameters": [{
                        "tags": [{
                                "text": "options The options to use to create the alert.",
                                "name": "param"
                            }],
                        "text": "The options to use to create the alert."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonAlertElement": {
                        "location": "global"
                    },
                    "AlertOptions": {
                        "location": "import",
                        "path": "../../interface"
                    }
                },
                "return": "Promise<HTMLIonAlertElement>"
            },
            "docs": {
                "text": "Create an alert overlay with alert options.",
                "tags": [{
                        "name": "param",
                        "text": "options The options to use to create the alert."
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
                                "text": "role The role of the element that is dismissing the alert.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the alert.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`.",
                                "name": "param"
                            }],
                        "text": "The role of the element that is dismissing the alert.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the alert.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "tags": [{
                                "text": "id The id of the alert to dismiss. If an id is not provided, it will dismiss the most recently opened alert.",
                                "name": "param"
                            }],
                        "text": "The id of the alert to dismiss. If an id is not provided, it will dismiss the most recently opened alert."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<boolean>"
            },
            "docs": {
                "text": "Dismiss the open alert overlay.",
                "tags": [{
                        "name": "param",
                        "text": "data Any data to emit in the dismiss events."
                    }, {
                        "name": "param",
                        "text": "role The role of the element that is dismissing the alert.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the alert.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "name": "param",
                        "text": "id The id of the alert to dismiss. If an id is not provided, it will dismiss the most recently opened alert."
                    }]
            }
        },
        "getTop": {
            "complexType": {
                "signature": "() => Promise<HTMLIonAlertElement | undefined>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonAlertElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLIonAlertElement | undefined>"
            },
            "docs": {
                "text": "Get the most recently opened alert overlay.",
                "tags": []
            }
        }
    }; }
}
