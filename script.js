(() => {
  const nav = document.querySelector('.global-nav');
  const toggle = document.querySelector('.nav-toggle');
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
    });

    nav.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;
      if (window.matchMedia('(max-width: 860px)').matches) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }


  const fallbackNews = [
    {
      date: '2026.04.15',
      tag: 'お知らせ',
      title: '東京支所開設のお知らせ',
      link: 'https://tokyo.nagasesogo.com/',
    },
    {
      date: '2024.02.01',
      tag: 'お知らせ',
      title: 'ご相談前に関係者の氏名等を確認させていただく理由について',
      link: 'https://nagasesogo.com/info-240201/',
    },
  ];

  // DOMParserで解析した文書ではスクリプトや画像読込みが実行されない
  const stripHtml = (value = '') => {
    const doc = new DOMParser().parseFromString(String(value), 'text/html');
    return doc.body.textContent || '';
  };

  // 総合サイト（nagasesogo.com）配下のhttpsリンクのみ許可する
  const safeLink = (value) => {
    try {
      const url = new URL(value);
      const isOwnSite = url.hostname === 'nagasesogo.com' || url.hostname.endsWith('.nagasesogo.com');
      return url.protocol === 'https:' && isOwnSite ? url.href : '';
    } catch (error) {
      return '';
    }
  };

  const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const renderNews = (items) => {
    const list = document.getElementById('latest-news-list');
    if (!list) return;

    // 取得データはHTMLとして解釈させず、文字列として要素に設定する
    list.replaceChildren(...items.map((item) => {
      const li = document.createElement('li');
      const time = document.createElement('time');
      const tag = document.createElement('span');
      const link = document.createElement('a');

      time.textContent = item.date;
      tag.textContent = item.tag || 'お知らせ';
      link.textContent = item.title;
      link.href = item.link;
      link.target = '_blank';
      link.rel = 'noopener';

      li.append(time, tag, link);
      return li;
    }));
  };

  const loadLatestNews = async () => {
    const list = document.getElementById('latest-news-list');
    if (!list) return;

    try {
      const response = await fetch(list.dataset.feed, { mode: 'cors' });
      if (!response.ok) throw new Error('Failed to fetch latest news');

      const posts = await response.json();
      const items = posts.slice(0, 4).map((post) => ({
        date: formatDate(post.date),
        tag: stripHtml(post._embedded?.['wp:term']?.[0]?.[0]?.name) || 'お知らせ',
        title: stripHtml(post.title?.rendered),
        link: safeLink(post.link),
      })).filter((item) => item.title && item.link);

      renderNews(items.length ? items : fallbackNews);
    } catch (error) {
      renderNews(fallbackNews);
    }
  };

  loadLatestNews();

  const sectionIds = ['top', 'office', 'practice', 'ngs-tx', 'flow'];
  const navLinks = new Map(
    [...document.querySelectorAll('.nav-inner a[href^="#"]')]
      .map((link) => [link.getAttribute('href').slice(1), link])
  );

  const observer = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!active) return;

    navLinks.forEach((link) => link.classList.remove('current'));
    const link = navLinks.get(active.target.id);
    if (link) link.classList.add('current');
  }, {
    rootMargin: '-42% 0px -52% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .forEach((section) => observer.observe(section));
})();
