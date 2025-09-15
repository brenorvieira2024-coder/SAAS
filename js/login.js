// Login Page Controller

class LoginController {
    constructor() {
        this.currentUserType = null;
        this.currentForm = 'selection';
        this.isLoading = false;
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.setupAnimations();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Global functions
        window.selectUserType = (type) => this.selectUserType(type);
        window.goBackToSelection = () => this.goBackToSelection();
        window.goBackToLogin = () => this.goBackToLogin();
        window.togglePassword = (inputId) => this.togglePassword(inputId);
        window.handleClienteLogin = (e) => this.handleClienteLogin(e);
        window.handleCorretorLogin = (e) => this.handleCorretorLogin(e);
        window.handleClienteRegister = (e) => this.handleClienteRegister(e);
        window.handleCorretorRegister = (e) => this.handleCorretorRegister(e);
        window.showRegisterForm = (type) => this.showRegisterForm(type);
    }

    setupAnimations() {
        // Animate elements on load
        const elements = document.querySelectorAll('.type-card, .login-form, .register-form');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        });

        // Trigger animations
        setTimeout(() => {
            elements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        }, 100);
    }

    checkAuthStatus() {
        // Check if user is already logged in
        const token = localStorage.getItem('zeralotes_token');
        const userType = localStorage.getItem('zeralotes_user_type');
        
        if (token && userType) {
            this.redirectToDashboard(userType);
        }
    }

    selectUserType(type) {
        this.currentUserType = type;
        
        // Update UI
        document.querySelectorAll('.type-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelector(`[data-type="${type}"]`).classList.add('selected');
        
        // Show login form after delay
        setTimeout(() => {
            this.showLoginForm(type);
        }, 300);
    }

    showLoginForm(type) {
        // Hide selection
        document.getElementById('user-type-selection').style.display = 'none';
        
        // Show forms container
        document.getElementById('login-forms').style.display = 'block';
        
        // Show specific form
        document.querySelectorAll('.login-form').forEach(form => {
            form.style.display = 'none';
        });
        
        document.getElementById(`${type}-form`).style.display = 'block';
        
        this.currentForm = 'login';
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = document.querySelector(`#${type}-form input`);
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }

    showRegisterForm(type) {
        // Hide login forms
        document.getElementById('login-forms').style.display = 'none';
        
        // Show register forms
        document.getElementById('register-forms').style.display = 'block';
        
        // Show specific register form
        document.querySelectorAll('.register-form').forEach(form => {
            form.style.display = 'none';
        });
        
        document.getElementById(`${type}-register-form`).style.display = 'block';
        
        this.currentForm = 'register';
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = document.querySelector(`#${type}-register-form input`);
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }

    goBackToSelection() {
        // Hide forms
        document.getElementById('login-forms').style.display = 'none';
        document.getElementById('register-forms').style.display = 'none';
        
        // Show selection
        document.getElementById('user-type-selection').style.display = 'block';
        
        // Reset selection
        document.querySelectorAll('.type-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.currentForm = 'selection';
        this.currentUserType = null;
    }

    goBackToLogin() {
        // Hide register forms
        document.getElementById('register-forms').style.display = 'none';
        
        // Show login forms
        document.getElementById('login-forms').style.display = 'block';
        
        this.currentForm = 'login';
    }

    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const button = input.parentElement.querySelector('.toggle-password');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    handleClienteLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateLoginForm(data)) {
            return;
        }
        
        this.performLogin('cliente', data);
    }

    handleCorretorLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateLoginForm(data)) {
            return;
        }
        
        this.performLogin('corretor', data);
    }

    handleClienteRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateRegisterForm(data, 'cliente')) {
            return;
        }
        
        this.performRegister('cliente', data);
    }

    handleCorretorRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateRegisterForm(data, 'corretor')) {
            return;
        }
        
        this.performRegister('corretor', data);
    }

    validateLoginForm(data) {
        let isValid = true;
        
        // Email validation
        if (!data.email || !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Por favor, insira um e-mail válido');
            isValid = false;
        }
        
        // Password validation
        if (!data.password || data.password.length < 6) {
            this.showFieldError('password', 'A senha deve ter pelo menos 6 caracteres');
            isValid = false;
        }
        
        return isValid;
    }

    validateRegisterForm(data, type) {
        let isValid = true;
        
        // Name validation
        if (!data.name || data.name.length < 2) {
            this.showFieldError('name', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }
        
        // Email validation
        if (!data.email || !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Por favor, insira um e-mail válido');
            isValid = false;
        }
        
        // Phone validation
        if (!data.phone || data.phone.length < 10) {
            this.showFieldError('phone', 'Por favor, insira um telefone válido');
            isValid = false;
        }
        
        if (type === 'cliente') {
            // Password validation
            if (!data.password || data.password.length < 6) {
                this.showFieldError('password', 'A senha deve ter pelo menos 6 caracteres');
                isValid = false;
            }
            
            // Confirm password validation
            if (data.password !== data.confirmPassword) {
                this.showFieldError('confirmPassword', 'As senhas não coincidem');
                isValid = false;
            }
            
            // Terms validation
            if (!data.terms) {
                this.showNotification('Você deve aceitar os termos de uso', 'error');
                isValid = false;
            }
        }
        
        if (type === 'corretor') {
            // CRECI validation
            if (!data.creci || data.creci.length < 5) {
                this.showFieldError('creci', 'Por favor, insira um CRECI válido');
                isValid = false;
            }
            
            // Experience validation
            if (!data.experience || data.experience < 0) {
                this.showFieldError('experience', 'Por favor, insira uma experiência válida');
                isValid = false;
            }
            
            // Specialties validation
            if (!data.specialties || data.specialties.length < 3) {
                this.showFieldError('specialties', 'Por favor, insira suas especialidades');
                isValid = false;
            }
            
            // Message validation
            if (!data.message || data.message.length < 10) {
                this.showFieldError('message', 'Por favor, escreva uma mensagem mais detalhada');
                isValid = false;
            }
        }
        
        return isValid;
    }

    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
        
        // Clear error on input
        field.addEventListener('input', () => {
            formGroup.classList.remove('error');
            errorDiv.remove();
        }, { once: true });
    }

    performLogin(type, data) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const submitBtn = document.querySelector(`#${type}-login-form button[type="submit"]`);
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Mock authentication
            const mockUsers = {
                cliente: {
                    email: 'cliente@teste.com',
                    password: '123456'
                },
                corretor: {
                    email: 'corretor@teste.com',
                    password: '123456'
                }
            };
            
            const user = mockUsers[type];
            
            if (data.email === user.email && data.password === user.password) {
                // Successful login
                const token = this.generateToken();
                const userData = {
                    id: utils.generateId(),
                    type: type,
                    email: data.email,
                    name: type === 'cliente' ? 'João Silva' : 'Carlos Corretor',
                    loginTime: new Date().toISOString()
                };
                
                // Store auth data
                localStorage.setItem('zeralotes_token', token);
                localStorage.setItem('zeralotes_user_type', type);
                localStorage.setItem('zeralotes_user_data', JSON.stringify(userData));
                
                this.showNotification('Login realizado com sucesso!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    this.redirectToDashboard(type);
                }, 1000);
            } else {
                // Failed login
                this.showNotification('E-mail ou senha incorretos', 'error');
            }
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.isLoading = false;
        }, 2000);
    }

    performRegister(type, data) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const submitBtn = document.querySelector(`#${type}-register-form button[type="submit"]`);
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            if (type === 'cliente') {
                // Successful registration
                this.showNotification('Conta criada com sucesso! Você pode fazer login agora.', 'success');
                
                // Go back to login
                setTimeout(() => {
                    this.goBackToLogin();
                }, 2000);
            } else {
                // Corretor registration request
                this.showNotification('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
                
                // Go back to login
                setTimeout(() => {
                    this.goBackToLogin();
                }, 2000);
            }
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.isLoading = false;
        }, 2000);
    }

    redirectToDashboard(type) {
        if (type === 'cliente') {
            window.location.href = 'dashboard-cliente.html';
        } else {
            window.location.href = 'dashboard-corretor.html';
        }
    }

    generateToken() {
        return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // Utility methods
    clearFormErrors() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    }

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            this.clearFormErrors();
        }
    }

    // Handle forgot password
    handleForgotPassword(type) {
        this.showNotification('Funcionalidade de recuperação de senha em desenvolvimento', 'info');
    }

    // Handle terms and privacy
    showTerms() {
        this.showNotification('Termos de uso em desenvolvimento', 'info');
    }

    showPrivacy() {
        this.showNotification('Política de privacidade em desenvolvimento', 'info');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loginController = new LoginController();
});

// Export for use in other modules
window.LoginController = LoginController;
