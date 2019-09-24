import { ComponentInterface } from '../../stencil.core';
import { AlertOptions, OverlayController } from '../../interface';
/**
 * @deprecated Use the `alertController` exported from core.
 */
export declare class AlertController implements ComponentInterface, OverlayController {
    constructor();
    /**
     * Create an alert overlay with alert options.
     *
     * @param options The options to use to create the alert.
     */
    create(options: AlertOptions): Promise<HTMLIonAlertElement>;
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
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened alert overlay.
     */
    getTop(): Promise<HTMLIonAlertElement | undefined>;
}
