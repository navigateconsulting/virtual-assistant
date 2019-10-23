import { d as readTask, w as writeTask, r as registerInstance, c as getIonMode, h, H as Host, e as getElement } from './core-950489bb.js';
import { c as clamp } from './helpers-ad941782.js';

const TRANSITION = 'all 0.2s ease-in-out';
const cloneElement = (tagName) => {
    const getCachedEl = document.querySelector(`${tagName}.ion-cloned-element`);
    if (getCachedEl !== null) {
        return getCachedEl;
    }
    const clonedEl = document.createElement(tagName);
    clonedEl.classList.add('ion-cloned-element');
    clonedEl.style.setProperty('display', 'none');
    document.body.appendChild(clonedEl);
    return clonedEl;
};
const createHeaderIndex = (headerEl) => {
    if (!headerEl) {
        return;
    }
    const toolbars = headerEl.querySelectorAll('ion-toolbar');
    return {
        el: headerEl,
        toolbars: Array.from(toolbars).map((toolbar) => {
            const ionTitleEl = toolbar.querySelector('ion-title');
            return {
                el: toolbar,
                background: toolbar.shadowRoot.querySelector('.toolbar-background'),
                ionTitleEl,
                innerTitleEl: (ionTitleEl) ? ionTitleEl.shadowRoot.querySelector('.toolbar-title') : null,
                ionButtonsEl: Array.from(toolbar.querySelectorAll('ion-buttons')) || []
            };
        }) || [[]]
    };
};
const handleContentScroll = (scrollEl, mainHeaderIndex, scrollHeaderIndex, remainingHeight = 0) => {
    readTask(() => {
        const scrollTop = scrollEl.scrollTop;
        const lastMainToolbar = mainHeaderIndex.toolbars[mainHeaderIndex.toolbars.length - 1];
        const scale = clamp(1, 1 + (-scrollTop / 500), 1.1);
        const borderOpacity = clamp(0, (scrollTop - remainingHeight) / lastMainToolbar.el.clientHeight, 1);
        const maxOpacity = 1;
        const scaledOpacity = borderOpacity * maxOpacity;
        writeTask(() => {
            scaleLargeTitles(scrollHeaderIndex.toolbars, scale);
            setToolbarBackgroundOpacity(mainHeaderIndex.toolbars[0], (scaledOpacity === 1) ? undefined : scaledOpacity);
        });
    });
};
const setToolbarBackgroundOpacity = (toolbar, opacity) => {
    if (opacity === undefined) {
        toolbar.background.style.removeProperty('--opacity');
    }
    else {
        toolbar.background.style.setProperty('--opacity', opacity.toString());
    }
};
/**
 * If toolbars are intersecting, hide the scrollable toolbar content
 * and show the primary toolbar content. If the toolbars are not intersecting,
 * hide the primary toolbar content and show the scrollable toolbar content
 */
const handleToolbarIntersection = (ev, mainHeaderIndex, scrollHeaderIndex) => {
    writeTask(() => {
        const event = ev[0];
        const intersection = event.intersectionRect;
        const intersectionArea = intersection.width * intersection.height;
        const rootArea = event.rootBounds.width * event.rootBounds.height;
        const isPageHidden = intersectionArea === 0 && rootArea === 0;
        const leftDiff = Math.abs(intersection.left - event.boundingClientRect.left);
        const rightDiff = Math.abs(intersection.right - event.boundingClientRect.right);
        const isPageTransitioning = intersectionArea > 0 && (leftDiff >= 5 || rightDiff >= 5);
        if (isPageHidden || isPageTransitioning) {
            return;
        }
        if (event.isIntersecting) {
            setHeaderActive(mainHeaderIndex, false);
            setHeaderActive(scrollHeaderIndex);
        }
        else {
            /**
             * There is a bug with IntersectionObserver on Safari
             * where `event.isIntersecting === false` when cancelling
             * a swipe to go back gesture. Checking the intersection
             * x, y, width, and height provides a workaround. This bug
             * does not happen when using Safari + Web Animations,
             * only Safari + CSS Animations.
             */
            const hasValidIntersection = (intersection.x === 0 && intersection.y === 0) || (intersection.width !== 0 && intersection.height !== 0);
            if (hasValidIntersection) {
                setHeaderActive(mainHeaderIndex);
                setHeaderActive(scrollHeaderIndex, false);
            }
        }
    });
};
const setHeaderActive = (headerIndex, active = true) => {
    writeTask(() => {
        if (active) {
            headerIndex.el.classList.remove('header-collapse-condense-inactive');
        }
        else {
            headerIndex.el.classList.add('header-collapse-condense-inactive');
        }
        setToolbarBackgroundOpacity(headerIndex.toolbars[0], (active) ? undefined : 0);
    });
};
const scaleLargeTitles = (toolbars = [], scale = 1, transition = false) => {
    toolbars.forEach(toolbar => {
        const ionTitle = toolbar.ionTitleEl;
        const titleDiv = toolbar.innerTitleEl;
        if (!ionTitle || ionTitle.size !== 'large') {
            return;
        }
        titleDiv.style.transformOrigin = 'left center';
        titleDiv.style.transition = (transition) ? TRANSITION : '';
        titleDiv.style.transform = `scale3d(${scale}, ${scale}, 1)`;
    });
};

const Header = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.collapsibleHeaderInitialized = false;
        /**
         * If `true`, the header will be translucent.
         * Only applies when the mode is `"ios"` and the device supports
         * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         *
         * Note: In order to scroll content behind the header, the `fullscreen`
         * attribute needs to be set on the content.
         */
        this.translucent = false;
    }
    async componentDidLoad() {
        await this.checkCollapsibleHeader();
    }
    async componentDidUpdate() {
        await this.checkCollapsibleHeader();
    }
    componentDidUnload() {
        this.destroyCollapsibleHeader();
    }
    async checkCollapsibleHeader() {
        // Determine if the header can collapse
        const hasCollapse = this.collapse === 'condense';
        const canCollapse = (hasCollapse && getIonMode(this) === 'ios') ? hasCollapse : false;
        if (!canCollapse && this.collapsibleHeaderInitialized) {
            this.destroyCollapsibleHeader();
        }
        else if (canCollapse && !this.collapsibleHeaderInitialized) {
            const tabs = this.el.closest('ion-tabs');
            const page = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
            const pageEl = (tabs) ? tabs : (page) ? page : null;
            const contentEl = (pageEl) ? pageEl.querySelector('ion-content') : null;
            await this.setupCollapsibleHeader(contentEl, pageEl);
        }
    }
    destroyCollapsibleHeader() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = undefined;
        }
        if (this.scrollEl && this.contentScrollCallback) {
            this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
            this.contentScrollCallback = undefined;
        }
    }
    async setupCollapsibleHeader(contentEl, pageEl) {
        if (!contentEl || !pageEl) {
            console.error('ion-header requires a content to collapse, make sure there is an ion-content.');
            return;
        }
        this.scrollEl = await contentEl.getScrollElement();
        readTask(() => {
            const headers = pageEl.querySelectorAll('ion-header');
            const mainHeader = Array.from(headers).find((header) => header.collapse !== 'condense');
            if (!mainHeader || !this.scrollEl) {
                return;
            }
            const mainHeaderIndex = createHeaderIndex(mainHeader);
            const scrollHeaderIndex = createHeaderIndex(this.el);
            if (!mainHeaderIndex || !scrollHeaderIndex) {
                return;
            }
            setHeaderActive(mainHeaderIndex, false);
            // TODO: Find a better way to do this
            let remainingHeight = 0;
            for (let i = 1; i <= scrollHeaderIndex.toolbars.length - 1; i++) {
                remainingHeight += scrollHeaderIndex.toolbars[i].el.clientHeight;
            }
            /**
             * Handle interaction between toolbar collapse and
             * showing/hiding content in the primary ion-header
             */
            const toolbarIntersection = (ev) => { handleToolbarIntersection(ev, mainHeaderIndex, scrollHeaderIndex); };
            readTask(() => {
                const mainHeaderHeight = mainHeaderIndex.el.clientHeight;
                this.intersectionObserver = new IntersectionObserver(toolbarIntersection, { threshold: 0.25, rootMargin: `-${mainHeaderHeight}px 0px 0px 0px` });
                this.intersectionObserver.observe(scrollHeaderIndex.toolbars[0].el);
            });
            /**
             * Handle scaling of large iOS titles and
             * showing/hiding border on last toolbar
             * in primary header
             */
            this.contentScrollCallback = () => { handleContentScroll(this.scrollEl, mainHeaderIndex, scrollHeaderIndex, remainingHeight); };
            this.scrollEl.addEventListener('scroll', this.contentScrollCallback);
        });
        writeTask(() => {
            cloneElement('ion-title');
            cloneElement('ion-back-button');
        });
        this.collapsibleHeaderInitialized = true;
    }
    render() {
        const mode = getIonMode(this);
        const collapse = this.collapse || 'none';
        return (h(Host, { role: "banner", class: {
                [mode]: true,
                // Used internally for styling
                [`header-${mode}`]: true,
                [`header-translucent`]: this.translucent,
                [`header-collapse-${collapse}`]: true,
                [`header-translucent-${mode}`]: this.translucent,
            } }));
    }
    get el() { return getElement(this); }
    static get style() { return "ion-header {\n  display: block;\n  position: relative;\n  -ms-flex-order: -1;\n  order: -1;\n  width: 100%;\n  z-index: 10;\n}\n\nion-header ion-toolbar:first-child {\n  padding-top: var(--ion-safe-area-top, 0);\n}\n\n.header-ios ion-toolbar:last-child {\n  --border-width: 0 0 0.55px;\n}\n\n.header-ios[no-border] ion-toolbar:last-child {\n  --border-width: 0;\n}\n\n\@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))) {\n  .header-translucent-ios {\n    -webkit-backdrop-filter: saturate(180%) blur(20px);\n    backdrop-filter: saturate(180%) blur(20px);\n  }\n\n  .header-translucent-ios ion-toolbar {\n    --opacity: .8;\n    --backdrop-filter: saturate(180%) blur(20px);\n  }\n}\n.header-collapse-condense {\n  z-index: 9;\n}\n\n.header-collapse-condense ion-toolbar {\n  position: -webkit-sticky;\n  position: sticky;\n  top: 0;\n}\n\n.header-collapse-condense ion-toolbar:first-child {\n  padding-top: 7px;\n  z-index: 1;\n}\n\n.header-collapse-condense ion-toolbar {\n  z-index: 0;\n}\n\n.header-collapse-condense ion-toolbar ion-searchbar {\n  height: 48px;\n  padding-top: 0px;\n  padding-bottom: 13px;\n}\n\nion-toolbar.in-toolbar ion-title,\nion-toolbar.in-toolbar ion-buttons {\n  -webkit-transition: all 0.2s ease-in-out;\n  transition: all 0.2s ease-in-out;\n}\n\n/**\n * There is a bug in Safari where animating the opacity\n * on an element in a scrollable container while scrolling\n * causes the scroll position to jump to the top\n */\n.header-collapse-condense ion-toolbar ion-title,\n.header-collapse-condense ion-toolbar ion-buttons {\n  -webkit-transition: none;\n  transition: none;\n}\n\n.header-collapse-condense-inactive ion-toolbar.in-toolbar ion-title,\n.header-collapse-condense-inactive ion-toolbar.in-toolbar ion-buttons.buttons-collapse {\n  opacity: 0;\n  pointer-events: none;\n}"; }
};

export { Header as ion_header };
