(() => {
  window.addEventListener('pageshow', (event) => {
    const entries = performance.getEntriesByType ? performance.getEntriesByType('navigation') : [];
    const backForward = entries.length > 0 && entries[0].type === 'back_forward';
    const legacyBackForward = performance.navigation && performance.navigation.type === 2;
    if (!event.persisted && !backForward && !legacyBackForward) return;

    const root = document.documentElement;
    root.classList.add('navigation-restoring');
    document.querySelectorAll('#main-container, #side-bar').forEach((container) => {
      container.classList.remove('invisible', 'fadeIn', 'fadeInTop', 'fadeInRight');
    });
    document.querySelectorAll('[data-scroll-reveal]').forEach((article) => {
      article.classList.add('scroll-reveal-visible');
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove('navigation-restoring'));
    });
  });
})();
