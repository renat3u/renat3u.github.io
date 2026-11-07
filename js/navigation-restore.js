(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('pageshow', (event) => {
    const entries = performance.getEntriesByType ? performance.getEntriesByType('navigation') : [];
    const backForward = entries.length > 0 && entries[0].type === 'back_forward';
    const legacyBackForward = performance.navigation && performance.navigation.type === 2;
    if (!event.persisted && !backForward && !legacyBackForward) return;

    const root = document.documentElement;
    const articles = [...document.querySelectorAll('[data-scroll-reveal]')];
    root.classList.add('navigation-restoring');
    document.querySelectorAll('#main-container, #side-bar').forEach((container) => {
      container.classList.remove('invisible', 'fadeIn', 'fadeInTop', 'fadeInRight');
    });
    articles.forEach((article) => {
      article.classList.remove('navigation-restore-item');
      article.classList.add('scroll-reveal-visible');
      article.style.removeProperty('--navigation-restore-order');
    });

    requestAnimationFrame(() => {
      if (!reducedMotion) {
        const visibleArticles = articles.filter((article) => {
          const rect = article.getBoundingClientRect();
          return rect.bottom > 0 && rect.top < window.innerHeight;
        });

        visibleArticles.forEach((article, index) => {
          article.style.setProperty('--navigation-restore-order', index);
          article.classList.add('navigation-restore-item');
          article.addEventListener('animationend', () => {
            article.classList.remove('navigation-restore-item');
            article.style.removeProperty('--navigation-restore-order');
          }, { once: true });
        });
      }

      requestAnimationFrame(() => root.classList.remove('navigation-restoring'));
    });
  });
})();
