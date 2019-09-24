import { ComponentInterface } from '../../stencil.core';
import { LoadingOptions, OverlayController } from '../../interface';
/**
 * @deprecated Use the `loadingController` exported from core.
 */
export declare class LoadingController implements ComponentInterface, OverlayController {
    constructor();
    /**
     * Create a loading overlay with loading options.
     *
     * @param options The options to use to create the loading.
     */
    create(options?: LoadingOptions): Promise<HTMLIonLoadingElement>;
    /**
     * Dismiss the open loading overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the loading.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the loading.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the loading to dismiss. If an id is not provided, it will dismiss the most recently opened loading.
     */
    dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
    /**
     * Get the most recently opened loading overlay.
     */
    getTop(): Promise<HTMLIonLoadingElement | undefined>;
}
