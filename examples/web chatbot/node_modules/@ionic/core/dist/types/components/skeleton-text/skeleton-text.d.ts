import { ComponentInterface } from '../../stencil.core';
export declare class SkeletonText implements ComponentInterface {
    el: HTMLElement;
    /**
     * If `true`, the skeleton text will animate.
     */
    animated: boolean;
    /**
     * @deprecated Use CSS instead. The width of the skeleton text. If supplied, it will override the CSS style.
     */
    width?: string;
    calculateWidth(): {
        style: {
            width: string;
        };
    } | undefined;
    render(): any;
}
