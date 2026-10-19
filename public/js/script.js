'use strict';

(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const themeButton = document.getElementById('themeBtn');
  let manualTheme = false;
  try { manualTheme = ['light', 'dark'].includes(localStorage.getItem('theme')); } catch (error) {}

  function applyTheme(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#131313' : '#f6f6f3';
    document.querySelectorAll('img[data-shot]').forEach(image => {
      image.src = image.dataset.shot + (dark ? '' : '-light') + '.webp';
    });
  }
  applyTheme(root.dataset.theme);
  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    manualTheme = true;
    applyTheme(theme);
    try { localStorage.setItem('theme', theme); } catch (error) {}
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!manualTheme) applyTheme(event.matches ? 'dark' : 'light');
  });

  const menuButton = document.getElementById('menuBtn');
  const navigation = document.getElementById('site-nav');
  function closeMenu(returnFocus = false) {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  // Native anchors preserve deep links, browser history, and the skip link.
  if ('IntersectionObserver' in window) {
    const links = [...navigation.querySelectorAll('a')];
    const sections = links.map(link => document.querySelector(link.getAttribute('href')));
    const observer = new IntersectionObserver(entries => {
      const active = entries.find(entry => entry.isIntersecting);
      if (!active) return;
      links.forEach(link => {
        const current = link.hash === '#' + active.target.id;
        link.classList.toggle('is-current', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -65% 0px' });
    sections.forEach(section => { if (section) observer.observe(section); });
  }

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('[data-reveal]').forEach(element => {
      element.classList.add('will-reveal');
      observer.observe(element);
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) document.querySelectorAll('.will-reveal').forEach(element => element.classList.add('is-visible'));
    });
  }

  const projects = [...document.querySelectorAll('.project')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const selected = item === button;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      let count = 0;
      projects.forEach(project => {
        project.hidden = filter !== 'all' && project.dataset.category !== filter;
        if (!project.hidden) {
          count++;
          project.classList.add('is-visible');
        }
      });
      document.getElementById('project-count').textContent = String(count).padStart(2, '0') + ' selected project' + (count === 1 ? '' : 's');
    });
  });

  const certificateToggle = document.getElementById('certificates-toggle');
  const extraCertificates = [...document.querySelectorAll('.certificate-extra')];
  function setCertificatesExpanded(expanded) {
    extraCertificates.forEach(item => { item.hidden = !expanded; });
    certificateToggle.setAttribute('aria-expanded', String(expanded));
    certificateToggle.querySelector('span').textContent = expanded ? 'Show fewer credentials' : 'View all 9 credentials';
  }
  setCertificatesExpanded(false);
  certificateToggle.addEventListener('click', () => setCertificatesExpanded(certificateToggle.getAttribute('aria-expanded') !== 'true'));

  const dialog = document.getElementById('certificate-dialog');
  const certificateImage = document.getElementById('certificate-image');
  const certificateError = document.getElementById('certificate-error');
  let certificateOpener;
  document.querySelectorAll('.certificate').forEach(button => {
    button.addEventListener('click', () => {
      certificateOpener = button;
      const title = button.querySelector('strong').textContent;
      document.getElementById('certificate-title').textContent = title;
      certificateError.hidden = true;
      certificateImage.hidden = false;
      certificateImage.alt = title + ' certificate';
      certificateImage.src = button.dataset.img;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      document.getElementById('certificate-close').focus();
    });
  });
  certificateImage.addEventListener('error', () => {
    certificateImage.hidden = true;
    certificateError.hidden = false;
  });
  document.getElementById('certificate-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    if (certificateOpener) certificateOpener.focus();
  });

  const form = document.getElementById('contactForm');
  const fields = [...form.querySelectorAll('input, textarea')];
  const status = document.getElementById('form-status');
  const submit = document.getElementById('submitBtn');
  function validate(field) {
    let error = '';
    const value = field.value.trim();
    if (!value) error = 'Please fill in this field.';
    else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address.';
    else if (field.id === 'message' && value.length < 10) error = 'Please write at least 10 characters.';
    const group = field.closest('.form-group');
    let message = group.querySelector('.form-error');
    if (error) {
      if (!message) {
        message = document.createElement('span');
        message.className = 'form-error';
        message.id = field.id + '-error';
        group.appendChild(message);
      }
      message.textContent = error;
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', message.id);
    } else {
      if (message) message.remove();
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
    return !error;
  }
  fields.forEach(field => {
    field.addEventListener('blur', () => { if (field.value || field.hasAttribute('aria-invalid')) validate(field); });
    field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) validate(field); });
  });

  let emailClientPromise;
  function loadEmailClient() {
    if (window.emailjs) return Promise.resolve(window.emailjs);
    if (!emailClientPromise) {
      emailClientPromise = new Promise((resolve, reject) => {
        const sdk = document.createElement('script');
        let settled = false;
        sdk.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4.4.1/dist/email.min.js';
        sdk.integrity = 'sha384-SALc35EccAf6RzGw4iNsyj7kTPr33K7RoGzYu+7heZhT8s0GZouafRiCg1qy44AS';
        sdk.crossOrigin = 'anonymous';
        sdk.async = true;
        const timeout = setTimeout(() => finish(new Error('Email client timed out')), 12000);
        function finish(error) {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          if (error || !window.emailjs) {
            sdk.remove();
            emailClientPromise = undefined;
            reject(error || new Error('Email client unavailable'));
          } else resolve(window.emailjs);
        }
        sdk.onload = () => finish();
        sdk.onerror = () => finish(new Error('Email client unavailable'));
        document.head.appendChild(sdk);
      });
    }
    return emailClientPromise;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    const valid = fields.map(validate).every(Boolean);
    if (!valid) {
      status.textContent = 'Please check the highlighted fields.';
      status.dataset.state = 'error';
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    const payload = {
      from_name: form.elements.name.value.trim(),
      from_email: form.elements.email.value.trim(),
      subject: form.elements.subject.value.trim(),
      message: form.elements.message.value.trim(),
      to_email: 'adityaajaysingh0104@gmail.com'
    };
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submit.querySelector('.btn-text').textContent = 'Sending…';
    status.textContent = '';
    status.dataset.state = 'sending';
    try {
      const client = await loadEmailClient();
      client.init({ publicKey: '42_vwBZ0ZtAHGQkag' });
      await client.send('service_m70ckgj', 'template_fwa4xtm', payload);
      form.reset();
      status.textContent = 'Message sent. Thank you — I’ll be in touch.';
      status.dataset.state = 'success';
    } catch (error) {
      status.textContent = 'Your message could not be sent. Please ';
      const fallback = document.createElement('a');
      fallback.href = 'mailto:adityaajaysingh0104@gmail.com';
      fallback.textContent = 'email me directly';
      status.append(fallback, '.');
      status.dataset.state = 'error';
    } finally {
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      submit.querySelector('.btn-text').textContent = 'Send a message';
    }
  });

  function svgElement(name, attributes = {}, content) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    if (content !== undefined) element.textContent = content;
    return element;
  }
  async function loadActivity() {
    const calendar = document.getElementById('gh-calendar');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const today = new Date();
      const year = today.getFullYear();
      const results = await Promise.allSettled([year - 1, year].map(async y => {
        const response = await fetch('https://github-contributions-api.jogruber.de/v4/Adityasiig?y=' + y, { signal: controller.signal });
        if (!response.ok) throw new Error('Activity unavailable');
        return response.json();
      }));
      // A partial calendar would understate activity, so show an honest fallback.
      if (results.some(result => result.status !== 'fulfilled' || !Array.isArray(result.value.contributions))) throw new Error('Activity unavailable');
      const counts = new Map();
      results.forEach(result => result.value.contributions.forEach(day => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(day.date) && Number.isInteger(day.count) && day.count >= 0) counts.set(day.date, Math.max(counts.get(day.date) || 0, day.count));
      }));
      const end = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      const start = new Date(end);
      start.setUTCDate(start.getUTCDate() - 364);
      start.setUTCDate(start.getUTCDate() - start.getUTCDay());
      const maxCount = Math.max(1, ...counts.values());
      const weeks = Math.floor((end - start) / 86400000 / 7) + 1;
      const step = 16, cell = 12, left = 30, top = 25;
      const svg = svgElement('svg', { viewBox: `0 0 ${left + weeks * step} 145`, class: 'calendar-svg', role: 'img', 'aria-label': 'GitHub contributions over the last 12 months' });
      const labels = new Set();
      let total = 0;
      ['', 'Mon', '', 'Wed', '', 'Fri', ''].forEach((label, row) => {
        if (label) svg.append(svgElement('text', { x: 0, y: top + row * step + 9 }, label));
      });
      for (let day = new Date(start); day <= end; day.setUTCDate(day.getUTCDate() + 1)) {
        const date = day.toISOString().slice(0, 10);
        const week = Math.floor((day - start) / 86400000 / 7);
        const count = counts.get(date) || 0;
        total += count;
        const level = count === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil(count / maxCount * 4)));
        const rect = svgElement('rect', { x: left + week * step, y: top + day.getUTCDay() * step, width: cell, height: cell, rx: 2, 'data-level': level });
        rect.append(svgElement('title', {}, `${count} contribution${count === 1 ? '' : 's'} on ${date}`));
        svg.append(rect);
        if (day.getUTCDate() <= 7 && day.getUTCDay() === 0 && !labels.has(day.getUTCMonth())) {
          svg.append(svgElement('text', { x: left + week * step, y: 11 }, day.toLocaleDateString('en', { month: 'short', timeZone: 'UTC' })));
          labels.add(day.getUTCMonth());
        }
      }
      calendar.replaceChildren(svg);
      document.getElementById('gh-contrib-count').textContent = total.toLocaleString() + ' contributions in the last 12 months';
    } catch (error) {
      const message = document.createElement('p');
      message.className = 'calendar-placeholder';
      const link = document.createElement('a');
      link.href = 'https://github.com/Adityasiig';
      link.textContent = 'View activity directly on GitHub ↗';
      link.className = 'small-link';
      message.append(link);
      calendar.replaceChildren(message);
      document.getElementById('gh-contrib-count').textContent = 'Live activity is temporarily unavailable';
    } finally { clearTimeout(timeout); }
  }
  if ('IntersectionObserver' in window) {
    const activityObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        activityObserver.disconnect();
        loadActivity();
      }
    }, { rootMargin: '200px' });
    activityObserver.observe(document.getElementById('activity'));
  } else loadActivity();

  document.getElementById('year').textContent = new Date().getFullYear();
  const clock = document.getElementById('clock');
  function updateClock() { clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }); }
  updateClock();
  setInterval(updateClock, 60000);
})();
