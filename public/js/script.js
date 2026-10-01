/* ============================================
   ADITYA SINGH - PORTFOLIO
   Interactive JavaScript
   ============================================ */

// The tag is deferred, so the DOM is already parsed; still guard in case the
// script is ever loaded without defer.
function initPortfolio() {

    // ===== LOADING SCREEN =====
    const loader = document.getElementById('loader');

    function dismissLoader() {
        if (!loader || loader.classList.contains('loaded')) return;
        loader.classList.add('loaded');
        document.body.style.overflow = 'auto';
        animateHeroElements();
    }

    // Dismiss as soon as the DOM is ready — no artificial delay.
    dismissLoader();

    // Failsafe: if anything above threw before this point, still reveal on load.
    window.addEventListener('load', dismissLoader);

    // Respect the user's motion preference across every effect below.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== TYPED.JS =====
    const typedElement = document.getElementById('typed-text');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: [
                'vulnerability scanners.',
                'web applications.',
                'Python automation.',
                'things that break on purpose.'
            ],
            typeSpeed: 55,
            backSpeed: 30,
            backDelay: 2200,
            loop: true,
            smartBackspace: true,
            cursorChar: '|'
        });
    }

    // ===== NAVIGATION =====
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger toggle
    if (hamburger && mobileMenu) {
        function setMenu(open) {
            hamburger.classList.toggle('active', open);
            mobileMenu.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', String(open));
            hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            document.body.style.overflow = open ? 'hidden' : 'auto';
        }

        hamburger.addEventListener('click', () => {
            setMenu(!mobileMenu.classList.contains('active'));
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                setMenu(false);
                hamburger.focus();
            }
        });
    }

    // Active nav link — IntersectionObserver instead of measuring every section
    // on every scroll tick (that forced a synchronous layout per section).
    const sections = document.querySelectorAll('section[id]');

    function setActiveNav(id) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
    }

    const navObserver = new IntersectionObserver((entries) => {
        // Pick the entry nearest the top of the viewport that is currently visible.
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) {
            visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            setActiveNav(visible[0].target.id);
        }
    }, { rootMargin: '-200px 0px -60% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== UNIFIED SCROLL HANDLER =====
    // One passive listener, rAF-coalesced: all reads happen up front, all writes
    // after, so a scroll tick never interleaves layout reads with style writes.
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTargets = {};
    let scrollTicking = false;

    function onScrollFrame() {
        scrollTicking = false;
        const scrollTop = window.scrollY;
        const viewportH = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - viewportH;

        header.classList.toggle('scrolled', scrollTop > 50);

        if (scrollProgress) {
            scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        }

        if (scrollTargets.backToTop) {
            scrollTargets.backToTop.classList.toggle('visible', scrollTop > 400);
        }

        if (scrollTargets.heroContent && scrollTop < viewportH) {
            scrollTargets.heroContent.style.transform = `translateY(${scrollTop * 0.2}px)`;
            scrollTargets.heroContent.style.opacity = 1 - (scrollTop / (viewportH * 0.8));
        }
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(onScrollFrame);
        }
    }, { passive: true });

    // Theme switching was removed — the site is dark-only. Clear the stale
    // preference so returning visitors do not keep a dead key around.
    try { localStorage.removeItem('theme'); } catch (e) { /* private mode */ }

    // ===== SCROLL ANIMATIONS =====
    function animateHeroElements() {
        const heroAnimated = document.querySelectorAll('.hero [data-animate]');
        heroAnimated.forEach((el) => {
            const delay = parseInt(el.getAttribute('data-delay') || 0);
            setTimeout(() => {
                el.classList.add('animated');
            }, delay + 100);
        });
    }

    // Intersection Observer for scroll animations
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay') || 0);
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                animateObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observe all non-hero animated elements
    document.querySelectorAll('[data-animate]:not(.hero [data-animate])').forEach(el => {
        animateObserver.observe(el);
    });

    // ===== SKILL BAR ANIMATIONS =====
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate pill fills
                const fills = entry.target.querySelectorAll('.pill-fill');
                fills.forEach((fill, i) => {
                    setTimeout(() => {
                        fill.classList.add('animated');
                    }, i * 150);
                });

                // Animate ring fills
                const rings = entry.target.querySelectorAll('.ring-fill');
                rings.forEach((ring, i) => {
                    const dasharray = ring.getAttribute('stroke-dasharray');
                    const percent = dasharray ? dasharray.split(',')[0].trim() : '0';
                    ring.style.setProperty('--dash', percent);
                    setTimeout(() => {
                        ring.classList.add('animated');
                    }, i * 200);
                });

                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    // ===== STAT COUNTER ANIMATION =====
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    let current = 0;
                    const step = Math.ceil(target / 30);
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(interval);
                        }
                        counter.textContent = current;
                    }, 40);
                });
                statObserver.unobserve(entry.target);
            }
        });
        // Observe the stat row itself, not the whole About section. The
        // section is taller than the viewport, so a 0.5 threshold on it
        // could never be met and the counters stayed at 0.
    }, { threshold: 0.3 });

    const statTarget = document.querySelector('.about-stats-row')
        || document.getElementById('about');
    if (statTarget) {
        statObserver.observe(statTarget);
    }

    // ===== CERTIFICATE LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const certCards = document.querySelectorAll('.tl-card');

    let lastFocusedCard = null;

    function openLightbox(card) {
        const img = card.querySelector('.tl-thumb img');
        const title = card.querySelector('.tl-title');
        const category = card.querySelector('.tl-category');
        if (!lightbox || !img) return;

        // Cards render a small thumb; data-img holds the full-size version.
        lightboxImg.src = card.dataset.img || img.src;
        lightboxImg.alt = img.alt || 'Certificate';
        lightboxImg.hidden = false;
        lightboxCaption.textContent = (category ? category.textContent.trim() + ' — ' : '') + (title ? title.textContent : '');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        lastFocusedCard = card;
        // .lightbox transitions visibility, and an element is not focusable
        // until that completes — so wait for the transition, with a timeout
        // fallback in case it never fires.
        if (lightboxClose) {
            const focusClose = () => lightboxClose.focus();
            lightbox.addEventListener('transitionend', focusClose, { once: true });
            setTimeout(focusClose, 350);
        }
    }

    certCards.forEach(card => {
        card.addEventListener('click', () => openLightbox(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(card);
            }
        });
    });

    function closeLightbox() {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (lastFocusedCard) {
            lastFocusedCard.focus();
            lastFocusedCard = null;
        }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        // Trap Tab inside the dialog while it is open.
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && lightboxClose) {
                e.preventDefault();
                lightboxClose.focus();
            }
        });
    }
    document.addEventListener('keydown', (e) => {
        // Only acts when the lightbox is open — closeLightbox() guards itself.
        if (e.key === 'Escape') closeLightbox();
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    let emailjsReady = false;

    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');

        function validateInput(input) {
            let isValid = true;
            let errorMsg = '';

            if (input.required && !input.value.trim()) {
                isValid = false;
                errorMsg = 'This field is required';
            } else if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    errorMsg = 'Please enter a valid email';
                }
            } else if (input.id === 'name' && input.value && input.value.length < 2) {
                isValid = false;
                errorMsg = 'Name must be at least 2 characters';
            } else if (input.id === 'message' && input.value && input.value.length < 10) {
                isValid = false;
                errorMsg = 'Message must be at least 10 characters';
            }

            const formGroup = input.closest('.form-group');
            let errorEl = formGroup.querySelector('.form-error');

            if (!isValid) {
                input.classList.remove('valid');
                input.classList.add('invalid');
                if (!errorEl) {
                    errorEl = document.createElement('span');
                    errorEl.className = 'form-error';
                    errorEl.id = input.id + '-error';
                    // role=alert so the message is announced as it appears.
                    errorEl.setAttribute('role', 'alert');
                    formGroup.appendChild(errorEl);
                }
                errorEl.textContent = errorMsg;
                input.setAttribute('aria-invalid', 'true');
                input.setAttribute('aria-describedby', errorEl.id);
            } else {
                input.classList.remove('invalid');
                if (input.value.trim()) input.classList.add('valid');
                if (errorEl) errorEl.remove();
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
            }

            return isValid;
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
            inputs.forEach(input => {
                if (!validateInput(input)) formValid = false;
            });

            if (!formValid) {
                showToast('Please fix the errors above', 'error');
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');

            // Loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.style.display = 'none';
            btnSpinner.style.display = 'inline-block';

            const templateParams = {
                from_name: document.getElementById('name').value.trim(),
                from_email: document.getElementById('email').value.trim(),
                subject:    document.getElementById('subject').value.trim(),
                message:    document.getElementById('message').value.trim(),
                to_email:   'adityaajaysingh0104@gmail.com'
            };

            // The EmailJS library is deferred, so init lazily on first submit.
            if (typeof emailjs === 'undefined') {
                showToast('Still loading — please try again in a moment.', 'error');
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                btnIcon.style.display = 'inline-block';
                btnSpinner.style.display = 'none';
                return;
            }
            if (!emailjsReady) {
                emailjs.init({ publicKey: window.EMAILJS_PUBLIC_KEY });
                emailjsReady = true;
            }

            emailjs.send('service_m70ckgj', 'template_fwa4xtm', templateParams)
                .then(() => {
                    showToast('Message sent! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    inputs.forEach(input => input.classList.remove('invalid', 'valid'));
                })
                .catch(() => {
                    showToast('Failed to send. Please email me directly.', 'error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    btnText.textContent = 'Send Message';
                    btnIcon.style.display = 'inline-block';
                    btnSpinner.style.display = 'none';
                });
        });
    }

    // ===== TOAST NOTIFICATION =====
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const existing = container.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        toast.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i> ${esc(message)}`;
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        scrollTargets.backToTop = backToTop;

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== PARALLAX ON HERO =====
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent && window.innerWidth > 768 && !reduceMotion) {
        scrollTargets.heroContent = heroContent;
    }

    // ===== TILT + MAGNETIC HOVER =====
    // Rect is cached on mouseenter rather than read on every mousemove, so the
    // pointer path no longer interleaves layout reads with transform writes.
    if (window.innerWidth > 768 && !reduceMotion) {
        const tiltCards = document.querySelectorAll('.project-card, .bento-card, .tl-card');
        tiltCards.forEach(card => {
            let rect = null;
            card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
            card.addEventListener('mousemove', (e) => {
                if (!rect) return;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((e.clientY - rect.top - centerY) / centerY) * 5;
                const rotateY = ((centerX - (e.clientX - rect.left)) / centerX) * 5;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => {
                rect = null;
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
            });
        });

        document.querySelectorAll('.btn').forEach(btn => {
            let rect = null;
            btn.addEventListener('mouseenter', () => { rect = btn.getBoundingClientRect(); });
            btn.addEventListener('mousemove', (e) => {
                if (!rect) return;
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                rect = null;
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ===== DYNAMIC GREETING =====
    const heroTitle = document.querySelector('.hero-title .line:first-child');
    if (heroTitle) {
        const hour = new Date().getHours();
        let greeting;
        if (hour < 12) greeting = 'Good Morning, I\'m';
        else if (hour < 17) greeting = 'Good Afternoon, I\'m';
        else greeting = 'Good Evening, I\'m';
        heroTitle.textContent = greeting;
    }

    // ===== GITHUB CONTRIBUTION CALENDAR (Custom) =====
    // Escape text destined for an HTML attribute / text node.
    const esc = (v) => String(v).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));

    (async function renderGithubCalendar() {
        const calEl = document.getElementById('gh-calendar');
        const countEl = document.getElementById('gh-contrib-count');
        if (!calEl) return;

        try {
            // Fetch both current and previous year to cover rolling 12 months
            const thisYear = new Date().getFullYear();
            const [res1, res2] = await Promise.all([
                fetch(`https://github-contributions-api.jogruber.de/v4/Adityasiig?y=${thisYear - 1}`),
                fetch(`https://github-contributions-api.jogruber.de/v4/Adityasiig?y=${thisYear}`)
            ]);
            if (!res1.ok && !res2.ok) throw new Error('fetch failed');

            const [data1, data2] = await Promise.all([
                res1.ok ? res1.json() : Promise.resolve({ contributions: [] }),
                res2.ok ? res2.json() : Promise.resolve({ contributions: [] })
            ]);

            // Build a map: date -> count (merged from both years)
            const dayMap = {};
            [...(data1.contributions || []), ...(data2.contributions || [])].forEach(d => {
                dayMap[d.date] = (dayMap[d.date] || 0) + d.count;
            });

            // Build 52+partial weeks starting from today going back ~1 year
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            // Find the Sunday on or before (today - 364 days)
            const start = new Date(today);
            start.setDate(start.getDate() - 364);
            start.setDate(start.getDate() - start.getDay()); // back to Sunday

            const weeks = [];
            let total = 0;
            let cursor = new Date(start);
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

            // Dynamic cell size — fill the container width exactly
            const DAY_COL = 32;   // day-label column width
            const BODY_GAP = 4;   // gap between day-col and weeks
            const numWeeks = weeks.length;
            const containerW = (calEl.closest('.github-graph-container') || calEl.parentElement).clientWidth;
            const hPad = 56;      // 28px padding × 2 from .github-graph-container
            const usable = containerW - hPad - DAY_COL - BODY_GAP;
            const GAP = 3;        // gap between cells / weeks
            const CELL = Math.max(10, Math.floor((usable - (numWeeks - 1) * GAP) / numWeeks));
            const STEP = CELL + GAP;
            const gridW = DAY_COL + BODY_GAP + numWeeks * STEP - GAP;

            // Month labels — absolutely positioned to stay aligned with cells
            const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const monthLabels = [];
            weeks.forEach((week, wi) => {
                week.forEach(({ date }) => {
                    if (new Date(date).getDate() === 1) {
                        monthLabels.push({ wi, label: MONTHS[new Date(date).getMonth()] });
                    }
                });
            });

            // Render. The grid is decorative detail for AT — the running total
            // is announced via #gh-contrib-count instead of 365 colour-only cells.
            let html = `<div class="gh-cal-grid" role="img" aria-label="GitHub contribution graph for the last year" style="width:${gridW}px">`;

            // Month labels row — absolutely positioned relative to cells area
            html += `<div class="gh-cal-months" style="position:relative;height:20px;margin-left:${DAY_COL + BODY_GAP}px;margin-bottom:6px;">`;
            monthLabels.forEach(({ wi, label }) => {
                html += `<span class="gh-cal-month-label" style="position:absolute;left:${wi * STEP}px">${esc(label)}</span>`;
            });
            html += '</div>';

            // Day labels + cell grid
            const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
            html += `<div class="gh-cal-body" style="gap:${BODY_GAP}px">`;
            html += `<div class="gh-cal-days" style="width:${DAY_COL}px">`;
            DAY_LABELS.forEach(l => html += `<span class="gh-cal-day-label" style="height:${CELL}px;line-height:${CELL}px">${l}</span>`);
            html += '</div>';

            html += `<div class="gh-cal-weeks" style="gap:${GAP}px">`;
            weeks.forEach(week => {
                html += `<div class="gh-cal-week" style="gap:${GAP}px">`;
                week.forEach(({ date, count, level, future }) => {
                    const style = `width:${CELL}px;height:${CELL}px`;
                    if (future) {
                        html += `<span class="gh-cal-cell" data-level="0" style="${style}"></span>`;
                    } else {
                        // date/count come from a third-party API — escape before
                        // interpolating into an attribute.
                        const tip = esc(count === 0
                            ? `No contributions on ${date}`
                            : `${count} contribution${count > 1 ? 's' : ''} on ${date}`);
                        html += `<span class="gh-cal-cell" data-level="${Number(level) || 0}" title="${tip}" style="${style}"></span>`;
                    }
                });
                html += '</div>';
            });
            html += '</div>'; // weeks
            html += '</div>'; // body
            html += '</div>'; // grid

            calEl.innerHTML = html;

            if (countEl) {
                countEl.textContent = `${total.toLocaleString()} contributions in the last year`;
            }
        } catch (e) {
            calEl.innerHTML = '<div class="gh-cal-error"><i class="fas fa-exclamation-circle"></i> Could not load contributions</div>';
            if (countEl) countEl.textContent = 'Contributions in the last year';
        }
    })();

    // ===== CONSOLE BRANDING =====
    console.log('%c Aditya Singh - Portfolio', 'color: #d4813f; font-size: 20px; font-weight: bold; font-family: sans-serif;');
    console.log('%c Built with passion and clean code', 'color: #b3a89c; font-size: 12px; font-family: sans-serif;');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
