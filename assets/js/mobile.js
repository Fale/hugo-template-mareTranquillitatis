document.addEventListener('DOMContentLoaded', function () {
    document.querySelector("#nav-toggler").addEventListener('click', function toggleNavigation() {
        if (document.querySelector("header nav").style.display === 'block') {
            document.querySelector("header nav").style.display = 'none';
        } else {
            document.querySelector("header nav").style.display = 'block';
        }
    });
});
