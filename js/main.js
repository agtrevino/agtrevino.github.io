/* Page behavior, written with jQuery (loaded from a CDN before this file). */

// Throttles scroll work to one run per frame.
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

// Videos play only while their panel is hovered (or visible on touch).
function videoPlayback() {
  const canHover = window.matchMedia('(hover: hover)').matches;

  // Cards (900px and below) have no videos; preload="none" saves the download.
  const cardLayout = window.matchMedia('(max-width: 900px)');

  // Buffer videos when the slide first shows, so the first hover has frames.
  const slide = document.getElementById('projects');
  let slideSeen = false;
  const loadVideos = () => {
    if (cardLayout.matches) return;
    document.querySelectorAll('.expansion-col video').forEach((video) => {
      video.preload = 'auto';
      if (video.paused) video.load();
    });
  };
  if (slide && 'IntersectionObserver' in window) {
    // Threshold 0 would count a slide that only touches the screen edge.
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
  // A tablet turned wider: buffer the videos then.
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

// Code layer drifts against the scroll (not on touch or reduced motion).
function contactParallax() {
  const section = document.getElementById('contact');
  const layer = section && section.querySelector('.code-layer');
  const wrapper = document.querySelector('.wrapper');
  if (!layer || !wrapper) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const p = section.getBoundingClientRect().top / window.innerHeight;
    section.querySelectorAll('.code-layer').forEach((el) => {
      el.style.setProperty('--py', (p * -120) + 'px');
    });
  };
  wrapper.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  update();
}

// Types the code layer in once, the first time the slide is mostly visible.
function contactTyping() {
  const section = document.getElementById('contact');
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

// A brighter copy of the code shows through a soft circle at the pointer.
function contactSpotlight() {
  const section = document.getElementById('contact');
  const bg = section && section.querySelector('.contact-bg');
  const layer = bg && bg.querySelector('.code-layer');
  if (!layer || !('IntersectionObserver' in window)) return;
  const noHover = window.matchMedia('(hover: none)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const small = window.matchMedia('(max-width: 480px)');
  const blocked = () => noHover.matches || reduced.matches || small.matches;
  if (blocked()) return;

  // The mask is on this wrapper, so it uses slide coordinates.
  const spot = document.createElement('div');
  spot.className = 'spot';
  const copy = layer.cloneNode(true);
  copy.classList.add('spot-layer');
  copy.setAttribute('aria-hidden', 'true');
  spot.appendChild(copy);
  bg.appendChild(spot);

  // The copy starts typing in the same frame as the original.
  const syncTyping = () => copy.classList.toggle('typing', layer.classList.contains('typing'));
  syncTyping();
  new MutationObserver(syncTyping).observe(layer, { attributes: true, attributeFilter: ['class'] });

  let frame = 0;
  let hideTimer;
  let x = 0;
  let y = 0;
  const draw = () => {
    frame = 0;
    const box = section.getBoundingClientRect();
    spot.style.setProperty('--mx', (x - box.left) + 'px');
    spot.style.setProperty('--my', (y - box.top) + 'px');
  };
  const onMove = (event) => {
    if (small.matches) return;
    window.clearTimeout(hideTimer);
    spot.classList.remove('is-off');
    x = event.clientX;
    y = event.clientY;
    if (!frame) frame = window.requestAnimationFrame(draw);
  };
  const onLeave = () => {
    spot.classList.add('is-off');
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      spot.style.setProperty('--mx', '-999px');
      spot.style.setProperty('--my', '-999px');
    }, 300);
  };

  // Listeners exist only while the slide is at least 30% on screen.
  let attached = false;
  const attach = () => {
    if (attached || blocked()) return;
    attached = true;
    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave);
  };
  const detach = () => {
    if (!attached) return;
    attached = false;
    section.removeEventListener('pointermove', onMove);
    section.removeEventListener('pointerleave', onLeave);
    window.cancelAnimationFrame(frame);
    frame = 0;
    onLeave();
  };
  new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    if (entry.intersectionRatio >= 0.3) attach();
    else detach();
  }, { threshold: [0, 0.3] }).observe(section);
}

// Copies the address on click; the button says "copied" for two seconds.
function copyEmail() {
  const button = document.querySelector('.copy-email');
  if (!button) return;
  const live = document.querySelector('.copy-live');
  const label = button.textContent;
  const address = 'aaron.g.trevino@gmail.com';
  let timer;

  // Older browsers and non-secure pages have no clipboard API.
  const fallbackCopy = () => {
    const area = document.createElement('textarea');
    area.value = address;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
    document.body.removeChild(area);
    return ok;
  };

  const done = (ok) => {
    window.clearTimeout(timer);
    if (live) live.textContent = ok ? 'Email copied' : 'Copy failed. Use the email button.';
    if (!ok) return;
    button.textContent = 'copied';
    timer = window.setTimeout(() => {
      button.textContent = label;
      if (live) live.textContent = '';
    }, 2000);
  };

  button.addEventListener('click', () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(() => done(true), () => done(fallbackCopy()));
    } else {
      done(fallbackCopy());
    }
  });
}

// The dot for the card nearest the left edge is active; tapping one scrolls.
function cardDots() {
  const row = document.querySelector('#projects .content');
  const dots = document.querySelectorAll('#projects .card-dots button');
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
  const hero = document.querySelector('#home');
  const signature = document.querySelector('.signature');
  const scrollContainer = document.querySelector('.wrapper');
  if (!hero || !signature || !scrollContainer) return;

  const source = signature.dataset.src;
  let replayTimer = null;

  // The first play waits for the hero entrance; replays use a shorter delay.
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

// Logos rise in sequence when the slide shows and after a panel hover ends.
function projectLogoIntro() {
  const slide = document.getElementById('projects');
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
        // Cleared so the hover fade out and in has no delay.
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
        // Reset so the next visit replays the sequence.
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

    // Leaving all panels after one expanded replays; panel to panel does not.
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
  // A tablet turned wider: start then.
  cardLayout.addEventListener('change', start);
}

// Replays the icon entrance whenever the hero comes back.
function heroIconReplay() {
  const hero = document.getElementById('home');
  if (!hero || !('IntersectionObserver' in window)) return;
  const cardLayout = window.matchMedia('(max-width: 900px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;
  // The 1px inset makes a slide that only touches the edge count as off screen.
  new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    if (cardLayout.matches) { hero.classList.remove('hero-away'); return; }
    if (entry.intersectionRatio === 0) hero.classList.add('hero-away');
    else if (entry.intersectionRatio >= 0.5) hero.classList.remove('hero-away');
  }, { root: document.querySelector('.wrapper'), rootMargin: '-1px 0px', threshold: [0, 0.5] }).observe(hero);
}

// Stops painting the hero when off screen; the 200px margin avoids a flash.
function heroVisibility() {
  const hero = document.getElementById('home');
  if (!hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    document.body.classList.toggle('hero-offscreen', !entry.isIntersecting);
  }, { root: document.querySelector('.wrapper'), rootMargin: '200px 0px 200px 0px', threshold: 0 }).observe(hero);
}

// A greeting for anyone who opens the console; it is the only console output.
function consoleHello() {
  console.log('%cHi, you found the console.', 'color: #eb3b5a; font-weight: bold; font-size: 16px;');
  console.log('I build front-end interfaces. This site is hand-written HTML, CSS and JavaScript, built with Claude Code.');
  console.log('Open to remote front-end roles: aaron.g.trevino@gmail.com');
  console.log('Source: https://github.com/agtrevino/agtrevino.github.io');
}

function ngOnInit() {
  consoleHello();
  suppressHoverWhileScrolling();
    videoPlayback();
    cardDots();
    contactParallax();
    contactTyping();
    contactSpotlight();
    copyEmail();
    heroVisibility();
    projectLogoIntro();
    heroIconReplay();
    signatureAnimation();
    expandingCards();
    navAnim();
    slideSync();
    navProgress();
    resumeTitleViewCheck();
  }

// On hover the logo fades out, then the details (.panel-reveal) fade in.
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

  }

function isResumeView() {

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
    // ADI's navy panel keeps the vertical name white.
    $('.vertical-text-2').removeClass("color-black");
    $('.resume-circle').removeClass("active-circle-black");
    $('.resume-nav').removeClass("active-nav");
    $('.resume-circle').removeClass("nav-circle-black");
    $('.home-circle').removeClass("active-circle");
    $('.home-nav').removeClass("active-nav");
    $('.contact-circle').removeClass("active-circle");
    $('.contact-nav').removeClass("active-nav");

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

  }

// Slides, nav and URL

const SLIDE_IDS = ['home', 'projects', 'resume', 'contact'];
const SLIDE_VIEWS = { home: isHomeView, projects: isProjectsView, resume: isResumeView, contact: isContactView };

// Most visible area wins; the first slide wins a tie.
function currentSlide() {
  const wrapper = document.querySelector('.wrapper');
  if (!wrapper) return SLIDE_IDS[0];
  const box = wrapper.getBoundingClientRect();
  let best = SLIDE_IDS[0];
  let bestArea = -1;
  SLIDE_IDS.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    const r = section.getBoundingClientRect();
    const visibleHeight = Math.min(r.bottom, box.bottom) - Math.max(r.top, box.top);
    const visibleWidth = Math.min(r.right, box.right) - Math.max(r.left, box.left);
    const area = Math.max(0, visibleHeight) * Math.max(0, visibleWidth);
    if (area > bestArea) { best = id; bestArea = area; }
  });
  return best;
}

// One nav item active, with light or dark colors for the slide.
let shownSlide = null;
function updateActiveSlide(force) {
  const id = currentSlide();
  if (!force && id === shownSlide) return id;
  shownSlide = id;
  $('.home-nav, .projects-nav, .resume-nav, .contact-nav').removeClass('active-nav');
  $('.home-circle, .projects-circle, .resume-circle, .contact-circle').removeClass('active-circle active-circle-black');
  SLIDE_VIEWS[id]();
  return id;
}

// The nav follows scroll; the hash waits for 150ms of stillness.
function slideSync() {
  const wrapper = document.querySelector('.wrapper');
  if (!wrapper) return;
  let urlReady = false;
  let settleTimer;
  let ticking = false;

  const syncHash = () => {
    if (!urlReady) return;
    const id = currentSlide();
    if (id === 'home') {
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    } else if (location.hash !== '#' + id) {
      history.replaceState(null, '', '#' + id);
    }
  };

  const scrollToHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = SLIDE_IDS.includes(id) && document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top - wrapper.getBoundingClientRect().top + wrapper.scrollTop;
    wrapper.scrollTo({ top, behavior: 'instant' });
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        updateActiveSlide();
      });
    }
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(syncHash, 150);
  };
  wrapper.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { updateActiveSlide(true); onScroll(); });
  window.addEventListener('hashchange', () => { updateActiveSlide(true); });

  // Once layout settles, open on the slide named in the URL.
  const start = () => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      scrollToHash();
      updateActiveSlide(true);
      urlReady = true;
      syncHash();
    }));
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

function resumeTitleViewCheck() {
    onWrapperScroll(function () {
      var scrollTop = $(window).scrollTop();
      var windowHeight = $(window).height();
      // Fade the strengths in one by one when the first heading is in view.
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
    });
  }

// A thin line between the nav dots fills as you scroll (progress, not place).
function navProgress() {
  const menu = document.querySelector('.vertical-menu');
  const wrapper = document.querySelector('.wrapper');
  const dots = menu ? Array.from(menu.querySelectorAll('.nav-circle')) : [];
  const slides = SLIDE_IDS.map((id) => document.getElementById(id));
  if (!menu || !wrapper || dots.length < 2 || slides.some((slide) => !slide)) return;

  const segments = [];
  for (let i = 0; i < dots.length - 1; i++) {
    const track = document.createElement('span');
    const fill = document.createElement('span');
    track.className = 'nav-seg';
    fill.className = 'nav-seg-fill';
    track.setAttribute('aria-hidden', 'true');
    track.appendChild(fill);
    menu.appendChild(track);
    segments.push({ track, fill });
  }

  // Each runs 4px below one dot to 4px above the next, on their center line.
  const place = () => {
    if (!menu.getClientRects().length) return;
    const box = menu.getBoundingClientRect();
    segments.forEach(({ track }, i) => {
      const a = dots[i].getBoundingClientRect();
      const b = dots[i + 1].getBoundingClientRect();
      track.style.top = (a.bottom + 4 - box.top) + 'px';
      track.style.height = Math.max(0, b.top - a.bottom - 8) + 'px';
      track.style.left = (a.left + a.width / 2 - box.left - 0.5) + 'px';
    });
  };

  const fillTo = () => {
    const scrolled = wrapper.scrollTop;
    segments.forEach(({ fill }, i) => {
      const start = slides[i].offsetTop;
      const span = slides[i + 1].offsetTop - start;
      const amount = span > 0 ? Math.min(1, Math.max(0, (scrolled - start) / span)) : 0;
      fill.style.transform = 'scaleY(' + amount + ')';
    });
  };

  place();
  fillTo();
  onWrapperScroll(fillTo);
  window.addEventListener('resize', () => { place(); fillTo(); });
  window.addEventListener('load', place);
  // The nav items rise in on load, which moves the dots until they finish.
  menu.addEventListener('animationend', place);
}

// Marks the current slide in the nav once its fade-in has finished.
function navAnim() {
    setTimeout(updateActiveSlide, 500, true);
  }

ngOnInit();
