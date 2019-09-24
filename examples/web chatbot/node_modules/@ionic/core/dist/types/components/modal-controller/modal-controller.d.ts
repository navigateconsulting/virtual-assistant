import { ComponentInterface } from '../../stencil.core';
import { ComponentRef, ModalOptions, OverlayController } from '../../interface';
/**
 * @deprecated Use the `modalController` exported from core.
 */
export declare class ModalController implements ComponentInterface, OverlayController {
    constructor();
    /**
     * Create a modal overlay with modal options.
     *
     * @param options The options to use to create the modal.
     */
    create<T extends ComponentRef>(options: ModalOptions<T>): Promise<HTMLIonModalElement>;
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
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened modal overlay.
     */
    getTop(): Promise<HTMLIonModalElement | undefined>;
}
