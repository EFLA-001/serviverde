/* ============================================================
   SERVIVERDE S.A.C — scripts.js
   Módulos:
     1. Nav (scroll + hamburguesa)
     2. Hero Slider
     3. Parallax
     4. Animaciones de entrada (IntersectionObserver)
     5. Contadores animados
     6. Tabs de servicios
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAV ─────────────────────────────────────────────── */
  const nav         = document.getElementById('mainNav');
  const burger      = document.getElementById('burger');
  const mobilePanel = document.getElementById('mobilePanel');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = mobilePanel.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobilePanel.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      mobilePanel.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ── 2. HERO SLIDER ─────────────────────────────────────── */
  const slides   = document.querySelectorAll('.hero-slide');
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  const dots     = document.querySelectorAll('.hero-dot');

  if (slides.length) {
    let cur = 0;

    function goTo(n) {
      slides[cur].classList.remove('active');
      bgSlides[cur]?.classList.remove('active');
      dots[cur]?.classList.remove('active');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('active');
      bgSlides[cur]?.classList.add('active');
      dots[cur]?.classList.add('active');
    }

    let timer = setInterval(() => goTo(cur + 1), 5500);
    dots.forEach(d => d.addEventListener('click', () => {
      clearInterval(timer);
      goTo(+d.dataset.slide);
      timer = setInterval(() => goTo(cur + 1), 5500);
    }));
  }


  /* ── 3. PARALLAX ────────────────────────────────────────── */
  const leaves = document.querySelectorAll('.parallax-leaf, .deco-leaf');
  if (leaves.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      leaves.forEach(el => {
        el.style.transform = `translateY(${y * (el.dataset.speed || 0.2)}px)`;
      });
    }, { passive: true });
  }


  /* ── 4. ANIMACIONES DE ENTRADA ──────────────────────────── */
  /*
   * Clases disponibles en HTML:
   *   .fade-in        → sube desde abajo
   *   .fade-in-left   → entra desde la izquierda
   *   .fade-in-right  → entra desde la derecha
   *   .fade-in-scale  → aparece con zoom
   *   .stagger        → hijos en cascada (delay incremental)
   *
   * El observer añade .visible cuando el elemento entra al viewport.
   */
  const animSelector = [
    '.fade-in',
    '.fade-in-left',
    '.fade-in-right',
    '.fade-in-scale',
    '.stagger',
  ].join(', ');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px',
  });

  document.querySelectorAll(animSelector).forEach(el => observer.observe(el));


  /* ── 5. CONTADORES ──────────────────────────────────────── */
  const statsEl = document.getElementById('statsSection');
  if (statsEl) {
    let done = false;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done) {
        done = true;
        document.querySelectorAll('.stat-num[data-target]').forEach(el => {
          const target = +el.dataset.target;
          const start  = performance.now();
          const tick   = now => {
            const p   = Math.min((now - start) / 1800, 1);
            const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            el.textContent = val;
            if (p < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = target;
              el.closest('.stat-item')?.classList.add('counted');
            }
          };
          requestAnimationFrame(tick);
        });
      }
    }, { threshold: 0.5 }).observe(statsEl);
  }


  /* ── 6. TABS SERVICIOS ──────────────────────────────────── */
  const tabs = document.querySelectorAll('.service-tab');
  if (tabs.length) {
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
      const panelId = 'panel-' + tab.dataset.panel;
      (document.getElementById(panelId) || document.getElementById('panel-all'))
        ?.classList.add('active');
    }));
  }

});