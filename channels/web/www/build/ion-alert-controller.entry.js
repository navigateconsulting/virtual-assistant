import { r as registerInstance, B as Build } from './core-950489bb.js';
import { c as createOverlay, d as dismissOverlay, g as getOverlay } from './overlays-a2b1b53e.js';

const AlertController = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
};

export { AlertController as ion_alert_controller };
