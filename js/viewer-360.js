// Visualizador 360º Interativo para Zeralotes

class Viewer360 {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            images: options.images || [],
            autoRotate: options.autoRotate || false,
            autoRotateSpeed: options.autoRotateSpeed || 0.5,
            enableHotspots: options.enableHotspots || true,
            enableFullscreen: options.enableFullscreen || true,
            enableVR: options.enableVR || false,
            ...options
        };
        
        this.currentImageIndex = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.zoom = 1;
        this.autoRotateInterval = null;
        this.isFullscreen = false;
        
        this.init();
    }

    init() {
        this.createViewer();
        this.setupEventListeners();
        this.loadImages();
        
        if (this.options.autoRotate) {
            this.startAutoRotate();
        }
    }

    createViewer() {
        this.container.innerHTML = `
            <div class="viewer-360-container">
                <canvas class="viewer-360-canvas" id="viewer-360-canvas"></canvas>
                
                <div class="viewer-360-loading" id="viewer-360-loading">
                    <div class="spinner"></div>
                    <div>Carregando visualização 360º...</div>
                </div>
                
                <div class="viewer-360-controls">
                    <button class="viewer-360-btn" id="prev-image" title="Imagem Anterior">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="viewer-360-btn" id="play-pause" title="Play/Pause">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="viewer-360-btn" id="next-image" title="Próxima Imagem">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <div class="viewer-360-info" id="viewer-360-info">
                    <h4>Visualização 360º</h4>
                    <div>Imagem: <span id="current-image">1</span> / <span id="total-images">${this.options.images.length}</span></div>
                    <div>Arraste para explorar</div>
                </div>
                
                <div class="viewer-360-fullscreen" id="viewer-360-fullscreen" title="Tela Cheia">
                    <i class="fas fa-expand"></i>
                </div>
                
                <div class="viewer-360-vr-mode" id="viewer-360-vr" title="Modo VR">
                    <i class="fas fa-vr-cardboard"></i> VR
                </div>
                
                <div class="viewer-360-zoom-controls">
                    <button class="viewer-360-zoom-btn" id="zoom-in" title="Zoom In">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="viewer-360-zoom-btn" id="zoom-out" title="Zoom Out">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="viewer-360-zoom-btn" id="zoom-reset" title="Reset Zoom">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                
                <div class="viewer-360-hotspots" id="viewer-360-hotspots"></div>
                
                <div class="viewer-360-progress">
                    <div class="viewer-360-progress-bar" id="viewer-360-progress"></div>
                </div>
            </div>
        `;
        
        this.canvas = this.container.querySelector('#viewer-360-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loading = this.container.querySelector('#viewer-360-loading');
        this.info = this.container.querySelector('#viewer-360-info');
        this.progress = this.container.querySelector('#viewer-360-progress');
        this.hotspots = this.container.querySelector('#viewer-360-hotspots');
        
        this.setupCanvas();
    }

    setupCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Configurar resolução para dispositivos de alta densidade
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width *= dpr;
        this.canvas.height *= dpr;
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    setupEventListeners() {
        // Controles de navegação
        this.container.querySelector('#prev-image').addEventListener('click', () => this.previousImage());
        this.container.querySelector('#next-image').addEventListener('click', () => this.nextImage());
        this.container.querySelector('#play-pause').addEventListener('click', () => this.toggleAutoRotate());
        this.container.querySelector('#viewer-360-fullscreen').addEventListener('click', () => this.toggleFullscreen());
        this.container.querySelector('#viewer-360-vr').addEventListener('click', () => this.toggleVR());
        
        // Controles de zoom
        this.container.querySelector('#zoom-in').addEventListener('click', () => this.zoomIn());
        this.container.querySelector('#zoom-out').addEventListener('click', () => this.zoomOut());
        this.container.querySelector('#zoom-reset').addEventListener('click', () => this.resetZoom());
        
        // Controles de mouse
        this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
        this.canvas.addEventListener('mousemove', (e) => this.drag(e));
        this.canvas.addEventListener('mouseup', () => this.endDrag());
        this.canvas.addEventListener('mouseleave', () => this.endDrag());
        
        // Controles de toque
        this.canvas.addEventListener('touchstart', (e) => this.startTouch(e));
        this.canvas.addEventListener('touchmove', (e) => this.touchMove(e));
        this.canvas.addEventListener('touchend', () => this.endTouch());
        
        // Controles de teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Redimensionamento
        window.addEventListener('resize', () => this.handleResize());
    }

    loadImages() {
        if (this.options.images.length === 0) {
            this.showError('Nenhuma imagem 360º disponível');
            return;
        }
        
        this.images = [];
        this.loadedImages = 0;
        
        this.options.images.forEach((imageSrc, index) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                this.images[index] = img;
                this.loadedImages++;
                this.updateProgress();
                
                if (this.loadedImages === this.options.images.length) {
                    this.hideLoading();
                    this.render();
                }
            };
            
            img.onerror = () => {
                console.error(`Erro ao carregar imagem: ${imageSrc}`);
                this.loadedImages++;
                this.updateProgress();
            };
            
            img.src = imageSrc;
        });
    }

    updateProgress() {
        const progress = (this.loadedImages / this.options.images.length) * 100;
        this.progress.style.width = progress + '%';
    }

    hideLoading() {
        this.loading.style.display = 'none';
        this.updateImageInfo();
    }

    showError(message) {
        this.loading.innerHTML = `
            <div style="color: #ff4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px;"></i>
                <div>${message}</div>
            </div>
        `;
    }

    render() {
        if (!this.images[this.currentImageIndex]) return;
        
        const img = this.images[this.currentImageIndex];
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Aplicar transformações
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(this.zoom, this.zoom);
        ctx.rotate(this.rotationY);
        
        // Renderizar imagem 360º
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const x = -imgWidth / 2 + this.rotationX;
        const y = -imgHeight / 2;
        
        ctx.drawImage(img, x, y, imgWidth, imgHeight);
        
        // Renderizar imagem adicional para continuidade
        ctx.drawImage(img, x + imgWidth, y, imgWidth, imgHeight);
        
        ctx.restore();
        
        // Renderizar hotspots
        this.renderHotspots();
    }

    renderHotspots() {
        if (!this.options.enableHotspots) return;
        
        // Limpar hotspots existentes
        this.hotspots.innerHTML = '';
        
        // Adicionar hotspots de exemplo
        const hotspotData = [
            { x: 30, y: 40, title: 'Sala de Estar', description: 'Amplo espaço para convivência' },
            { x: 70, y: 60, title: 'Cozinha', description: 'Cozinha moderna e funcional' },
            { x: 20, y: 80, title: 'Quarto Principal', description: 'Suíte com closet' }
        ];
        
        hotspotData.forEach((hotspot, index) => {
            const hotspotEl = document.createElement('div');
            hotspotEl.className = 'viewer-360-hotspot';
            hotspotEl.style.left = hotspot.x + '%';
            hotspotEl.style.top = hotspot.y + '%';
            hotspotEl.title = hotspot.title;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'viewer-360-tooltip';
            tooltip.innerHTML = `
                <strong>${hotspot.title}</strong><br>
                ${hotspot.description}
            `;
            
            hotspotEl.appendChild(tooltip);
            this.hotspots.appendChild(hotspotEl);
        });
    }

    startDrag(e) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }

    drag(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        
        this.rotationX += deltaX * 0.01;
        this.rotationY += deltaY * 0.01;
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        this.render();
    }

    endDrag() {
        this.isDragging = false;
    }

    startTouch(e) {
        if (e.touches.length === 1) {
            this.startDrag(e.touches[0]);
        }
    }

    touchMove(e) {
        if (e.touches.length === 1) {
            this.drag(e.touches[0]);
        }
    }

    endTouch() {
        this.endDrag();
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.previousImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoRotate();
                break;
            case 'f':
            case 'F':
                this.toggleFullscreen();
                break;
            case '+':
            case '=':
                this.zoomIn();
                break;
            case '-':
                this.zoomOut();
                break;
            case '0':
                this.resetZoom();
                break;
        }
    }

    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.options.images.length) % this.options.images.length;
        this.updateImageInfo();
        this.render();
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.options.images.length;
        this.updateImageInfo();
        this.render();
    }

    updateImageInfo() {
        const currentImageEl = this.container.querySelector('#current-image');
        const totalImagesEl = this.container.querySelector('#total-images');
        
        if (currentImageEl) currentImageEl.textContent = this.currentImageIndex + 1;
        if (totalImagesEl) totalImagesEl.textContent = this.options.images.length;
    }

    toggleAutoRotate() {
        if (this.autoRotateInterval) {
            this.stopAutoRotate();
        } else {
            this.startAutoRotate();
        }
    }

    startAutoRotate() {
        this.autoRotateInterval = setInterval(() => {
            this.rotationX += this.options.autoRotateSpeed;
            this.render();
        }, 16);
        
        const playBtn = this.container.querySelector('#play-pause');
        if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
        
        const playBtn = this.container.querySelector('#play-pause');
        if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    zoomIn() {
        this.zoom = Math.min(this.zoom * 1.2, 3);
        this.render();
    }

    zoomOut() {
        this.zoom = Math.max(this.zoom / 1.2, 0.5);
        this.render();
    }

    resetZoom() {
        this.zoom = 1;
        this.rotationX = 0;
        this.rotationY = 0;
        this.render();
    }

    toggleFullscreen() {
        if (!this.options.enableFullscreen) return;
        
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    enterFullscreen() {
        const modal = document.createElement('div');
        modal.className = 'viewer-360-modal';
        modal.id = 'viewer-360-modal';
        
        modal.innerHTML = `
            <div class="viewer-360-modal-content">
                <div class="viewer-360-modal-header">
                    <h3 class="viewer-360-modal-title">Visualização 360º - Tela Cheia</h3>
                    <button class="viewer-360-modal-close" id="viewer-360-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="viewer-360-modal-body">
                    <div id="viewer-360-fullscreen-container"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Criar novo visualizador em tela cheia
        const fullscreenContainer = modal.querySelector('#viewer-360-fullscreen-container');
        this.fullscreenViewer = new Viewer360(fullscreenContainer, {
            ...this.options,
            enableFullscreen: false
        });
        
        // Event listeners para o modal
        modal.querySelector('#viewer-360-modal-close').addEventListener('click', () => {
            this.exitFullscreen();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.exitFullscreen();
            }
        });
        
        // Mostrar modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        this.isFullscreen = true;
    }

    exitFullscreen() {
        const modal = document.getElementById('viewer-360-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        
        this.isFullscreen = false;
    }

    toggleVR() {
        if (!this.options.enableVR) return;
        
        // Placeholder para funcionalidade VR
        if (window.cinematicEffects) {
            window.cinematicEffects.showNotification('Modo VR em desenvolvimento', 'info');
        }
    }

    handleResize() {
        this.setupCanvas();
        this.render();
    }

    destroy() {
        this.stopAutoRotate();
        this.exitFullscreen();
        
        if (this.fullscreenViewer) {
            this.fullscreenViewer.destroy();
        }
    }
}

// Inicializar visualizadores 360º automaticamente
document.addEventListener('DOMContentLoaded', () => {
    const viewers = document.querySelectorAll('[data-viewer-360]');
    
    viewers.forEach(viewer => {
        const images = JSON.parse(viewer.dataset.images || '[]');
        const options = JSON.parse(viewer.dataset.options || '{}');
        
        new Viewer360(viewer, {
            images,
            ...options
        });
    });
});

// Exportar para uso global
window.Viewer360 = Viewer360;
