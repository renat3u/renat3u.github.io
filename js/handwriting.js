(() => {
  const characters = [
    [
      { d: 'M13 15 C20 13 27 15 25 21 C23 27 16 28 16 33 C16 37 25 36 23 42 C21 47 16 49 13 50', w: 5.3, t: 260 },
      { d: 'M11 17 C10 31 11 48 10 63', w: 5.8, t: 230 },
      { d: 'M34 23 Q52 20 76 22', w: 5.2, t: 210 },
      { d: 'M54 10 Q50 26 36 39', w: 6.1, t: 210 },
      { d: 'M44 37 Q42 48 42 60', w: 5.2, t: 150 },
      { d: 'M44 36 Q56 34 68 35 Q69 47 66 61 Q65 66 61 63', w: 5.5, t: 260 },
      { d: 'M45 46 Q55 44 65 45', w: 4.4, t: 130 },
      { d: 'M45 55 Q54 54 64 54', w: 4.8, t: 130 },
      { d: 'M29 57 Q33 59 35 64', w: 5.6, t: 110 },
      { d: 'M25 68 Q32 65 37 69 Q41 74 33 77 Q29 80 38 80', w: 4.9, t: 230 },
      { d: 'M24 85 Q46 91 84 79', w: 6.4, t: 260 }
    ],
    [
      { d: 'M30 9 Q26 18 18 25', w: 5.1, t: 140 },
      { d: 'M22 25 Q30 23 40 22', w: 4.6, t: 130 },
      { d: 'M32 25 Q31 31 27 35', w: 4.7, t: 110 },
      { d: 'M63 8 Q59 16 51 23', w: 5.2, t: 140 },
      { d: 'M55 23 Q66 20 79 20', w: 4.8, t: 150 },
      { d: 'M69 23 Q68 29 64 33', w: 4.5, t: 110 },
      { d: 'M55 40 Q46 44 32 47', w: 5.7, t: 160 },
      { d: 'M27 58 Q48 53 72 53', w: 5.4, t: 200 },
      { d: 'M24 71 Q46 66 70 66', w: 5.9, t: 200 },
      { d: 'M50 46 Q47 63 48 79 Q49 89 64 85 Q75 83 82 77', w: 6.2, t: 310 }
    ]
  ];

  const namespace = 'http://www.w3.org/2000/svg';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function renderTitle(container) {
    const horizontal = container.dataset.layout === 'horizontal' || window.matchMedia('(max-width: 768px)').matches;
    const shouldWrite = container.hasAttribute('data-handwriting-animate') && !reducedMotion.matches;
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', horizontal ? '0 0 200 100' : '0 0 100 200');
    svg.setAttribute('class', 'hw-svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    let delay = shouldWrite ? 120 : 0;
    characters.forEach((strokes, characterIndex) => {
      const group = document.createElementNS(namespace, 'g');
      const x = horizontal ? characterIndex * 100 : 0;
      const y = horizontal ? 0 : characterIndex * 100;
      group.setAttribute('transform', `translate(${x} ${y})`);

      strokes.forEach((stroke) => {
        const path = document.createElementNS(namespace, 'path');
        path.setAttribute('d', stroke.d);
        path.setAttribute('class', 'hw-stroke');
        path.setAttribute('pathLength', '1');
        path.setAttribute('stroke-width', stroke.w);
        path.style.setProperty('--hw-delay', `${delay}ms`);
        path.style.setProperty('--hw-duration', `${stroke.t}ms`);
        group.append(path);
        if (shouldWrite) delay += stroke.t + 32;
      });

      svg.append(group);
      if (shouldWrite) delay += characterIndex === 0 ? 150 : 0;
    });

    container.replaceChildren(svg);
    if (shouldWrite) svg.classList.add('hw-is-writing');
  }

  document.querySelectorAll('[data-handwriting-title]').forEach((container) => {
    renderTitle(container);
    if (container.dataset.layout !== 'horizontal') {
      window.matchMedia('(max-width: 768px)').addEventListener('change', () => renderTitle(container));
    }
  });
})();
