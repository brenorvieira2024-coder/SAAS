// Blog Social - Interações e Funcionalidades

class BlogSocial {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.loadPosts();
    }

    setupEventListeners() {
        // Curtir posts
        document.addEventListener('click', (e) => {
            if (e.target.closest('.blog-post-engagement-btn')) {
                const btn = e.target.closest('.blog-post-engagement-btn');
                if (btn.textContent.includes('Curtir')) {
                    this.likePost(btn);
                } else if (btn.textContent.includes('Comentar')) {
                    this.toggleComments(btn);
                }
            }
        });

        // Comentários
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('blog-comment-submit')) {
                this.submitComment(e.target);
            }
        });

        // Criar post
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('blog-create-post-submit')) {
                this.createPost();
            }
        });

        // Seguir usuários
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('blog-suggestion-follow')) {
                this.followUser(e.target);
            }
        });

        // Tags clicáveis
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('blog-post-tag')) {
                this.filterByTag(e.target.textContent);
            }
        });
    }

    setupAnimations() {
        // Animar posts quando entram na tela
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.blog-post').forEach(post => {
            observer.observe(post);
        });
    }

    likePost(button) {
        const post = button.closest('.blog-post');
        const heartIcon = button.querySelector('i');
        const stats = post.querySelector('.blog-post-stats');
        const likeStat = stats.querySelector('.blog-post-stat');
        
        // Toggle like
        if (button.classList.contains('active')) {
            // Unlike
            button.classList.remove('active');
            heartIcon.className = 'far fa-heart';
            button.innerHTML = '<i class="far fa-heart"></i> Curtir';
            
            // Decrease count
            const count = parseInt(likeStat.textContent.match(/\d+/)[0]);
            likeStat.innerHTML = `<i class="fas fa-heart"></i> ${count - 1} curtidas`;
        } else {
            // Like
            button.classList.add('active');
            heartIcon.className = 'fas fa-heart';
            button.innerHTML = '<i class="fas fa-heart"></i> Curtido';
            
            // Increase count
            const count = parseInt(likeStat.textContent.match(/\d+/)[0]);
            likeStat.innerHTML = `<i class="fas fa-heart"></i> ${count + 1} curtidas`;
            
            // Animation
            button.style.animation = 'heartBeat 0.6s ease';
            setTimeout(() => {
                button.style.animation = '';
            }, 600);
        }

        this.showNotification('Post curtido!', 'success');
    }

    toggleComments(button) {
        const post = button.closest('.blog-post');
        const comments = post.querySelector('.blog-post-comments');
        
        if (comments.classList.contains('expanded')) {
            comments.classList.remove('expanded');
            button.innerHTML = '<i class="far fa-comment"></i> Comentar';
        } else {
            comments.classList.add('expanded');
            button.innerHTML = '<i class="fas fa-comment"></i> Ocultar';
        }
    }

    submitComment(button) {
        const form = button.closest('.blog-comment-form');
        const input = form.querySelector('.blog-comment-input');
        const text = input.value.trim();
        
        if (!text) {
            this.showNotification('Digite um comentário!', 'error');
            return;
        }

        // Create comment element
        const commentsContainer = form.parentElement;
        const newComment = document.createElement('div');
        newComment.className = 'blog-comment';
        newComment.innerHTML = `
            <img src="https://via.placeholder.com/35x35/00ff88/000000?text=U" alt="Usuário" class="blog-comment-avatar">
            <div class="blog-comment-content">
                <div class="blog-comment-author">Você</div>
                <div class="blog-comment-text">${text}</div>
                <div class="blog-comment-meta">
                    <span>Agora</span>
                    <button class="blog-comment-action">Curtir</button>
                    <button class="blog-comment-action">Responder</button>
                </div>
            </div>
        `;

        // Insert before form
        commentsContainer.insertBefore(newComment, form);
        
        // Clear input
        input.value = '';
        
        // Update comment count
        const post = form.closest('.blog-post');
        const commentStat = post.querySelector('.blog-post-stats .blog-post-stat:nth-child(2)');
        const count = parseInt(commentStat.textContent.match(/\d+/)[0]);
        commentStat.innerHTML = `<i class="fas fa-comment"></i> ${count + 1} comentários`;

        this.showNotification('Comentário publicado!', 'success');
    }

    createPost() {
        const input = document.querySelector('.blog-create-post-input');
        const text = input.value.trim();
        
        if (!text) {
            this.showNotification('Digite algo para publicar!', 'error');
            return;
        }

        // Create new post
        const feed = document.querySelector('.blog-feed');
        const newPost = document.createElement('article');
        newPost.className = 'blog-post';
        newPost.innerHTML = `
            <div class="blog-post-header">
                <img src="https://via.placeholder.com/50x50/00ff88/000000?text=U" alt="Usuário" class="blog-post-avatar">
                <div class="blog-post-author">
                    <h4>Você</h4>
                    <div class="blog-post-meta">
                        <span class="blog-post-time">
                            <i class="fas fa-clock"></i>
                            Agora
                        </span>
                    </div>
                </div>
                <div class="blog-post-actions">
                    <button class="blog-post-action" title="Mais opções">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            
            <div class="blog-post-content">
                <div class="blog-post-text">
                    <p>${text}</p>
                </div>
            </div>
            
            <div class="blog-post-interactions">
                <div class="blog-post-stats">
                    <span class="blog-post-stat">
                        <i class="fas fa-heart"></i>
                        0 curtidas
                    </span>
                    <span class="blog-post-stat">
                        <i class="fas fa-comment"></i>
                        0 comentários
                    </span>
                    <span class="blog-post-stat">
                        <i class="fas fa-share"></i>
                        0 compartilhamentos
                    </span>
                </div>
                <div class="blog-post-engagement">
                    <button class="blog-post-engagement-btn" onclick="likePost(this)">
                        <i class="far fa-heart"></i>
                        Curtir
                    </button>
                    <button class="blog-post-engagement-btn" onclick="toggleComments(this)">
                        <i class="far fa-comment"></i>
                        Comentar
                    </button>
                    <button class="blog-post-engagement-btn">
                        <i class="fas fa-share"></i>
                        Compartilhar
                    </button>
                </div>
            </div>
            
            <div class="blog-post-comments">
                <div class="blog-comment-form">
                    <img src="https://via.placeholder.com/35x35/00ff88/000000?text=U" alt="Usuário" class="blog-comment-avatar">
                    <input type="text" class="blog-comment-input" placeholder="Escreva um comentário...">
                    <button class="blog-comment-submit">Publicar</button>
                </div>
            </div>
        `;

        // Insert at top of feed
        feed.insertBefore(newPost, feed.firstChild);
        
        // Clear input
        input.value = '';
        
        this.showNotification('Post publicado com sucesso!', 'success');
    }

    followUser(button) {
        const suggestion = button.closest('.blog-suggestion');
        const name = suggestion.querySelector('.blog-suggestion-name').textContent;
        
        if (button.textContent === 'Seguir') {
            button.textContent = 'Seguindo';
            button.style.background = 'var(--neon-green)';
            this.showNotification(`Agora você está seguindo ${name}!`, 'success');
        } else {
            button.textContent = 'Seguir';
            button.style.background = 'var(--primary-green)';
            this.showNotification(`Você parou de seguir ${name}.`, 'info');
        }
    }

    filterByTag(tag) {
        this.showNotification(`Filtrando por: ${tag}`, 'info');
        // Implementar filtro por tag
    }

    loadPosts() {
        // Simular carregamento de posts
        const feed = document.querySelector('.blog-feed');
        if (!feed) return;

        // Adicionar loading
        const loading = document.createElement('div');
        loading.className = 'blog-loading';
        loading.innerHTML = `
            <div class="spinner"></div>
            <span>Carregando posts...</span>
        `;
        feed.appendChild(loading);

        // Simular delay
        setTimeout(() => {
            loading.remove();
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `blog-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Funções globais para compatibilidade
    likePost(button) {
        this.likePost(button);
    }

    toggleComments(button) {
        this.toggleComments(button);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.blogSocial = new BlogSocial();
});

// Funções globais para compatibilidade
window.likePost = (button) => {
    if (window.blogSocial) {
        window.blogSocial.likePost(button);
    }
};

window.toggleComments = (button) => {
    if (window.blogSocial) {
        window.blogSocial.toggleComments(button);
    }
};

// Exportar para uso global
window.BlogSocial = BlogSocial;
