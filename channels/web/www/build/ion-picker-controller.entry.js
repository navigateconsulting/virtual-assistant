import { r as registerInstance, B as Build } from './core-950489bb.js';
import { c as createOverlay, d as dismissOverlay, g as getOverlay } from './overlays-a2b1b53e.js';

const PickerController = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
};

export { PickerController as ion_picker_controller };
