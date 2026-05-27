gsap.registerPlugin(ScrollTrigger);

// ─── Chapter navigation dots ──────────────────
const dots = document.querySelectorAll('.nav-dot');
const sections = Array.from(dots).map(d => d.dataset.target);

function setActiveDot(id) {
  dots.forEach(dot => dot.classList.toggle('active', dot.dataset.target === id));
}

// Click: smooth scroll to target section
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.getElementById(dot.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Scroll: mark active dot based on which section's top is above viewport midpoint
function updateActiveDot() {
  const mid = window.innerHeight / 2;
  let activeId = null;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.getBoundingClientRect().top <= mid) activeId = id;
  });
  if (activeId) setActiveDot(activeId);
}

window.addEventListener('scroll', updateActiveDot, { passive: true });
updateActiveDot();

// ─── Progress bar ─────────────────────────────
const bar = document.getElementById('progress');
ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: self => {
    bar.style.width = (self.progress * 100) + '%';
  }
});

// ─── Scene illustrations (scroll-scrubbed overlay) ────────────────────────────
gsap.utils.toArray('.scene').forEach(scene => {
  const img = scene.querySelector('.scene-img');
  if (!img) return;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: 'top 75%',
      end: 'bottom 25%',
      scrub: 2
    }
  });
  tl.fromTo(img, { opacity: 0 }, { opacity: 0.14, duration: 0.25, ease: 'none' })
    .to({}, { duration: 0.5 })
    .to(img, { opacity: 0, duration: 0.25, ease: 'none' });
});

// ─── Chapter headers ──────────────────────────
gsap.utils.toArray('.chapter-label, .chapter-title, .chapter-subtitle').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    }
  );
});

// ─── Text lines ───────────────────────────────
gsap.utils.toArray('.line').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 18 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        toggleActions: 'play none none none'
      }
    }
  );
});

// ─── Dividers & end rule ──────────────────────
gsap.utils.toArray('.divider, .end-rule').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.4,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
});
