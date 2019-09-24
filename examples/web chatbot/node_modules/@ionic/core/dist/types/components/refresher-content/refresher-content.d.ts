import { ComponentInterface } from '../../stencil.core';
import { SpinnerTypes } from '../../interface';
export declare class RefresherContent implements ComponentInterface {
    /**
     * A static icon to display when you begin to pull down
     */
    pullingIcon?: string | null;
    /**
     * The text you want to display when you begin to pull down.
     * `pullingText` can accept either plaintext or HTML as a string.
     * To display characters normally reserved for HTML, they
     * must be escaped. For example `<Ionic>` would become
     * `&lt;Ionic&gt;`
     *
     * For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
     */
    pullingText?: string;
    /**
     * An animated SVG spinner that shows when refreshing begins
     */
    refreshingSpinner?: SpinnerTypes | null;
    /**
     * The text you want to display when performing a refresh.
     * `refreshingText` can accept either plaintext or HTML as a string.
     * To display characters normally reserved for HTML, they
     * must be escaped. For example `<Ionic>` would become
     * `&lt;Ionic&gt;`
     *
     * For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
     */
    refreshingText?: string;
    componentWillLoad(): void;
    render(): any;
}
