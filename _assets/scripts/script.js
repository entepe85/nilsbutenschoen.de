/*global window, document, setTimeout, console */
(function () {
    'use strict';
    var scrollTop = 0,
        forEach = Array.prototype.forEach,
        parallaxImages = document.querySelectorAll('.parallax-image'),
        navItems = document.querySelectorAll('.site-nav a.page-link'),
        pageUrl = document.URL;

    // Cross browser requestAnimationFrame
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (f) {
        setTimeout(f, 1000 / 60);
    };


    // Check if element is visible in viewport
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */ &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight);
    }


    // Parallax scrolling based on requestAnimationFrame
    function tick() {
        forEach.call(parallaxImages, function (el) {
            // Only perform the parallax animation if the parent is visible in the viewport
            if (isElementInViewport(el.parentNode)) {
                // Subtract parentNode's offset to allow for parallax in the middle of the page.
                el.style.transform = "translate3d(0," + Math.ceil(scrollTop * 0.5) + "px, 0)";
                el.style.msTransform = "translate3d(0," + Math.ceil(scrollTop * 0.5) + "px, 0)";
                el.style.mozTransform = "translate3d(0," + Math.ceil(scrollTop * 0.5) + "px, 0)";
                el.style.webkitTransform = "translate3d(0," + Math.ceil(scrollTop * 0.5) + "px, 0)";
            }
        });
    }


    function updateUnits() {
        scrollTop = window.pageYOffset;
        window.requestAnimationFrame(tick);
    }


    // Function to check if a menu item is active, because the site is static
    forEach.call(navItems, function (item) {
        var itemLink = item.getAttribute('href');
        if (pageUrl.indexOf(itemLink) > -1) {
            item.classList.add('active');
        }
    });


    window.addEventListener('scroll', function () { // on page scroll
        scrollTop = window.pageYOffset;
        window.requestAnimationFrame(tick);
    }, false);


    window.addEventListener('load', function () {
        updateUnits();
    });
    window.addEventListener('resize', function () {
        updateUnits();
    });
}(window));
