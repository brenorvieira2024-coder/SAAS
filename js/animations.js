// Advanced Animation System for Zeralotes

class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupPageTransitions();
        this.setupLoadingAnimations();
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animation elements
        document.querySelectorAll('[data-animation]').forEach(element => {
            scrollObserver.observe(element);
        });

        // Parallax scrolling
        this.setupParallaxScrolling();
    }

    setupParallaxScrolling() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        window.addEventListener('scroll', utils.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16));
    }

    setupHoverEffects() {
        // 3D card effects
        document.querySelectorAll('.card-3d').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });

        // Glow effects
        document.querySelectorAll('.hover-glow').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = '0 0 30px var(--primary-green)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = 'none';
            });
        });
    }

    setupPageTransitions() {
        // Page transition overlay
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition';
        document.body.appendChild(transitionOverlay);

        // Handle page transitions
        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.animatePageTransition(link.href);
            });
        });
    }

    animatePageTransition(url) {
        const overlay = document.querySelector('.page-transition');
        overlay.classList.add('active');
        
        setTimeout(() => {
            window.location.href = url;
        }, 600);
    }

    setupLoadingAnimations() {
        // Progress bar animation
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                progressBar.style.width = progress + '%';
            }, 200);
        }

        // Logo pulse animation
        const logo = document.querySelector('.loading-logo');
        if (logo) {
            logo.style.animation = 'pulse 2s infinite';
        }
    }

    triggerAnimation(element) {
        const animationType = element.dataset.animation;
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
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
                case 'slide-in':
                    this.slideIn(element);
                    break;
                case 'typewriter':
                    this.typewriterEffect(element);
                    break;
                case 'glitch':
                    this.glitchEffect(element);
                    break;
                case 'morph':
                    this.morphingEffect(element);
                    break;
            }
        }, delay);
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

    slideIn(element) {
        element.style.transform = 'translateX(-100%)';
        element.style.transition = 'transform 0.8s ease';
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
        });
    }

    typewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-green)';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
    }

    glitchEffect(element) {
        element.classList.add('glitch');
        element.setAttribute('data-text', element.textContent);
        
        setTimeout(() => {
            element.classList.remove('glitch');
        }, 2000);
    }

    morphingEffect(element) {
        element.style.animation = 'morph 4s ease-in-out infinite';
    }

    // Particle system
    createParticleSystem(container, count = 50) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        container.appendChild(particlesContainer);

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Matrix rain effect
    createMatrixRain(container) {
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-rain';
        container.appendChild(matrixContainer);

        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        for (let i = 0; i < 30; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = Math.random() * 100 + '%';
            column.style.animationDelay = Math.random() * 3 + 's';
            column.style.animationDuration = (Math.random() * 2 + 3) + 's';
            
            let text = '';
            for (let j = 0; j < 15; j++) {
                text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
            }
            column.innerHTML = text;
            
            matrixContainer.appendChild(column);
        }
    }

    // Stagger animation for lists
    staggerAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * delay);
        });
    }

    // Loading spinner
    createSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        container.appendChild(spinner);
        return spinner;
    }

    // Progress bar
    createProgressBar(container, duration = 3000) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressContainer.appendChild(progressFill);
        
        container.appendChild(progressContainer);
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressFill.style.width = progress + '%';
        }, duration / 100);
        
        return progressContainer;
    }
}

// Initialize animation controller
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Export for use in other modules
window.AnimationController = AnimationController;
