//WINDOW HEIGHT FOR NAVBAR--------------------------
$(document).ready(function() {
    let wh = $(window).height();
    $("html body").css({
        "height": wh

    });
    // let isScrolled = false;
    $(window).scroll(function () {
        //if you hard code, then use console
        //.log to determine when you want the
        //nav bar to stick.
        // console.log($(window).scrollTop());
        //
        //
        // if ($(window).scrollTop() > (wh - 55)) {
        //     $('#nav-bar').addClass('navbar-fixed');
        //     // isScrolled = true;
        // }
        // if ($(window).scrollTop() < (wh - 55)) {
        //     $('#nav-bar').removeClass('navbar-fixed');
        // }
        // if ($(window).scrollTop() > (wh - 55)) {
        //     $('#nav-bar').addClass('navbar-opacity');
        // }
        // if ($(window).scrollTop() < (wh - 55)) {
        //     $('#nav-bar').removeClass('navbar-opacity');
        // }
    });
});

$(document).ready(function() {



    $(document).ready(function(){
       $(".parallax-1").css({
           'filter'         : 'blur(0px)',
           '-webkit-filter' : 'blur(0px)',
           '-moz-filter'    : 'blur(0px)',
           '-o-filter'      : 'blur(0px)',
           '-ms-filter'     : 'blur(0px)',
           'transition'     : '500'
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
});