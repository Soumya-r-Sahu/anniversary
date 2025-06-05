/**
 * Wish List Manager - Interactive wish management system
 * Features: wish creation, categorization, priority management, progress tracking
 */
export class WishListManager {
    constructor() {
        this.wishes = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.particleSystem = null;
        this.init();
    }
    init() {
        this.loadSampleWishes();
        this.bindEvents();
        this.initializeParticleSystem();
        this.renderWishes();
        this.updateStats();
        this.createSparkleEffects();
    }
    loadSampleWishes() {
        this.wishes = [
            {
                id: 1,
                title: "Visit Cherry Blossoms in Japan",
                description: "Experience the magical sakura season together in Kyoto and Tokyo",
                category: "travel",
                priority: "high",
                status: "pending",
                dateAdded: new Date('2024-03-15'),
                progress: 0,
                tags: ["japan", "spring", "romantic", "nature"]
            },
            {
                id: 2,
                title: "Take a Couples Cooking Class",
                description: "Learn to make authentic Italian pasta from scratch",
                category: "together",
                priority: "medium",
                status: "pending",
                dateAdded: new Date('2024-03-10'),
                progress: 30,
                tags: ["cooking", "italian", "skills", "date night"]
            },
            {
                id: 3,
                title: "Go Stargazing with Telescope",
                description: "Find a dark sky location and identify constellations together",
                category: "experiences",
                priority: "medium",
                status: "in-progress",
                dateAdded: new Date('2024-03-08'),
                progress: 60,
                tags: ["astronomy", "romantic", "nature", "adventure"]
            },
            {
                id: 4,
                title: "Build Our Dream Home",
                description: "Design and create a space that reflects our love and dreams",
                category: "future",
                priority: "high",
                status: "pending",
                dateAdded: new Date('2024-03-05'),
                progress: 10,
                tags: ["home", "future", "planning", "life goals"]
            },
            {
                id: 5,
                title: "Learn Salsa Dancing",
                description: "Take salsa dancing lessons and perform at a local event",
                category: "together",
                priority: "low",
                status: "completed",
                dateAdded: new Date('2024-02-28'),
                progress: 100,
                tags: ["dancing", "music", "performance", "skills"]
            },
            {
                id: 6,
                title: "Weekend Getaway to Maldives",
                description: "Romantic overwater bungalow vacation with snorkeling",
                category: "travel",
                priority: "urgent",
                status: "in-progress",
                dateAdded: new Date('2024-03-12'),
                progress: 45,
                tags: ["maldives", "beach", "romantic", "luxury"]
            }
        ];
    }
    bindEvents() {
        // Form submission
        const wishForm = document.getElementById('wishForm');
        if (wishForm) {
            wishForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        // Filter buttons
        this.createFilterButtons();
        // Sort dropdown
        this.createSortDropdown();
        // Search functionality
        this.createSearchBar();
    }
    createFilterButtons() {
        const categoriesContainer = document.querySelector('.wish-categories');
        if (!categoriesContainer) return;
        const filterContainer = document.createElement('div');
        filterContainer.className = 'wish-filters';
        filterContainer.innerHTML = `
            <h3 class="text-xl font-dancing text-purple-600 mb-4 text-center">
                🎯 Filter Wishes
            </h3>
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">🌟 All Wishes</button>
                <button class="filter-btn" data-filter="travel">🌍 Travel</button>
                <button class="filter-btn" data-filter="together">💕 Together</button>
                <button class="filter-btn" data-filter="experiences">🎭 Experiences</button>
                <button class="filter-btn" data-filter="goals">🎯 Goals</button>
                <button class="filter-btn" data-filter="gifts">🎁 Gifts</button>
                <button class="filter-btn" data-filter="future">🔮 Future</button>
            </div>
        `;
        categoriesContainer.parentNode.insertBefore(filterContainer, categoriesContainer.nextSibling);
        // Add event listeners
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });
    }
    createSortDropdown() {
        const wishesDisplay = document.querySelector('.wishes-display');
        if (!wishesDisplay) return;
        const sortContainer = document.createElement('div');
        sortContainer.className = 'wish-sort-container';
        sortContainer.innerHTML = `
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-dancing text-purple-600">
                    ⭐ Our Current Wishes ⭐
                </h3>
                <div class="sort-controls">
                    <label class="text-sm text-gray-600 mr-2">Sort by:</label>
                    <select id="wishSort" class="form-select-small">
                        <option value="newest">📅 Newest First</option>
                        <option value="oldest">📅 Oldest First</option>
                        <option value="priority">⭐ Priority</option>
                        <option value="progress">📊 Progress</option>
                        <option value="status">🎯 Status</option>
                    </select>
                </div>
            </div>
        `;
        const currentHeader = wishesDisplay.querySelector('h3');
        if (currentHeader) {
            currentHeader.replaceWith(sortContainer);
        }
        document.getElementById('wishSort')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderWishes();
        });
    }
    createSearchBar() {
        const filterContainer = document.querySelector('.wish-filters');
        if (!filterContainer) return;
        const searchContainer = document.createElement('div');
        searchContainer.className = 'wish-search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="wishSearch" class="form-input" placeholder="🔍 Search wishes...">
                <div class="search-suggestions" id="searchSuggestions"></div>
            </div>
        `;
        filterContainer.appendChild(searchContainer);
        const searchInput = document.getElementById('wishSearch');
        searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }
    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const newWish = {
            id: Date.now(),
            title: formData.get('wishTitle') || document.getElementById('wishTitle').value,
            description: formData.get('wishDescription') || document.getElementById('wishDescription').value,
            category: formData.get('wishCategory') || document.getElementById('wishCategory').value,
            priority: formData.get('wishPriority') || document.getElementById('wishPriority').value,
            status: 'pending',
            dateAdded: new Date(),
            progress: 0,
            tags: this.generateTags(document.getElementById('wishTitle').value, document.getElementById('wishDescription').value)
        };
        if (!newWish.title.trim()) {
            this.showNotification('error', 'Please enter a wish title');
            return;
        }
        this.wishes.unshift(newWish);
        this.renderWishes();
        this.updateStats();
        form.reset();
        this.showNotification('success', '🌟 Wish added successfully!');
        this.triggerCelebration();
    }
    generateTags(title, description) {
        const text = (title + ' ' + description).toLowerCase();
        const commonTags = {
            'travel': ['adventure', 'explore', 'vacation'],
            'food': ['cooking', 'restaurant', 'recipe'],
            'romantic': ['love', 'date', 'together'],
            'adventure': ['exciting', 'fun', 'experience'],
            'learning': ['skill', 'class', 'education']
        };
        const tags = [];
        for (const [tag, keywords] of Object.entries(commonTags)) {
            if (keywords.some(keyword => text.includes(keyword)) || text.includes(tag)) {
                tags.push(tag);
            }
        }
        return tags;
    }
    handleFilterChange(e) {
        const filterBtn = e.target;
        const filter = filterBtn.dataset.filter;
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
        this.currentFilter = filter;
        this.renderWishes();
    }
    handleSearch(query) {
        const suggestions = document.getElementById('searchSuggestions');
        if (!suggestions) return;
        if (query.length < 2) {
            suggestions.style.display = 'none';
            this.renderWishes();
            return;
        }
        const filteredWishes = this.wishes.filter(wish =>
            wish.title.toLowerCase().includes(query.toLowerCase()) ||
            wish.description.toLowerCase().includes(query.toLowerCase()) ||
            wish.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        this.renderWishes(filteredWishes);
        // Show suggestions
        const uniqueTags = [...new Set(this.wishes.flatMap(w => w.tags))];
        const matchingTags = uniqueTags.filter(tag =>
            tag.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        if (matchingTags.length > 0) {
            suggestions.innerHTML = matchingTags
                .map(tag => `<div class="suggestion-item" data-tag="${tag}">#${tag}</div>`)
                .join('');
            suggestions.style.display = 'block';
            suggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    document.getElementById('wishSearch').value = e.target.dataset.tag;
                    suggestions.style.display = 'none';
                    this.handleSearch(e.target.dataset.tag);
                });
            });
        } else {
            suggestions.style.display = 'none';
        }
    }
    renderWishes(customWishes = null) {
        const container = document.getElementById('wishesContainer');
        if (!container) return;
        let wishesToRender = customWishes || this.getFilteredWishes();
        wishesToRender = this.getSortedWishes(wishesToRender);
        if (wishesToRender.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="text-6xl mb-4">🌟</div>
                    <h3 class="text-xl font-dancing text-purple-600 mb-2">No wishes found</h3>
                    <p class="text-gray-600">Try adjusting your filters or add a new wish!</p>
                </div>
            `;
            return;
        }
        container.innerHTML = wishesToRender.map(wish => this.createWishCard(wish)).join('');
        // Add event listeners to wish cards
        container.querySelectorAll('.wish-item').forEach(card => {
            this.addWishCardEvents(card);
        });
    }
    getFilteredWishes() {
        if (this.currentFilter === 'all') {
            return this.wishes;
        }
        return this.wishes.filter(wish => wish.category === this.currentFilter);
    }
    getSortedWishes(wishes) {
        return [...wishes].sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'oldest':
                    return new Date(a.dateAdded) - new Date(b.dateAdded);
                case 'priority':
                    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'progress':
                    return b.progress - a.progress;
                case 'status':
                    const statusOrder = { 'in-progress': 3, pending: 2, completed: 1 };
                    return statusOrder[b.status] - statusOrder[a.status];
                default:
                    return 0;
            }
        });
    }
    createWishCard(wish) {
        const categoryEmojis = {
            travel: '🌍',
            together: '💕',
            experiences: '🎭',
            goals: '🎯',
            gifts: '🎁',
            future: '🔮'
        };
        const priorityColors = {
            urgent: 'bg-red-500',
            high: 'bg-orange-500',
            medium: 'bg-yellow-500',
            low: 'bg-green-500'
        };
        const statusEmojis = {
            pending: '⏳',
            'in-progress': '🚀',
            completed: '✅'
        };
        return `
            <div class="wish-item" data-wish-id="${wish.id}">
                <div class="wish-header">
                    <span class="wish-category-badge">
                        ${categoryEmojis[wish.category] || '🌟'} ${wish.category.charAt(0).toUpperCase() + wish.category.slice(1)}
                    </span>
                    <div class="wish-priority ${priorityColors[wish.priority]}">
                        ${wish.priority.toUpperCase()}
                    </div>
                </div>
                <div class="wish-content">
                    <h4 class="wish-title">${wish.title}</h4>
                    <p class="wish-description">${wish.description}</p>
                    <div class="wish-progress">
                        <div class="progress-info">
                            <span>Progress: ${wish.progress}%</span>
                            <span class="wish-status">${statusEmojis[wish.status]} ${wish.status.replace('-', ' ').toUpperCase()}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${wish.progress}%"></div>
                        </div>
                    </div>
                    <div class="wish-tags">
                        ${wish.tags.map(tag => `<span class="wish-tag">#${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="wish-actions">
                    <button class="btn-small btn-primary" onclick="wishListManager.updateProgress(${wish.id})">
                        📈 Update Progress
                    </button>
                    <button class="btn-small btn-secondary" onclick="wishListManager.editWish(${wish.id})">
                        ✏️ Edit
                    </button>
                    <button class="btn-small btn-success" onclick="wishListManager.completeWish(${wish.id})">
                        ✅ Complete
                    </button>
                    <button class="btn-small btn-danger" onclick="wishListManager.deleteWish(${wish.id})">
                        🗑️ Delete
                    </button>
                </div>
                <div class="wish-date">
                    Added on ${wish.dateAdded.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>
        `;
    }
    addWishCardEvents(card) {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            this.createCardSparkles(card);
        });
        // Add click to expand
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.wish-actions') && !e.target.closest('button')) {
                this.expandWishCard(card);
            }
        });
    }
    updateProgress(wishId) {
        const wish = this.wishes.find(w => w.id === wishId);
        if (!wish) return;
        const newProgress = prompt(`Current progress: ${wish.progress}%\nEnter new progress (0-100):`, wish.progress);
        if (newProgress === null) return;
        const progress = Math.max(0, Math.min(100, parseInt(newProgress) || 0));
        wish.progress = progress;
        if (progress === 100 && wish.status !== 'completed') {
            wish.status = 'completed';
            this.triggerCelebration();
            this.showNotification('success', '🎉 Wish completed! Congratulations!');
        } else if (progress > 0 && progress < 100 && wish.status === 'pending') {
            wish.status = 'in-progress';
        }
        this.renderWishes();
        this.updateStats();
    }
    editWish(wishId) {
        const wish = this.wishes.find(w => w.id === wishId);
        if (!wish) return;
        // Create edit modal
        this.showEditModal(wish);
    }
    showEditModal(wish) {
        const modal = document.createElement('div');
        modal.className = 'wish-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>✏️ Edit Wish</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <form class="wish-edit-form">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="editTitle" value="${wish.title}" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="editDescription">${wish.description}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Category</label>
                            <select id="editCategory">
                                <option value="travel" ${wish.category === 'travel' ? 'selected' : ''}>🌍 Travel</option>
                                <option value="together" ${wish.category === 'together' ? 'selected' : ''}>💕 Together</option>
                                <option value="experiences" ${wish.category === 'experiences' ? 'selected' : ''}>🎭 Experiences</option>
                                <option value="goals" ${wish.category === 'goals' ? 'selected' : ''}>🎯 Goals</option>
                                <option value="gifts" ${wish.category === 'gifts' ? 'selected' : ''}>🎁 Gifts</option>
                                <option value="future" ${wish.category === 'future' ? 'selected' : ''}>🔮 Future</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Priority</label>
                            <select id="editPriority">
                                <option value="low" ${wish.priority === 'low' ? 'selected' : ''}>🟢 Low</option>
                                <option value="medium" ${wish.priority === 'medium' ? 'selected' : ''}>🟡 Medium</option>
                                <option value="high" ${wish.priority === 'high' ? 'selected' : ''}>🔴 High</option>
                                <option value="urgent" ${wish.priority === 'urgent' ? 'selected' : ''}>💥 Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="this.closest('.wish-modal').remove()">Cancel</button>
                        <button type="submit" class="btn-primary">💾 Save Changes</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        // Handle form submission
        modal.querySelector('.wish-edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            wish.title = document.getElementById('editTitle').value;
            wish.description = document.getElementById('editDescription').value;
            wish.category = document.getElementById('editCategory').value;
            wish.priority = document.getElementById('editPriority').value;
            wish.tags = this.generateTags(wish.title, wish.description);
            this.renderWishes();
            modal.remove();
            this.showNotification('success', '✏️ Wish updated successfully!');
        });
        // Handle close button
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        // Handle outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    completeWish(wishId) {
        const wish = this.wishes.find(w => w.id === wishId);
        if (!wish) return;
        wish.status = 'completed';
        wish.progress = 100;
        this.renderWishes();
        this.updateStats();
        this.triggerCelebration();
        this.showNotification('success', '🎉 Wish completed! Amazing!');
    }
    deleteWish(wishId) {
        if (!confirm('Are you sure you want to delete this wish?')) return;
        this.wishes = this.wishes.filter(w => w.id !== wishId);
        this.renderWishes();
        this.updateStats();
        this.showNotification('info', '🗑️ Wish deleted');
    }
    expandWishCard(card) {
        card.classList.toggle('expanded');
        if (card.classList.contains('expanded')) {
            this.createExpandAnimation(card);
        }
    }
    updateStats() {
        const stats = {
            total: this.wishes.length,
            completed: this.wishes.filter(w => w.status === 'completed').length,
            inProgress: this.wishes.filter(w => w.status === 'in-progress').length,
            pending: this.wishes.filter(w => w.status === 'pending').length,
            highPriority: this.wishes.filter(w => w.priority === 'high' || w.priority === 'urgent').length
        };
        // Create or update stats display
        this.createStatsDisplay(stats);
    }
    createStatsDisplay(stats) {
        let statsContainer = document.querySelector('.wish-stats');
        if (!statsContainer) {
            statsContainer = document.createElement('div');
            statsContainer.className = 'wish-stats';
            const categoriesSection = document.querySelector('.wish-categories');
            if (categoriesSection) {
                categoriesSection.parentNode.insertBefore(statsContainer, categoriesSection);
            }
        }
        const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        statsContainer.innerHTML = `
            <h3 class="text-2xl font-dancing text-purple-600 mb-6 text-center">
                📊 Wish Statistics
            </h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">🌟</div>
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Wishes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-number">${stats.completed}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🚀</div>
                    <div class="stat-number">${stats.inProgress}</div>
                    <div class="stat-label">In Progress</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-number">${stats.pending}</div>
                    <div class="stat-label">Pending</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-number">${completionRate}%</div>
                    <div class="stat-label">Success Rate</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-number">${stats.highPriority}</div>
                    <div class="stat-label">High Priority</div>
                </div>
            </div>
        `;
    }
    // Particle and Effect Systems
    initializeParticleSystem() {
        this.particleSystem = {
            container: document.getElementById('wishParticles'),
            particles: [],
            emojis: ['⭐', '✨', '💫', '🌟', '💖', '💕', '🌠', '🎀', '🦋', '🌸']
        };
        if (this.particleSystem.container) {
            this.startParticleAnimation();
        }
    }
    startParticleAnimation() {
        setInterval(() => {
            this.createParticle();
        }, 3000);
    }
    createParticle() {
        if (!this.particleSystem.container) return;
        const particle = document.createElement('div');
        particle.className = 'wish-particle';
        particle.textContent = this.particleSystem.emojis[Math.floor(Math.random() * this.particleSystem.emojis.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
        particle.style.animationDuration = (Math.random() * 5 + 8) + 's';
        this.particleSystem.container.appendChild(particle);
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 13000);
    }
    createSparkleEffects() {
        const sparkleElements = document.querySelectorAll('.page-icon, .wish-category-badge');
        sparkleElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addSparkles(element);
            });
        });
    }
    addSparkles(element) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle-effect';
                sparkle.innerHTML = '✨';
                sparkle.style.position = 'absolute';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.animation = 'sparkle-float 2s ease-out forwards';
                const rect = element.getBoundingClientRect();
                sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 2000);
            }, i * 100);
        }
    }
    createCardSparkles(card) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '💫';
        sparkle.className = 'card-sparkle';
        sparkle.style.position = 'absolute';
        sparkle.style.right = '10px';
        sparkle.style.top = '10px';
        sparkle.style.animation = 'sparkle-pulse 1s ease-in-out';
        card.style.position = 'relative';
        card.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
    createExpandAnimation(card) {
        // Add expand animation styles dynamically
        card.style.transform = 'scale(1.02)';
        card.style.zIndex = '10';
        setTimeout(() => {
            card.style.transform = '';
            card.style.zIndex = '';
        }, 300);
    }
    triggerCelebration() {
        // Create confetti effect
        this.createConfetti();
        // Show celebration message
        this.showCelebrationMessage();
        // Play celebration sound (if audio enabled)
        this.playSuccessSound();
    }
    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(confettiContainer);
        const confettiPieces = ['❤️', '💖', '✨', '🎉', '🌟', '💕', '🎊'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.innerHTML = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];
            confetti.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -50px;
                font-size: ${Math.random() * 20 + 15}px;
                animation: confetti-fall ${Math.random() * 2 + 3}s linear forwards;
            `;
            confettiContainer.appendChild(confetti);
        }
        setTimeout(() => confettiContainer.remove(), 5000);
    }
    showCelebrationMessage() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-popup';
        celebration.innerHTML = `
            <div class="celebration-content">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-2xl font-dancing text-purple-600 mb-2">Wish Granted!</h3>
                <p class="text-gray-600">Another dream becomes reality! ✨</p>
            </div>
        `;
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            z-index: 1001;
            animation: celebration-popup 3s ease-in-out forwards;
        `;
        document.body.appendChild(celebration);
        setTimeout(() => celebration.remove(), 3000);
    }
    playSuccessSound() {
        // Create a simple success sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            }
    }
    showNotification(type, message) {
        if (window.notificationManager) {
            window.notificationManager.show(type, 'Wish List', message);
        } else {
            }: ${message}`);
        }
    }
}
// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wishListManager = new WishListManager();
});
// Export for external use
window.WishListManager = WishListManager;