window.onresize = () => {
    loadMobileNav();
    
    if (window.innerWidth < 770) {
        console.log("change");
        if (!gridView) {
            loadProjects();
        }
        hideViewButton(true);
    } else {
        hideViewButton(false);
    }
};
