(() => {
  const list = document.querySelector('[data-posts-list]');
  const loader = document.querySelector('[data-posts-loader]');
  if (!list || !loader || !('IntersectionObserver' in window)) return;

  const endpoint = list.dataset.postsEndpoint;
  const batchSize = 4;
  let posts = [];
  let cursor = Number(list.dataset.initialCount || 6);
  let loading = false;
  let finished = false;

  function createLink(item, className) {
    const link = document.createElement('a');
    link.href = item.url;
    link.textContent = item.name || item.title;
    if (className) link.className = className;
    if (item.name) link.title = item.name;
    return link;
  }

  function createMetaGroup(item, iconClass) {
    const span = document.createElement('span');
    span.className = 'meta-item';
    const icon = document.createElement('i');
    icon.className = `fa ${iconClass}`;
    icon.setAttribute('aria-hidden', 'true');
    span.append(icon, document.createTextNode(' '), createLink(item, 'a-tag'), document.createTextNode(' '));
    return span;
  }

  function createArticle(post) {
    const article = document.createElement('article');
    article.className = 'post-container';
    article.setAttribute('data-scroll-reveal', '');

    const title = document.createElement('p');
    title.className = 'post-title';
    title.append(createLink({ title: post.title, url: post.url }));

    const meta = document.createElement('p');
    meta.className = 'post-meta';
    const date = document.createElement('span');
    date.className = 'date meta-item';
    date.textContent = `${list.dataset.postedLabel || '发布于'} ${post.date}`;
    meta.append(date);
    post.categories.forEach((category) => meta.append(createMetaGroup(category, 'fa-folder')));
    post.tags.forEach((tag) => meta.append(createMetaGroup(tag, 'fa-tag')));

    const excerpt = document.createElement('p');
    excerpt.className = 'post-abstract';
    excerpt.textContent = post.excerpt;
    article.append(title, meta, excerpt);
    return article;
  }

  async function loadNext() {
    if (loading || finished) return;
    loading = true;
    loader.textContent = '正在载入…';

    try {
      if (!posts.length) {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        posts = await response.json();
      }

      const articles = posts.slice(cursor, cursor + batchSize).map(createArticle);
      articles.forEach((article) => list.insertBefore(article, loader));
      cursor += articles.length;
      document.dispatchEvent(new CustomEvent('scroll-reveal:register', { detail: articles }));

      if (cursor >= posts.length) {
        finished = true;
        observer.disconnect();
        loader.textContent = '已读完全部文章';
        loader.classList.add('posts-loader-complete');
      } else {
        loader.textContent = '';
      }
    } catch (error) {
      observer.unobserve(loader);
      loader.textContent = '更多文章暂时载入失败，请刷新重试。';
    } finally {
      loading = false;
    }
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) loadNext();
  }, { rootMargin: '600px 0px', threshold: 0 });
  observer.observe(loader);
})();
