import { ComponentInterface } from '../../stencil.core';
import { OverlayController, PickerOptions } from '../../interface';
/**
 * @deprecated Use the `pickerController` exported from core.
 */
export declare class PickerController implements ComponentInterface, OverlayController {
    constructor();
    /**
     * Create a picker overlay with picker options.
     *
     * @param options The options to use to create the picker.
     */
    create(options: PickerOptions): Promise<HTMLIonPickerElement>;
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
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened picker overlay.
     */
    getTop(): Promise<HTMLIonPickerElement | undefined>;
}
