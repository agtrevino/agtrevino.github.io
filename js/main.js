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

function suppressHoverWhileScrolling() {
  let scrollTimeout;

  $('.wrapper').on('scroll', function () {
    document.body.classList.add('is-scrolling');
    window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 150);
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
  const hero = document.querySelector('#homeTwo');
  const signature = document.querySelector('.signature');
  const scrollContainer = document.querySelector('.wrapper');
  if (!hero || !signature || !scrollContainer) return;

  const source = signature.dataset.src;
  let replayTimer = null;

  // The first play waits until 2.0s after page load, after the hero entrance.
  // Later replays keep the 1.3s delay.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let firstPlay = true;
  const nextDelay = () => {
    if (!firstPlay) return 1300;
    return reducedMotion ? 0 : Math.max(0, 2000 - performance.now());
  };

  const replay = () => {
    firstPlay = false;
    signature.src = source;
    signature.classList.remove('signature-fade');
  };

  if (!('IntersectionObserver' in window)) {
    const heroIsVisible = () => {
      const bounds = hero.getBoundingClientRect();
      return bounds.top < window.innerHeight && bounds.bottom > 0;
    };
    if (heroIsVisible()) window.setTimeout(replay, nextDelay());
    return;
  }

  const observer = new IntersectionObserver(([entry]) => {
    window.clearTimeout(replayTimer);
    replayTimer = null;

    if (!entry.isIntersecting || entry.intersectionRatio === 0) {
      signature.classList.add('signature-fade');
      signature.removeAttribute('src');
      return;
    }

    signature.classList.add('signature-fade');
    replayTimer = window.setTimeout(replay, nextDelay());
  }, { root: scrollContainer, threshold: 0.1 });

  observer.observe(hero);
}

function ngOnInit() {
  suppressHoverWhileScrolling();
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

// Project panels: on hover, fade out the panel's logo, then fade in its details
// (heading, role line, blurb, image), which are marked .panel-reveal.
function expandingCards() {
    $(".expansion-col").each(function () {
      const logo = $(this).find(".site-logo-container img");
      const details = $(this).find(".panel-reveal");
      $(this).on("mouseover", "div", function () {
        logo.removeClass("fadeInUp");
        setTimeout(function () {
          details.addClass("fadeInUp");
        }, 200);
      });
      $(this).on("mouseleave", "div", function () {
        logo.addClass("fadeInUp");
        setTimeout(function () {
          details.removeClass("fadeInUp");
        }, 200);
      });
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
    $('.contact-circle').removeClass("active-circle");
    $('.contact-nav').removeClass("active-nav");
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
    // The first portfolio panel (ADI) is navy, so the vertical name stays white here.
    $('.vertical-text-2').removeClass("color-black");
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
      const scrollContainer = this;
      const containerBounds = scrollContainer.getBoundingClientRect();
      const isMarkerVisible = (marker) => {
        const markerBounds = marker.getBoundingClientRect();
        return markerBounds.top >= containerBounds.top && markerBounds.bottom <= containerBounds.bottom;
      };


      $(".home-two-viewport").each(function () {
        if (isMarkerVisible(this)) {
          this.view = 'homeView';
          viewSwitch(this.view);
        }
      });

      $(".resume-two-viewport").each(function () {
        if (isMarkerVisible(this)) {
          this.view = 'resumeView';
          viewSwitch(this.view);
        }
      });
      $(".projects-two-viewport").each(function () {
        if (isMarkerVisible(this)) {
          this.view = 'projectsView';
          viewSwitch(this.view);
        }
      });
      $(".jstorm-viewport").each(function () {
        if (isMarkerVisible(this)) {
          $('.jstorm-line').addClass('line-extend');
          $('.appddiction-line').removeClass('line-extend');
        }
      })
      $(".projects-main-viewport").each(function () {
        if (isMarkerVisible(this)) {
          $('.jstorm-line').removeClass('line-extend');
          $('.appddiction-line').removeClass('line-extend');
        }
      })

      $(".appddiction-viewport").each(function () {
        if (isMarkerVisible(this)) {
          this.view = 'appddictionView';
          viewSwitch(this.view);
          $('.appddiction-line').addClass('line-extend');
          $('.jstorm-line').removeClass('line-extend');
        }
      })

      $(".contact-two-viewport").each(function () {
        if (isMarkerVisible(this)) {
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


    });
  }

// The nav fades in first with CSS (heroRise in styles.css, done at 0.5s).
// This only marks Home as active once the nav has appeared.
function navAnim() {
    setTimeout(function () {
      $('.home-circle').addClass("active-circle");
      setTimeout(function () {
        $('.home-nav').addClass("active-nav");
      }, 300)
    }, 500)
  }




// Nav clicks that were (click) bindings in the Angular template.
$(document).on('click', '[data-view="projects"]', () => isProjectsView());
$(document).on('click', '[data-view="contact"]', () => isContactView());

ngOnInit();
