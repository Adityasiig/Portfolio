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
});

