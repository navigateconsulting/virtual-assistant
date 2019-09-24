// Get the menu controller element
const getMenuController = (doc) => {
    const menuControllerElement = doc.querySelector('ion-menu-controller');
    if (!menuControllerElement) {
        return Promise.resolve(undefined);
    }
    return menuControllerElement.componentOnReady();
};
// Given a menu, toggle it
const toggleMenu = async (menu) => {
    const menuCtrl = await getMenuController(document);
    if (menuCtrl) {
        const menuEl = await menuCtrl.get(menu);
        if (menuEl) {
            menuCtrl.toggle(menu);
        }
    }
};
// Given a menu, return whether or not the menu toggle should be visible
const updateVisibility = async (menu) => {
    const menuCtrl = await getMenuController(document);
    if (menuCtrl) {
        const menuEl = await menuCtrl.get(menu);
        if (menuEl && await menuEl.isActive()) {
            return true;
        }
    }
    return false;
};

export { toggleMenu as t, updateVisibility as u };
