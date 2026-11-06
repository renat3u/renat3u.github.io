(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  function shuffled(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function splitText(element) {
    const accessibleText = element.textContent.replace(/\s+/g, ' ').trim();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      const tokens = node.nodeValue.match(/[A-Za-z0-9]+(?:['’\-][A-Za-z0-9]+)*|\s+|./gu) || [];
      tokens.forEach((token) => {
        if (/^\s+$/.test(token)) {
          fragment.append(document.createTextNode(token));
          return;
        }
        const span = document.createElement('span');
        span.className = 'sl-char';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = token;
        fragment.append(span);
      });
      node.replaceWith(fragment);
    });

    element.querySelectorAll('a').forEach((link) => {
      link.setAttribute('aria-label', link.textContent.trim());
    });
    const accessibleCopy = document.createElement('span');
    accessibleCopy.className = 'sr-only';
    accessibleCopy.textContent = accessibleText;
    element.append(accessibleCopy);
    return [...element.querySelectorAll('.sl-char')];
  }

  function prepare(element) {
    const chars = splitText(element);
    if (!chars.length) return;
    const order = shuffled(chars);
    const initialCount = Math.max(3, Math.round(chars.length * 0.1));
    const waiting = order.slice(initialCount);
    order.slice(0, initialCount).forEach((char) => char.classList.add('sl-lit'));
    let started = false;

    function start() {
      if (started) return;
      started = true;
      const duration = Math.min(3600, Math.max(2200, chars.length * 13));
      waiting.forEach((char, index) => {
        const delay = (index / waiting.length) * duration + Math.random() * 90;
        window.setTimeout(() => {
          char.classList.add('sl-lit', 'sl-spark');
          window.setTimeout(() => char.classList.remove('sl-spark'), 260);
        }, delay);
      });
      window.setTimeout(() => element.classList.add('sl-complete'), duration + 400);
    }

    if (!('IntersectionObserver' in window)) {
      start();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        start();
        observer.unobserve(element);
      });
    }, { threshold: 0.25 });
    observer.observe(element);
  }

  document.querySelectorAll('[data-starlight], .about-content .post-abstract > p').forEach(prepare);
})();
