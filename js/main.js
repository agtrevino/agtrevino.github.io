/* Page behavior (jQuery loads first) */

// One scroll run per frame
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

// Blocks panel hover while scrolling (body.is-scrolling)
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

// Videos play only while hovered (or visible on touch)
function videoPlayback() {
  const canHover = window.matchMedia('(hover: hover)').matches;

  // Cards have no videos; preload="none" saves bytes
  const cardLayout = window.matchMedia('(max-width: 900px)');

  // Buffer when the slide first shows, so hover has frames
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
    // Threshold 0 counts a slide that only touches the edge
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
  // A tablet turned wider: buffer then
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

// Drifts against the scroll; skipped for touch/reduced
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

// Types the code in once, when the slide is mostly visible
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

// Brighter code copy shows through a pointer circle
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

  // The mask is on the wrapper: slide coordinates
  const spot = document.createElement('div');
  spot.className = 'spot';
  const copy = layer.cloneNode(true);
  copy.classList.add('spot-layer');
  copy.setAttribute('aria-hidden', 'true');
  spot.appendChild(copy);
  bg.appendChild(spot);

  // The copy starts typing with the original
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

  // Listeners only while 30% of the slide shows
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

// Copies the address; the button says "copied" for 2s
function copyEmail() {
  const button = document.querySelector('.copy-email');
  if (!button) return;
  const live = document.querySelector('.copy-live');
  const label = button.textContent;
  const address = 'aaron.g.trevino@gmail.com';
  let timer;

  // No clipboard API on old browsers or non-secure pages
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

// Active dot = card nearest the left edge
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

// Redraws the hero signature GIF each time the hero shows
function signatureAnimation() {
  const hero = document.querySelector('#home');
  const signature = document.querySelector('.signature');
  const scrollContainer = document.querySelector('.wrapper');
  if (!hero || !signature || !scrollContainer) return;

  const source = signature.dataset.src;
  let replayTimer = null;

  // The first play waits for the hero entrance
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

// Logos rise in turn when the slide shows or hover ends
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
        // Cleared so hover fades have no delay
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
        // Reset so the next visit replays
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

    // Replays after leaving all panels, not panel to panel
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
  // A tablet turned wider: start then
  cardLayout.addEventListener('change', start);
}

// Replays the icon entrance when the hero returns
function heroIconReplay() {
  const hero = document.getElementById('home');
  if (!hero || !('IntersectionObserver' in window)) return;
  const cardLayout = window.matchMedia('(max-width: 900px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;
  // 1px inset: a slide touching the edge counts as off
  new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    if (cardLayout.matches) { hero.classList.remove('hero-away'); return; }
    if (entry.intersectionRatio === 0) hero.classList.add('hero-away');
    else if (entry.intersectionRatio >= 0.5) hero.classList.remove('hero-away');
  }, { root: document.querySelector('.wrapper'), rootMargin: '-1px 0px', threshold: [0, 0.5] }).observe(hero);
}

// No painting off screen; 200px margin avoids a flash
function heroVisibility() {
  const hero = document.getElementById('home');
  if (!hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    document.body.classList.toggle('hero-offscreen', !entry.isIntersecting);
  }, { root: document.querySelector('.wrapper'), rootMargin: '200px 0px 200px 0px', threshold: 0 }).observe(hero);
}

// The only console output on the site
function consoleHello() {
  console.log('%cHi, you found the console.', 'color: #eb3b5a; font-weight: bold; font-size: 16px;');
  console.log('I build front-end interfaces. This site is hand-written HTML, CSS and JavaScript, built with Claude Code.');
  console.log('Open to remote front-end roles: aaron.g.trevino@gmail.com');
  console.log('Source: https://github.com/agtrevino/agtrevino.github.io');
}

// Runs every setup function once on page load
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
    toolsIntro();
    signatureAnimation();
    expandingCards();
    navAnim();
    slideSync();
    resumeTitleViewCheck();
  }

// Hover: logo fades out, then the details fade in
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

// Slides, nav and URL

// Slides in page order; light = dark nav colors
const SLIDES = {
  home: {},
  projects: {},
  resume: { light: true },
  tools: {},
  contact: {},
};
const SLIDE_IDS = Object.keys(SLIDES);

// Most visible area wins; first wins a tie
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

// One active nav item, in white or dark nav colors
function showSlide(id) {
  const light = !!SLIDES[id].light;
  const names = SLIDE_IDS.map((name) => '.' + name);
  $(names.map((name) => name + '-nav').join(',')).removeClass('active-nav');
  $(names.map((name) => name + '-circle').join(','))
    .removeClass('active-circle active-circle-black nav-circle-black');
  $('.' + id + '-nav').addClass('active-nav');
  $('.' + id + '-circle').addClass(light ? 'active-circle-black nav-circle-black' : 'active-circle');
  $('.nav-link-text').toggleClass('color-black', light);
  $('.line').toggleClass('line-black', light);
  $('.nav-circle').toggleClass('circle-black', light);
  $('.vertical-text-2').toggleClass('color-black', light);
}

// Icons fade and rise in turn when the slide shows
function toolsIntro() {
  const section = document.getElementById('tools');
  const items = section ? section.querySelectorAll('.tool') : [];
  if (!section || !items.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  items.forEach((item, i) => item.style.setProperty('--i', i));
  section.classList.add('tools-ready');
  // 1px inset: a slide at the snap edge counts as off
  new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    if (entry.intersectionRatio >= 0.4) section.classList.add('tools-in');
    else if (entry.intersectionRatio === 0) section.classList.remove('tools-in');
  }, { root: document.querySelector('.wrapper'), rootMargin: '-1px 0px', threshold: [0, 0.4] }).observe(section);
}

// A one-time ring on the dot of the slide just arrived at
function playRipple(id) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dot = document.querySelector('.' + id + '-circle');
  if (!dot) return;
  dot.classList.remove('nav-ripple');
  void dot.offsetWidth;
  dot.classList.add('nav-ripple');
  dot.addEventListener('animationend', () => dot.classList.remove('nav-ripple'), { once: true });
}

let shownSlide = null;
let navReady = false;
// Sets the nav for the visible slide; ripple on a change
function updateActiveSlide(force) {
  const id = currentSlide();
  if (!force && id === shownSlide) return id;
  const arrived = navReady && shownSlide !== null && id !== shownSlide;
  shownSlide = id;
  showSlide(id);
  if (arrived) playRipple(id);
  return id;
}

// Keeps nav and URL hash in step; hash waits for stillness
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

  // After layout settles, open the slide in the URL
  const start = () => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      scrollToHash();
      updateActiveSlide(true);
      navReady = true;
      urlReady = true;
      syncHash();
    }));
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

// Fades the resume strengths in one by one
function resumeTitleViewCheck() {
    onWrapperScroll(function () {
      var scrollTop = $(window).scrollTop();
      var windowHeight = $(window).height();
      // Fade the strengths in once the heading shows
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

// Marks the current slide after the nav fade-in
function navAnim() {
    setTimeout(updateActiveSlide, 500, true);
  }

ngOnInit();
