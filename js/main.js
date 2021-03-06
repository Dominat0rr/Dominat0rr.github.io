/* Mobile Nav */
document.querySelector('.menu-btn').addEventListener('click', () => {
    document.querySelector('.navbar-nav').classList.toggle('show');
});

/* Top Scroll - button */
const topButton = document.getElementById("scroll-top-btn");

window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topButton.style.display = "block";
      } else {
        topButton.style.display = "none";
      }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}