(function () {

    'use strict';
    var gradient = "linear-gradient(to right, rgba(0,0,0, 1), rgba(0,0,0, .9), rgba(0,0,0, .6), rgba(0,0,0, .4)),";
    var imageUrl = [
        "url(../img/login-bg-1.jpg)",
        "url(../img/login-bg-2.jpg)",
        "url(../img/login-bg-3.jpeg)",
        "url(../img/login-bg-4.jpg)",
        "url(../img/login-bg-5.jpg)",
        "url(../img/login-bg-6.jpg)",
        "url(../img/login-bg-7.jpg)",
        "url(../img/login-bg-8.jpg)",
        "url(../img/login-bg-9.jpg)"
    ];


    setTimeout(function () {
        $(".tll-1").animate({opacity: 1},1200);
        setTimeout(function () {
            $(".tll-2").animate({opacity: 1},1200);
        }, 300);
        setTimeout(function () {
            $(".tll-3").animate({opacity: 1},1200);
        }, 600);

        setTimeout(function () {
            $(".tlr-1").animate({opacity: 1},0);
        }, 1800);
        setTimeout(function () {
            $(".tlr-2").animate({opacity: 1},0);
        }, 2250);
        setTimeout(function () {
            $(".tlr-3").animate({opacity: 1},0);
        }, 2700);

    }, 1000);


    var intervalId = setInterval(function () {
        var randomNumber = Math.floor(Math.random() * imageUrl.length);
            $(".img-rotation").fadeOut(1200, function () {
                setTimeout(function(){
                    $(".back-ground").css("background", "black");
                }, 2000);
                    $(".img-rotation").css("background", gradient + imageUrl[randomNumber] + "no-repeat");
                    $(".img-rotation").css("background-size", "cover");
                    $(".img-rotation").fadeIn(1200);
            });
    }, 5000);


    for (var i = 0; i <= 100; i++) {
        if (!i % 3 && !i % 5) {
            console.log("FizzBuzz: " + i)
        } else if (!i % 3) {
            console.log("Fizz:" + i);
        } else if (!i % 5) {
            console.log("Buzz: " + i)
        } else {
            console.log(i);
        }
    }

}());


//////////////////-------------------------------

/*

click to domain to configure
click on A record
put an @ symbol
select droplet to the right

C name
www\ @ \ TTL

what would yo like to do about menu.ls? "2"

*/