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

  const stripHtml = (value = '') => {
    const div = document.createElement('div');
    div.innerHTML = value;
    return div.textContent || div.innerText || '';
  };

  const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const renderNews = (items) => {
    const list = document.getElementById('latest-news-list');
    if (!list) return;

    list.innerHTML = items.map((item) => `
      <li>
        <time>${item.date}</time>
        <span>${item.tag || 'お知らせ'}</span>
        <a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
      </li>
    `).join('');
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
        tag: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'お知らせ',
        title: stripHtml(post.title?.rendered),
        link: post.link,
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
