// Blog Page Controller

class BlogController {
    constructor() {
        this.posts = [];
        this.currentPage = 1;
        this.postsPerPage = 5;
        this.isLoading = false;
        this.likedPosts = new Set();
        
        this.init();
        this.setupEventListeners();
        this.loadPosts();
    }

    init() {
        this.setupAnimations();
        this.setupIntersectionObservers();
        this.loadLikedPosts();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('blog-search');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => {
                this.searchPosts(e.target.value);
            }, 300));
        }

        // Category filters
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByCategory(item.dataset.category);
            });
        });

        // Global functions
        window.likePost = (postId) => this.likePost(postId);
        window.commentPost = (postId) => this.commentPost(postId);
        window.sharePost = (postId) => this.sharePost(postId);
        window.playVideo = (videoId) => this.playVideo(videoId);
        window.loadMorePosts = () => this.loadMorePosts();
        window.searchPosts = () => this.searchPosts();
        window.subscribeNewsletter = (e) => this.subscribeNewsletter(e);
    }

    setupAnimations() {
        // Animate posts on scroll
        const posts = document.querySelectorAll('.post');
        posts.forEach((post, index) => {
            post.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    setupIntersectionObservers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.post, .sidebar-widget').forEach(el => {
            observer.observe(el);
        });
    }

    loadPosts() {
        // Simulate loading posts from API
        this.posts = [
            {
                id: 'featured-1',
                title: 'Tendências do Mercado Imobiliário 2024: O Futuro é Agora',
                content: 'O mercado imobiliário está passando por uma transformação sem precedentes...',
                author: 'Carlos Silva',
                authorRole: 'CEO Zeralotes',
                authorAvatar: 'https://via.placeholder.com/50x50/00ff88/000000?text=CS',
                publishDate: '2 horas atrás',
                readTime: '5 min',
                category: 'tendencias',
                tags: ['#Tendências', '#MercadoImobiliário', '#2024', '#Inovação'],
                media: {
                    type: 'image',
                    url: 'https://via.placeholder.com/600x300/00ff88/000000?text=Tendências+2024'
                },
                stats: {
                    likes: 127,
                    comments: 23,
                    shares: 15
                },
                featured: true
            },
            {
                id: 'post-2',
                title: 'Como Escolher o Imóvel Ideal: Guia Completo',
                content: 'Encontrar o imóvel perfeito pode parecer uma tarefa difícil...',
                author: 'Ana Santos',
                authorRole: 'Arquiteta',
                authorAvatar: 'https://via.placeholder.com/50x50/00ff88/000000?text=AS',
                publishDate: '5 horas atrás',
                readTime: '7 min',
                category: 'dicas',
                tags: ['#Dicas', '#ImóvelIdeal', '#Guia'],
                media: {
                    type: 'image',
                    url: 'https://via.placeholder.com/600x300/00ff88/000000?text=Escolha+do+Imóvel'
                },
                stats: {
                    likes: 89,
                    comments: 12,
                    shares: 8
                },
                featured: false
            },
            {
                id: 'post-3',
                title: 'Financiamento Imobiliário: Tudo que Você Precisa Saber',
                content: 'O financiamento imobiliário é uma das principais formas de adquirir um imóvel...',
                author: 'Roberto Lima',
                authorRole: 'Especialista em Financiamento',
                authorAvatar: 'https://via.placeholder.com/50x50/00ff88/000000?text=RL',
                publishDate: '1 dia atrás',
                readTime: '6 min',
                category: 'financiamento',
                tags: ['#Financiamento', '#Investimento', '#DicasFinanceiras'],
                media: {
                    type: 'video',
                    url: 'https://via.placeholder.com/600x300/00ff88/000000?text=Video+Financiamento'
                },
                stats: {
                    likes: 156,
                    comments: 34,
                    shares: 22
                },
                featured: false
            },
            {
                id: 'post-4',
                title: 'Decoração Sustentável: Tendências Eco-Friendly',
                content: 'A sustentabilidade está em alta na decoração de interiores...',
                author: 'Maria Costa',
                authorRole: 'Designer de Interiores',
                authorAvatar: 'https://via.placeholder.com/50x50/00ff88/000000?text=MC',
                publishDate: '2 dias atrás',
                readTime: '4 min',
                category: 'decoracao',
                tags: ['#Decoração', '#Sustentabilidade', '#EcoFriendly', '#Interiores'],
                media: {
                    type: 'gallery',
                    urls: [
                        'https://via.placeholder.com/300x200/00ff88/000000?text=Decoração+1',
                        'https://via.placeholder.com/300x200/00ff88/000000?text=Decoração+2',
                        'https://via.placeholder.com/300x200/00ff88/000000?text=Decoração+3'
                    ]
                },
                stats: {
                    likes: 203,
                    comments: 45,
                    shares: 18
                },
                featured: false
            }
        ];
    }

    loadLikedPosts() {
        const liked = localStorage.getItem('zeralotes_liked_posts');
        if (liked) {
            this.likedPosts = new Set(JSON.parse(liked));
            this.updateLikeButtons();
        }
    }

    saveLikedPosts() {
        localStorage.setItem('zeralotes_liked_posts', JSON.stringify([...this.likedPosts]));
    }

    likePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const isLiked = this.likedPosts.has(postId);
        
        if (isLiked) {
            this.likedPosts.delete(postId);
            post.stats.likes--;
        } else {
            this.likedPosts.add(postId);
            post.stats.likes++;
        }

        this.saveLikedPosts();
        this.updateLikeButton(postId);
        this.showNotification(isLiked ? 'Post descurtido' : 'Post curtido!', 'success');
    }

    updateLikeButton(postId) {
        const likeBtn = document.querySelector(`[onclick="likePost('${postId}')"]`);
        if (!likeBtn) return;

        const isLiked = this.likedPosts.has(postId);
        const icon = likeBtn.querySelector('i');
        const count = likeBtn.querySelector('span');
        const post = this.posts.find(p => p.id === postId);

        if (isLiked) {
            likeBtn.classList.add('liked');
            icon.className = 'fas fa-heart';
        } else {
            likeBtn.classList.remove('liked');
            icon.className = 'far fa-heart';
        }

        if (count && post) {
            count.textContent = post.stats.likes;
        }
    }

    updateLikeButtons() {
        this.posts.forEach(post => {
            this.updateLikeButton(post.id);
        });
    }

    commentPost(postId) {
        // Simulate opening comment modal
        this.showNotification('Funcionalidade de comentários em desenvolvimento', 'info');
    }

    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.content,
                url: window.location.href
            }).then(() => {
                post.stats.shares++;
                this.updateShareButton(postId);
            });
        } else {
            // Fallback: copy to clipboard
            const url = `${window.location.origin}${window.location.pathname}#${postId}`;
            navigator.clipboard.writeText(url).then(() => {
                post.stats.shares++;
                this.updateShareButton(postId);
                this.showNotification('Link copiado para a área de transferência!', 'success');
            });
        }
    }

    updateShareButton(postId) {
        const shareBtn = document.querySelector(`[onclick="sharePost('${postId}')"]`);
        if (!shareBtn) return;

        const count = shareBtn.querySelector('span');
        const post = this.posts.find(p => p.id === postId);

        if (count && post) {
            count.textContent = post.stats.shares;
        }
    }

    playVideo(videoId) {
        // Simulate video player
        this.showNotification('Reprodutor de vídeo em desenvolvimento', 'info');
    }

    searchPosts(query = '') {
        if (!query) {
            query = document.getElementById('blog-search')?.value || '';
        }

        const posts = document.querySelectorAll('.post');
        const searchTerm = query.toLowerCase();

        posts.forEach(post => {
            const title = post.querySelector('h2')?.textContent.toLowerCase() || '';
            const content = post.querySelector('p')?.textContent.toLowerCase() || '';
            const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');

            if (title.includes(searchTerm) || content.includes(searchTerm) || tags.includes(searchTerm)) {
                post.style.display = 'block';
                post.classList.add('search-match');
            } else {
                post.style.display = 'none';
                post.classList.remove('search-match');
            }
        });

        if (searchTerm) {
            this.showNotification(`${posts.length} posts encontrados para "${query}"`, 'info');
        }
    }

    filterByCategory(category) {
        const posts = document.querySelectorAll('.post');
        const categoryItems = document.querySelectorAll('.category-item');

        // Update active category
        categoryItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.category === category) {
                item.classList.add('active');
            }
        });

        // Filter posts
        posts.forEach(post => {
            const postCategory = post.dataset.category;
            if (category === 'all' || postCategory === category) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });

        this.showNotification(`Mostrando posts da categoria: ${category}`, 'info');
    }

    loadMorePosts() {
        if (this.isLoading) return;

        this.isLoading = true;
        const loadMoreBtn = document.querySelector('.load-more button');
        const originalText = loadMoreBtn.innerHTML;
        
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        loadMoreBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Add more posts (simulated)
            this.addMorePosts();
            
            // Reset button
            loadMoreBtn.innerHTML = originalText;
            loadMoreBtn.disabled = false;
            this.isLoading = false;
            
            this.showNotification('Mais posts carregados!', 'success');
        }, 2000);
    }

    addMorePosts() {
        // Simulate adding more posts
        const newPosts = [
            {
                id: `post-${Date.now()}`,
                title: 'Novo Post Carregado',
                content: 'Este é um post carregado dinamicamente...',
                author: 'Autor Teste',
                authorRole: 'Especialista',
                authorAvatar: 'https://via.placeholder.com/50x50/00ff88/000000?text=AT',
                publishDate: 'Agora',
                readTime: '3 min',
                category: 'dicas',
                tags: ['#Novo', '#Teste'],
                media: {
                    type: 'image',
                    url: 'https://via.placeholder.com/600x300/00ff88/000000?text=Novo+Post'
                },
                stats: {
                    likes: 0,
                    comments: 0,
                    shares: 0
                },
                featured: false
            }
        ];

        // Add to DOM (simplified)
        this.showNotification('Funcionalidade de carregar mais posts em desenvolvimento', 'info');
    }

    subscribeNewsletter(e) {
        e.preventDefault();
        
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        
        if (!email) {
            this.showNotification('Por favor, insira um e-mail válido', 'error');
            return;
        }

        const submitBtn = form.querySelector('button');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscrevendo...';
        submitBtn.disabled = true;

        // Simulate subscription
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.showNotification('Inscrição realizada com sucesso!', 'success');
        }, 2000);
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

    // Utility methods
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    formatReadTime(minutes) {
        return `${minutes} min de leitura`;
    }

    // Analytics tracking
    trackPostView(postId) {
        // Simulate analytics tracking
        console.log(`Post viewed: ${postId}`);
    }

    trackPostInteraction(postId, action) {
        // Simulate analytics tracking
        console.log(`Post interaction: ${postId} - ${action}`);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogController = new BlogController();
});

// Export for use in other modules
window.BlogController = BlogController;
