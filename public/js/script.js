document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles.js
    try {
        // Make sure the particles container exists
        if (document.getElementById('particles-js')) {
            particlesJS.load('particles-js', 'public/js/particles-config.json', function() {
                console.log('particles.js loaded successfully');
            });
        } else {
            console.error('Particles container not found');
        }
    } catch (error) {
        console.error('Error loading particles.js:', error);
    }
    
    // Initialize typed.js
    const typed = new Typed('.typed-text', {
        strings: ['Developer', 'Coder', 'Tech Enthusiast', 'Problem Solver'],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
    });

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active navigation links on scroll
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').slice(1) === current) {
                li.classList.add('active');
            }
        });
    });

    // Form Submission (for demo purposes)
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For demo purposes, let's just log it and show an alert
            console.log('Form Submission:', { name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message! This is a demo form, so it does not actually send emails.');
            
            // Reset the form
            contactForm.reset();
        });
    }

    // Add skill progress animations with intersection observer
    const skillBars = document.querySelectorAll('.progress');
    const skillsSection = document.querySelector('.skills');
    
    if (skillsSection && skillBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                        }, 200);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(skillsSection);
    }

    // Add project card hover and 3D tilt effects
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt based on mouse position
            const tiltX = (y - centerY) / centerY * 3; // Subtle 3-degree max tilt
            const tiltY = (x - centerX) / centerX * -3; // Invert X axis for natural tilt
            
            // Apply 3D transform
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transform when mouse leaves
            card.style.transform = '';
            card.classList.remove('card-hover');
        });
        
        card.addEventListener('mouseenter', () => {
            card.classList.add('card-hover');
        });
    });
    
    // Add subtle animation to hero subheading
    const heroSubheading = document.querySelector('.hero-content h2');
    if (heroSubheading) {
        heroSubheading.classList.add('animate-fade-in');
    }
    
    // Animate section headers with staggered letter effect
    const sectionHeaders = document.querySelectorAll('.section-header h2');
    sectionHeaders.forEach(header => {
        // Remove the animation code - we just keep the original text
        // No letter-by-letter animation anymore
    });
    
    // Enhanced background particles effect
    function enhanceParticlesEffect() {
        try {
            if (particlesJS) {
                const config = {
                    particles: {
                        number: {
                            value: 60,
                            density: {
                                enable: true,
                                value_area: 1000
                            }
                        },
                        color: {
                            value: ["#6c5ce7", "#fd79a8", "#00cec9"]
                        },
                        shape: {
                            type: "circle",
                            stroke: {
                                width: 0,
                                color: "#000000"
                            }
                        },
                        opacity: {
                            value: 0.3,
                            random: true,
                            anim: {
                                enable: true,
                                speed: 0.8,
                                opacity_min: 0.1,
                                sync: false
                            }
                        },
                        size: {
                            value: 4,
                            random: true,
                            anim: {
                                enable: true,
                                speed: 1.5,
                                size_min: 0.1,
                                sync: false
                            }
                        },
                        line_linked: {
                            enable: true,
                            distance: 180,
                            color: "#6c5ce7",
                            opacity: 0.15,
                            width: 1
                        },
                        move: {
                            enable: true,
                            speed: 1.5,
                            direction: "none",
                            random: true,
                            straight: false,
                            out_mode: "out",
                            bounce: false,
                            attract: {
                                enable: true,
                                rotateX: 600,
                                rotateY: 1200
                            }
                        }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: {
                                enable: true,
                                mode: "grab"
                            },
                            onclick: {
                                enable: true,
                                mode: "push"
                            },
                            resize: true
                        },
                        modes: {
                            grab: {
                                distance: 200,
                                line_linked: {
                                    opacity: 0.4
                                }
                            },
                            push: {
                                particles_nb: 3
                            }
                        }
                    },
                    retina_detect: true
                };
                
                particlesJS('particles-js', config);
            }
        } catch (error) {
            console.error('Error enhancing particles:', error);
        }
    }
    
    enhanceParticlesEffect();
    
    // Animated count-up for skill percentages
    function animateSkillPercentages() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            const progress = item.querySelector('.progress');
            const width = progress.style.width;
            const percentage = parseInt(width);
            
            // Add percentage text
            const percentText = document.createElement('span');
            percentText.className = 'percent-text';
            percentText.textContent = '0%';
            percentText.style.position = 'absolute';
            percentText.style.right = '0';
            percentText.style.top = '-25px';
            percentText.style.fontSize = '0.9rem';
            percentText.style.fontWeight = '500';
            percentText.style.color = 'var(--primary-color)';
            
            const progressBar = item.querySelector('.progress-bar');
            progressBar.style.position = 'relative';
            progressBar.appendChild(percentText);
            
            // Animate percentage on intersection
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let count = 0;
                        const interval = setInterval(() => {
                            count += 1;
                            percentText.textContent = count + '%';
                            if (count >= percentage) {
                                clearInterval(interval);
                            }
                        }, 15);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(item);
        });
    }
    
    animateSkillPercentages();

    // Add parallax effect to certificates
    function addCertificateParallax() {
        // Remove the tilt animation functionality
        // This function is kept but emptied to avoid breaking any references to it
        console.log('Certificate parallax effect disabled');
    }
    
    addCertificateParallax();

    // Add parallax scrolling effect
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
    
    // Add scroll reveal animations with different directions
    const fromBottom = document.querySelectorAll('.section-header, .project-card, .certificate-card');
    const fromLeft = document.querySelectorAll('.about-img, .contact-info');
    const fromRight = document.querySelectorAll('.about-text, .contact-form');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Bottom animation
    const bottomObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-bottom');
                bottomObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Left animation
    const leftObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-left');
                leftObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Right animation
    const rightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-right');
                rightObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fromBottom.forEach(item => {
        item.classList.add('hidden-bottom');
        bottomObserver.observe(item);
    });
    
    fromLeft.forEach(item => {
        item.classList.add('hidden-left');
        leftObserver.observe(item);
    });
    
    fromRight.forEach(item => {
        item.classList.add('hidden-right');
        rightObserver.observe(item);
    });
    
    // Add floating animation to card icons
    const icons = document.querySelectorAll('.card-icon');
    icons.forEach(icon => {
        icon.classList.add('floating-icon');
    });
    
    // Add a scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.pageYOffset / scrollTotal) * 100;
        progressBar.style.width = scrollProgress + '%';
    });

    // Certificate Lightbox Functionality
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    // Create lightbox elements
    const createLightbox = () => {
        // Create lightbox container
        const lightbox = document.createElement('div');
        lightbox.className = 'certificate-lightbox';
        
        // Create lightbox content
        const lightboxContent = document.createElement('div');
        lightboxContent.className = 'lightbox-content';
        
        // Create image wrapper
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'lightbox-image-wrapper';
        lightboxContent.appendChild(imageWrapper);
        
        // Create image element
        const lightboxImage = document.createElement('img');
        lightboxImage.className = 'lightbox-image';
        imageWrapper.appendChild(lightboxImage);
        
        // Create loader
        const loader = document.createElement('div');
        loader.className = 'lightbox-loader';
        loader.innerHTML = '<div class="spinner"></div>';
        imageWrapper.appendChild(loader);
        
        // Create close button
        const closeButton = document.createElement('div');
        closeButton.className = 'lightbox-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        });
        lightboxContent.appendChild(closeButton);
        
        // Create caption
        const caption = document.createElement('div');
        caption.className = 'lightbox-caption';
        lightboxContent.appendChild(caption);
        
        // Add content to lightbox
        lightbox.appendChild(lightboxContent);
        
        // Add lightbox to body
        document.body.appendChild(lightbox);
        
        // Image load handler
        lightboxImage.addEventListener('load', () => {
            // Hide loader
            loader.style.display = 'none';
            // Show image
            lightboxImage.style.opacity = '1';
        });
        
        // Image error handler
        lightboxImage.addEventListener('error', () => {
            loader.style.display = 'none';
            lightboxImage.src = 'public/images/image-error.png'; // fallback image
            lightboxImage.style.opacity = '1';
        });
        
        // Close on click outside content
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
        
        // Function to close the lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 300);
        };
        
        return {
            lightbox,
            lightboxImage,
            caption,
            loader,
            closeLightbox
        };
    };
    
    // Initialize lightbox
    const { lightbox, lightboxImage, caption, loader, closeLightbox } = createLightbox();
    
    // Add click event to certificates to open in lightbox
    certificateCards.forEach(card => {
        card.addEventListener('click', () => {
            // Find the image inside the card
            const img = card.querySelector('.certificate-image-container img');
            const title = card.querySelector('.overlay h3').textContent;
            const categoryElement = card.querySelector('.cert-category');
            const category = categoryElement ? categoryElement.textContent : '';
            
            // Show loader
            loader.style.display = 'flex';
            lightboxImage.style.opacity = '0';
            
            // Set image source and caption
            lightboxImage.src = img.src;
            caption.textContent = category ? `${title} - ${category}` : title;
            
            // Disable page scrolling
            document.body.style.overflow = 'hidden';
            
            // Show lightbox
            lightbox.classList.add('active');
        });
    });
    
    // Handle orientation change and resize
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (lightbox.classList.contains('active')) {
                // Add any specific adjustments needed on orientation change
            }
        }, 300);
    });

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Function to set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
        
        // Add animation class to body to smooth transition
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 1000);
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Default to dark theme if no preference is saved
        setTheme('dark');
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        // Show visual feedback
        themeToggle.classList.add('clicked');
        setTimeout(() => {
            themeToggle.classList.remove('clicked');
        }, 300);
    });
    
    // Ensure the toggle is accessible via keyboard
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggle.click();
        }
    });

    // Update theme icon
    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Add click event for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Show/hide scroll indicator based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
    
    // Enhanced smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll with custom timing function
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Highlight the section with a subtle animation
                setTimeout(() => {
                    targetElement.classList.add('section-highlight');
                    setTimeout(() => {
                        targetElement.classList.remove('section-highlight');
                    }, 1500);
                }, 800);
            }
        });
    });

    // Add subtle parallax effect to sections
    function addParallaxEffect() {
        const sections = document.querySelectorAll('section');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                // Only apply effect when section is in viewport
                if (scrollY > sectionTop - window.innerHeight && scrollY < sectionTop + sectionHeight) {
                    const yPos = (scrollY - sectionTop) * 0.1; // Subtle movement
                    section.style.backgroundPositionY = yPos + 'px';
                }
            });
        });
    }

    addParallaxEffect();
});

