// Sistema de Efeitos Cinematográficos para Zeralotes

class CinematicEffects {
    constructor() {
        this.particles = [];
        this.matrixColumns = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.createParticles();
        this.createMatrixRain();
        this.setupEnergyLines();
        this.setupGlitchEffects();
        this.setupTypingEffect();
        this.setupScrollAnimations();
        
        this.isInitialized = true;
        console.log('🎬 Efeitos Cinematográficos Inicializados');
    }

    // Sistema de Partículas Flutuantes
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Posição aleatória
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 8) + 's';
            
            particlesContainer.appendChild(particle);
        }
    }

    // Efeito Matrix Rain
    createMatrixRain() {
        const matrixContainer = document.getElementById('matrix-rain');
        if (!matrixContainer) return;

        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const columnCount = 20;

        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = (i * 5) + '%';
            column.style.animationDelay = Math.random() * 5 + 's';
            column.style.animationDuration = (Math.random() * 3 + 5) + 's';
            
            // Adicionar caracteres
            for (let j = 0; j < 20; j++) {
                const char = document.createElement('div');
                char.textContent = characters[Math.floor(Math.random() * characters.length)];
                char.style.opacity = Math.random();
                column.appendChild(char);
            }
            
            matrixContainer.appendChild(column);
        }
    }

    // Configurar Linhas de Energia
    setupEnergyLines() {
        const energyLines = document.querySelectorAll('.energy-line');
        energyLines.forEach((line, index) => {
            line.style.animationDelay = (index * 0.5) + 's';
        });
    }

    // Efeito Glitch
    setupGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch-effect');
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.animation = 'glitch1 0.3s infinite, glitch2 0.3s infinite';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.animation = '';
            });
        });
    }

    // Efeito de Digitação
    setupTypingEffect() {
        const typingElements = document.querySelectorAll('.typing-effect');
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-green)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            // Iniciar após um delay
            setTimeout(typeWriter, 2000);
        });
    }

    // Animações de Scroll
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-smooth');
                    
                    // Efeito de slide baseado na posição
                    if (entry.target.classList.contains('carousel-item')) {
                        const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                        entry.target.style.animationDelay = (index * 0.2) + 's';
                        entry.target.classList.add('slide-in-left');
                    }
                }
            });
        }, observerOptions);

        // Observar elementos
        document.querySelectorAll('.carousel-item, .blog-item, .property-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Efeito de Holograma Interativo
    setupHologramEffect() {
        const hologramElements = document.querySelectorAll('.hologram-effect');
        hologramElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    // Efeito de Pulsação de Energia
    createEnergyPulse(element) {
        const pulse = document.createElement('div');
        pulse.className = 'energy-pulse';
        element.appendChild(pulse);
        
        setTimeout(() => {
            pulse.remove();
        }, 2000);
    }

    // Sistema de Notificações Futuristas
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--gradient-primary);
            color: var(--pure-black);
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: var(--glow-green);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.5s ease;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Efeito de Loading Futurista
    showFuturisticLoader(container) {
        const loader = document.createElement('div');
        loader.className = 'futuristic-loader';
        loader.innerHTML = `
            <div class="loading-text">CARREGANDO...</div>
        `;
        
        // Estilos do loader
        loader.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
        `;
        
        const loadingText = loader.querySelector('.loading-text');
        loadingText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--primary-green);
            font-family: var(--font-primary);
            font-size: 12px;
            font-weight: 700;
            text-shadow: var(--glow-green);
        `;
        
        container.style.position = 'relative';
        container.appendChild(loader);
        
        return loader;
    }

    // Remover Loader
    hideFuturisticLoader(loader) {
        if (loader && loader.parentNode) {
            loader.remove();
        }
    }

    // Efeito de Transição de Página
    pageTransition(callback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--pure-black);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Fade in
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        // Executar callback e fade out
        setTimeout(() => {
            if (callback) callback();
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }, 500);
    }

    // Efeito de Distorção em Imagens
    setupImageDistortion() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.filter = 'hue-rotate(90deg) contrast(1.2) brightness(1.1)';
                img.style.transition = 'filter 0.3s ease';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.filter = 'none';
            });
        });
    }

    // Sistema de Som Ambiente (placeholder)
    setupAmbientSound() {
        // Aqui seria implementado o sistema de áudio
        // Por enquanto, apenas um placeholder
        console.log('🔊 Sistema de Som Ambiente - Placeholder');
    }

    // Destruir efeitos
    destroy() {
        this.particles = [];
        this.matrixColumns = [];
        this.isInitialized = false;
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.cinematicEffects = new CinematicEffects();
    
    // Configurar efeitos adicionais
    window.cinematicEffects.setupHologramEffect();
    window.cinematicEffects.setupImageDistortion();
    window.cinematicEffects.setupAmbientSound();
});

// Exportar para uso global
window.CinematicEffects = CinematicEffects;
