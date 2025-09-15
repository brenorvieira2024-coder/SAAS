// Dashboard Corretor Controller

class DashboardCorretorController {
    constructor() {
        this.currentSection = 'overview';
        this.userData = null;
        this.clientsData = [];
        this.propertiesData = [];
        this.postsData = [];
        this.contentData = {
            images: [],
            calls: []
        };
        
        this.init();
        this.setupEventListeners();
        this.loadUserData();
        this.loadAllData();
    }

    init() {
        this.checkAuth();
        this.setupAnimations();
    }

    checkAuth() {
        const token = localStorage.getItem('zeralotes_token');
        const userType = localStorage.getItem('zeralotes_user_type');
        
        if (!token || userType !== 'corretor') {
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

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterProperties(filter);
            });
        });

        // Content tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.showContentTab(tab);
            });
        });

        // Client selector
        const clientSelector = document.getElementById('client-selector');
        if (clientSelector) {
            clientSelector.addEventListener('change', (e) => {
                this.loadClientChecklist(e.target.value);
            });
        }

        // Search functionality
        const clientSearch = document.getElementById('client-search');
        if (clientSearch) {
            clientSearch.addEventListener('input', utils.debounce((e) => {
                this.searchClients(e.target.value);
            }, 300));
        }

        // Global functions
        window.logout = () => this.logout();
        window.showAddClientModal = () => this.showModal('add-client-modal');
        window.showAddPropertyModal = () => this.showModal('add-property-modal');
        window.showAddPostModal = () => this.showModal('add-post-modal');
        window.closeModal = (modalId) => this.closeModal(modalId);
        window.addClient = (e) => this.addClient(e);
        window.addProperty = (e) => this.addProperty(e);
        window.addPost = (e) => this.addPost(e);
        window.searchClients = () => this.searchClients();
        window.uploadImage = (type) => this.uploadImage(type);
        window.showAddCallModal = () => this.showModal('add-call-modal');
        window.addValue = () => this.addValue();
    }

    setupAnimations() {
        // Animate elements on load
        const elements = document.querySelectorAll('.stat-card, .activity-item, .client-card, .property-card, .post-card');
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
            
            if (profileName) profileName.textContent = this.userData.name || 'Carlos Corretor';
            if (profileEmail) profileEmail.textContent = this.userData.email || 'corretor@teste.com';
            if (userName) userName.textContent = this.userData.name || 'Corretor';
            
            // Update avatar if available
            if (profileAvatar && this.userData.avatar) {
                profileAvatar.src = this.userData.avatar;
            }
        }
    }

    loadAllData() {
        this.loadClientsData();
        this.loadPropertiesData();
        this.loadPostsData();
        this.loadContentData();
    }

    loadClientsData() {
        // Load clients from localStorage or API
        this.clientsData = JSON.parse(localStorage.getItem('zeralotes_clients_data') || JSON.stringify([
            {
                id: '1',
                name: 'João Silva',
                email: 'joao@email.com',
                phone: '(11) 99999-9999',
                property: 'Residencial Futuro Verde',
                status: 'active',
                createdAt: '2024-01-15'
            },
            {
                id: '2',
                name: 'Maria Santos',
                email: 'maria@email.com',
                phone: '(11) 88888-8888',
                property: 'Casa Moderna Futuro',
                status: 'active',
                createdAt: '2024-01-20'
            },
            {
                id: '3',
                name: 'Pedro Costa',
                email: 'pedro@email.com',
                phone: '(11) 77777-7777',
                property: 'Apartamento Green',
                status: 'pending',
                createdAt: '2024-01-25'
            }
        ]));

        this.updateClientsDisplay();
        this.updateClientSelector();
    }

    loadPropertiesData() {
        // Load properties from localStorage or API
        this.propertiesData = JSON.parse(localStorage.getItem('zeralotes_properties_data') || JSON.stringify([
            {
                id: '1',
                name: 'Residencial Futuro Verde',
                type: 'apartamentos',
                location: 'São Paulo - SP',
                price: 450000,
                description: 'Empreendimento sustentável com tecnologia de ponta',
                status: 'active',
                createdAt: '2024-01-10'
            },
            {
                id: '2',
                name: 'Casa Moderna Futuro',
                type: 'casas',
                location: 'São Paulo - SP',
                price: 380000,
                description: 'Casa térrea moderna com design futurista',
                status: 'active',
                createdAt: '2024-01-12'
            },
            {
                id: '3',
                name: 'Terreno Premium',
                type: 'terrenos',
                location: 'Brasília - DF',
                price: 280000,
                description: 'Terreno plano e regular, ideal para construção',
                status: 'active',
                createdAt: '2024-01-14'
            }
        ]));

        this.updatePropertiesDisplay();
        this.updatePropertySelector();
    }

    loadPostsData() {
        // Load posts from localStorage or API
        this.postsData = JSON.parse(localStorage.getItem('zeralotes_posts_data') || JSON.stringify([
            {
                id: '1',
                title: 'Tendências do Mercado Imobiliário 2024',
                content: 'O mercado imobiliário está passando por uma transformação...',
                category: 'tendencias',
                status: 'published',
                createdAt: '2024-01-20'
            },
            {
                id: '2',
                title: 'Como Escolher o Imóvel Ideal',
                content: 'Encontrar o imóvel perfeito pode parecer uma tarefa difícil...',
                category: 'dicas',
                status: 'published',
                createdAt: '2024-01-18'
            }
        ]));

        this.updatePostsDisplay();
    }

    loadContentData() {
        // Load content data from localStorage or API
        this.contentData = JSON.parse(localStorage.getItem('zeralotes_content_data') || JSON.stringify({
            images: [
                {
                    id: '1',
                    url: 'https://via.placeholder.com/300x200/00ff88/000000?text=Property+1',
                    category: 'property',
                    title: 'Imagem do Empreendimento 1'
                },
                {
                    id: '2',
                    url: 'https://via.placeholder.com/300x200/00ff88/000000?text=Property+2',
                    category: 'property',
                    title: 'Imagem do Empreendimento 2'
                }
            ],
            calls: [
                {
                    id: '1',
                    title: 'Chamada Principal',
                    text: 'Descubra o último lançamento da Zeralotes',
                    status: 'active'
                },
                {
                    id: '2',
                    title: 'Chamada Secundária',
                    text: 'Imóveis do futuro, hoje',
                    status: 'active'
                }
            ]
        }));

        this.updateContentDisplay();
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

    loadSectionData(sectionId) {
        switch (sectionId) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'clients':
                this.loadClientsData();
                break;
            case 'properties':
                this.loadPropertiesData();
                break;
            case 'checklists':
                this.loadChecklistsData();
                break;
            case 'blog':
                this.loadPostsData();
                break;
            case 'content':
                this.loadContentData();
                break;
            case 'about':
                this.loadAboutData();
                break;
        }
    }

    loadOverviewData() {
        // Update stats cards
        this.updateStatsCards();
        this.updateRecentActivity();
    }

    updateStatsCards() {
        const stats = [
            { value: this.clientsData.length, label: 'Clientes Ativos' },
            { value: this.propertiesData.length, label: 'Empreendimentos' },
            { value: 8, label: 'Vendas' },
            { value: 'R$ 45.000', label: 'Comissões' }
        ];

        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            if (stats[index]) {
                const value = card.querySelector('.stat-value');
                if (value) value.textContent = stats[index].value;
            }
        });
    }

    updateRecentActivity() {
        const activities = [
            {
                icon: 'fas fa-user-plus',
                title: 'Novo cliente cadastrado',
                description: 'João Silva foi adicionado ao sistema',
                time: '1 hora atrás'
            },
            {
                icon: 'fas fa-home',
                title: 'Novo empreendimento',
                description: 'Residencial Futuro Verde foi cadastrado',
                time: '3 horas atrás'
            },
            {
                icon: 'fas fa-blog',
                title: 'Post publicado',
                description: '"Tendências do Mercado 2024" foi publicado',
                time: '1 dia atrás'
            }
        ];

        const activityItems = document.querySelectorAll('.activity-item');
        activityItems.forEach((item, index) => {
            if (activities[index]) {
                const data = activities[index];
                
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

    updateClientsDisplay() {
        const clientsGrid = document.getElementById('clients-grid');
        if (!clientsGrid) return;

        clientsGrid.innerHTML = '';

        if (this.clientsData.length === 0) {
            clientsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Nenhum cliente encontrado</h3>
                    <p>Adicione seu primeiro cliente para começar</p>
                </div>
            `;
            return;
        }

        this.clientsData.forEach(client => {
            const clientCard = this.createClientCard(client);
            clientsGrid.appendChild(clientCard);
        });
    }

    createClientCard(client) {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${client.name}</h3>
                    <p class="card-subtitle">${client.email}</p>
                </div>
                <div class="card-actions">
                    <button class="action-btn edit" onclick="editClient('${client.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteClient('${client.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="card-info">
                    <div class="info-item">
                        <i class="fas fa-phone"></i>
                        <span>${client.phone}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-home"></i>
                        <span>${client.property}</span>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <span class="card-status status-${client.status}">${this.getStatusText(client.status)}</span>
                <span class="card-date">${this.formatDate(client.createdAt)}</span>
            </div>
        `;
        return card;
    }

    updatePropertiesDisplay() {
        const propertiesGrid = document.getElementById('properties-grid');
        if (!propertiesGrid) return;

        propertiesGrid.innerHTML = '';

        if (this.propertiesData.length === 0) {
            propertiesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-home"></i>
                    <h3>Nenhum empreendimento encontrado</h3>
                    <p>Adicione seu primeiro empreendimento para começar</p>
                </div>
            `;
            return;
        }

        this.propertiesData.forEach(property => {
            const propertyCard = this.createPropertyCard(property);
            propertiesGrid.appendChild(propertyCard);
        });
    }

    createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${property.name}</h3>
                    <p class="card-subtitle">${this.getTypeText(property.type)}</p>
                </div>
                <div class="card-actions">
                    <button class="action-btn edit" onclick="editProperty('${property.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProperty('${property.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="card-info">
                    <div class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${property.location}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>${this.formatCurrency(property.price)}</span>
                    </div>
                </div>
                <p class="card-description">${property.description}</p>
            </div>
            <div class="card-footer">
                <span class="card-status status-${property.status}">${this.getStatusText(property.status)}</span>
                <span class="card-date">${this.formatDate(property.createdAt)}</span>
            </div>
        `;
        return card;
    }

    updatePostsDisplay() {
        const postsGrid = document.getElementById('posts-grid');
        if (!postsGrid) return;

        postsGrid.innerHTML = '';

        if (this.postsData.length === 0) {
            postsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-blog"></i>
                    <h3>Nenhum post encontrado</h3>
                    <p>Crie seu primeiro post para começar</p>
                </div>
            `;
            return;
        }

        this.postsData.forEach(post => {
            const postCard = this.createPostCard(post);
            postsGrid.appendChild(postCard);
        });
    }

    createPostCard(post) {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-subtitle">${this.getCategoryText(post.category)}</p>
                </div>
                <div class="card-actions">
                    <button class="action-btn edit" onclick="editPost('${post.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deletePost('${post.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <p class="card-description">${post.content.substring(0, 100)}...</p>
            </div>
            <div class="card-footer">
                <span class="card-status status-${post.status}">${this.getStatusText(post.status)}</span>
                <span class="card-date">${this.formatDate(post.createdAt)}</span>
            </div>
        `;
        return card;
    }

    updateClientSelector() {
        const selector = document.getElementById('client-selector');
        if (!selector) return;

        selector.innerHTML = '<option value="">Selecione um cliente</option>';
        this.clientsData.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            selector.appendChild(option);
        });
    }

    updatePropertySelector() {
        const selector = document.getElementById('client-property');
        if (!selector) return;

        selector.innerHTML = '<option value="">Selecione um empreendimento</option>';
        this.propertiesData.forEach(property => {
            const option = document.createElement('option');
            option.value = property.id;
            option.textContent = property.name;
            selector.appendChild(option);
        });
    }

    // Modal functions
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Form handlers
    addClient(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const newClient = {
            id: utils.generateId(),
            ...data,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        this.clientsData.push(newClient);
        this.saveClientsData();
        this.updateClientsDisplay();
        this.updateClientSelector();
        this.closeModal('add-client-modal');
        this.showNotification('Cliente adicionado com sucesso!', 'success');
        form.reset();
    }

    addProperty(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const newProperty = {
            id: utils.generateId(),
            ...data,
            price: parseFloat(data.price),
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        this.propertiesData.push(newProperty);
        this.savePropertiesData();
        this.updatePropertiesDisplay();
        this.updatePropertySelector();
        this.closeModal('add-property-modal');
        this.showNotification('Empreendimento adicionado com sucesso!', 'success');
        form.reset();
    }

    addPost(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const newPost = {
            id: utils.generateId(),
            ...data,
            status: 'published',
            createdAt: new Date().toISOString()
        };
        
        this.postsData.push(newPost);
        this.savePostsData();
        this.updatePostsDisplay();
        this.closeModal('add-post-modal');
        this.showNotification('Post publicado com sucesso!', 'success');
        form.reset();
    }

    // Data persistence
    saveClientsData() {
        localStorage.setItem('zeralotes_clients_data', JSON.stringify(this.clientsData));
    }

    savePropertiesData() {
        localStorage.setItem('zeralotes_properties_data', JSON.stringify(this.propertiesData));
    }

    savePostsData() {
        localStorage.setItem('zeralotes_posts_data', JSON.stringify(this.postsData));
    }

    saveContentData() {
        localStorage.setItem('zeralotes_content_data', JSON.stringify(this.contentData));
    }

    // Utility methods
    getStatusText(status) {
        const statusMap = {
            'active': 'Ativo',
            'pending': 'Pendente',
            'inactive': 'Inativo',
            'published': 'Publicado',
            'draft': 'Rascunho'
        };
        return statusMap[status] || status;
    }

    getTypeText(type) {
        const typeMap = {
            'casas': 'Casa',
            'apartamentos': 'Apartamento',
            'terrenos': 'Terreno'
        };
        return typeMap[type] || type;
    }

    getCategoryText(category) {
        const categoryMap = {
            'tendencias': 'Tendências',
            'dicas': 'Dicas',
            'financiamento': 'Financiamento',
            'decoracao': 'Decoração',
            'sustentabilidade': 'Sustentabilidade'
        };
        return categoryMap[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
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

    // Additional methods for other functionalities
    filterProperties(filter) {
        // Update active filter tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Filter properties
        const filteredProperties = filter === 'all' 
            ? this.propertiesData 
            : this.propertiesData.filter(property => property.type === filter);

        this.displayFilteredProperties(filteredProperties);
    }

    displayFilteredProperties(properties) {
        const propertiesGrid = document.getElementById('properties-grid');
        if (!propertiesGrid) return;

        propertiesGrid.innerHTML = '';

        if (properties.length === 0) {
            propertiesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-home"></i>
                    <h3>Nenhum empreendimento encontrado</h3>
                    <p>Tente ajustar os filtros</p>
                </div>
            `;
            return;
        }

        properties.forEach(property => {
            const propertyCard = this.createPropertyCard(property);
            propertiesGrid.appendChild(propertyCard);
        });
    }

    searchClients(query = '') {
        if (!query) {
            query = document.getElementById('client-search')?.value || '';
        }

        const filteredClients = this.clientsData.filter(client =>
            client.name.toLowerCase().includes(query.toLowerCase()) ||
            client.email.toLowerCase().includes(query.toLowerCase())
        );

        this.displayFilteredClients(filteredClients);
    }

    displayFilteredClients(clients) {
        const clientsGrid = document.getElementById('clients-grid');
        if (!clientsGrid) return;

        clientsGrid.innerHTML = '';

        if (clients.length === 0) {
            clientsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Nenhum cliente encontrado</h3>
                    <p>Tente ajustar sua busca</p>
                </div>
            `;
            return;
        }

        clients.forEach(client => {
            const clientCard = this.createClientCard(client);
            clientsGrid.appendChild(clientCard);
        });
    }

    loadClientChecklist(clientId) {
        if (!clientId) {
            document.getElementById('checklist-manager').innerHTML = `
                <div class="no-selection">
                    <i class="fas fa-user-check"></i>
                    <h3>Selecione um cliente</h3>
                    <p>Escolha um cliente para gerenciar seu checklist</p>
                </div>
            `;
            return;
        }

        // Load checklist for specific client
        const client = this.clientsData.find(c => c.id === clientId);
        if (client) {
            this.displayClientChecklist(client);
        }
    }

    displayClientChecklist(client) {
        const checklistManager = document.getElementById('checklist-manager');
        if (!checklistManager) return;

        checklistManager.innerHTML = `
            <div class="client-checklist">
                <h3>Checklist - ${client.name}</h3>
                <p>Empreendimento: ${client.property}</p>
                <div class="checklist-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 75%"></div>
                    </div>
                    <span>75% Concluído</span>
                </div>
                <div class="checklist-items">
                    <!-- Checklist items will be loaded here -->
                </div>
            </div>
        `;
    }

    showContentTab(tabId) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Hide all tab content
        document.querySelectorAll('.content-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        const tabBtn = document.querySelector(`[data-tab="${tabId}"]`);
        const tabContent = document.getElementById(`${tabId}-tab`);

        if (tabBtn) tabBtn.classList.add('active');
        if (tabContent) tabContent.classList.add('active');
    }

    updateContentDisplay() {
        // Update images display
        this.updateImagesDisplay();
        this.updateCallsDisplay();
    }

    updateImagesDisplay() {
        const imageGrid = document.querySelector('.image-grid');
        if (!imageGrid) return;

        imageGrid.innerHTML = '';

        this.contentData.images.forEach(image => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.innerHTML = `
                <img src="${image.url}" alt="${image.title}">
                <div class="image-overlay">
                    <div class="image-actions">
                        <button class="action-btn edit" onclick="editImage('${image.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteImage('${image.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            imageGrid.appendChild(imageItem);
        });
    }

    updateCallsDisplay() {
        const callsList = document.querySelector('.calls-list');
        if (!callsList) return;

        callsList.innerHTML = '';

        this.contentData.calls.forEach(call => {
            const callItem = document.createElement('div');
            callItem.className = 'call-item';
            callItem.innerHTML = `
                <div class="call-content">
                    <h4>${call.title}</h4>
                    <p>${call.text}</p>
                </div>
                <div class="call-actions">
                    <button class="action-btn edit" onclick="editCall('${call.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteCall('${call.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            callsList.appendChild(callItem);
        });
    }

    loadAboutData() {
        // Load about page data
        const aboutData = JSON.parse(localStorage.getItem('zeralotes_about_data') || JSON.stringify({
            title: 'CONSTRUINDO O FUTURO',
            subtitle: 'Há mais de uma década transformando sonhos em realidade através de empreendimentos inovadores e sustentáveis.',
            mission: 'Desenvolver empreendimentos imobiliários que não apenas atendem às necessidades dos nossos clientes, mas que também contribuem para um futuro mais sustentável e tecnológico.',
            values: [
                { id: '1', title: 'Inovação', description: 'Utilizamos as mais avançadas tecnologias' },
                { id: '2', title: 'Sustentabilidade', description: 'Comprometidos com o meio ambiente' },
                { id: '3', title: 'Transparência', description: 'Comunicação clara e honesta' },
                { id: '4', title: 'Excelência', description: 'Buscamos sempre a perfeição' }
            ]
        }));

        // Populate form
        document.getElementById('about-title').value = aboutData.title;
        document.getElementById('about-subtitle').value = aboutData.subtitle;
        document.getElementById('about-mission').value = aboutData.mission;

        // Populate values
        this.updateValuesList(aboutData.values);
    }

    updateValuesList(values) {
        const valuesList = document.getElementById('values-list');
        if (!valuesList) return;

        valuesList.innerHTML = '';

        values.forEach(value => {
            const valueItem = document.createElement('div');
            valueItem.className = 'value-item';
            valueItem.innerHTML = `
                <input type="text" value="${value.title}" placeholder="Título do valor">
                <input type="text" value="${value.description}" placeholder="Descrição do valor">
                <button type="button" class="remove-value" onclick="removeValue('${value.id}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            valuesList.appendChild(valueItem);
        });
    }

    addValue() {
        const valuesList = document.getElementById('values-list');
        if (!valuesList) return;

        const valueItem = document.createElement('div');
        valueItem.className = 'value-item';
        valueItem.innerHTML = `
            <input type="text" placeholder="Título do valor">
            <input type="text" placeholder="Descrição do valor">
            <button type="button" class="remove-value" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        valuesList.appendChild(valueItem);
    }

    uploadImage(type) {
        // Simulate image upload
        this.showNotification('Funcionalidade de upload em desenvolvimento', 'info');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardCorretorController = new DashboardCorretorController();
});

// Export for use in other modules
window.DashboardCorretorController = DashboardCorretorController;
