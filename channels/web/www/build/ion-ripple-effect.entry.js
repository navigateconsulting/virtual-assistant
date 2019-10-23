import { r as registerInstance, d as readTask, w as writeTask, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';

const RippleEffect = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Sets the type of ripple-effect:
         *
         * - `bounded`: the ripple effect expands from the user's click position
         * - `unbounded`: the ripple effect expands from the center of the button and overflows the container.
         *
         * NOTE: Surfaces for bounded ripples should have the overflow property set to hidden,
         * while surfaces for unbounded ripples should have it set to visible.
         */
        this.type = 'bounded';
    }
    /**
     * Adds the ripple effect to the parent element.
     *
     * @param x The horizontal coordinate of where the ripple should start.
     * @param y The vertical coordinate of where the ripple should start.
     */
    async addRipple(x, y) {
        return new Promise(resolve => {
            readTask(() => {
                const rect = this.el.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                const hypotenuse = Math.sqrt(width * width + height * height);
                const maxDim = Math.max(height, width);
                const maxRadius = this.unbounded ? maxDim : hypotenuse + PADDING;
                const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
                const finalScale = maxRadius / initialSize;
                let posX = x - rect.left;
                let posY = y - rect.top;
                if (this.unbounded) {
                    posX = width * 0.5;
                    posY = height * 0.5;
                }
                const styleX = posX - initialSize * 0.5;
                const styleY = posY - initialSize * 0.5;
                const moveX = width * 0.5 - posX;
                const moveY = height * 0.5 - posY;
                writeTask(() => {
                    const div = document.createElement('div');
                    div.classList.add('ripple-effect');
                    const style = div.style;
                    style.top = styleY + 'px';
                    style.left = styleX + 'px';
                    style.width = style.height = initialSize + 'px';
                    style.setProperty('--final-scale', `${finalScale}`);
                    style.setProperty('--translate-end', `${moveX}px, ${moveY}px`);
                    const container = this.el.shadowRoot || this.el;
                    container.appendChild(div);
                    setTimeout(() => {
                        resolve(() => {
                            removeRipple(div);
                        });
                    }, 225 + 100);
                });
            });
        });
    }
    get unbounded() {
        return this.type === 'unbounded';
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { role: "presentation", class: {
                [mode]: true,
                'unbounded': this.unbounded
            } }));
    }
    get el() { return getElement(this); }
    static get style() { return ":host {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  contain: strict;\n  pointer-events: none;\n}\n\n:host(.unbounded) {\n  contain: layout size style;\n}\n\n.ripple-effect {\n  border-radius: 50%;\n  position: absolute;\n  background-color: currentColor;\n  color: inherit;\n  contain: strict;\n  opacity: 0;\n  -webkit-animation: 225ms rippleAnimation forwards, 75ms fadeInAnimation forwards;\n  animation: 225ms rippleAnimation forwards, 75ms fadeInAnimation forwards;\n  will-change: transform, opacity;\n  pointer-events: none;\n}\n\n.fade-out {\n  -webkit-transform: translate(var(--translate-end)) scale(var(--final-scale, 1));\n  transform: translate(var(--translate-end)) scale(var(--final-scale, 1));\n  -webkit-animation: 150ms fadeOutAnimation forwards;\n  animation: 150ms fadeOutAnimation forwards;\n}\n\n\@-webkit-keyframes rippleAnimation {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: scale(1);\n    transform: scale(1);\n  }\n  to {\n    -webkit-transform: translate(var(--translate-end)) scale(var(--final-scale, 1));\n    transform: translate(var(--translate-end)) scale(var(--final-scale, 1));\n  }\n}\n\n\@keyframes rippleAnimation {\n  from {\n    -webkit-animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transform: scale(1);\n    transform: scale(1);\n  }\n  to {\n    -webkit-transform: translate(var(--translate-end)) scale(var(--final-scale, 1));\n    transform: translate(var(--translate-end)) scale(var(--final-scale, 1));\n  }\n}\n\@-webkit-keyframes fadeInAnimation {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0;\n  }\n  to {\n    opacity: 0.16;\n  }\n}\n\@keyframes fadeInAnimation {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0;\n  }\n  to {\n    opacity: 0.16;\n  }\n}\n\@-webkit-keyframes fadeOutAnimation {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0.16;\n  }\n  to {\n    opacity: 0;\n  }\n}\n\@keyframes fadeOutAnimation {\n  from {\n    -webkit-animation-timing-function: linear;\n    animation-timing-function: linear;\n    opacity: 0.16;\n  }\n  to {\n    opacity: 0;\n  }\n}"; }
};
const removeRipple = (ripple) => {
    ripple.classList.add('fade-out');
    setTimeout(() => {
        ripple.remove();
    }, 200);
};
const PADDING = 10;
const INITIAL_ORIGIN_SCALE = 0.5;

export { RippleEffect as ion_ripple_effect };
