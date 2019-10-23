import { r as registerInstance, c as getIonMode, h, H as Host } from './core-950489bb.js';

const Slide = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { class: {
                [mode]: true,
                'swiper-slide': true,
                'swiper-zoom-container': true
            } }));
    }
    static get style() { return "ion-slide {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n.slide-zoom {\n  display: block;\n  width: 100%;\n  text-align: center;\n}\n\n.swiper-slide {\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  -ms-flex-align: center;\n  align-items: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  font-size: 18px;\n  text-align: center;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.swiper-slide img {\n  width: auto;\n  max-width: 100%;\n  height: auto;\n  max-height: 100%;\n}"; }
};

export { Slide as ion_slide };
