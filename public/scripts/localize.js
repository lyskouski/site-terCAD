(async function () {
  const host = window.location.hostname.replace(/^www\./, '').toLowerCase();
  const sites = [
    { domain: 'tercad.com', locale: 'en' },
    { domain: 'tercad.pl', locale: 'pl' },
    { domain: 'tercad.fr', locale: 'fr' },
    { domain: 'tercad.de', locale: 'de' },
    { domain: 'tercad.pt', locale: 'pt' },
    { domain: 'tercad.by', locale: 'be' }
  ];
  const currentSite = sites.find((site) => site.domain === host) || sites[0];
  const locale = currentSite.locale;
  const siteToggle = document.getElementById('site-toggle');
  const siteToggleLabel = document.getElementById('site-toggle-label');

  siteToggle.value = currentSite.domain;
  siteToggle.addEventListener('change', () => {
    const url = `https://${siteToggle.value}${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.assign(url);
  });
  siteToggleLabel.textContent = locale === 'be' ? 'Мова' : locale === 'pl' ? 'Język' : locale === 'fr' ? 'Langue' : locale === 'de' ? 'Sprache' : locale === 'pt' ? 'Idioma' : 'Language';
  document.querySelector('link[rel="canonical"]').href = `https://${currentSite.domain}/`;

  // The markup ships in English, so other locales are fetched on demand
  if (locale === 'en') return;

  try {
    const response = await fetch('./data/locales.json');
    if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
    const translations = await response.json();
    const copy = translations[locale];
    if (!copy) return;

    document.documentElement.lang = copy.lang;
    document.title = copy.title;
    document.querySelector('meta[name="description"]').content = copy.tagline;
    document.querySelector('meta[property="og:description"]').content = copy.tagline;
    document.querySelector('meta[property="twitter:description"]').content = copy.tagline;

    // data-i18n holds a dotted path into the locale, e.g. "projects.0.1"
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = element.dataset.i18n.split('.').reduce((node, key) => node?.[key], copy);
      if (typeof value === 'string') element.innerHTML = value;
    });
  } catch (error) {
    console.error('Unable to load translations', error);
  }
})();
