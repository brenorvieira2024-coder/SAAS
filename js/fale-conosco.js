// Fale Conosco Page Controller

class FaleConoscoController {
    constructor() {
        this.currentStep = 'state';
        this.selectedState = null;
        this.selectedCity = null;
        this.brokersData = this.initializeBrokersData();
        
        this.init();
        this.setupEventListeners();
        this.updateBusinessHours();
        this.startClock();
    }

    init() {
        this.setupAnimations();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // State selection
        document.querySelectorAll('.state-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectState(e.target.dataset.state));
        });

        // Global functions
        window.contactWhatsApp = () => this.contactWhatsApp();
        window.sendEmail = () => this.sendEmail();
        window.makeCall = () => this.makeCall();
        window.openMaps = () => this.openMaps();
        window.goBackToStates = () => this.goBackToStates();
        window.goBackToCities = () => this.goBackToCities();
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    setupFormValidation() {
        const form = document.getElementById('contact-form');
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldGroup = field.closest('.form-group');
        
        // Remove previous validation classes
        fieldGroup.classList.remove('error', 'success');
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um e-mail válido';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\(\)\-\+]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Por favor, insira um telefone válido';
            }
        }

        // Apply validation result
        if (isValid && value) {
            fieldGroup.classList.add('success');
        } else if (!isValid) {
            fieldGroup.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            fieldGroup.appendChild(errorDiv);
        }

        return isValid;
    }

    clearFieldError(field) {
        const fieldGroup = field.closest('.form-group');
        fieldGroup.classList.remove('error');
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, select, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.submitForm(data);
        } else {
            this.showNotification('Por favor, corrija os erros no formulário', 'error');
        }
    }

    submitForm(data) {
        // Show loading state
        const submitBtn = document.querySelector('#contact-form button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // Reset form
            document.getElementById('contact-form').reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            this.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            
            // Log form data (in real app, send to server)
            console.log('Form submitted:', data);
        }, 2000);
    }

    selectState(stateCode) {
        this.selectedState = stateCode;
        this.loadCities(stateCode);
        this.showStep('city');
    }

    loadCities(stateCode) {
        const cities = this.getCitiesByState(stateCode);
        const cityGrid = document.getElementById('city-grid');
        
        cityGrid.innerHTML = '';
        cities.forEach(city => {
            const cityBtn = document.createElement('button');
            cityBtn.className = 'city-btn';
            cityBtn.textContent = city.name;
            cityBtn.dataset.city = city.code;
            cityBtn.addEventListener('click', () => this.selectCity(city.code));
            cityGrid.appendChild(cityBtn);
        });
    }

    selectCity(cityCode) {
        this.selectedCity = cityCode;
        this.loadBrokers(this.selectedState, cityCode);
        this.showStep('brokers');
    }

    loadBrokers(stateCode, cityCode) {
        const brokers = this.getBrokersByLocation(stateCode, cityCode);
        const brokersGrid = document.getElementById('brokers-grid');
        
        brokersGrid.innerHTML = '';
        brokers.forEach(broker => {
            const brokerCard = document.createElement('div');
            brokerCard.className = 'broker-card';
            brokerCard.innerHTML = `
                <div class="broker-photo">
                    <img src="${broker.photo}" alt="${broker.name}">
                </div>
                <div class="broker-name">${broker.name}</div>
                <div class="broker-specialty">${broker.specialty}</div>
                <div class="broker-contact">
                    <button onclick="contactBroker('${broker.whatsapp}')">
                        <i class="fab fa-whatsapp"></i>
                        WhatsApp
                    </button>
                    <button onclick="callBroker('${broker.phone}')">
                        <i class="fas fa-phone"></i>
                        Ligar
                    </button>
                </div>
            `;
            brokersGrid.appendChild(brokerCard);
        });
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.selector-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Show selected step
        document.getElementById(`step-${step}`).classList.add('active');
        this.currentStep = step;
    }

    goBackToStates() {
        this.showStep('state');
        this.selectedState = null;
        this.selectedCity = null;
    }

    goBackToCities() {
        this.showStep('city');
        this.selectedCity = null;
    }

    // Contact methods
    contactWhatsApp() {
        const phoneNumber = '5511999999999';
        const message = 'Olá! Gostaria de mais informações sobre os empreendimentos da Zeralotes.';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    sendEmail() {
        const email = 'contato@zeralotes.com';
        const subject = 'Informações sobre Empreendimentos Zeralotes';
        const body = 'Olá! Gostaria de receber mais informações sobre os empreendimentos da Zeralotes.';
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = url;
    }

    makeCall() {
        const phoneNumber = '551133334444';
        window.location.href = `tel:${phoneNumber}`;
    }

    openMaps() {
        const address = 'Av. Paulista, 1000, São Paulo - SP';
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    }

    // Business hours and clock
    updateBusinessHours() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute;

        // Update status for each day
        this.updateDayStatus('weekday', dayOfWeek >= 1 && dayOfWeek <= 5, currentTime, 8 * 60, 18 * 60);
        this.updateDayStatus('saturday', dayOfWeek === 6, currentTime, 8 * 60, 14 * 60);
        this.updateDayStatus('sunday', dayOfWeek === 0, currentTime, 0, 0);
    }

    updateDayStatus(dayId, isToday, currentTime, openTime, closeTime) {
        const statusElement = document.getElementById(`${dayId}-status`);
        if (!statusElement) return;

        const icon = statusElement.querySelector('i');
        const text = statusElement.querySelector('span');

        if (isToday) {
            if (closeTime === 0) {
                // Closed day
                statusElement.className = 'status closed';
                text.textContent = 'Fechado';
            } else if (currentTime >= openTime && currentTime < closeTime) {
                // Open
                statusElement.className = 'status open';
                text.textContent = 'Aberto';
            } else {
                // Closed
                statusElement.className = 'status closed';
                text.textContent = 'Fechado';
            }
        } else {
            statusElement.className = 'status closed';
            text.textContent = 'Fechado';
        }
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const clockElement = document.getElementById('current-time');
            if (clockElement) {
                clockElement.textContent = timeString;
            }
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    // Data initialization
    initializeBrokersData() {
        return {
            sp: {
                'sao-paulo': [
                    {
                        name: 'Carlos Silva',
                        specialty: 'Especialista em Apartamentos',
                        photo: 'https://via.placeholder.com/80x80/00ff88/000000?text=CS',
                        whatsapp: '5511999999999',
                        phone: '551133334444'
                    },
                    {
                        name: 'Ana Santos',
                        specialty: 'Especialista em Casas',
                        photo: 'https://via.placeholder.com/80x80/00ff88/000000?text=AS',
                        whatsapp: '5511888888888',
                        phone: '551122223333'
                    }
                ],
                'campinas': [
                    {
                        name: 'Roberto Lima',
                        specialty: 'Especialista em Terrenos',
                        photo: 'https://via.placeholder.com/80x80/00ff88/000000?text=RL',
                        whatsapp: '5511777777777',
                        phone: '551111112222'
                    }
                ]
            },
            rj: {
                'rio-janeiro': [
                    {
                        name: 'Maria Costa',
                        specialty: 'Especialista em Apartamentos',
                        photo: 'https://via.placeholder.com/80x80/00ff88/000000?text=MC',
                        whatsapp: '5521999999999',
                        phone: '552133334444'
                    }
                ]
            },
            df: {
                'brasilia': [
                    {
                        name: 'João Oliveira',
                        specialty: 'Especialista em Casas',
                        photo: 'https://via.placeholder.com/80x80/00ff88/000000?text=JO',
                        whatsapp: '5561999999999',
                        phone: '556133334444'
                    }
                ]
            }
        };
    }

    getCitiesByState(stateCode) {
        const cities = {
            sp: [
                { name: 'São Paulo', code: 'sao-paulo' },
                { name: 'Campinas', code: 'campinas' },
                { name: 'Santos', code: 'santos' }
            ],
            rj: [
                { name: 'Rio de Janeiro', code: 'rio-janeiro' },
                { name: 'Niterói', code: 'niteroi' }
            ],
            df: [
                { name: 'Brasília', code: 'brasilia' }
            ],
            mg: [
                { name: 'Belo Horizonte', code: 'belo-horizonte' },
                { name: 'Uberlândia', code: 'uberlandia' }
            ],
            rs: [
                { name: 'Porto Alegre', code: 'porto-alegre' }
            ],
            pr: [
                { name: 'Curitiba', code: 'curitiba' }
            ]
        };
        return cities[stateCode] || [];
    }

    getBrokersByLocation(stateCode, cityCode) {
        return this.brokersData[stateCode]?.[cityCode] || [];
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        const bgColor = type === 'success' ? 'var(--primary-green)' : type === 'error' ? '#ff6b6b' : 'var(--dark-gray)';
        const textColor = type === 'success' ? 'var(--black)' : 'var(--white)';
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
            color: ${textColor};
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
}

// Global broker contact functions
window.contactBroker = (whatsapp) => {
    const message = 'Olá! Tenho interesse em um empreendimento da Zeralotes. Gostaria de mais informações.';
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

window.callBroker = (phone) => {
    window.location.href = `tel:${phone}`;
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.faleConoscoController = new FaleConoscoController();
});

// Export for use in other modules
window.FaleConoscoController = FaleConoscoController;
