// Main JavaScript for Zeralotes SaaS

class ZeralotesApp {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupAnimations();
        this.setupCarousels();
    }

    init() {
        // Show loading screen
        this.showLoadingScreen();
        
        // Initialize after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2000);
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-logo">ZERALOTES</div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        `;
        document.body.appendChild(loadingScreen);
    }

    hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(0, 0, 0, 0.98)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            }
        });

        // Active navigation link
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });

        // Stagger animation for cards
        document.querySelectorAll('.stagger-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(item);
        });

        // Parallax effect for hero shapes
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape');
            
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Add geometric grid background
        this.addGeometricGrid();
    }

    addGeometricGrid() {
        const grid = document.createElement('div');
        grid.className = 'geometric-grid';
        document.body.appendChild(grid);
    }

    setupCarousels() {
        // Empreendimentos carousel
        const empreendimentosCarousel = document.getElementById('empreendimentos-carousel');
        const prevBtn = document.getElementById('prev-empreendimentos');
        const nextBtn = document.getElementById('next-empreendimentos');
        
        if (empreendimentosCarousel && prevBtn && nextBtn) {
            let currentIndex = 0;
            const items = empreendimentosCarousel.children;
            const totalItems = items.length;
            const itemsPerView = window.innerWidth > 768 ? 3 : 1;
            
            const updateCarousel = () => {
                const translateX = -currentIndex * (100 / itemsPerView);
                empreendimentosCarousel.style.transform = `translateX(${translateX}%)`;
                
                // Update button states
                prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
                nextBtn.style.opacity = currentIndex >= totalItems - itemsPerView ? '0.5' : '1';
            };

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentIndex < totalItems - itemsPerView) {
                    currentIndex++;
                    updateCarousel();
                }
            });

            // Auto-play carousel
            setInterval(() => {
                if (currentIndex < totalItems - itemsPerView) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            }, 5000);

            // Initialize
            updateCarousel();
        }
    }

    // Utility methods
    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    addGlitchEffect(element) {
        element.classList.add('glitch');
        element.setAttribute('data-text', element.textContent);
    }

    createMatrixRain() {
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-rain';
        document.body.appendChild(matrixContainer);

        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        for (let i = 0; i < 50; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = Math.random() * 100 + '%';
            column.style.animationDelay = Math.random() * 3 + 's';
            column.style.animationDuration = (Math.random() * 2 + 3) + 's';
            
            let text = '';
            for (let j = 0; j < 20; j++) {
                text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
            }
            column.innerHTML = text;
            
            matrixContainer.appendChild(column);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ZeralotesApp();
});

// Utility functions
const utils = {
    // Format currency
    formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export for use in other modules
window.ZeralotesApp = ZeralotesApp;
window.utils = utils;
