import { r as registerInstance, B as Build, j as isPlatform, i as config, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';

const App = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentDidLoad() {
        if (Build.isBrowser) {
            rIC(() => {
                const isHybrid = isPlatform(window, 'hybrid');
                if (!config.getBoolean('_testing')) {
                    __sc_import_rasa('./tap-click-41f7b764.js').then(module => module.startTapClick(config));
                }
                if (config.getBoolean('statusTap', isHybrid)) {
                    __sc_import_rasa('./status-tap-b5332a6b.js').then(module => module.startStatusTap());
                }
                if (config.getBoolean('inputShims', needInputShims())) {
                    __sc_import_rasa('./input-shims-45589c48.js').then(module => module.startInputShims(config));
                }
                if (config.getBoolean('hardwareBackButton', isHybrid)) {
                    __sc_import_rasa('./hardware-back-button-dbf97d0e.js').then(module => module.startHardwareBackButton());
                }
                __sc_import_rasa('./focus-visible-f5bcca71.js').then(module => module.startFocusVisible());
            });
        }
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { class: {
                [mode]: true,
                'ion-page': true,
                'force-statusbar-padding': config.getBoolean('_forceStatusbarPadding')
            } }));
    }
    get el() { return getElement(this); }
    static get style() { return "html.plt-mobile ion-app {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\nion-app.force-statusbar-padding {\n  --ion-safe-area-top: 20px;\n}"; }
};
const needInputShims = () => {
    return isPlatform(window, 'ios') && isPlatform(window, 'mobile');
};
const rIC = (callback) => {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback);
    }
    else {
        setTimeout(callback, 32);
    }
};

export { App as ion_app };
