// Empreendimentos Page Controller

class EmpreendimentosController {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentCategory = 'all';
        this.currentFilters = {
            search: '',
            location: '',
            price: '',
            rooms: ''
        };
        
        this.init();
        this.setupEventListeners();
        this.loadProperties();
    }

    init() {
        // Initialize the page
        this.setupAnimations();
        this.setupIntersectionObservers();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.filterProperties();
            }, 300));
        }

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setActiveTab(e.target);
                this.currentCategory = e.target.dataset.category;
                this.filterProperties();
            });
        });

        // Advanced filters
        document.getElementById('location-filter')?.addEventListener('change', (e) => {
            this.currentFilters.location = e.target.value;
            this.filterProperties();
        });

        document.getElementById('price-filter')?.addEventListener('change', (e) => {
            this.currentFilters.price = e.target.value;
            this.filterProperties();
        });

        document.getElementById('rooms-filter')?.addEventListener('change', (e) => {
            this.currentFilters.rooms = e.target.value;
            this.filterProperties();
        });

        // 360° view modal
        window.open360View = () => this.open360View();
        window.close360View = () => this.close360View();
        window.contactWhatsApp = () => this.contactWhatsApp();
    }

    setupAnimations() {
        // Animate property cards on scroll
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        });
    }

    setupIntersectionObservers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.property-card').forEach(card => {
            observer.observe(card);
        });
    }

    loadProperties() {
        // Load properties from DOM
        const propertyCards = document.querySelectorAll('.property-card');
        this.properties = Array.from(propertyCards).map(card => ({
            element: card,
            category: card.dataset.category,
            location: card.dataset.location,
            price: parseInt(card.dataset.price),
            rooms: parseInt(card.dataset.rooms),
            title: card.querySelector('h3').textContent.toLowerCase(),
            description: card.querySelector('.description').textContent.toLowerCase()
        }));

        this.filteredProperties = [...this.properties];
    }

    setActiveTab(activeTab) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }

    filterProperties() {
        this.filteredProperties = this.properties.filter(property => {
            // Category filter
            if (this.currentCategory !== 'all' && property.category !== this.currentCategory) {
                return false;
            }

            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                if (!property.title.includes(searchTerm) && 
                    !property.description.includes(searchTerm)) {
                    return false;
                }
            }

            // Location filter
            if (this.currentFilters.location && property.location !== this.currentFilters.location) {
                return false;
            }

            // Price filter
            if (this.currentFilters.price) {
                const [min, max] = this.parsePriceRange(this.currentFilters.price);
                if (property.price < min || (max && property.price > max)) {
                    return false;
                }
            }

            // Rooms filter
            if (this.currentFilters.rooms) {
                const rooms = parseInt(this.currentFilters.rooms);
                if (this.currentFilters.rooms === '4+') {
                    if (property.rooms < 4) return false;
                } else if (property.rooms !== rooms) {
                    return false;
                }
            }

            return true;
        });

        this.displayFilteredProperties();
    }

    parsePriceRange(priceRange) {
        if (priceRange === '800000+') {
            return [800000, null];
        }
        
        const [min, max] = priceRange.split('-').map(p => parseInt(p));
        return [min, max];
    }

    displayFilteredProperties() {
        // Show loading animation
        this.showLoading();

        setTimeout(() => {
            // Hide all properties
            this.properties.forEach(property => {
                property.element.classList.add('hidden');
            });

            // Show filtered properties
            this.filteredProperties.forEach((property, index) => {
                setTimeout(() => {
                    property.element.classList.remove('hidden');
                    property.element.classList.add('fade-in');
                }, index * 100);
            });

            // Show no results message if needed
            if (this.filteredProperties.length === 0) {
                this.showNoResults();
            } else {
                this.hideNoResults();
            }

            this.hideLoading();
        }, 300);
    }

    showLoading() {
        const grid = document.getElementById('properties-grid');
        if (grid && !grid.querySelector('.loading-properties')) {
            const loading = document.createElement('div');
            loading.className = 'loading-properties';
            loading.innerHTML = '<div class="loading-spinner"></div>';
            grid.appendChild(loading);
        }
    }

    hideLoading() {
        const loading = document.querySelector('.loading-properties');
        if (loading) {
            loading.remove();
        }
    }

    showNoResults() {
        const grid = document.getElementById('properties-grid');
        if (grid && !grid.querySelector('.no-results')) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>Nenhum empreendimento encontrado</h3>
                <p>Tente ajustar os filtros ou fazer uma nova busca.</p>
            `;
            grid.appendChild(noResults);
        }
    }

    hideNoResults() {
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }

    open360View() {
        const modal = document.getElementById('modal-360');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add entrance animation
            const content = modal.querySelector('.modal-content');
            content.style.transform = 'scale(0.8)';
            content.style.opacity = '0';
            
            setTimeout(() => {
                content.style.transform = 'scale(1)';
                content.style.opacity = '1';
            }, 100);
        }
    }

    close360View() {
        const modal = document.getElementById('modal-360');
        if (modal) {
            const content = modal.querySelector('.modal-content');
            content.style.transform = 'scale(0.8)';
            content.style.opacity = '0';
            
            setTimeout(() => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    contactWhatsApp() {
        const phoneNumber = '5511999999999'; // Replace with actual phone number
        const message = 'Olá! Tenho interesse em um empreendimento da Zeralotes. Gostaria de mais informações.';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // Utility methods
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    // Smooth scroll to section
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Add property to favorites (localStorage)
    addToFavorites(propertyId) {
        let favorites = JSON.parse(localStorage.getItem('zeralotes_favorites') || '[]');
        if (!favorites.includes(propertyId)) {
            favorites.push(propertyId);
            localStorage.setItem('zeralotes_favorites', JSON.stringify(favorites));
            this.showNotification('Adicionado aos favoritos!', 'success');
        } else {
            this.showNotification('Já está nos favoritos!', 'info');
        }
    }

    // Remove property from favorites
    removeFromFavorites(propertyId) {
        let favorites = JSON.parse(localStorage.getItem('zeralotes_favorites') || '[]');
        favorites = favorites.filter(id => id !== propertyId);
        localStorage.setItem('zeralotes_favorites', JSON.stringify(favorites));
        this.showNotification('Removido dos favoritos!', 'info');
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--dark-gray);
            color: var(--white);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            border-left: 4px solid var(--primary-green);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Share property
    shareProperty(propertyId, propertyTitle) {
        if (navigator.share) {
            navigator.share({
                title: propertyTitle,
                text: `Confira este empreendimento da Zeralotes: ${propertyTitle}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const url = `${window.location.origin}${window.location.pathname}#${propertyId}`;
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Link copiado para a área de transferência!', 'success');
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.empreendimentosController = new EmpreendimentosController();
});

// Handle URL hash for direct property links
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
        const propertyId = hash.substring(1);
        const property = document.querySelector(`[data-property-id="${propertyId}"]`);
        if (property) {
            property.scrollIntoView({ behavior: 'smooth' });
            property.style.animation = 'pulse 1s ease';
        }
    }
});

// Export for use in other modules
window.EmpreendimentosController = EmpreendimentosController;
