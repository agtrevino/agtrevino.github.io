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

// Scroll progress (--hero-p) fades the hero text out
function heroScroll() {
  const wrapper = document.querySelector('.wrapper');
  const hero = document.getElementById('home');
  if (!wrapper || !hero) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const progress = Math.min(1, Math.max(0, wrapper.scrollTop / (0.6 * window.innerHeight)));
    hero.style.setProperty('--hero-p', progress);
  };

  wrapper.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  update();
}

// Replays a signature GIF each time its slide shows
function signatureAnimation(slide, signature) {
  const scrollContainer = document.querySelector('.wrapper');
  if (!slide || !signature || !scrollContainer) return;

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
    const slideIsVisible = () => {
      const bounds = slide.getBoundingClientRect();
      return bounds.top < window.innerHeight && bounds.bottom > 0;
    };
    if (slideIsVisible()) window.setTimeout(replay, nextDelay());
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

  observer.observe(slide);
}

// Logos rise in turn when the slide shows or hover ends
function projectLogoIntro() {
  const slide = document.getElementById('projects');
  if (!slide || !('IntersectionObserver' in window)) return;
  const cardLayout = window.matchMedia('(max-width: 900px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = window.matchMedia('(hover: hover)');
  // Panel order, whatever the number of panels
  const logos = Array.from(slide.querySelectorAll('.site-logo-container img'));

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
    heroScroll();
    projectLogoIntro();
    heroIconReplay();
    toolsIntro();
    toolsBackdrop();
    toolsPanel();
    signatureAnimation(document.getElementById('home'), document.querySelector('.signature'));
    signatureAnimation(document.getElementById('contact'), document.querySelector('.contact-signature'));
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

// Tools panel: shows the selected tool, typed in
function toolsPanel() {
  const section = document.getElementById('tools');
  const panel = section && section.querySelector('.tool-panel');
  const tools = section ? Array.from(section.querySelectorAll('button.tool')) : [];
  const parts = panel ? {
    inner: panel.querySelector('.panel-inner'),
    group: panel.querySelector('.panel-group'),
    icon: panel.querySelector('.panel-icon'),
    name: panel.querySelector('.panel-name'),
    typed: panel.querySelector('.panel-typed'),
    full: panel.querySelector('.panel-full'),
  } : null;
  if (!section || !tools.length || !parts || Object.values(parts).some((el) => !el)) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  // The untyped rest keeps the final text size
  const rest = document.createElement('span');
  rest.className = 'panel-rest';
  rest.setAttribute('aria-hidden', 'true');
  parts.typed.after(rest);

  let typingFrame = 0;
  let swapTimer = 0;
  // Cancels the swap fades, not the CSS opening animation
  const cancelFades = () => {
    parts.inner.getAnimations().forEach((animation) => {
      if (typeof CSSAnimation !== 'undefined' && animation instanceof CSSAnimation) return;
      animation.cancel();
    });
  };
  const stopTyping = () => {
    window.cancelAnimationFrame(typingFrame);
    window.clearTimeout(swapTimer);
    cancelFades();
  };

  const fill = (tool) => {
    const svg = tool.querySelector('svg');
    parts.group.textContent = tool.dataset.group || '';
    parts.name.textContent = tool.querySelector('.tool-name').textContent;
    parts.icon.textContent = '';
    if (svg) parts.icon.appendChild(svg.cloneNode(true));
    panel.style.setProperty('--brand', tool.style.getPropertyValue('--brand'));
    parts.full.textContent = tool.dataset.desc || '';
  };

  const type = (text) => {
    if (reduced.matches) {
      parts.typed.textContent = text;
      rest.textContent = '';
      return;
    }
    const start = performance.now();
    const step = (now) => {
      const count = Math.min(text.length, Math.floor((now - start) / 16));
      parts.typed.textContent = text.slice(0, count);
      rest.textContent = text.slice(count);
      if (count < text.length) typingFrame = window.requestAnimationFrame(step);
    };
    typingFrame = window.requestAnimationFrame(step);
  };

  const select = (tool) => {
    if (tool.getAttribute('aria-pressed') === 'true') return;
    tools.forEach((other) => {
      other.setAttribute('aria-pressed', other === tool ? 'true' : 'false');
      other.tabIndex = other === tool ? 0 : -1;
    });
    stopTyping();
    const swap = () => {
      fill(tool);
      type(tool.dataset.desc || '');
      if (!reduced.matches) {
        parts.inner.animate(
          [{ opacity: 0, translate: '12px 0' }, { opacity: 1, translate: '0 0' }],
          { duration: 125, easing: 'ease-out' });
      }
    };
    if (reduced.matches) {
      swap();
    } else {
      parts.inner.animate(
        [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '-12px 0' }],
        { duration: 125, easing: 'ease-in', fill: 'forwards' });
      swapTimer = window.setTimeout(() => {
        cancelFades();
        swap();
      }, 125);
    }
    section.dispatchEvent(new CustomEvent('toolchange', { detail: { tool } }));
  };

  // Opens on the pressed tool, without typing
  const first = tools.find((tool) => tool.getAttribute('aria-pressed') === 'true') || tools[0];
  tools.forEach((tool) => { tool.tabIndex = tool === first ? 0 : -1; });
  first.setAttribute('aria-pressed', 'true');
  fill(first);
  parts.typed.textContent = first.dataset.desc || '';
  section.dispatchEvent(new CustomEvent('toolchange', { detail: { tool: first, initial: true } }));

  const grid = section.querySelector('.tools-groups');
  if (!grid) return;
  grid.addEventListener('click', (event) => {
    const tool = event.target.closest('button.tool');
    if (tool) select(tool);
  });
  // One tab stop: the focused tool becomes the entry point
  grid.addEventListener('focusin', (event) => {
    const tool = event.target.closest('button.tool');
    if (!tool) return;
    tools.forEach((other) => { other.tabIndex = other === tool ? 0 : -1; });
  });
  // Left/Right: reading order. Up/Down: rows in the group.
  grid.addEventListener('keydown', (event) => {
    const tool = event.target.closest('button.tool');
    const index = tools.indexOf(tool);
    if (index < 0) return;
    let target = null;
    if (event.key === 'ArrowRight') target = tools[index + 1];
    else if (event.key === 'ArrowLeft') target = tools[index - 1];
    else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const down = event.key === 'ArrowDown';
      const here = tool.getBoundingClientRect();
      const mates = tools.filter((other) => other !== tool && other.dataset.group === tool.dataset.group);
      const rows = mates.filter((other) => {
        const box = other.getBoundingClientRect();
        return down ? box.top > here.top + 4 : box.top < here.top - 4;
      });
      if (rows.length) {
        const rowTop = rows.reduce((best, other) => {
          const top = other.getBoundingClientRect().top;
          return down ? Math.min(best, top) : Math.max(best, top);
        }, down ? Infinity : -Infinity);
        const row = rows.filter((other) => Math.abs(other.getBoundingClientRect().top - rowTop) < 4);
        target = row.reduce((best, other) => (
          Math.abs(other.getBoundingClientRect().left - here.left) <
          Math.abs(best.getBoundingClientRect().left - here.left) ? other : best));
      }
    } else return;
    if (target) {
      event.preventDefault();
      target.focus({ preventScroll: true });
    }
  });
}

// Tools backdrop: brand glow and ghost icon follow the pick
function toolsBackdrop() {
  const section = document.getElementById('tools');
  const bg = section && section.querySelector('.contact-bg');
  if (!bg) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const make = (className) => {
    const el = document.createElement('div');
    el.className = className;
    bg.appendChild(el);
    return el;
  };
  const glows = [make('tools-glow'), make('tools-glow')];
  const clip = make('tools-ghost-clip');
  const ghosts = [0, 1].map(() => {
    const ghost = document.createElement('div');
    ghost.className = 'tools-ghost';
    clip.appendChild(ghost);
    return ghost;
  });
  const icons = ghosts.map((ghost) => {
    const icon = document.createElement('div');
    icon.className = 'ghost-icon';
    ghost.appendChild(icon);
    return icon;
  });

  // Each change lights the idle layer, dims the other
  let live = 1;
  section.addEventListener('toolchange', (event) => {
    const tool = event.detail.tool;
    const svg = tool.querySelector('svg');
    const brand = tool.style.getPropertyValue('--brand').trim();
    const white = /^#f{6}$/i.test(brand);
    live = 1 - live;
    glows[live].style.setProperty('--glow', white ? '#fff' : brand);
    glows[live].style.setProperty('--glow-pct', white ? '14%' : '32%');
    ghosts[live].style.setProperty('--brand', brand);
    icons[live].textContent = '';
    if (svg) icons[live].appendChild(svg.cloneNode(true));
    glows.forEach((el, i) => el.classList.toggle('is-on', i === live));
    ghosts.forEach((el, i) => el.classList.toggle('is-on', i === live));
    if (!reduced.matches && !event.detail.initial) {
      icons[live].animate(
        [{ translate: '40px 0', opacity: 0 }, { translate: '0 0', opacity: 1 }],
        { duration: 400, easing: 'ease-out' });
    }
  });

  // Mouse parallax, only while 30% of the slide shows
  if (!('IntersectionObserver' in window)) return;
  const canMove = () => window.matchMedia('(hover: hover)').matches && !reduced.matches;
  let frame = 0;
  let x = 0;
  let y = 0;
  const draw = () => {
    frame = 0;
    bg.style.setProperty('--gx', x.toFixed(1) + 'px');
    bg.style.setProperty('--gy', y.toFixed(1) + 'px');
  };
  const onMove = (event) => {
    const box = section.getBoundingClientRect();
    x = ((event.clientX - box.left) / box.width - 0.5) * 28;
    y = ((event.clientY - box.top) / box.height - 0.5) * 28;
    if (!frame) frame = window.requestAnimationFrame(draw);
  };
  let attached = false;
  const attach = () => {
    if (attached || !canMove()) return;
    attached = true;
    section.addEventListener('pointermove', onMove, { passive: true });
  };
  const detach = () => {
    if (!attached) return;
    attached = false;
    section.removeEventListener('pointermove', onMove);
    window.cancelAnimationFrame(frame);
    frame = 0;
  };
  new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    if (entry.intersectionRatio >= 0.3) attach();
    else detach();
  }, { threshold: [0, 0.3] }).observe(section);
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
