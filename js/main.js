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

  // Up to 900px wide the portfolio slide is a row of swipeable cards with no videos:
  // the videos are hidden and carry preload="none" in the HTML, so nothing is downloaded.
  const cardLayout = window.matchMedia('(max-width: 900px)');

  // Buffer every panel video once the portfolio slide first scrolls into view,
  // so the first frames are ready before the first hover. Videos already playing are left alone.
  // The HTML says preload="none" (so phones download nothing); wider screens raise it here.
  const slide = document.getElementById('projectsTwo');
  let slideSeen = false;
  const loadVideos = () => {
    if (cardLayout.matches) return;
    document.querySelectorAll('.expansion-col video').forEach((video) => {
      video.preload = 'auto';
      if (video.paused) video.load();
    });
  };
  if (slide && 'IntersectionObserver' in window) {
    // Wait until part of the slide is actually visible: at threshold 0 a slide whose top edge
    // only touches the bottom of the screen already counts as intersecting.
    const loader = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.intersectionRatio > 0)) return;
      loader.disconnect();
      slideSeen = true;
      loadVideos();
    }, { root: document.querySelector('.wrapper'), threshold: 0.05 });
    loader.observe(slide);
  } else {
    slideSeen = true;
    loadVideos();
  }
  // A tablet turned to a wider orientation: buffer the videos then.
  cardLayout.addEventListener('change', () => { if (slideSeen) loadVideos(); });

  document.querySelectorAll('.expansion-col').forEach((col) => {
    const video = col.querySelector('video');
    if (!video) return;
    const play = () => {
      if (cardLayout.matches) return;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };
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

// Contact slide: the code layer drifts slowly against the scroll. p is how far the slide's top is
// below the top of the screen (1 = just below the screen, 0 = in place), so --py goes from -120px to 0.
// Skipped (--py stays 0) with reduced motion and on touch screens.
function contactParallax() {
  const section = document.getElementById('contactTwo');
  const layer = section && section.querySelector('.code-layer');
  const wrapper = document.querySelector('.wrapper');
  if (!layer || !wrapper) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const p = section.getBoundingClientRect().top / window.innerHeight;
    layer.style.setProperty('--py', (p * -120) + 'px');
  };
  wrapper.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  update();
}

// Contact slide: the first time the slide is mostly on screen, each line of the code layer is
// revealed left to right, one line after another. It plays once. Without JS the code is plain text.
function contactTyping() {
  const section = document.getElementById('contactTwo');
  const layer = section && section.querySelector('.code-layer');
  if (!layer || !('IntersectionObserver' in window)) return;

  layer.querySelectorAll('pre').forEach((pre) => {
    const lines = pre.textContent.split('\n');
    pre.textContent = '';
    lines.forEach((text, i) => {
      const line = document.createElement('span');
      line.className = 'ln';
      line.style.setProperty('--i', i);
      line.style.setProperty('--n', Math.max(1, text.length));
      line.textContent = text === '' ? ' ' : text;
      pre.appendChild(line);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    layer.classList.add('typing');
    observer.disconnect();
  }, { threshold: 0.4 });
  observer.observe(section);
}

// Dots under the card row: the dot for the card nearest the left edge is active, and tapping one scrolls to its card.
function cardDots() {
  const row = document.querySelector('#projectsTwo .content');
  const dots = document.querySelectorAll('#projectsTwo .card-dots button');
  if (!row || !dots.length) return;
  const update = () => {
    const cards = [...row.querySelectorAll('.expansion-col')];
    const rowLeft = row.getBoundingClientRect().left;
    let nearest = 0, best = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(card.getBoundingClientRect().left - rowLeft);
      if (d < best) { best = d; nearest = i; }
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === nearest);
      if (i === nearest) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };
  // Tapping a dot scrolls the row to that card.
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const card = row.querySelectorAll('.expansion-col')[i];
      if (card) row.scrollTo({ left: card.offsetLeft - row.offsetLeft, behavior: 'smooth' });
    });
  });
  row.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  update();
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

// Project logos: on desktop they rise one after another (150ms apart) each time the portfolio
// slide comes into view, and again when the pointer leaves the panels after one was expanded.
// In the HTML they start hidden (no .fadeInUp); the card layout (900px and below) shows them
// with CSS. With reduced motion they just appear, once, with no delay.
function projectLogoIntro() {
  const slide = document.getElementById('projectsTwo');
  if (!slide || !('IntersectionObserver' in window)) return;
  const cardLayout = window.matchMedia('(max-width: 900px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = window.matchMedia('(hover: hover)');
  const logos = ['adi', 'appddiction', 'jstorm', 'mp']
    .map((name) => slide.querySelector('.' + name + '-site-logo'))
    .filter(Boolean);

  const playLogos = () => {
    logos.forEach((logo, i) => {
      logo.classList.remove('fadeInUp');
      void logo.offsetWidth;
      if (!reducedMotion.matches) {
        // Clear the delay afterwards so the hover fade out and back in has none.
        const clearDelay = () => { logo.style.animationDelay = ''; };
        logo.addEventListener('animationend', clearDelay, { once: true });
        logo.addEventListener('animationcancel', clearDelay, { once: true });
        logo.style.animationDelay = (i * 150) + 'ms';
      }
      logo.classList.add('fadeInUp');
    });
  };

  let started = false;
  const start = () => {
    if (started || cardLayout.matches) return;
    started = true;

    let played = false;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (cardLayout.matches) return;
      if (entry.intersectionRatio === 0) {
        // Off screen: hide the logos again so the next visit replays the sequence.
        played = false;
        if (!reducedMotion.matches) {
          logos.forEach((logo) => {
            logo.classList.remove('fadeInUp');
            logo.style.animationDelay = '';
          });
        }
      } else if (entry.intersectionRatio >= 0.4 && !played) {
        played = true;
        playLogos();
        if (reducedMotion.matches) observer.disconnect();
      }
    }, { root: document.querySelector('.wrapper'), rootMargin: '-1px 0px', threshold: [0, 0.4] });
    observer.observe(slide);

    // The pointer leaves all the panels after one was expanded: bring the logos back in sequence.
    // Moving from one panel to another stays inside the container, so it does not count.
    const panels = slide.querySelector('.content');
    if (panels && canHover.matches && !reducedMotion.matches) {
      let expanded = false;
      panels.addEventListener('mouseover', (event) => {
        if (event.target.closest('.expansion-col')) expanded = true;
      });
      panels.addEventListener('mouseleave', () => {
        if (!expanded) return;
        expanded = false;
        if (!cardLayout.matches) playLogos();
      });
    }
  };
  start();
  // A tablet turned to a wider orientation: run it then.
  cardLayout.addEventListener('change', start);
}

// Replay the hero icons each time the hero comes back into view.
function heroIconReplay() {
  const hero = document.getElementById('homeTwo');
  if (!hero || !('IntersectionObserver' in window)) return;
  const cardLayout = window.matchMedia('(max-width: 900px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;
  // The 1px inset margin makes a slide that only touches the edge (where the page snaps to) count
  // as off screen. Once the hero is completely off screen, the icons are reset (hidden). When it is at
  // least half back on screen the reset is lifted, so the icons rise again, in order.
  new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    if (cardLayout.matches) { hero.classList.remove('hero-away'); return; }
    if (entry.intersectionRatio === 0) hero.classList.add('hero-away');
    else if (entry.intersectionRatio >= 0.5) hero.classList.remove('hero-away');
  }, { root: document.querySelector('.wrapper'), rootMargin: '-1px 0px', threshold: [0, 0.5] }).observe(hero);
}

// Stop painting the hero background while the hero is off screen. The 200px margin turns it
// back on before the hero scrolls into view, so there is no flash.
function heroVisibility() {
  const hero = document.getElementById('homeTwo');
  if (!hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    document.body.classList.toggle('hero-offscreen', !entry.isIntersecting);
  }, { root: document.querySelector('.wrapper'), rootMargin: '200px 0px 200px 0px', threshold: 0 }).observe(hero);
}

function ngOnInit() {
  suppressHoverWhileScrolling();
    videoPlayback();
    cardDots();
    contactParallax();
    contactTyping();
    heroVisibility();
    projectLogoIntro();
    heroIconReplay();
    signatureAnimation();
    expandingCards();
    navAnim();
    // this.viewSwitch();
    navViewCheck();
    resumeTitleViewCheck();
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
      case 'contactView':
        isContactView();
        break;
    }
  }

function isHomeView() {
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

function isProjectsView() {

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
      $(".contact-two-viewport").each(function () {
        if (isMarkerVisible(this)) {
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
      // Resume strengths: when the first heading is in view, fade the blocks in one by one, 300ms apart.
      $(".strength-title").first().each(function () {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
          $('.strength-row').each(function (i) {
            var row = $(this);
            setTimeout(function () {
              row.addClass("fadeInUp");
            }, 300 * (i + 1));
          });
        }
      })
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
