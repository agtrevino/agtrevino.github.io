// $('.enter-button').click(function () {
//     $( ".menu" ).fadeOut(2500);
//
//
// });

//this function controls dots expansion

$(function() {
    $('#enter-button').hover(function() {
        $('.dots-outer').css({
            height: 300,
            width: 300
        });
        $('.dots-middle').css({
            height: 250,
            width: 250
        });
        $('.dots-inner').css({
            height: 420,
            width: 420,
        });

    }, function() {
        // on mouseout, reset the background colour
        $('.dots-outer').css({
            height: 200,
            width: 200
        });
        $('.dots-middle').css({
            height: 200,
            width: 200
        });
        $('.dots-inner').css({
            height: 200,
            width: 200,
            transition: 200
        });


    });
});

$('#enter-button').click(function () {
    $('.nav-bar').fadeIn(500);
    $(this).fadeTo( "slow", 0 );
    // $('.full-name-header').fadeTo( "slow", 0 );



});

// $('#enter-button').click(function () {
//     $( "#dots-inner" ).removeClass('dots-inner').addClass( "dots-inner-slow" );
// });



//
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