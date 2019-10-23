import { r as registerInstance, h, H as Host, e as getElement } from './core-950489bb.js';
import { n as navLink } from './nav-link-utils-8805b760.js';

const NavPop = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
    get el() { return getElement(this); }
};

export { NavPop as ion_nav_pop };
