const mobileNavDiv = document.getElementById('mobile-nav');

/* Open when someone clicks on the span element */
function openNav() {
    document.getElementById('mobile-nav').style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
	document.getElementById('mobile-nav').style.width = "0%";
}

window.onresize = () => {
    loadMobileNav();
}

/* loadMobileNav */
onload = () => {
    loadMobileNav();
}

function loadMobileNav() {
    if (window.innerWidth < 775) {    
        const mobileNavHTML = `
            <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
            <div class="overlay-content">
            <a href="/">Home</a>
            <a href="./projects.html">Projects</a>
            <a href="./about.html">About me</a>
            <a href="./resume.html">Resume</a>
            </div>
        `;
        mobileNavDiv.innerHTML = mobileNavHTML;
    }
}