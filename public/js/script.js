/* ============================================
   ADITYA SINGH - PORTFOLIO
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== LOADING SCREEN =====
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            animateHeroElements();
        }, 1200);
    });

    // Failsafe: hide loader after 3s regardless
    setTimeout(() => {
        if (loader && !loader.classList.contains('loaded')) {
            loader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            animateHeroElements();
        }
    }, 3000);

    // ===== CUSTOM CURSOR =====
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline && window.innerWidth > 768) {
        let cursorX = 0, cursorY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top = cursorY + 'px';
        });

        function animateCursor() {
            outlineX += (cursorX - outlineX) * 0.15;
            outlineY += (cursorY - outlineY) * 0.15;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .tl-card, .project-card, .bento-card, .detail-card, .contact-card, .skill-tag, input, textarea');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ===== TYPED.JS =====
    const typedElement = document.getElementById('typed-text');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: [
                'Web Developer',
                'Security Researcher',
                'Python Developer',
                'Ethical Hacker',
                'Full-Stack Builder',
                'Open Source Contributor'
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
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

    // Scroll effect on header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Hamburger toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

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

    // ===== SCROLL PROGRESS =====
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = percent + '%';
        }
    });

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

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
    }, { threshold: 0.5 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        statObserver.observe(aboutSection);
    }

    // ===== CERTIFICATE LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const certCards = document.querySelectorAll('.tl-card');

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.tl-thumb img');
            const title = card.querySelector('.tl-title');
            const category = card.querySelector('.tl-category');

            if (lightbox && img) {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = (category ? category.textContent.trim() + ' — ' : '') + (title ? title.textContent : '');
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');

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
                    formGroup.appendChild(errorEl);
                }
                errorEl.textContent = errorMsg;
            } else {
                input.classList.remove('invalid');
                if (input.value.trim()) input.classList.add('valid');
                if (errorEl) errorEl.remove();
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

            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with values from emailjs.com
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
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
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
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== PARALLAX ON HERO =====
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            }
        });
    }

    // ===== TILT EFFECT ON CARDS =====
    if (window.innerWidth > 768) {
        const tiltCards = document.querySelectorAll('.project-card, .bento-card, .tl-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * 5;
                const rotateY = ((centerX - x) / centerX) * 5;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ===== MAGNETIC BUTTONS =====
    if (window.innerWidth > 768) {
        const magneticBtns = document.querySelectorAll('.btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
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

            // Render
            let html = `<div class="gh-cal-grid" style="width:${gridW}px">`;

            // Month labels row — absolutely positioned relative to cells area
            html += `<div class="gh-cal-months" style="position:relative;height:20px;margin-left:${DAY_COL + BODY_GAP}px;margin-bottom:6px;">`;
            monthLabels.forEach(({ wi, label }) => {
                html += `<span class="gh-cal-month-label" style="position:absolute;left:${wi * STEP}px">${label}</span>`;
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
                        const tip = count === 0
                            ? `No contributions on ${date}`
                            : `${count} contribution${count > 1 ? 's' : ''} on ${date}`;
                        html += `<span class="gh-cal-cell" data-level="${level}" title="${tip}" style="${style}"></span>`;
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
    console.log('%c Aditya Singh - Portfolio', 'color: #6c5ce7; font-size: 20px; font-weight: bold; font-family: sans-serif;');
    console.log('%c Built with passion and clean code', 'color: #00cec9; font-size: 12px; font-family: sans-serif;');
});
