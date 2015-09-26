/*global window, document, setTimeout, console, XMLHttpRequest, FormData */
(function () {
    'use strict';
    var scrollTop = 0,
        forEach = Array.prototype.forEach,
        parallaxImages = document.querySelectorAll('.parallax-image'),
        navItems = document.querySelectorAll('.site-nav a.page-link'),
        pageUrl = document.URL,
        ajaxForm = document.querySelector('.ajax-form');

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


    if (ajaxForm !== 'undefined' && ajaxForm) {
        ajaxForm.addEventListener('submit', function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var xhr = new XMLHttpRequest(),
                formData = new FormData(ajaxForm),
                submitButton = ajaxForm.querySelector('button[type="submit"]'),
                message = {},
                statusMessage = document.createElement('div');
            message.success = 'Das hat geklappt. Vielen Dank für die Nachricht!';
            message.error = 'Oje, da ist leider etwas schiefgelaufen.';
            statusMessage.className = 'message';
            ajaxForm.appendChild(statusMessage);
            // Serialize form input values (URI encoded) into an array for later!
            forEach.call(ajaxForm.querySelectorAll('input, select, textarea'), function (input) {
                // Only store input values in array if the input is neither disabled nor empty
                if (!input.getAttribute('disabled') && input.value !== '') {
                    formData[input.getAttribute('name')] = input.value;
                }
            });
            console.log(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 1) {
                    // Add visual feedback for the AJAX request being sent!
                    submitButton.classList.add('sending');
                }
                if (xhr.readyState === 4) {
                    submitButton.classList.remove('sending');
                    if (xhr.status === 200) {
                        statusMessage.innerHTML = message.success;
                        statusMessage.classList.add('success');
                    } else {
                        statusMessage.innerHTML = message.error;
                        statusMessage.classList.add('error');
                    }
                }
            };
            xhr.open('POST', ajaxForm.getAttribute('action'), true);
            xhr.setRequestHeader('accept', 'application/json');
            xhr.send(formData);
        });
    }

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
