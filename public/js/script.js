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

    // Animate skill bars when they come into view
    const skillsSection = document.querySelector('.skills');
    const progressBars = document.querySelectorAll('.progress');

    let hasAnimated = false;

    window.addEventListener('scroll', () => {
        const sectionPosition = skillsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (sectionPosition < screenPosition && !hasAnimated) {
            hasAnimated = true;
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }
    });

    // Function to create floating shapes animation
    function createShapeAnimation() {
        // Find particles-js div and remove it
        const particlesElement = document.getElementById('particles-js');
        if (particlesElement) {
            particlesElement.remove();
        }
        
        // Create the shape animation container
        const shapeAnimationContainer = document.createElement('div');
        shapeAnimationContainer.className = 'shape-animation';
        
        // Create the 5 main shapes
        for (let i = 1; i <= 5; i++) {
            const shape = document.createElement('div');
            shape.className = `shape shape-${i}`;
            shapeAnimationContainer.appendChild(shape);
        }
        
        // Add more random smaller shapes for enhanced effect
        for (let i = 1; i <= 10; i++) {
            const randomShape = document.createElement('div');
            randomShape.className = 'shape';
            randomShape.style.width = Math.floor(Math.random() * 80 + 40) + 'px';
            randomShape.style.height = randomShape.style.width;
            randomShape.style.opacity = (Math.random() * 0.2 + 0.2).toString();
            randomShape.style.background = `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
            randomShape.style.top = Math.floor(Math.random() * 90 + 5) + '%';
            randomShape.style.left = Math.floor(Math.random() * 90 + 5) + '%';
            randomShape.style.animationDuration = Math.floor(Math.random() * 20 + 10) + 's';
            randomShape.style.animationDirection = Math.random() > 0.5 ? 'normal' : 'reverse';
            shapeAnimationContainer.appendChild(randomShape);
        }
        
        // Add the container to the body
        document.body.appendChild(shapeAnimationContainer);
        
        // Also create the wave animation
        createWaveAnimation();
    }

    // Function to create wave animation
    function createWaveAnimation() {
        const waveContainer = document.createElement('div');
        waveContainer.className = 'wave-container';
        
        for (let i = 1; i <= 3; i++) {
            const wave = document.createElement('div');
            wave.className = `wave wave-${i}`;
            waveContainer.appendChild(wave);
        }
        
        document.body.appendChild(waveContainer);
    }

    // Certificate interactions
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    // Create lightbox elements
    const createLightbox = () => {
        // Create lightbox container
        const lightbox = document.createElement('div');
        lightbox.className = 'certificate-lightbox';
        
        // Create lightbox content
        const lightboxContent = document.createElement('div');
        lightboxContent.className = 'lightbox-content';
        
        // Create image element
        const lightboxImage = document.createElement('img');
        lightboxImage.className = 'lightbox-image';
        lightboxContent.appendChild(lightboxImage);
        
        // Create close button
        const closeButton = document.createElement('div');
        closeButton.className = 'lightbox-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                document.body.style.overflow = 'auto';
            }, 300);
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
        
        // Close on click outside content
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    document.body.style.overflow = 'auto';
                }, 300);
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    document.body.style.overflow = 'auto';
                }, 300);
            }
        });
        
        return {
            lightbox,
            lightboxImage,
            caption
        };
    };
    
    // Initialize lightbox
    const { lightbox, lightboxImage, caption } = createLightbox();
    
    // Add click event to certificates to open in lightbox
    certificateCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.querySelector('.overlay h3').textContent;
            const categoryElement = card.querySelector('.cert-category');
            const category = categoryElement ? categoryElement.textContent : '';
            
            // Set image source and caption
            lightboxImage.src = img.src;
            caption.textContent = category ? `${title} - ${category}` : title;
            
            // Show lightbox with loading animation
            document.body.style.overflow = 'hidden';
            lightbox.classList.add('active');
            
            // Add loading animation
            lightboxImage.style.opacity = '0';
            setTimeout(() => {
                lightboxImage.style.opacity = '1';
            }, 100);
        });
    });
    
    // Enhanced certificate animation
    const animateCertificates = () => {
        certificateCards.forEach((card, index) => {
            // Make sure the card is initially hidden
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Add a slight delay for each card for a staggered effect
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    };
    
    // Trigger animation when scrolled into view
    const certificatesSection = document.querySelector('#certificates');
    
    if (certificatesSection) {
        window.addEventListener('scroll', function checkScroll() {
            const sectionTop = certificatesSection.getBoundingClientRect().top;
            const isVisible = sectionTop < window.innerHeight - 100;
            
            if (isVisible) {
                animateCertificates();
                window.removeEventListener('scroll', checkScroll);
            }
        });
    }

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

    // Add skill progress animations with intersection observer
    function animateSkillsOnScroll() {
        const skillBars = document.querySelectorAll('.progress');
        const skillsSection = document.querySelector('.skills');
        
        if (!skillsSection || skillBars.length === 0) return;

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

    // Add project card hover effects
    function enhanceProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('card-hover');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('card-hover');
            });
        });
    }

    // Animate sections on scroll with fade-in effects
    function animateSectionsOnScroll() {
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            section.classList.add('section-hidden');
            observer.observe(section);
        });
    }

    // Add interactive project filter
    function setupProjectFilter() {
        const projectContainer = document.querySelector('.other-projects-container');
        if (!projectContainer) return;
        
        // Create filter buttons
        const filterButtons = document.createElement('div');
        filterButtons.className = 'project-filters';
        filterButtons.innerHTML = `
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="in-progress">In Progress</button>
            <button class="filter-btn" data-filter="coming-soon">Coming Soon</button>
            <button class="filter-btn" data-filter="planned">Planned</button>
        `;
        
        // Insert filter buttons before the projects grid
        const projectsGrid = projectContainer.querySelector('.projects-grid');
        projectContainer.insertBefore(filterButtons, projectsGrid);
        
        // Add event listeners to filter buttons
        const buttons = filterButtons.querySelectorAll('.filter-btn');
        const projects = projectsGrid.querySelectorAll('.project-card');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                // Show/hide projects based on filter
                projects.forEach(project => {
                    if (filter === 'all') {
                        project.style.display = 'block';
                        return;
                    }
                    
                    const statusElement = project.querySelector('.project-status span');
                    if (!statusElement) {
                        project.style.display = 'none';
                        return;
                    }
                    
                    const status = statusElement.textContent.toLowerCase().replace(/\s+/g, '-');
                    if (status === filter) {
                        project.style.display = 'block';
                    } else {
                        project.style.display = 'none';
                    }
                });
            });
        });
    }

    // Add our new dynamic features
    animateSkillsOnScroll();
    enhanceProjectCards();
    animateSectionsOnScroll();
    setupProjectFilter();
});

