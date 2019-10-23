import { r as registerInstance, f as createEvent, c as getIonMode, h, H as Host } from './core-950489bb.js';
import { n as now } from './helpers-ad941782.js';
import { GESTURE_CONTROLLER } from './index-9b8e1c51.js';

const Backdrop = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.lastClick = -10000;
        this.blocker = GESTURE_CONTROLLER.createBlocker({
            disableScroll: true
        });
        /**
         * If `true`, the backdrop will be visible.
         */
        this.visible = true;
        /**
         * If `true`, the backdrop will can be clicked and will emit the `ionBackdropTap` event.
         */
        this.tappable = true;
        /**
         * If `true`, the backdrop will stop propagation on tap.
         */
        this.stopPropagation = true;
        this.ionBackdropTap = createEvent(this, "ionBackdropTap", 7);
    }
    connectedCallback() {
        if (this.stopPropagation) {
            this.blocker.block();
        }
    }
    disconnectedCallback() {
        this.blocker.unblock();
    }
    onTouchStart(ev) {
        this.lastClick = now(ev);
        this.emitTap(ev);
    }
    onMouseDown(ev) {
        if (this.lastClick < now(ev) - 2500) {
            this.emitTap(ev);
        }
    }
    emitTap(ev) {
        if (this.stopPropagation) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        if (this.tappable) {
            this.ionBackdropTap.emit();
        }
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { tabindex: "-1", class: {
                [mode]: true,
                'backdrop-hide': !this.visible,
                'backdrop-no-tappable': !this.tappable,
            } }));
    }
    static get style() { return ":host {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  display: block;\n  position: absolute;\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n  contain: strict;\n  cursor: pointer;\n  opacity: 0.01;\n  -ms-touch-action: none;\n  touch-action: none;\n  z-index: 2;\n}\n\n:host(.backdrop-hide) {\n  background: transparent;\n}\n\n:host(.backdrop-no-tappable) {\n  cursor: auto;\n}\n\n:host {\n  background-color: var(--ion-backdrop-color, #000);\n}"; }
};

export { Backdrop as ion_backdrop };
