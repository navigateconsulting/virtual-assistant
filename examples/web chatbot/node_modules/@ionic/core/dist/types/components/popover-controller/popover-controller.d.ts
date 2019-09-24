import { ComponentInterface } from '../../stencil.core';
import { ComponentRef, OverlayController, PopoverOptions } from '../../interface';
/**
 * @deprecated Use the `popoverController` exported from core.
 */
export declare class PopoverController implements ComponentInterface, OverlayController {
    constructor();
    /**
     * Create a popover overlay with popover options.
     *
     * @param options The options to use to create the popover.
     */
    create<T extends ComponentRef>(options: PopoverOptions<T>): Promise<HTMLIonPopoverElement>;
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
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened popover overlay.
     */
    getTop(): Promise<HTMLIonPopoverElement | undefined>;
}
