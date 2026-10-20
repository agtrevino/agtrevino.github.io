/* ==========================================================================
   main.js
   Behavior for the page, written with jQuery ($).
   - Fades the side menu in on load.
   - Highlights the current menu item as you scroll (changes colors too).
   - Plays a project video only while you hover its panel.
   - Reveals the three resume strengths when you reach them.
   jQuery is loaded from a CDN in index.html before this file.
   ========================================================================== */


// Run scroll handlers at most once per animation frame.
function onWrapperScroll(fn) {
  let ticking = false;
  $('.wrapper').on('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fn.call(this);
    });
  });
}

// Project videos sit under overlays until a panel is hovered.
// Play a video only while its panel is hovered (or visible on touch screens).
function videoPlayback() {
  const canHover = window.matchMedia('(hover: hover)').matches;
  document.querySelectorAll('.expansion-col').forEach((col) => {
    const video = col.querySelector('video');
    if (!video) return;
    const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    if (canHover) {
      col.addEventListener('mouseenter', play);
      col.addEventListener('mouseleave', () => video.pause());
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? play() : video.pause()));
      }, { threshold: 0.25 }).observe(col);
    }
  });
}

function signatureAnimation() {
  const signature = document.querySelector('.signature');
  if (!signature) return;

  const source = signature.getAttribute('src');
  let replayTimer;

  const replay = () => {
    signature.src = `${source}?t=${Date.now()}`;
  };

  if (!('IntersectionObserver' in window)) {
    window.setInterval(replay, 8000);
    return;
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      signature.classList.add('signature-fade');
      window.clearInterval(replayTimer);
      replayTimer = null;
      return;
    }

    signature.classList.remove('signature-fade');
    if (replayTimer) return;
    replay();
    replayTimer = window.setInterval(replay, 8000);
  });

  observer.observe(signature);
}

function ngOnInit() {
    videoPlayback();
    signatureAnimation();
    expandingCards();
    navAnim();
    // this.viewSwitch();
    navViewCheck();
    resumeTitleViewCheck();
    $(document).ready(function() {
      $(".trigger").click(function() {
        $(".menu").toggleClass("active"); 
      });
    });
  }

function expandingCards() {
    $(".jstorm-col").on("mouseover", "div", function (e) {
      $('.jstorm-site-logo').removeClass("fadeInUp");
      setTimeout(function () {
        $('.jstorm-title-2').addClass("fadeInUp");
        $('.jstorm-logo-img').addClass("fadeInUp");
        $('.jstorm-text').addClass("fadeInUp");
      }, 200);
    });
    $(".jstorm-col").on("mouseleave", "div", function (e) {
      $('.jstorm-site-logo').addClass("fadeInUp");
      setTimeout(function () {
        $('.jstorm-title-2').removeClass("fadeInUp");
        $('.jstorm-logo-img').removeClass("fadeInUp");
        $('.jstorm-text').removeClass("fadeInUp");
      }, 200);
    });

    $(".codebound-col").on("mouseover", "div", function (e) {
      $('.codebound-site-logo').removeClass("fadeInUp");
      setTimeout(function () {
        $('.codebound-title-2').addClass("fadeInUp");
        $('.codebound-logo-img').addClass("fadeInUp");
        $('.codebound-text').addClass("fadeInUp");
      }, 200);
    });
    $(".codebound-col").on("mouseleave", "div", function (e) {
      $('.codebound-site-logo').addClass("fadeInUp");
      setTimeout(function () {
        $('.codebound-title-2').removeClass("fadeInUp");
        $('.codebound-logo-img').removeClass("fadeInUp");
        $('.codebound-text').removeClass("fadeInUp");
      }, 200);
    });

    $(".mp-col").on("mouseover", "div", function (e) {
      $('.mp-site-logo').removeClass("fadeInUp");
      setTimeout(function () {
        $('.mp-title-2').addClass("fadeInUp");
        $('.mp-logo-img').addClass("fadeInUp");
        $('.mp-text').addClass("fadeInUp");
      }, 200);
    });
    $(".mp-col").on("mouseleave", "div", function (e) {
      $('.mp-site-logo').addClass("fadeInUp");
      setTimeout(function () {
        $('.mp-title-2').removeClass("fadeInUp");
        $('.mp-logo-img').removeClass("fadeInUp");
        $('.mp-text').removeClass("fadeInUp");
      }, 200);
    });

    $(".appddiction-col").on("mouseover", "div", function (e) {
      $('.appddiction-site-logo').removeClass("fadeInUp");
      setTimeout(function () {
        $('.appddiction-title-2').addClass("fadeInUp");
        $('.appddiction-logo-img').addClass("fadeInUp");
        $('.appddiction-text').addClass("fadeInUp");

      }, 200);
    });
    $(".appddiction-col").on("mouseleave", "div", function (e) {
      $('.appddiction-site-logo').addClass("fadeInUp");
      setTimeout(function () {
        $('.appddiction-title-2').removeClass("fadeInUp");
        $('.appddiction-logo-img').removeClass("fadeInUp");
        $('.appddiction-text').removeClass("fadeInUp");

      }, 200);
    });


  }


function closeSubNav() {
    $('.projects-sub-nav-3').removeClass("active-nav");
    setTimeout(function () {
      $('.projects-sub-nav-2').removeClass("active-nav");
      setTimeout(function () {
        $('.projects-sub-nav-1').removeClass("active-nav");
        $('.sub-menu-container').removeClass("expanded");
      }, 150)
    }, 150)
  }

function openSubNav() {
    // $('.sub-menu-container').addClass("expanded");
    // setTimeout(function () {
    //   $('.projects-sub-nav-1').addClass("active-nav");
    //   setTimeout(function () {
    //     $('.projects-sub-nav-2').addClass("active-nav");
    //     setTimeout(function () {
    //       $('.projects-sub-nav-3').addClass("active-nav");
    //     }, 150)
    //   }, 150)
    // }, 250)
  }

function viewSwitch(view) {

    switch (view) {
      case 'homeView':
        isHomeView();
        break;
      case 'resumeView':
        isResumeView();
        break;
      case 'projectsView':
        isProjectsView();
        break;
      case 'appddictionView':
        isAppddictionView();
        break;
      case 'contactView':
        isContactView();
        break;
      default:
        console.log('Default!');
    }
  }

function isHomeView() {
    closeSubNav();

    $('.home-nav').addClass("active-nav");
    $('.home-circle').addClass("active-circle");

    $('.projects-circle').removeClass("active-circle");
    $('.projects-nav').removeClass("active-nav");
    $('.nav-link-text').removeClass("color-black");
    $('.line').removeClass("line-black");
    $('.nav-circle').removeClass("circle-black");
    $('.vertical-text-2').removeClass("color-black");
    $('.resume-circle').removeClass("active-circle-black");
    $('.resume-nav').removeClass("active-nav");
    $('.resume-circle').removeClass("nav-circle-black");

    $('.main-logo-poly').css({ fill: "#fff" });
    $('.main-logo-poly').css({ stroke: "#fff" });


  }

function isResumeView() {
    // $('.projects-sub-nav-3').removeClass("active-nav");

    $('.main-logo-poly').css({ fill: "#505464" });
    $('.main-logo-poly').css({ stroke: "#505464" });

    $('.resume-nav').addClass("active-nav");
    $('.resume-circle').addClass("active-circle-black");
    $('.resume-circle').addClass("nav-circle-black");
    $('.vertical-text-2').addClass("color-black");
    $('.nav-link-text').addClass("color-black");
    $('.line').addClass("line-black");
    $('.nav-circle').addClass("circle-black");

    $('.contact-circle').removeClass("active-circle");
    $('.contact-nav').removeClass("active-nav");

    $('.projects-circle').removeClass("active-circle");
    $('.projects-nav').removeClass("active-nav");
    $('.home-circle').removeClass("active-circle");
    $('.home-nav').removeClass("active-nav");

  }

function isAppddictionView() {
    openSubNav();

    $('.main-logo-poly').css({ fill: "#505464" });
    $('.main-logo-poly').css({ stroke: "#505464" });

    $('.resume-nav').removeClass("active-nav");
    $('.resume-circle').removeClass("active-circle-black");
    $('.resume-circle').removeClass("nav-circle-black");
    $('.projects-circle').addClass("nav-circle-black");
    $('.projects-circle').addClass("active-circle-black");
    $('.projects-nav').addClass("active-nav");
    $('.vertical-text-2').addClass("color-black");
    $('.nav-link-text').addClass("color-black");
    $('.line').addClass("line-black");
    $('.nav-circle').addClass("circle-black");

    $('.contact-circle').removeClass("active-circle");
    $('.contact-nav').removeClass("active-nav");
    $('.home-circle').removeClass("active-circle");
    $('.home-nav').removeClass("active-nav");

  }

function isProjectsView() {

    openSubNav();

    $('.projects-nav').addClass("active-nav");
    $('.projects-circle').addClass("active-circle");


    $('.nav-link-text').removeClass("color-black");
    $('.line').removeClass("line-black");
    $('.nav-circle').removeClass("circle-black");
    $('.vertical-text-2').addClass("color-black");
    $('.resume-circle').removeClass("active-circle-black");
    $('.resume-nav').removeClass("active-nav");
    $('.resume-circle').removeClass("nav-circle-black");
    $('.home-circle').removeClass("active-circle");
    $('.home-nav').removeClass("active-nav");
    $('.contact-circle').removeClass("active-circle");
    $('.contact-nav').removeClass("active-nav");
    $('.main-logo-poly').css({ fill: "#fff" });
    $('.main-logo-poly').css({ stroke: "#fff" });

  }

function isContactView() {

    closeSubNav();
    $('.projects-sub-nav-3').removeClass("active-nav");

    $('.contact-nav').addClass("active-nav");
    $('.contact-circle').addClass("active-circle");

    $('.projects-circle').removeClass("active-circle");
    $('.projects-nav').removeClass("active-nav");
    $('.home-circle').removeClass("active-circle");
    $('.home-nav').removeClass("active-nav");
    $('.nav-link-text').removeClass("color-black");
    $('.line').removeClass("line-black");
    $('.nav-circle').removeClass("circle-black");
    $('.vertical-text-2').removeClass("color-black");
    $('.resume-circle').removeClass("active-circle-black");
    $('.resume-nav').removeClass("active-nav");
    $('.resume-circle').removeClass("nav-circle-black");

    $('.main-logo-poly').css({ fill: "#fff" });
    $('.main-logo-poly').css({ stroke: "#fff" });

    $('.sub-menu-container').removeClass("expanded");


  }

function navViewCheck() {

    
    onWrapperScroll(function () {
      var scrollTop = $(window).scrollTop();
      var windowHeight = $(window).height();


      $(".home-two-viewport").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          this.view = 'homeView';
          viewSwitch(this.view);
        }
      });

      $(".resume-two-viewport").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          this.view = 'resumeView';
          viewSwitch(this.view);
        }
      });
      $(".projects-two-viewport").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          this.view = 'projectsView';
          viewSwitch(this.view);
        }
      });
      $(".jstorm-viewport").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          $('.jstorm-line').addClass('line-extend');
          $('.codebound-line').removeClass('line-extend');
          $('.appddiction-line').removeClass('line-extend');
        }
      })
      $(".projects-main-viewport").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          $('.jstorm-line').removeClass('line-extend');
          $('.codebound-line').removeClass('line-extend');
          $('.appddiction-line').removeClass('line-extend');
        }
      })
      $(".codebound-viewport").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          $('.codebound-line').addClass('line-extend');
          $('.jstorm-line').removeClass('line-extend');
          $('.appddiction-line').removeClass('line-extend');
          $('.projects-circle').removeClass("active-circle-black");
        }
      })

      $(".appddiction-viewport").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          this.view = 'appddictionView';
          viewSwitch(this.view);
          $('.appddiction-line').addClass('line-extend');
          $('.jstorm-line').removeClass('line-extend');
          $('.codebound-line').removeClass('line-extend');
        }
      })

      $(".contact-two-viewport").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          $('.projects-sub-nav-3').removeClass("active-nav");
          $('.projects-sub-nav-3').removeClass("active-nav");
          this.view = 'contactView';
          viewSwitch(this.view);

        }
      });

    });
  }

function resumeTitleViewCheck() {
    onWrapperScroll(function () {
      var scrollTop = $(window).scrollTop();
      var windowHeight = $(window).height();
      $(".creative-title").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          setTimeout(function () {
            $('.creative-row').addClass("fadeInUp");
            setTimeout(function () {
              $('.detail-row').addClass("fadeInUp");
              setTimeout(function () {
                $('.team-row').addClass("fadeInUp");
              }, 300)
            }, 300)
          }, 300)
        }
      })
      $(".jstorm-title").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          // setTimeout(function () {
          //   $('.jstorm-title').addClass("fadeInUp");
          // }, 300);
        }
      });
      // $(".jstorm-title-2").each(function () {
      //   var offset = $(this).offset();
      //   if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
      //     $('.jstorm-img-1').addClass("fadeInUp");
      //     $('.jstorm-img-2').addClass("fadeInUp");
      //     setTimeout(function () {
      //       // $('.jstorm-title-2').addClass("fadeInUp");
      //       setTimeout(function () {
      //         $('.jstorm-text').addClass("fadeInUp");
      //       }, 300);
      //     }, 300);
      //   }
      // });

      $(".codebound-title").each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          // setTimeout(function () {
          //   $('.codebound-title').addClass("fadeInUp");
          // }, 300);
        }
      });
      // $(".codebound-title-2").each(function () {
      //   var offset = $(this).offset();
      //   if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
      //     $('.codebound-img').addClass("fadeInUp");
      //     setTimeout(function () {
      //       $('.codebound-title-2').addClass("fadeInUp");
      //       setTimeout(function () {
      //         $('.codebound-text').addClass("fadeInUp");
      //       }, 300);
      //     }, 300);

      //   }
      // });

    });
  }

function navAnim() {
    setTimeout(function () {
      $('#home-nav').addClass("fadeInUp");
      setTimeout(function () {
        $('#projects-nav').addClass("fadeInUp");
        setTimeout(function () {
          $('#resume-nav').addClass("fadeInUp");
          setTimeout(function () {
            $('#contact-nav').addClass("fadeInUp");
            setTimeout(function () {
              $('.home-circle').addClass("active-circle");
              setTimeout(function () {
                $('.home-nav').addClass("active-nav");
              }, 300)
            }, 300)
          }, 300)
        }, 300)
      }, 300)
    }, 600)
  }




// Nav clicks that were (click) bindings in the Angular template.
$(document).on('click', '[data-view="projects"]', () => isProjectsView());
$(document).on('click', '[data-view="contact"]', () => isContactView());

ngOnInit();
