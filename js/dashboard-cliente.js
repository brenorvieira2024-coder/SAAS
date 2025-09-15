// Dashboard Cliente Controller

class DashboardClienteController {
    constructor() {
        this.currentSection = 'overview';
        this.userData = null;
        this.checklistData = null;
        
        this.init();
        this.setupEventListeners();
        this.loadUserData();
        this.loadChecklistData();
    }

    init() {
        this.checkAuth();
        this.setupAnimations();
    }

    checkAuth() {
        const token = localStorage.getItem('zeralotes_token');
        const userType = localStorage.getItem('zeralotes_user_type');
        
        if (!token || userType !== 'cliente') {
            window.location.href = 'login.html';
            return;
        }
        
        this.userData = JSON.parse(localStorage.getItem('zeralotes_user_data') || '{}');
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // Checklist tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.showChecklistCategory(category);
            });
        });

        // Global logout function
        window.logout = () => this.logout();
    }

    setupAnimations() {
        // Animate elements on load
        const elements = document.querySelectorAll('.stat-card, .timeline-item, .activity-item, .checklist-item');
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

    loadUserData() {
        if (this.userData) {
            // Update profile information
            const profileName = document.getElementById('profile-name');
            const profileEmail = document.getElementById('profile-email');
            const userName = document.getElementById('user-name');
            const profileAvatar = document.getElementById('profile-avatar');
            
            if (profileName) profileName.textContent = this.userData.name || 'Cliente';
            if (profileEmail) profileEmail.textContent = this.userData.email || 'cliente@teste.com';
            if (userName) userName.textContent = this.userData.name || 'Cliente';
            
            // Update avatar if available
            if (profileAvatar && this.userData.avatar) {
                profileAvatar.src = this.userData.avatar;
            }
        }
    }

    loadChecklistData() {
        // Load checklist data from localStorage or API
        this.checklistData = JSON.parse(localStorage.getItem('zeralotes_checklist_data') || JSON.stringify({
            'pre-obra': {
                name: 'Pré-Obra',
                progress: 100,
                items: [
                    {
                        id: 'licenca',
                        title: 'Licença de Construção',
                        description: 'Documentação aprovada pela prefeitura',
                        status: 'completed',
                        date: '2023-12-15'
                    },
                    {
                        id: 'projeto',
                        title: 'Projeto Executivo',
                        description: 'Projeto detalhado aprovado',
                        status: 'completed',
                        date: '2023-12-20'
                    },
                    {
                        id: 'contrato',
                        title: 'Contrato de Construção',
                        description: 'Contrato assinado com construtora',
                        status: 'completed',
                        date: '2023-12-22'
                    }
                ]
            },
            'fundacao': {
                name: 'Fundação',
                progress: 100,
                items: [
                    {
                        id: 'escavacao',
                        title: 'Escavação',
                        description: 'Escavação do terreno concluída',
                        status: 'completed',
                        date: '2024-01-05'
                    },
                    {
                        id: 'armadura',
                        title: 'Armadura da Fundação',
                        description: 'Armadura de aço instalada',
                        status: 'completed',
                        date: '2024-01-10'
                    },
                    {
                        id: 'concretagem',
                        title: 'Concretagem da Fundação',
                        description: 'Concreto da fundação aplicado',
                        status: 'completed',
                        date: '2024-01-15'
                    }
                ]
            },
            'estrutura': {
                name: 'Estrutura',
                progress: 100,
                items: [
                    {
                        id: 'estrutura-concreto',
                        title: 'Estrutura de Concreto',
                        description: 'Estrutura principal concluída',
                        status: 'completed',
                        date: '2024-02-20'
                    },
                    {
                        id: 'lajes',
                        title: 'Lajes',
                        description: 'Todas as lajes foram concretadas',
                        status: 'completed',
                        date: '2024-02-25'
                    },
                    {
                        id: 'paredes',
                        title: 'Paredes Estruturais',
                        description: 'Paredes de concreto concluídas',
                        status: 'completed',
                        date: '2024-03-05'
                    }
                ]
            },
            'acabamento': {
                name: 'Acabamento',
                progress: 60,
                items: [
                    {
                        id: 'eletrica',
                        title: 'Instalações Elétricas',
                        description: 'Fiação e quadros elétricos instalados',
                        status: 'completed',
                        date: '2024-03-10'
                    },
                    {
                        id: 'hidraulica',
                        title: 'Instalações Hidráulicas',
                        description: 'Tubulações de água e esgoto',
                        status: 'completed',
                        date: '2024-03-15'
                    },
                    {
                        id: 'revestimento',
                        title: 'Revestimentos',
                        description: 'Pisos e azulejos em andamento',
                        status: 'in-progress',
                        date: null
                    },
                    {
                        id: 'pintura',
                        title: 'Pintura',
                        description: 'Aguardando conclusão dos revestimentos',
                        status: 'pending',
                        date: null
                    },
                    {
                        id: 'esquadrias',
                        title: 'Portas e Janelas',
                        description: 'Instalação de esquadrias',
                        status: 'pending',
                        date: null
                    }
                ]
            },
            'entrega': {
                name: 'Entrega',
                progress: 0,
                items: [
                    {
                        id: 'vistoria',
                        title: 'Vistoria Final',
                        description: 'Vistoria técnica de entrega',
                        status: 'pending',
                        date: null
                    },
                    {
                        id: 'documentacao',
                        title: 'Documentação de Entrega',
                        description: 'Documentos finais e chaves',
                        status: 'pending',
                        date: null
                    },
                    {
                        id: 'chaves',
                        title: 'Entrega das Chaves',
                        description: 'Cerimônia de entrega',
                        status: 'pending',
                        date: null
                    }
                ]
            }
        }));

        this.updateChecklistDisplay();
    }

    updateChecklistDisplay() {
        // Update progress bars and item statuses
        Object.keys(this.checklistData).forEach(categoryId => {
            const category = this.checklistData[categoryId];
            const progressBar = document.querySelector(`#${categoryId} .progress-fill`);
            const progressText = document.querySelector(`#${categoryId} .category-progress span`);
            
            if (progressBar) {
                progressBar.style.width = `${category.progress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${category.progress}% Concluído`;
            }
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section-content').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to nav item
        const navItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        this.currentSection = sectionId;

        // Load section-specific data
        this.loadSectionData(sectionId);
    }

    showChecklistCategory(categoryId) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Hide all categories
        document.querySelectorAll('.checklist-category').forEach(category => {
            category.classList.remove('active');
        });

        // Show selected category
        const targetCategory = document.getElementById(categoryId);
        if (targetCategory) {
            targetCategory.classList.add('active');
        }

        // Add active class to tab
        const tabBtn = document.querySelector(`[data-category="${categoryId}"]`);
        if (tabBtn) {
            tabBtn.classList.add('active');
        }
    }

    loadSectionData(sectionId) {
        switch (sectionId) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'checklist':
                this.loadChecklistData();
                break;
            case 'negotiations':
                this.loadNegotiationsData();
                break;
            case 'documents':
                this.loadDocumentsData();
                break;
            case 'messages':
                this.loadMessagesData();
                break;
            case 'profile':
                this.loadProfileData();
                break;
        }
    }

    loadOverviewData() {
        // Update stats cards with real data
        this.updateStatsCards();
        this.updateProgressTimeline();
        this.updateRecentActivity();
    }

    updateStatsCards() {
        // Update property information
        const propertyCard = document.querySelector('.stat-card:first-child');
        if (propertyCard) {
            const propertyData = {
                name: 'Residencial Futuro Verde',
                unit: 'Apartamento 1203',
                value: 'R$ 450.000'
            };
            
            const title = propertyCard.querySelector('h3');
            const unit = propertyCard.querySelector('p');
            const value = propertyCard.querySelector('.stat-value');
            
            if (title) title.textContent = propertyData.name;
            if (unit) unit.textContent = propertyData.unit;
            if (value) value.textContent = propertyData.value;
        }

        // Update progress
        const progressCard = document.querySelector('.stat-card:nth-child(2)');
        if (progressCard) {
            const progressValue = progressCard.querySelector('.stat-value');
            if (progressValue) progressValue.textContent = '75%';
        }

        // Update delivery date
        const deliveryCard = document.querySelector('.stat-card:nth-child(3)');
        if (deliveryCard) {
            const deliveryValue = deliveryCard.querySelector('.stat-value');
            if (deliveryValue) deliveryValue.textContent = 'Jun/2024';
        }

        // Update contract status
        const contractCard = document.querySelector('.stat-card:nth-child(4)');
        if (contractCard) {
            const contractValue = contractCard.querySelector('.stat-value');
            if (contractValue) contractValue.textContent = 'Assinado';
        }
    }

    updateProgressTimeline() {
        // Update timeline items with real data
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineData = [
            { status: 'completed', title: 'Fundação', description: 'Fundação concluída com sucesso', date: 'Jan 2024' },
            { status: 'completed', title: 'Estrutura', description: 'Estrutura de concreto finalizada', date: 'Mar 2024' },
            { status: 'in-progress', title: 'Acabamento', description: 'Acabamento em andamento', date: 'Abr 2024' },
            { status: 'pending', title: 'Entrega', description: 'Aguardando conclusão', date: 'Jun 2024' }
        ];

        timelineItems.forEach((item, index) => {
            if (timelineData[index]) {
                const data = timelineData[index];
                item.className = `timeline-item ${data.status}`;
                
                const title = item.querySelector('h3');
                const description = item.querySelector('p');
                const date = item.querySelector('.timeline-date');
                
                if (title) title.textContent = data.title;
                if (description) description.textContent = data.description;
                if (date) date.textContent = data.date;
            }
        });
    }

    updateRecentActivity() {
        // Update activity list with real data
        const activityItems = document.querySelectorAll('.activity-item');
        const activityData = [
            {
                icon: 'fas fa-camera',
                title: 'Novas fotos adicionadas',
                description: '15 fotos do progresso da obra foram adicionadas',
                time: '2 horas atrás'
            },
            {
                icon: 'fas fa-file-signature',
                title: 'Documento atualizado',
                description: 'Contrato de financiamento foi atualizado',
                time: '1 dia atrás'
            },
            {
                icon: 'fas fa-comment',
                title: 'Nova mensagem',
                description: 'Carlos Silva enviou uma mensagem',
                time: '2 dias atrás'
            }
        ];

        activityItems.forEach((item, index) => {
            if (activityData[index]) {
                const data = activityData[index];
                
                const icon = item.querySelector('.activity-icon i');
                const title = item.querySelector('h4');
                const description = item.querySelector('p');
                const time = item.querySelector('.activity-time');
                
                if (icon) icon.className = data.icon;
                if (title) title.textContent = data.title;
                if (description) description.textContent = data.description;
                if (time) time.textContent = data.time;
            }
        });
    }

    loadNegotiationsData() {
        // Load negotiations data
        console.log('Loading negotiations data...');
    }

    loadDocumentsData() {
        // Load documents data
        console.log('Loading documents data...');
    }

    loadMessagesData() {
        // Load messages data
        console.log('Loading messages data...');
    }

    loadProfileData() {
        // Load profile data
        console.log('Loading profile data...');
    }

    // Utility methods
    formatDate(dateString) {
        if (!dateString) return 'Pendente';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short'
        });
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
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
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    logout() {
        // Clear authentication data
        localStorage.removeItem('zeralotes_token');
        localStorage.removeItem('zeralotes_user_type');
        localStorage.removeItem('zeralotes_user_data');
        
        // Redirect to login
        window.location.href = 'login.html';
    }

    // Real-time updates
    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateProgressData();
        }, 30000); // Update every 30 seconds
    }

    updateProgressData() {
        // Simulate progress updates
        const progressCards = document.querySelectorAll('.stat-card');
        progressCards.forEach(card => {
            card.style.animation = 'pulse 1s ease';
            setTimeout(() => {
                card.style.animation = '';
            }, 1000);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardClienteController = new DashboardClienteController();
});

// Export for use in other modules
window.DashboardClienteController = DashboardClienteController;
