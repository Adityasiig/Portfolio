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

    // ===== IN-PAGE LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 24;
            window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    });

    // ===== RAIL SCROLL SPY =====
    // The rail dots light for whichever section owns the viewport.
    const railLinks = Array.from(document.querySelectorAll('.rn'));
    if (railLinks.length) {
        const byId = new Map(railLinks.map(a => [a.getAttribute('href').slice(1), a]));
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const link = byId.get(entry.target.id);
                if (link) link.classList.toggle('on', entry.isIntersecting);
            });
        }, { rootMargin: '-45% 0px -45% 0px' });
        byId.forEach((_, id) => {
            const section = document.getElementById(id);
            if (section) spy.observe(section);
        });
    }

    // ===== THEME TOGGLE =====
    // The head script already resolved the theme; this only flips it.
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        const root = document.documentElement;
        const meta = document.querySelector('meta[name="theme-color"]');

        // The project previews are baked images, so each theme gets its
        // own render rather than a filter that would muddy the UI inside.
        const shots = document.querySelectorAll('img[data-shot]');
        const paintShots = (dark) => {
            shots.forEach(img => {
                img.src = img.dataset.shot + (dark ? '' : '-light') + '.webp';
            });
        };

        const sync = (dark) => {
            themeBtn.setAttribute('aria-checked', String(dark));
            themeBtn.setAttribute('aria-label', dark ? 'Dark mode' : 'Light mode');
            if (meta) meta.setAttribute('content', dark ? '#000000' : '#f4f3f1');
            paintShots(dark);
        };
        sync(root.getAttribute('data-theme') !== 'light');

        themeBtn.addEventListener('click', () => {
            const goingLight = root.getAttribute('data-theme') !== 'light';
            // Crossfade only for the duration of the swap.
            root.classList.add('theming');
            if (goingLight) root.setAttribute('data-theme', 'light');
            else root.removeAttribute('data-theme');
            sync(!goingLight);
            try { localStorage.setItem('theme', goingLight ? 'light' : 'dark'); } catch (e) { /* ignore */ }
            // The matrix caches its ink, so tell it the palette moved.
            if (window.refreshMatrixInk) window.refreshMatrixInk();
            setTimeout(() => root.classList.remove('theming'), 500);
        });
    }

    // ===== CIRCULAR DISPLAYS =====
    // Four different instruments, not one grid reused. Each canvas names
    // its renderer with data-display; they share only the frame loop,
    // the ink colour and the on-screen gate.
    const displays = document.querySelectorAll('.disc');
    if (displays.length && !reduceMotion) {

        const TAU = Math.PI * 2;

        // --- Renderers. Each gets (ctx, t, S) where S is the box size. ---
        const RENDERERS = {

            // RADAR: a sweeping arm over polar rings, with blips that
            // light as the arm passes and fade behind it.
            radar(ctx, t, S) {
                const c = S / 2, R = c * 0.86;
                const sweep = (t * 0.9) % TAU;

                ctx.strokeStyle = ink;
                ctx.globalAlpha = 0.16;
                ctx.lineWidth = 1;
                for (let i = 1; i <= 3; i++) {
                    ctx.beginPath();
                    ctx.arc(c, c, R * i / 3, 0, TAU);
                    ctx.stroke();
                }
                // Cross hairs.
                ctx.beginPath();
                ctx.moveTo(c - R, c); ctx.lineTo(c + R, c);
                ctx.moveTo(c, c - R); ctx.lineTo(c, c + R);
                ctx.stroke();

                // The trailing wedge, drawn as fading spokes behind the arm.
                for (let i = 1; i <= 14; i++) {
                    const ang = sweep - i * 0.045;
                    ctx.globalAlpha = 0.3 * (1 - i / 14);
                    ctx.strokeStyle = ink;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(c, c);
                    ctx.lineTo(c + Math.cos(ang) * R, c + Math.sin(ang) * R);
                    ctx.stroke();
                }
                // The arm itself.
                ctx.globalAlpha = 0.9;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(c, c);
                ctx.lineTo(c + Math.cos(sweep) * R, c + Math.sin(sweep) * R);
                ctx.stroke();

                // Blips at fixed bearings; brightness follows the arm.
                const blips = [[0.7, 1.1], [0.45, 3.0], [0.85, 4.4], [0.3, 5.6]];
                blips.forEach(([rad, ang]) => {
                    let d = (sweep - ang + TAU) % TAU;
                    const v = Math.max(0, 1 - d / 1.5);
                    ctx.globalAlpha = 0.12 + v * 0.88;
                    ctx.fillStyle = ink;
                    ctx.beginPath();
                    ctx.arc(c + Math.cos(ang) * R * rad, c + Math.sin(ang) * R * rad,
                            2.6 + v * 1.6, 0, TAU);
                    ctx.fill();
                });
            },

            // EQUALISER: bars radiating from the centre, each its own
            // oscillator, like a circular level meter.
            equaliser(ctx, t, S) {
                const c = S / 2, inner = c * 0.3, max = c * 0.82;
                const N = 48;
                ctx.lineCap = 'round';
                for (let i = 0; i < N; i++) {
                    const ang = i / N * TAU;
                    const osc = Math.sin(t * 2.4 + i * 0.5)
                              * Math.sin(t * 0.7 + i * 0.13);
                    const len = inner + (max - inner) * (0.25 + Math.abs(osc) * 0.75);
                    ctx.globalAlpha = 0.25 + Math.abs(osc) * 0.7;
                    ctx.strokeStyle = ink;
                    ctx.lineWidth = 2.4;
                    ctx.beginPath();
                    ctx.moveTo(c + Math.cos(ang) * inner, c + Math.sin(ang) * inner);
                    ctx.lineTo(c + Math.cos(ang) * len, c + Math.sin(ang) * len);
                    ctx.stroke();
                }
                ctx.globalAlpha = 0.5;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(c, c, inner - 5, 0, TAU);
                ctx.stroke();
            },

            // ORBIT: concentric rings of beads turning at different
            // speeds and directions, a planetary readout.
            orbit(ctx, t, S) {
                const c = S / 2;
                const rings = [
                    { r: 0.30, n: 6,  sp:  0.55, d: 3.2 },
                    { r: 0.52, n: 10, sp: -0.38, d: 2.8 },
                    { r: 0.74, n: 16, sp:  0.24, d: 2.4 }
                ];
                rings.forEach(({ r, n, sp, d }) => {
                    const R = c * 0.88 * r;
                    ctx.globalAlpha = 0.14;
                    ctx.strokeStyle = ink;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(c, c, R, 0, TAU);
                    ctx.stroke();

                    for (let i = 0; i < n; i++) {
                        const ang = i / n * TAU + t * sp;
                        // Beads brighten as they cross the top of the dial.
                        const lift = (Math.cos(ang + Math.PI / 2) + 1) / 2;
                        ctx.globalAlpha = 0.25 + lift * 0.75;
                        ctx.fillStyle = ink;
                        ctx.beginPath();
                        ctx.arc(c + Math.cos(ang) * R, c + Math.sin(ang) * R, d, 0, TAU);
                        ctx.fill();
                    }
                });
            },

            // WAVEFORM: a closed loop deformed by layered sine waves,
            // breathing like an audio ring.
            waveform(ctx, t, S) {
                const c = S / 2, base = c * 0.50;
                const draw = (amp, speed, lobes, alpha, width) => {
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = ink;
                    ctx.lineWidth = width;
                    ctx.beginPath();
                    for (let i = 0; i <= 180; i++) {
                        const ang = i / 180 * TAU;
                        const r = base
                            + Math.sin(ang * lobes + t * speed) * amp
                            + Math.sin(ang * (lobes * 2) - t * speed * 0.6) * amp * 0.4;
                        const x = c + Math.cos(ang) * r;
                        const y = c + Math.sin(ang) * r;
                        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                };
                draw(c * 0.13, 1.8, 3, 0.85, 2);
                draw(c * 0.09, -1.2, 5, 0.4, 1.5);
                draw(c * 0.06, 2.6, 7, 0.22, 1);
            }
        };

        // The ink colour only changes on a theme swap, so read it once
        // and expose a refresh hook rather than querying every frame.
        let ink = '#ffffff';
        const readInk = () => {
            ink = getComputedStyle(document.documentElement)
                .getPropertyValue('--white').trim() || '#ffffff';
        };
        readInk();
        window.refreshMatrixInk = readInk;

        displays.forEach(canvas => {
            const render = RENDERERS[canvas.dataset.display];
            if (!render) return;

            const ctx = canvas.getContext('2d');
            const SIZE = 300;
            const DPR = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = SIZE * DPR;
            canvas.height = SIZE * DPR;
            ctx.scale(DPR, DPR);

            // Stagger instances so they are not all in lockstep.
            const offset = Number(canvas.dataset.offset || 0) / 1000;
            let raf = 0;

            const draw = (now) => {
                const t = now / 1000 + offset;
                ctx.clearRect(0, 0, SIZE, SIZE);
                render(ctx, t, SIZE);
                ctx.globalAlpha = 1;
                raf = requestAnimationFrame(draw);
            };

            // The observer is the only gate: a display:none canvas (mobile)
            // never intersects, so the loop never starts there.
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !raf) raf = requestAnimationFrame(draw);
                    else if (!entry.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
                });
            }, { threshold: 0 });
            io.observe(canvas);
        });
    }

    // ===== SCROLL REVEALS =====
    // Everything marked [data-rise] fades up once, when it first enters.
    // Children of a [data-stagger] group inherit an increasing delay so a
    // grid resolves cell by cell instead of all at once.
    const risers = document.querySelectorAll('[data-rise]');
    if (risers.length) {
        if (reduceMotion) {
            risers.forEach(el => el.classList.add('is-in'));
        } else {
            document.querySelectorAll('[data-stagger]').forEach(group => {
                Array.from(group.children).forEach((child, i) => {
                    child.style.setProperty('--d', (i * 60) + 'ms');
                });
            });
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-in');
                    obs.unobserve(entry.target);
                });
            }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
            risers.forEach(el => io.observe(el));
        }
    }

    // ===== COUNTER ROLL =====
    // Readout numbers count up to their final value on first view.
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && reduceMotion) {
        // No roll: show the real figure straight away.
        counters.forEach(el => el.textContent = el.dataset.count);
    } else if (counters.length) {
        const roll = (el) => {
            const target = parseInt(el.dataset.count, 10);
            if (!Number.isFinite(target)) return;
            const pad = el.dataset.count.length;
            const start = performance.now();
            const dur = 900;
            const step = (now) => {
                const t = Math.min((now - start) / dur, 1);
                // Ease out so it settles rather than stopping dead.
                const v = Math.round(target * (1 - Math.pow(1 - t, 3)));
                el.textContent = String(v).padStart(pad, '0');
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };
        const cio = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                roll(entry.target);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.5 });
        // The markup carries the real figure so it survives a JS failure;
        // zero it here, where the roll is guaranteed to run.
        counters.forEach(el => {
            el.textContent = '0'.repeat(el.dataset.count.length);
            cio.observe(el);
        });
    }

    // ===== RAIL CLOCK =====
    // India time, rendered in the rail like device chrome.
    const clock = document.getElementById('clock');
    if (clock) {
        const paint = () => {
            clock.textContent = new Date().toLocaleTimeString('en-GB', {
                timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit'
            });
        };
        paint();
        setInterval(paint, 20000);
    }

    // ===== FILE ROW PRESS =====
    // Certificate rows behave like list items on a device: a brief press
    // state before the viewer opens.
    document.querySelectorAll('.file').forEach(row => {
        row.addEventListener('pointerdown', () => row.style.opacity = '0.6');
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => {
            row.addEventListener(ev, () => row.style.opacity = '');
        });
    });


    // ===== CERTIFICATE LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    let lastFocusedCard = null;

    function openLightbox(card) {
        // Rows carry only a data-img path; the full image is fetched on open
        // so nine certificates never load up front.
        const title = card.querySelector('.f-name');
        const src = card.dataset.img;
        if (!lightbox || !src) return;
        lightboxImg.src = src;
        lightboxImg.alt = title ? title.textContent + ' certificate' : 'Certificate';
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

    document.querySelectorAll('.file').forEach(card => {
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
            weeks.forEach((week, wi) => {
                html += '<div class="gh-cal-week" style="gap:' + GAP + 'px">';
                // Each column starts slightly later so the graph fills
                // left to right instead of appearing all at once.
                const delay = Math.min(wi * 9, 500);
                week.forEach(({ date, count, level, future }) => {
                    const style = 'width:' + CELL + 'px;height:' + CELL
                        + 'px;animation-delay:' + delay + 'ms';
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
