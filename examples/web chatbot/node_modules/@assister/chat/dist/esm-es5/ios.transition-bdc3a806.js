var shadow = function (el) {
    return el.shadowRoot || el;
};
var iosTransitionAnimation = function (AnimationC, navEl, opts) {
    var DURATION = 540;
    var EASING = 'cubic-bezier(0.32,0.72,0,1)';
    var OPACITY = 'opacity';
    var TRANSFORM = 'transform';
    var TRANSLATEX = 'translateX';
    var CENTER = '0%';
    var OFF_OPACITY = 0.8;
    var backDirection = (opts.direction === 'back');
    var isRTL = navEl.ownerDocument.dir === 'rtl';
    var OFF_RIGHT = isRTL ? '-99.5%' : '99.5%';
    var OFF_LEFT = isRTL ? '33%' : '-33%';
    var enteringEl = opts.enteringEl;
    var leavingEl = opts.leavingEl;
    var contentEl = enteringEl.querySelector(':scope > ion-content');
    var headerEls = enteringEl.querySelectorAll(':scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *');
    var enteringToolBarEls = enteringEl.querySelectorAll(':scope > ion-header > ion-toolbar');
    var enteringContent = new AnimationC();
    var rootTransition = new AnimationC();
    rootTransition
        .addElement(enteringEl)
        .duration(opts.duration || DURATION)
        .easing(opts.easing || EASING)
        .beforeRemoveClass('ion-page-invisible');
    if (leavingEl && navEl) {
        var navDecor = new AnimationC();
        navDecor
            .addElement(navEl);
        rootTransition.add(navDecor);
    }
    if (!contentEl && enteringToolBarEls.length === 0 && headerEls.length === 0) {
        enteringContent.addElement(enteringEl.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs'));
    }
    else {
        enteringContent
            .addElement(contentEl)
            .addElement(headerEls);
    }
    rootTransition.add(enteringContent);
    if (backDirection) {
        enteringContent
            .beforeClearStyles([OPACITY])
            .fromTo(TRANSLATEX, OFF_LEFT, CENTER, true)
            .fromTo(OPACITY, OFF_OPACITY, 1, true);
    }
    else {
        // entering content, forward direction
        enteringContent
            .beforeClearStyles([OPACITY])
            .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
        if (contentEl) {
            var enteringTransitionEffectEl = shadow(contentEl).querySelector('.transition-effect');
            if (enteringTransitionEffectEl) {
                var enteringTransitionCoverEl = enteringTransitionEffectEl.querySelector('.transition-cover');
                var enteringTransitionShadowEl = enteringTransitionEffectEl.querySelector('.transition-shadow');
                var enteringTransitionEffect = new AnimationC();
                var enteringTransitionCover = new AnimationC();
                var enteringTransitionShadow = new AnimationC();
                enteringTransitionEffect
                    .addElement(enteringTransitionEffectEl)
                    .beforeStyles({ opacity: '1' })
                    .afterStyles({ opacity: '' });
                enteringTransitionCover
                    .addElement(enteringTransitionCoverEl)
                    .beforeClearStyles([OPACITY])
                    .fromTo(OPACITY, 0, 0.1, true);
                enteringTransitionShadow
                    .addElement(enteringTransitionShadowEl)
                    .beforeClearStyles([OPACITY])
                    .fromTo(OPACITY, 0.70, 0.03, true);
                enteringContent
                    .add(enteringTransitionEffect)
                    .add(enteringTransitionCover)
                    .add(enteringTransitionShadow);
            }
        }
    }
    enteringToolBarEls.forEach(function (enteringToolBarEl) {
        var enteringToolBar = new AnimationC();
        var enteringTitle = new AnimationC();
        var enteringToolBarButtons = new AnimationC();
        var enteringToolBarItems = new AnimationC();
        var enteringToolBarBg = new AnimationC();
        var enteringBackButton = new AnimationC();
        var backButtonEl = enteringToolBarEl.querySelector('ion-back-button');
        enteringToolBar.addElement(enteringToolBarEl);
        rootTransition.add(enteringToolBar);
        enteringTitle.addElement(enteringToolBarEl.querySelector('ion-title'));
        enteringToolBarButtons.addElement(enteringToolBarEl.querySelectorAll('ion-buttons,[menuToggle]'));
        enteringToolBarItems.addElement(enteringToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])'));
        enteringToolBarBg.addElement(shadow(enteringToolBarEl).querySelector('.toolbar-background'));
        if (backButtonEl) {
            enteringBackButton.addElement(backButtonEl);
        }
        enteringToolBar
            .add(enteringTitle)
            .add(enteringToolBarButtons)
            .add(enteringToolBarItems)
            .add(enteringToolBarBg)
            .add(enteringBackButton);
        enteringTitle.fromTo(OPACITY, 0.01, 1, true);
        enteringToolBarButtons.fromTo(OPACITY, 0.01, 1, true);
        enteringToolBarItems.fromTo(OPACITY, 0.01, 1, true);
        if (backDirection) {
            enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);
            enteringToolBarItems.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);
            // back direction, entering page has a back button
            enteringBackButton.fromTo(OPACITY, 0.01, 1, true);
        }
        else {
            // entering toolbar, forward direction
            enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
            enteringToolBarItems.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
            enteringToolBarBg
                .beforeClearStyles([OPACITY])
                .fromTo(OPACITY, 0.01, 1, true);
            // forward direction, entering page has a back button
            enteringBackButton.fromTo(OPACITY, 0.01, 1, true);
            if (backButtonEl) {
                var enteringBackBtnText = new AnimationC();
                enteringBackBtnText
                    .addElement(shadow(backButtonEl).querySelector('.button-text'))
                    .fromTo(TRANSLATEX, (isRTL ? '-100px' : '100px'), '0px');
                enteringToolBar.add(enteringBackBtnText);
            }
        }
    });
    // setup leaving view
    if (leavingEl) {
        var leavingContent = new AnimationC();
        var leavingContentEl = leavingEl.querySelector(':scope > ion-content');
        leavingContent
            .addElement(leavingContentEl)
            .addElement(leavingEl.querySelectorAll(':scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *'));
        rootTransition.add(leavingContent);
        if (backDirection) {
            // leaving content, back direction
            leavingContent
                .beforeClearStyles([OPACITY])
                .fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));
            if (leavingContentEl) {
                var leavingTransitionEffectEl = shadow(leavingContentEl).querySelector('.transition-effect');
                if (leavingTransitionEffectEl) {
                    var leavingTransitionCoverEl = leavingTransitionEffectEl.querySelector('.transition-cover');
                    var leavingTransitionShadowEl = leavingTransitionEffectEl.querySelector('.transition-shadow');
                    var leavingTransitionEffect = new AnimationC();
                    var leavingTransitionCover = new AnimationC();
                    var leavingTransitionShadow = new AnimationC();
                    leavingTransitionEffect
                        .addElement(leavingTransitionEffectEl)
                        .beforeStyles({ opacity: '1' })
                        .afterStyles({ opacity: '' });
                    leavingTransitionCover
                        .addElement(leavingTransitionCoverEl)
                        .beforeClearStyles([OPACITY])
                        .fromTo(OPACITY, 0.1, 0, true);
                    leavingTransitionShadow
                        .addElement(leavingTransitionShadowEl)
                        .beforeClearStyles([OPACITY])
                        .fromTo(OPACITY, 0.70, 0.03, true);
                    leavingContent
                        .add(leavingTransitionEffect)
                        .add(leavingTransitionCover)
                        .add(leavingTransitionShadow);
                }
            }
        }
        else {
            // leaving content, forward direction
            leavingContent
                .fromTo(TRANSLATEX, CENTER, OFF_LEFT, true)
                .fromTo(OPACITY, 1, OFF_OPACITY, true);
        }
        var leavingToolBarEls = leavingEl.querySelectorAll(':scope > ion-header > ion-toolbar');
        leavingToolBarEls.forEach(function (leavingToolBarEl) {
            var leavingToolBar = new AnimationC();
            var leavingTitle = new AnimationC();
            var leavingToolBarButtons = new AnimationC();
            var leavingToolBarItems = new AnimationC();
            var leavingToolBarItemEls = leavingToolBarEl.querySelectorAll(':scope > *:not(ion-title):not(ion-buttons):not([menuToggle])');
            var leavingToolBarBg = new AnimationC();
            var leavingBackButton = new AnimationC();
            var backButtonEl = leavingToolBarEl.querySelector('ion-back-button');
            leavingToolBar.addElement(leavingToolBarEl);
            leavingTitle.addElement(leavingToolBarEl.querySelector('ion-title'));
            leavingToolBarButtons.addElement(leavingToolBarEl.querySelectorAll('ion-buttons,[menuToggle]'));
            if (leavingToolBarItemEls.length > 0) {
                leavingToolBarItems.addElement(leavingToolBarItemEls);
            }
            leavingToolBarBg.addElement(shadow(leavingToolBarEl).querySelector('.toolbar-background'));
            if (backButtonEl) {
                leavingBackButton.addElement(backButtonEl);
            }
            leavingToolBar
                .add(leavingTitle)
                .add(leavingToolBarButtons)
                .add(leavingToolBarItems)
                .add(leavingBackButton)
                .add(leavingToolBarBg);
            rootTransition.add(leavingToolBar);
            // fade out leaving toolbar items
            leavingBackButton.fromTo(OPACITY, 0.99, 0);
            leavingTitle.fromTo(OPACITY, 0.99, 0);
            leavingToolBarButtons.fromTo(OPACITY, 0.99, 0, 0);
            leavingToolBarItems.fromTo(OPACITY, 0.99, 0);
            if (backDirection) {
                // leaving toolbar, back direction
                leavingTitle.fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));
                leavingToolBarItems.fromTo(TRANSLATEX, CENTER, (isRTL ? '-100%' : '100%'));
                // leaving toolbar, back direction, and there's no entering toolbar
                // should just slide out, no fading out
                leavingToolBarBg
                    .beforeClearStyles([OPACITY])
                    .fromTo(OPACITY, 1, 0.01);
                if (backButtonEl) {
                    var leavingBackBtnText = new AnimationC();
                    leavingBackBtnText.addElement(shadow(backButtonEl).querySelector('.button-text'));
                    leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (isRTL ? -124 : 124) + 'px');
                    leavingToolBar.add(leavingBackBtnText);
                }
            }
            else {
                // leaving toolbar, forward direction
                leavingTitle
                    .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
                    .afterClearStyles([TRANSFORM]);
                leavingToolBarItems
                    .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
                    .afterClearStyles([TRANSFORM, OPACITY]);
                leavingBackButton.afterClearStyles([OPACITY]);
                leavingTitle.afterClearStyles([OPACITY]);
                leavingToolBarButtons.afterClearStyles([OPACITY]);
            }
        });
    }
    // Return the rootTransition promise
    return Promise.resolve(rootTransition);
};
export { iosTransitionAnimation, shadow };
