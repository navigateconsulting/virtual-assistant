import { r as registerInstance, f as createEvent, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';
import { c as createColorClasses } from './theme-215399f6.js';

const Label = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.noAnimate = false;
        this.ionStyle = createEvent(this, "ionStyle", 7);
    }
    componentWillLoad() {
        this.noAnimate = (this.position === 'floating');
        this.emitStyle();
    }
    componentDidLoad() {
        if (this.noAnimate) {
            setTimeout(() => {
                this.noAnimate = false;
            }, 1000);
        }
    }
    positionChanged() {
        this.emitStyle();
    }
    emitStyle() {
        const position = this.position;
        this.ionStyle.emit({
            'label': true,
            [`label-${position}`]: position !== undefined
        });
    }
    render() {
        const position = this.position;
        const mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true, [`label-${position}`]: position !== undefined, [`label-no-animate`]: (this.noAnimate) }) }));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "position": ["positionChanged"]
    }; }
    static get style() { return ".item.sc-ion-label-ios-h, .item .sc-ion-label-ios-h {\n  \n  --color: initial;\n  display: block;\n  color: var(--color);\n  font-family: var(--ion-font-family, inherit);\n  font-size: inherit;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.ion-color.sc-ion-label-ios-h {\n  color: var(--ion-color-base);\n}\n\n.ion-text-wrap.sc-ion-label-ios-h, [text-wrap].sc-ion-label-ios-h {\n  white-space: normal;\n}\n\n.item-interactive-disabled.sc-ion-label-ios-h:not(.item-multiple-inputs), .item-interactive-disabled:not(.item-multiple-inputs) .sc-ion-label-ios-h {\n  cursor: default;\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.item-input.sc-ion-label-ios-h, .item-input .sc-ion-label-ios-h {\n  -ms-flex: initial;\n  flex: initial;\n  max-width: 200px;\n  pointer-events: none;\n}\n\n.item-textarea.sc-ion-label-ios-h, .item-textarea .sc-ion-label-ios-h {\n  -ms-flex-item-align: baseline;\n  align-self: baseline;\n}\n\n.label-fixed.sc-ion-label-ios-h {\n  -ms-flex: 0 0 100px;\n  flex: 0 0 100px;\n  width: 100px;\n  min-width: 100px;\n  max-width: 200px;\n}\n\n.label-stacked.sc-ion-label-ios-h, .label-floating.sc-ion-label-ios-h {\n  margin-bottom: 0;\n  -ms-flex-item-align: stretch;\n  align-self: stretch;\n  width: auto;\n  max-width: 100%;\n}\n.label-no-animate.label-floating.sc-ion-label-ios-h {\n  -webkit-transition: none;\n  transition: none;\n}\n\n.ion-text-wrap.sc-ion-label-ios-h, [text-wrap].sc-ion-label-ios-h {\n  font-size: 14px;\n  line-height: 1.5;\n}\n\n.label-stacked.sc-ion-label-ios-h {\n  margin-bottom: 4px;\n  font-size: 13.6px;\n}\n.label-floating.sc-ion-label-ios-h {\n  margin-bottom: 0;\n  -webkit-transform: translate3d(0,  27px,  0);\n  transform: translate3d(0,  27px,  0);\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n  -webkit-transition: -webkit-transform 150ms ease-in-out;\n  transition: -webkit-transform 150ms ease-in-out;\n  transition: transform 150ms ease-in-out;\n  transition: transform 150ms ease-in-out, -webkit-transform 150ms ease-in-out;\n}\n[dir=rtl].sc-ion-label-ios-h -no-combinator.label-floating.sc-ion-label-ios-h, [dir=rtl] .sc-ion-label-ios-h -no-combinator.label-floating.sc-ion-label-ios-h, [dir=rtl].label-floating.sc-ion-label-ios-h, [dir=rtl] .label-floating.sc-ion-label-ios-h {\n  -webkit-transform-origin: right top;\n  transform-origin: right top;\n}\n\n.item-has-focus.label-floating.sc-ion-label-ios-h, .item-has-focus .label-floating.sc-ion-label-ios-h, .item-has-placeholder.label-floating.sc-ion-label-ios-h, .item-has-placeholder .label-floating.sc-ion-label-ios-h, .item-has-value.label-floating.sc-ion-label-ios-h, .item-has-value .label-floating.sc-ion-label-ios-h {\n  -webkit-transform: translate3d(0,  0,  0) scale(0.8);\n  transform: translate3d(0,  0,  0) scale(0.8);\n}\n\n.sc-ion-label-ios-s  h1  {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 2px;\n  font-size: 24px;\n  font-weight: normal;\n}\n\n.sc-ion-label-ios-s  h2  {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 2px;\n  font-size: 17px;\n  font-weight: normal;\n}\n\n.sc-ion-label-ios-s  h3 , .sc-ion-label-ios-s  h4 , .sc-ion-label-ios-s  h5 , .sc-ion-label-ios-s  h6  {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 3px;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: normal;\n}\n\n.sc-ion-label-ios-s  p  {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 2px;\n  font-size: 14px;\n  line-height: normal;\n  text-overflow: inherit;\n  overflow: inherit;\n}\n\n.sc-ion-label-ios-s > p {\n  color: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.4);\n}\n\n.sc-ion-label-ios-h.ion-color.sc-ion-label-ios-s > p, .ion-color .sc-ion-label-ios-h.sc-ion-label-ios-s > p {\n  color: inherit;\n}\n\n.sc-ion-label-ios-s  h2:last-child , .sc-ion-label-ios-s  h3:last-child , .sc-ion-label-ios-s  h4:last-child , .sc-ion-label-ios-s  h5:last-child , .sc-ion-label-ios-s  h6:last-child , .sc-ion-label-ios-s  p:last-child  {\n  margin-bottom: 0;\n}"; }
};

export { Label as ion_label };
