//WINDOW HEIGHT FOR NAVBAR--------------------------
$(document).ready(function () {

    $('.sidenav').sidenav();

    $('.carousel.carousel-slider').carousel({
        fullWidth: true,
        indicators: true
    });

    let wh = $(window).height();
    $("html body").css({
        "height": wh
    });

    $("a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {
                window.location.hash = hash;
            });
        }
    });
    $(window).scroll(function () {
        // if you hard code, then use console
        // .log to determine when you want the
        // nav bar to stick.
        console.log($(window).scrollTop());
        if ($(window).scrollTop() > (wh - 119)) {
            $('#nav-bar').css('position', 'fixed');
            $('#nav-bar').css('top', 0);
            $('#nav-bar').css('margin', 0);
        }
        if ($(window).scrollTop() < (wh - 119)) {
            $('#nav-bar').css('position', 'absolute');
            $('#nav-bar').css('bottom', 0);
            $('#nav-bar').css('top', 'auto');
        }
    });
});