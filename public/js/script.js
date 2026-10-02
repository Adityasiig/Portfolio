/* ============================================
   ADITYA SINGH / PORTFOLIO
   Vanilla JS: nav, reveals, lightbox, form, GitHub calendar.
   No scroll listeners; everything observes intersections.
   ============================================ */

function initPortfolio() {

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Escape text destined for an HTML attribute / text node.
    const esc = (v) => String(v).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));

    // ===== HEADER BACKGROUND =====
    // A zero-height sentinel at the top of the page: when it leaves the
    // viewport the user has scrolled, so the header gets a solid backdrop.
    const header = document.getElementById('header');
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:60px;width:1px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
    }).observe(sentinel);

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    function setMenu(open) {
        hamburger.classList.toggle('active', open);
        mobileMenu.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('active')));
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                setMenu(false);
                hamburger.focus();
            }
        });
    }

    // ===== SCROLL SPY =====
    const navLinks = document.querySelectorAll('.nav-link');
    const spy = new IntersectionObserver((entries) => {
        const visible = entries.filter(e => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === visible[0].target.id);
            });
        }
    }, { rootMargin: '-120px 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(s => spy.observe(s));

    // Smooth-scroll with a fixed-header offset.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 76;
            window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    });

    // ===== REVEAL ON SCROLL =====
    const revealer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealer.observe(el));

    // ===== CERTIFICATE LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    let lastFocusedCard = null;

    function openLightbox(card) {
        const img = card.querySelector('img');
        const title = card.querySelector('.tl-title');
        if (!lightbox || !img) return;
        lightboxImg.src = card.dataset.img || img.src;
        lightboxImg.alt = img.alt || 'Certificate';
        lightboxImg.hidden = false;
        lightboxCaption.textContent = title ? title.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lastFocusedCard = card;
        // The dialog transitions visibility; focus once it is focusable.
        if (lightboxClose) {
            const focusClose = () => lightboxClose.focus();
            lightbox.addEventListener('transitionend', focusClose, { once: true });
            setTimeout(focusClose, 300);
        }
    }

    function closeLightbox() {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (lastFocusedCard) {
            lastFocusedCard.focus();
            lastFocusedCard = null;
        }
    }

    document.querySelectorAll('.tl-card').forEach(card => {
        card.addEventListener('click', () => openLightbox(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(card);
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        // Trap Tab inside the dialog while it is open.
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && lightboxClose) {
                e.preventDefault();
                lightboxClose.focus();
            }
        });
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    // ===== CERTIFICATES: show 6, expand to all =====
    // Collapsed state is applied here, not in the HTML, so every
    // certificate stays visible when JavaScript is unavailable.
    const certToggle = document.getElementById('certToggle');
    const certGrid = document.querySelector('.cert-grid');
    if (certToggle && certGrid && certGrid.children.length > 6) {
        certGrid.classList.add('collapsed');
        certToggle.hidden = false;
        certToggle.addEventListener('click', () => {
            const collapsed = certGrid.classList.toggle('collapsed');
            certToggle.setAttribute('aria-expanded', String(!collapsed));
            certToggle.querySelector('span').textContent = collapsed
                ? 'Show all ' + certGrid.children.length + ' certificates'
                : 'Show fewer certificates';
            if (collapsed) certGrid.scrollIntoView({ block: 'start' });
        });
    }

    // ===== TOAST =====
    function showToast(message, type) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const existing = container.querySelector('.toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = '<i class="fas ' + icon + '" aria-hidden="true"></i> ' + esc(message);
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 350);
        }, 3200);
    }

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    let emailjsReady = false;

    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');

        function validateInput(input) {
            let valid = true;
            let msg = '';
            if (input.required && !input.value.trim()) {
                valid = false; msg = 'This field is required';
            } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                valid = false; msg = 'Please enter a valid email';
            } else if (input.id === 'message' && input.value && input.value.length < 10) {
                valid = false; msg = 'Message must be at least 10 characters';
            }

            const group = input.closest('.form-group');
            let errorEl = group.querySelector('.form-error');
            if (!valid) {
                input.classList.add('invalid');
                if (!errorEl) {
                    errorEl = document.createElement('span');
                    errorEl.className = 'form-error';
                    errorEl.id = input.id + '-error';
                    errorEl.setAttribute('role', 'alert');
                    group.appendChild(errorEl);
                }
                errorEl.textContent = msg;
                input.setAttribute('aria-invalid', 'true');
                input.setAttribute('aria-describedby', errorEl.id);
            } else {
                input.classList.remove('invalid');
                if (errorEl) errorEl.remove();
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
            }
            return valid;
        }

        inputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) validateInput(input);
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let formValid = true;
            inputs.forEach(input => { if (!validateInput(input)) formValid = false; });
            if (!formValid) {
                showToast('Please fix the errors above', 'error');
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');

            function setSending(sending) {
                submitBtn.disabled = sending;
                btnText.textContent = sending ? 'Sending' : 'Send message';
                btnIcon.style.display = sending ? 'none' : 'inline-block';
                btnSpinner.style.display = sending ? 'inline-block' : 'none';
            }
            setSending(true);

            // The EmailJS library is deferred; init lazily on first submit.
            if (typeof emailjs === 'undefined') {
                showToast('Still loading, please try again in a moment', 'error');
                setSending(false);
                return;
            }
            if (!emailjsReady) {
                emailjs.init({ publicKey: window.EMAILJS_PUBLIC_KEY });
                emailjsReady = true;
            }

            emailjs.send('service_m70ckgj', 'template_fwa4xtm', {
                from_name: document.getElementById('name').value.trim(),
                from_email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim(),
                to_email: 'adityaajaysingh0104@gmail.com'
            }).then(() => {
                showToast("Message sent. I'll get back to you soon.", 'success');
                contactForm.reset();
                inputs.forEach(input => input.classList.remove('invalid'));
            }).catch(() => {
                showToast('Failed to send. Please email me directly.', 'error');
            }).finally(() => setSending(false));
        });
    }

    // ===== GITHUB CONTRIBUTION CALENDAR =====
    (async function renderGithubCalendar() {
        const calEl = document.getElementById('gh-calendar');
        const countEl = document.getElementById('gh-contrib-count');
        if (!calEl) return;

        try {
            const thisYear = new Date().getFullYear();
            const [res1, res2] = await Promise.all([
                fetch('https://github-contributions-api.jogruber.de/v4/Adityasiig?y=' + (thisYear - 1)),
                fetch('https://github-contributions-api.jogruber.de/v4/Adityasiig?y=' + thisYear)
            ]);
            if (!res1.ok && !res2.ok) throw new Error('fetch failed');

            const [data1, data2] = await Promise.all([
                res1.ok ? res1.json() : Promise.resolve({ contributions: [] }),
                res2.ok ? res2.json() : Promise.resolve({ contributions: [] })
            ]);

            const dayMap = {};
            [...(data1.contributions || []), ...(data2.contributions || [])].forEach(d => {
                dayMap[d.date] = (dayMap[d.date] || 0) + d.count;
            });

            // Build 52+ weeks from the Sunday on or before one year ago.
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const start = new Date(today);
            start.setDate(start.getDate() - 364);
            start.setDate(start.getDate() - start.getDay());

            const weeks = [];
            let total = 0;
            const cursor = new Date(start);
            while (cursor <= today) {
                const week = [];
                for (let d = 0; d < 7; d++) {
                    const dateStr = cursor.toISOString().slice(0, 10);
                    const count = dayMap[dateStr] || 0;
                    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4;
                    if (cursor <= today) total += count;
                    week.push({ date: dateStr, count, level, future: cursor > today });
                    cursor.setDate(cursor.getDate() + 1);
                }
                weeks.push(week);
            }

            // Size cells so the grid fills the container width exactly.
            const DAY_COL = 32, BODY_GAP = 4, GAP = 3, H_PAD = 56;
            const numWeeks = weeks.length;
            const containerW = (calEl.closest('.github-graph-container') || calEl.parentElement).clientWidth;
            const usable = containerW - H_PAD - DAY_COL - BODY_GAP;
            const CELL = Math.max(10, Math.floor((usable - (numWeeks - 1) * GAP) / numWeeks));
            const STEP = CELL + GAP;
            const gridW = DAY_COL + BODY_GAP + numWeeks * STEP - GAP;

            const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthLabels = [];
            weeks.forEach((week, wi) => {
                week.forEach(({ date }) => {
                    if (new Date(date).getDate() === 1) {
                        monthLabels.push({ wi, label: MONTHS[new Date(date).getMonth()] });
                    }
                });
            });

            // The grid is decorative detail for AT; the running total is
            // announced via #gh-contrib-count instead of 365 colour cells.
            let html = '<div class="gh-cal-grid" role="img" aria-label="GitHub contribution graph for the last year" style="width:' + gridW + 'px">';
            html += '<div class="gh-cal-months" style="position:relative;height:18px;margin-left:' + (DAY_COL + BODY_GAP) + 'px;margin-bottom:6px;">';
            monthLabels.forEach(({ wi, label }) => {
                html += '<span style="position:absolute;left:' + (wi * STEP) + 'px">' + esc(label) + '</span>';
            });
            html += '</div>';

            const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
            html += '<div class="gh-cal-body" style="gap:' + BODY_GAP + 'px">';
            html += '<div class="gh-cal-days" style="width:' + DAY_COL + 'px">';
            DAY_LABELS.forEach(l => {
                html += '<span class="gh-cal-day-label" style="height:' + CELL + 'px;line-height:' + CELL + 'px;margin-bottom:' + GAP + 'px">' + l + '</span>';
            });
            html += '</div>';

            html += '<div class="gh-cal-weeks" style="gap:' + GAP + 'px">';
            weeks.forEach(week => {
                html += '<div class="gh-cal-week" style="gap:' + GAP + 'px">';
                week.forEach(({ date, count, level, future }) => {
                    const style = 'width:' + CELL + 'px;height:' + CELL + 'px';
                    if (future) {
                        html += '<span class="gh-cal-cell" data-level="0" style="' + style + ';visibility:hidden"></span>';
                    } else {
                        // Data comes from a third-party API; escape before
                        // interpolating into an attribute.
                        const tip = esc(count === 0
                            ? 'No contributions on ' + date
                            : count + ' contribution' + (count > 1 ? 's' : '') + ' on ' + date);
                        html += '<span class="gh-cal-cell" data-level="' + (Number(level) || 0) + '" title="' + tip + '" style="' + style + '"></span>';
                    }
                });
                html += '</div>';
            });
            html += '</div></div></div>';

            calEl.innerHTML = html;
            if (countEl) total && (countEl.textContent = total.toLocaleString() + ' contributions in the last year');
        } catch (err) {
            calEl.innerHTML = '<div class="gh-cal-error"><i class="fas fa-exclamation-circle" aria-hidden="true"></i> Could not load contributions</div>';
        }
    })();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
