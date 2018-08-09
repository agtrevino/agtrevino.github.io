$(document).ready(function() {

    let isScrolled = false;
    $(window).scroll(function () {
        //if you hard code, then use console
        //.log to determine when you want the
        //nav bar to stick.
        // console.log($(window).scrollTop());


        if ($(window).scrollTop() > 760) {
            $('#nav-bar').addClass('navbar-fixed');
            isScrolled = true;

        }
        if ($(window).scrollTop() < 761) {
            $('#nav-bar').removeClass('navbar-fixed');
        }
        if ($(window).scrollTop() > 819) {
            $('#nav-bar').addClass('navbar-opacity');
        }
        if ($(window).scrollTop() < 820) {
            $('#nav-bar').removeClass('navbar-opacity');
        }
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
});