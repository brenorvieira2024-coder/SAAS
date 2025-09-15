// Quem Somos - Cinematic Animations

class QuemSomosController {
    constructor() {
        this.init();
        this.setupCinematicEffects();
        this.setupCounterAnimations();
        this.setupTimelineAnimations();
    }

    init() {
        // Add cinematic background effects
        this.addCinematicEffects();
        
        // Setup intersection observers
        this.setupIntersectionObservers();
    }

    addCinematicEffects() {
        // Add particle system to hero section
        const heroSection = document.querySelector('.cinematic-hero');
        if (heroSection) {
            this.createParticleSystem(heroSection, 30);
        }

        // Add matrix rain effect to background
        this.createMatrixRain();
    }

    createParticleSystem(container, count = 30) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        particlesContainer.style.position = 'absolute';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        particlesContainer.style.zIndex = '1';
        
        container.appendChild(particlesContainer);

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'var(--primary-green)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particle.style.animation = 'particle-float 6s infinite linear';
            particlesContainer.appendChild(particle);
        }
    }

    createMatrixRain() {
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-rain';
        matrixContainer.style.position = 'fixed';
        matrixContainer.style.top = '0';
        matrixContainer.style.left = '0';
        matrixContainer.style.width = '100%';
        matrixContainer.style.height = '100%';
        matrixContainer.style.pointerEvents = 'none';
        matrixContainer.style.zIndex = '-1';
        matrixContainer.style.opacity = '0.05';
        
        document.body.appendChild(matrixContainer);

        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        for (let i = 0; i < 20; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.position = 'absolute';
            column.style.top = '-100%';
            column.style.color = 'var(--primary-green)';
            column.style.fontFamily = 'Courier New, monospace';
            column.style.fontSize = '12px';
            column.style.left = Math.random() * 100 + '%';
            column.style.animationDelay = Math.random() * 3 + 's';
            column.style.animationDuration = (Math.random() * 2 + 3) + 's';
            column.style.animation = 'matrix-fall 3s linear infinite';
            
            let text = '';
            for (let j = 0; j < 10; j++) {
                text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
            }
            column.innerHTML = text;
            
            matrixContainer.appendChild(column);
        }
    }

    setupCinematicEffects() {
        // Typewriter effect for title
        const title = document.querySelector('.cinematic-title');
        if (title) {
            this.setupTypewriterEffect(title);
        }

        // Floating cards animation
        this.setupFloatingCards();

        // Geometric shapes animation
        this.setupGeometricShapes();
    }

    setupTypewriterEffect(element) {
        const words = element.querySelectorAll('.title-word');
        words.forEach((word, index) => {
            const text = word.textContent;
            word.textContent = '';
            word.style.borderRight = '3px solid var(--primary-green)';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                word.textContent += text.charAt(i);
                i++;
                
                if (i >= text.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        word.style.borderRight = 'none';
                    }, 1000);
                }
            }, 150);
        });
    }

    setupFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 2}s`;
            card.style.animation = 'floatCard 6s ease-in-out infinite';
        });
    }

    setupGeometricShapes() {
        const shapes = document.querySelectorAll('.geo-line, .geo-circle');
        shapes.forEach((shape, index) => {
            shape.style.animationDelay = `${index * 1}s`;
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    setupTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(50px)';
            item.style.transition = `all 0.6s ease ${index * 0.2}s`;
            timelineObserver.observe(item);
        });
    }

    setupIntersectionObservers() {
        // Fade in animations for sections
        const fadeElements = document.querySelectorAll('[data-animation]');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationType = entry.target.dataset.animation;
                    const delay = entry.target.dataset.delay || 0;
                    
                    setTimeout(() => {
                        this.triggerAnimation(entry.target, animationType);
                    }, delay);
                    
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });
    }

    triggerAnimation(element, animationType) {
        switch (animationType) {
            case 'fade-in-up':
                this.fadeInUp(element);
                break;
            case 'fade-in-left':
                this.fadeInLeft(element);
                break;
            case 'fade-in-right':
                this.fadeInRight(element);
                break;
            case 'scale-in':
                this.scaleIn(element);
                break;
            case 'typewriter':
                this.setupTypewriterEffect(element);
                break;
        }
    }

    fadeInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    fadeInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        element.style.transition = 'all 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    fadeInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        element.style.transition = 'all 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    scaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'all 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    // Parallax scrolling for geometric shapes
    setupParallaxScrolling() {
        window.addEventListener('scroll', utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.geo-line, .geo-circle');
            
            shapes.forEach((shape, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = scrolled * speed;
                shape.style.transform = `translateY(${yPos}px)`;
            });
        }, 16));
    }

    // Glitch effect for special elements
    addGlitchEffect(element) {
        element.classList.add('glitch');
        element.setAttribute('data-text', element.textContent);
        
        setTimeout(() => {
            element.classList.remove('glitch');
        }, 2000);
    }

    // Morphing shapes animation
    createMorphingShapes() {
        const shapes = document.querySelectorAll('.morphing-shape');
        shapes.forEach(shape => {
            shape.style.animation = 'morph 4s ease-in-out infinite';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuemSomosController();
});

// Export for use in other modules
window.QuemSomosController = QuemSomosController;
