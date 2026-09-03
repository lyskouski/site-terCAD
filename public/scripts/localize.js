(async function () {
  const host = window.location.hostname.replace(/^www\./, '').toLowerCase();
  const locale = {
    'tercad.com': 'en',
    'tercad.pl': 'pl',
    'tercad.fr': 'fr',
    'tercad.de': 'de',
    'tercad.pt': 'pt',
    'tercad.by': 'be'
  }[host] || 'en';

  const setHtml = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = value;
  };

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
    setHtml('#main-logo_header', copy.tagline);
    setHtml('.person > header', `<strong class="text-shadow">Viachaslau Lyskouski</strong>: <em>${copy.founder}</em>`);
    setHtml('.person > div', `${copy.bio}<menu><span class="button" aria-disabled="true">${copy.roles[0]}</span><span class="button" aria-disabled="true">${copy.roles[1]}</span></menu>`);

    const parts = document.querySelectorAll('.part');
    setHtml('.part:nth-of-type(1) h2', `${copy.headings[0]} <a class="button" href="./data/privacy_policy_en.html">${copy.buttons[0]}</a> <a class="button" href="./data/terms_of_use_en.html">${copy.buttons[1]}</a>`);
    parts[0].querySelectorAll('p').forEach((element, index) => {
      if (copy.about[index]) element.innerHTML = copy.about[index];
    });
    setHtml('.part:nth-of-type(1) p:last-of-type', `<em>${copy.buttons[2]}&nbsp;</em> <a class="button" target="_blank" href="https://www.linkedin.com/company/tercad/">LinkedIn</a> <a class="button" target="_blank" href="https://www.patreon.com/terCAD">Patreon</a>`);
    setHtml('.part:nth-of-type(2) h2', copy.headings[1]);
    parts[1].querySelectorAll('.item').forEach((item, index) => {
      const project = copy.projects[index];
      if (project) {
        item.querySelector('h3').textContent = project[0];
        item.querySelector('p').innerHTML = project[1];
      }
    });
    setHtml('.part:nth-of-type(3) h2', copy.headings[2]);
    setHtml('.part:nth-of-type(3) p:first-of-type', copy.contribution);
    setHtml('.part:nth-of-type(3) p:nth-of-type(2)', `<em>${copy.reward}</em>`);
  } catch (error) {
    console.error('Unable to load translations', error);
  }
})();
