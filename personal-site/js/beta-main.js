//WINDOW HEIGHT FOR NAVBAR--------------------------
$(document).ready(function() {
    let wh = $(window).height();
    $("html body").css({
        "height": wh

    });
    let isScrolled = false;
    $(window).scroll(function () {
        // if you hard code, then use console
        // .log to determine when you want the
        // nav bar to stick.
        console.log($(window).scrollTop());
        if ($(window).scrollTop() > (wh - 64)) {
            $('#nav-bar').css('position', 'fixed');
            $('#nav-bar').css('top', 0);
            $('#nav-bar').css('margin', 0);
        }
        if ($(window).scrollTop() < (wh - 64)) {
            $('#nav-bar').css('position', 'absolute');
            $('#nav-bar').css('bottom', 0);
            $('#nav-bar').css('top', 'auto');
        }
    });
});

//SMOOTH SCROLLING FEATURE--------------------------
    $(document).ready(function(){
        $("a").on('click', function(event) {
            if (this.hash !== "") {
                event.preventDefault();
                var hash = this.hash;
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function(){
                    window.location.hash = hash;
                });
            }
        });
    });

///////////////////////////