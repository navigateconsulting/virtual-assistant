import { ComponentInterface, EventEmitter } from '../../stencil.core';
import { SegmentButtonLayout } from '../../interface';
import { ButtonInterface } from '../../utils/element-interface';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export declare class SegmentButton implements ComponentInterface, ButtonInterface {
    el: HTMLElement;
    /**
     * If `true`, the segment button is selected.
     */
    checked: boolean;
    /**
     * If `true`, the user cannot interact with the segment button.
     */
    disabled: boolean;
    /**
     * Set the layout of the text and icon in the segment.
     */
    layout?: SegmentButtonLayout;
    /**
     * The type of the button.
     */
    type: 'submit' | 'reset' | 'button';
    /**
     * The value of the segment button.
     */
    value: string;
    /**
     * Emitted when the segment button is clicked.
     */
    ionSelect: EventEmitter<void>;
    checkedChanged(checked: boolean, prev: boolean): void;
    private readonly hasLabel;
    private readonly hasIcon;
    private onClick;
    render(): any;
}
