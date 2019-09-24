import { Host, h } from "@stencil/core";
import { navLink } from '../nav-link/nav-link-utils';
/**
 * @deprecated Use `<ion-nav-link routerDirection="back">` instead.
 */
export class NavPop {
    constructor() {
        this.pop = () => {
            return navLink(this.el, 'back');
        };
    }
    componentDidLoad() {
        console.warn('[DEPRECATED][ion-nav-pop] <ion-nav-pop> is deprecated. Use `<ion-nav-link routerDirection="back">` instead.');
    }
    render() {
        return (h(Host, { onClick: this.pop }));
    }
    static get is() { return "ion-nav-pop"; }
    static get elementRef() { return "el"; }
}
