import { ComponentInterface } from '../../stencil.core';
import { ComponentProps, NavComponent } from '../../interface';
/**
 * @deprecated Use `<ion-nav-link component="MyComponent" routerDirection="root">` instead.
 */
export declare class NavSetRoot implements ComponentInterface {
    el: HTMLElement;
    /**
     * Component you want to make root for the navigation stack
     *
     */
    component?: NavComponent;
    /**
     * Data you want to pass to the component as props
     */
    componentProps?: ComponentProps;
    componentDidLoad(): void;
    private setRoot;
    render(): any;
}
