import { Build } from "@stencil/core";
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
/**
 * @deprecated Use the `popoverController` exported from core.
 */
export class PopoverController {
    constructor() {
        if (Build.isDev) {
            console.warn(`[DEPRECATED][ion-popover-controller] Use the popoverController export from @ionic/core:
  import { popoverController } from '@ionic/core';
  const popover = await popoverController.create({...});`);
        }
    }
    /**
     * Create a popover overlay with popover options.
     *
     * @param options The options to use to create the popover.
     */
    create(options) {
        return createOverlay('ion-popover', options);
    }
    /**
     * Dismiss the open popover overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the popover.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the popover.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the popover to dismiss. If an id is not provided, it will dismiss the most recently opened popover.
     */
    dismiss(data, role, id) {
        return dismissOverlay(document, data, role, 'ion-popover', id);
    }
    /**
     * Get the most recently opened popover overlay.
     */
    async getTop() {
        return getOverlay(document, 'ion-popover');
    }
    static get is() { return "ion-popover-controller"; }
    static get methods() { return {
        "create": {
            "complexType": {
                "signature": "<T extends ComponentRef>(options: PopoverOptions<T>) => Promise<HTMLIonPopoverElement>",
                "parameters": [{
                        "tags": [{
                                "text": "options The options to use to create the popover.",
                                "name": "param"
                            }],
                        "text": "The options to use to create the popover."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonPopoverElement": {
                        "location": "global"
                    },
                    "ComponentRef": {
                        "location": "import",
                        "path": "../../interface"
                    },
                    "PopoverOptions": {
                        "location": "import",
                        "path": "../../interface"
                    },
                    "T": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLIonPopoverElement>"
            },
            "docs": {
                "text": "Create a popover overlay with popover options.",
                "tags": [{
                        "name": "param",
                        "text": "options The options to use to create the popover."
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
                                "text": "role The role of the element that is dismissing the popover.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the popover.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`.",
                                "name": "param"
                            }],
                        "text": "The role of the element that is dismissing the popover.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the popover.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "tags": [{
                                "text": "id The id of the popover to dismiss. If an id is not provided, it will dismiss the most recently opened popover.",
                                "name": "param"
                            }],
                        "text": "The id of the popover to dismiss. If an id is not provided, it will dismiss the most recently opened popover."
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<boolean>"
            },
            "docs": {
                "text": "Dismiss the open popover overlay.",
                "tags": [{
                        "name": "param",
                        "text": "data Any data to emit in the dismiss events."
                    }, {
                        "name": "param",
                        "text": "role The role of the element that is dismissing the popover.\nThis can be useful in a button handler for determining which button was\nclicked to dismiss the popover.\nSome examples include: ``\"cancel\"`, `\"destructive\"`, \"selected\"`, and `\"backdrop\"`."
                    }, {
                        "name": "param",
                        "text": "id The id of the popover to dismiss. If an id is not provided, it will dismiss the most recently opened popover."
                    }]
            }
        },
        "getTop": {
            "complexType": {
                "signature": "() => Promise<HTMLIonPopoverElement | undefined>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLIonPopoverElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLIonPopoverElement | undefined>"
            },
            "docs": {
                "text": "Get the most recently opened popover overlay.",
                "tags": []
            }
        }
    }; }
}
