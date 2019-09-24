import { ComponentInterface } from '../../stencil.core';
import { ActionSheetOptions, OverlayController } from '../../interface';
/**
 * @deprecated Use the `actionSheetController` exported from core.
 */
export declare class ActionSheetController implements ComponentInterface, OverlayController {
    constructor();
    /**
     * Create an action sheet overlay with action sheet options.
     *
     * @param options The options to use to create the action sheet.
     */
    create(options: ActionSheetOptions): Promise<HTMLIonActionSheetElement>;
    /**
     * Dismiss the open action sheet overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the action sheet.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the action sheet.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the action sheet to dismiss. If an id is not provided, it will dismiss the most recently opened action sheet.
     */
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened action sheet overlay.
     */
    getTop(): Promise<HTMLIonActionSheetElement | undefined>;
}
