(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('scroll-reveal-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  function register(article) {
    if (article.dataset.scrollRevealReady) return;
    article.dataset.scrollRevealReady = 'true';
    const items = article.querySelectorAll('.post-title, .post-meta, .post-abstract');
    items.forEach((item, index) => {
      item.classList.add('scroll-reveal-item');
      item.style.setProperty('--scroll-reveal-order', index);
    });
    article.classList.add('scroll-reveal-ready');
    observer.observe(article);
  }

  document.querySelectorAll('[data-scroll-reveal]').forEach(register);
  document.addEventListener('scroll-reveal:register', (event) => {
    event.detail.forEach(register);
  });
})();
