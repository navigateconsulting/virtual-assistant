import { ComponentInterface, EventEmitter } from '../../stencil.core';
import { Color, RadioChangeEventDetail, StyleEventDetail } from '../../interface';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export declare class Radio implements ComponentInterface {
    private inputId;
    el: HTMLElement;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * The name of the control, which is submitted with the form data.
     */
    name: string;
    /**
     * If `true`, the user cannot interact with the radio.
     */
    disabled: boolean;
    /**
     * If `true`, the radio is selected.
     */
    checked: boolean;
    /**
     * the value of the radio.
     */
    value?: any | null;
    /**
     * Emitted when the styles change.
     * @internal
     */
    ionStyle: EventEmitter<StyleEventDetail>;
    /**
     * Emitted when the radio button is selected.
     */
    ionSelect: EventEmitter<RadioChangeEventDetail>;
    /**
     * Emitted when checked radio button is selected.
     * @internal
     */
    ionDeselect: EventEmitter<RadioChangeEventDetail>;
    /**
     * Emitted when the radio button has focus.
     */
    ionFocus: EventEmitter<void>;
    /**
     * Emitted when the radio button loses focus.
     */
    ionBlur: EventEmitter<void>;
    colorChanged(): void;
    checkedChanged(isChecked: boolean): void;
    disabledChanged(): void;
    componentWillLoad(): void;
    private emitStyle;
    private onFocus;
    private onBlur;
    private onClick;
    render(): any;
}
