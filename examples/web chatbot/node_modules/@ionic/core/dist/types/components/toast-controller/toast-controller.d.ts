import { ComponentInterface } from '../../stencil.core';
import { OverlayController, ToastOptions } from '../../interface';
/**
 * @deprecated Use the `toastController` exported from core.
 */
export declare class ToastController implements ComponentInterface, OverlayController {
    constructor();
    /**
     * Create a toast overlay with toast options.
     *
     * @param options The options to use to create the toast.
     */
    create(options?: ToastOptions): Promise<HTMLIonToastElement>;
    /**
     * Dismiss the open toast overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the toast. For example, 'cancel' or 'backdrop'.
     * @param id The id of the toast to dismiss. If an id is not provided, it will dismiss the most recently opened toast.
     */
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened toast overlay.
     */
    getTop(): Promise<HTMLIonToastElement | undefined>;
}
