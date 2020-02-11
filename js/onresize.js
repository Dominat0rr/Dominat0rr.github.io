window.onresize = () => {
    loadMobileNav();
    
    if (window.innerWidth < 915) {
        if (!gridView) {
            loadProjects();
        }
        hideViewButton(true);
    } else {
        hideViewButton(false);
    }
};
