// Otimizações de Performance para Zeralotes

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupIntersectionObserver();
        this.setupScrollOptimization();
        this.setupImageOptimization();
        this.setupAnimationOptimization();
        this.setupMemoryOptimization();
        this.setupTouchOptimization();
    }

    // Lazy Loading para Imagens
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('loading-skeleton');
                        img.classList.add('image-optimized');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Observer para Animações
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    // Otimização de Scroll
    setupScrollOptimization() {
        let ticking = false;
        
        const updateScrollElements = () => {
            const scrollY = window.pageYOffset;
            
            // Parallax suave
            document.querySelectorAll('.parallax-element').forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            // Navbar transparente
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (scrollY > 100) {
                    navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                    navbar.style.backdropFilter = 'blur(15px)';
                } else {
                    navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                    navbar.style.backdropFilter = 'blur(15px)';
                }
            }
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollElements);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Otimização de Imagens
    setupImageOptimization() {
        // WebP Support Detection
        const supportsWebP = () => {
            return new Promise((resolve) => {
                const webP = new Image();
                webP.onload = webP.onerror = () => {
                    resolve(webP.height === 2);
                };
                webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
            });
        };

        // Aplicar WebP se suportado
        supportsWebP().then(supported => {
            if (supported) {
                document.querySelectorAll('img[data-webp]').forEach(img => {
                    img.src = img.dataset.webp;
                });
            }
        });

        // Lazy loading para background images
        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.backgroundImage = `url(${element.dataset.bg})`;
                    element.classList.add('bg-loaded');
                    bgObserver.unobserve(element);
                }
            });
        });

        document.querySelectorAll('[data-bg]').forEach(el => {
            bgObserver.observe(el);
        });
    }

    // Otimização de Animações
    setupAnimationOptimization() {
        // Reduzir animações em dispositivos de baixa performance
        const isLowEndDevice = () => {
            return navigator.hardwareConcurrency <= 2 || 
                   navigator.deviceMemory <= 4 ||
                   /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };

        if (isLowEndDevice()) {
            document.documentElement.classList.add('reduced-motion');
        }

        // Pausar animações quando não visível
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.documentElement.classList.add('paused-animations');
            } else {
                document.documentElement.classList.remove('paused-animations');
            }
        });

        // Otimizar animações com will-change
        const animatedElements = document.querySelectorAll('.glow-effect, .hologram-effect, .neon-text');
        animatedElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.willChange = 'transform, box-shadow, text-shadow';
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.willChange = 'auto';
            });
        });
    }

    // Otimização de Memória
    setupMemoryOptimization() {
        // Limpar observers quando não necessário
        const cleanup = () => {
            // Remover event listeners de elementos removidos
            const removedElements = document.querySelectorAll('.removed');
            removedElements.forEach(el => {
                el.removeEventListener('click', el._clickHandler);
                el.removeEventListener('mouseenter', el._mouseHandler);
            });
        };

        // Executar limpeza periodicamente
        setInterval(cleanup, 30000); // A cada 30 segundos

        // Limpar cache de imagens antigas
        const clearImageCache = () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.complete && !img.offsetParent) {
                    img.src = '';
                }
            });
        };

        // Executar limpeza de cache quando necessário
        window.addEventListener('beforeunload', clearImageCache);
    }

    // Otimização para Touch
    setupTouchOptimization() {
        // Detectar dispositivos touch
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            document.documentElement.classList.add('touch-device');
            
            // Otimizar para touch
            document.querySelectorAll('.hover-effect').forEach(el => {
                el.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    el.classList.add('touch-active');
                });
                
                el.addEventListener('touchend', () => {
                    setTimeout(() => {
                        el.classList.remove('touch-active');
                    }, 150);
                });
            });
        }

        // Prevenir zoom duplo toque
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // Debounce para eventos frequentes
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle para scroll
    throttle(func, limit) {
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
    }

    // Preload de recursos críticos
    preloadCriticalResources() {
        const criticalImages = [
            'https://via.placeholder.com/600x400/00ff88/000000?text=Último+Lançamento',
            'https://via.placeholder.com/400x300/00ff88/000000?text=Casa+Modern'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Otimização de Fontes
    optimizeFonts() {
        // Preload de fontes críticas
        const fontPreloads = [
            'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
            'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&display=swap'
        ];

        fontPreloads.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    // Métricas de Performance
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    
                    console.log(`Tempo de carregamento: ${loadTime}ms`);
                    
                    // Enviar métricas para analytics (se disponível)
                    if (window.gtag) {
                        window.gtag('event', 'page_load_time', {
                            value: loadTime,
                            event_category: 'Performance'
                        });
                    }
                }, 0);
            });
        }
    }

    // Otimização de Service Worker
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registrado com sucesso:', registration);
                    })
                    .catch(registrationError => {
                        console.log('Falha no registro do SW:', registrationError);
                    });
            });
        }
    }

    // Inicializar todas as otimizações
    optimize() {
        this.preloadCriticalResources();
        this.optimizeFonts();
        this.measurePerformance();
        this.setupServiceWorker();
    }
}

// Inicializar otimizador quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
    window.performanceOptimizer.optimize();
});

// Otimizações globais
window.addEventListener('load', () => {
    // Remover classes de loading
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    // Inicializar animações
    if (window.cinematicEffects) {
        window.cinematicEffects.init();
    }
});

// Otimizações para resize
window.addEventListener('resize', window.performanceOptimizer?.debounce(() => {
    // Recalcular layouts se necessário
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}, 250));

// Exportar para uso global
window.PerformanceOptimizer = PerformanceOptimizer;
