// $('.enter-button').click(function () {
//     $( ".enter-button" ).fadeOut();
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
            width: 420
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