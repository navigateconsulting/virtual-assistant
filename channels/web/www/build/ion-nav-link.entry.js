import { r as registerInstance, h, H as Host, e as getElement } from './core-950489bb.js';
import { n as navLink } from './nav-link-utils-8805b760.js';

const NavLink = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * The transition direction when navigating to another page.
         */
        this.routerDirection = 'forward';
        this.onClick = () => {
            return navLink(this.el, this.routerDirection, this.component, this.componentProps);
        };
    }
    render() {
        return (h(Host, { onClick: this.onClick }));
    }
    get el() { return getElement(this); }
};

export { NavLink as ion_nav_link };
