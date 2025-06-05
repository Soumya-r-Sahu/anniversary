/**
 * Anniversary Website Interactive Features
 * Enhanced UI components and interactive elements
 * Version: 1.0.0 - Complete interactive features for anniversary website
 */

class AnniversaryInteractive {
    constructor() {
        this.api = null;
        this.components = {};
        this.modals = {};
        
        this.init();
    }

    async init() {
        // Wait for API to be available
        while (!window.anniversaryAPI) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.api = window.anniversaryAPI;
        
        // Initialize components
        this.initializeComponents();
        this.setupEventListeners();
        
        console.log('✨ Anniversary Interactive features initialized');
    }

    // =================== COMPONENT INITIALIZATION ===================

    initializeComponents() {
        this.initializeDashboard();
        this.initializeTimelineInteractive();
        this.initializePhotoGalleryInteractive();
        this.initializeLoveLetterWriter();
        this.initializeMemoryAdder();
        this.initializeSearchFeatures();
        this.initializeSettingsPanel();
    }

    // =================== DASHBOARD COMPONENT ===================

    initializeDashboard() {
        this.components.dashboard = {
            update: () => this.updateDashboard(),
            render: () => this.renderDashboard()
        };
    }

    updateDashboard() {
        const summary = this.api.getDashboardSummary();
        this.renderDashboardStats(summary.statistics);
        this.renderCountdown(summary.countdown);
        this.renderRecentMemories(summary.recentMemories);
        this.renderFavoritePhotos(summary.favoritePhotos);
    }

    renderDashboard() {
        const dashboardContainer = document.getElementById('dashboard') || this.createDashboardContainer();
        
        const summary = this.api.getDashboardSummary();
        
        dashboardContainer.innerHTML = `
            <div class="dashboard-grid">
                <div class="stats-card">
                    <h3>💕 Our Journey</h3>
                    <div class="stat-item">
                        <span class="stat-number">${summary.statistics.daysogether}</span>
                        <span class="stat-label">Days Together</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${summary.statistics.totalMemories}</span>
                        <span class="stat-label">Precious Memories</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${summary.statistics.totalPhotos}</span>
                        <span class="stat-label">Photos</span>
                    </div>
                </div>
                
                <div class="countdown-card">
                    <h3>⏰ Anniversary Countdown</h3>
                    <div class="countdown-display">
                        <span class="countdown-number">${summary.countdown.daysRemaining}</span>
                        <span class="countdown-label">Days to go!</span>
                    </div>
                    <p class="countdown-message">${summary.countdown.message}</p>
                </div>
                
                <div class="recent-memories-card">
                    <h3>🌟 Recent Memories</h3>
                    <div class="memory-list">
                        ${summary.recentMemories.map(memory => `
                            <div class="memory-item" onclick="anniversaryInteractive.viewMemory(${memory.id})">
                                <h4>${memory.title}</h4>
                                <span class="memory-date">${this.api.formatDate(memory.date)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createDashboardContainer() {
        const container = document.createElement('div');
        container.id = 'dashboard';
        container.className = 'anniversary-dashboard';
        
        // Add to main content area or create one
        const mainContent = document.querySelector('main, .main-content, .container');
        if (mainContent) {
            mainContent.appendChild(container);
        } else {
            document.body.appendChild(container);
        }
        
        return container;
    }

    // =================== INTERACTIVE TIMELINE ===================

    initializeTimelineInteractive() {
        this.components.timeline = {
            render: () => this.renderInteractiveTimeline(),
            addMemory: () => this.showAddMemoryModal(),
            editMemory: (id) => this.showEditMemoryModal(id)
        };
        
        // Add timeline if it doesn't exist
        this.ensureTimelineExists();
    }

    ensureTimelineExists() {
        if (!document.querySelector('.timeline, #timeline')) {
            this.createTimelineContainer();
        }
    }

    createTimelineContainer() {
        const timelineSection = document.createElement('section');
        timelineSection.className = 'timeline-section';
        timelineSection.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                        Our Love Timeline 💕
                    </h2>
                    <button onclick="anniversaryInteractive.components.timeline.addMemory()" 
                            class="add-memory-btn">
                        ➕ Add New Memory
                    </button>
                </div>
                <div class="timeline" id="interactive-timeline">
                    <!-- Timeline items will be rendered here -->
                </div>
            </div>
        `;
        
        // Insert after header or at the beginning of main content
        const main = document.querySelector('main, .main-content');
        if (main) {
            main.appendChild(timelineSection);
        }
    }

    renderInteractiveTimeline() {
        const timeline = document.getElementById('interactive-timeline') || 
                         document.querySelector('.timeline');
        if (!timeline) return;
        
        const memories = this.api.getTimeline();
        
        timeline.innerHTML = memories.map((memory, index) => `
            <div class="timeline-item interactive" data-memory-id="${memory.id}" 
                 data-aos="fade-${index % 2 === 0 ? 'right' : 'left'}" 
                 data-aos-delay="${(index % 6) * 100}">
                <div class="timeline-content">
                    <div class="timeline-date">${this.api.formatDate(memory.date)}</div>
                    <h3 class="timeline-title">${memory.title}</h3>
                    <p class="timeline-description">${memory.description}</p>
                    
                    ${memory.image ? `<img src="${memory.image}" alt="${memory.title}" class="timeline-image">` : ''}
                    
                    <div class="timeline-actions">
                        <button onclick="anniversaryInteractive.viewMemory(${memory.id})" class="view-btn">👁️ View</button>
                        <button onclick="anniversaryInteractive.components.timeline.editMemory(${memory.id})" class="edit-btn">✏️ Edit</button>
                        <button onclick="anniversaryInteractive.toggleFavorite('memory', ${memory.id})" 
                                class="favorite-btn ${memory.favorite ? 'active' : ''}">
                            ${memory.favorite ? '💖' : '🤍'} ${memory.favorite ? 'Favorited' : 'Add to Favorites'}
                        </button>
                    </div>
                    
                    ${memory.tags.length > 0 ? `
                        <div class="timeline-tags">
                            ${memory.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        // Refresh AOS animations if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // =================== INTERACTIVE PHOTO GALLERY ===================

    initializePhotoGalleryInteractive() {
        this.components.photoGallery = {
            render: () => this.renderInteractiveGallery(),
            addPhoto: () => this.showAddPhotoModal(),
            filterBy: (category) => this.filterPhotos(category)
        };
        
        this.ensureGalleryExists();
    }

    ensureGalleryExists() {
        if (!document.querySelector('.gallery-grid, #photo-gallery')) {
            this.createGalleryContainer();
        }
    }

    createGalleryContainer() {
        const gallerySection = document.createElement('section');
        gallerySection.className = 'photo-gallery-section';
        gallerySection.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                        Our Photo Gallery 📸
                    </h2>
                    <div class="gallery-controls">
                        <button onclick="anniversaryInteractive.components.photoGallery.addPhoto()" 
                                class="add-photo-btn">
                            📸 Add New Photo
                        </button>
                        <div class="filter-buttons">
                            <button onclick="anniversaryInteractive.components.photoGallery.filterBy('all')" class="filter-btn active">All</button>
                            <button onclick="anniversaryInteractive.components.photoGallery.filterBy('milestones')" class="filter-btn">Milestones</button>
                            <button onclick="anniversaryInteractive.components.photoGallery.filterBy('memories')" class="filter-btn">Memories</button>
                            <button onclick="anniversaryInteractive.components.photoGallery.filterBy('celebrations')" class="filter-btn">Celebrations</button>
                        </div>
                    </div>
                </div>
                <div class="gallery-grid" id="interactive-gallery">
                    <!-- Photo items will be rendered here -->
                </div>
            </div>
        `;
        
        const main = document.querySelector('main, .main-content');
        if (main) {
            main.appendChild(gallerySection);
        }
    }

    renderInteractiveGallery(category = null) {
        const gallery = document.getElementById('interactive-gallery') || 
                        document.querySelector('.gallery-grid');
        if (!gallery) return;
        
        const photos = this.api.getPhotos(category);
        
        gallery.innerHTML = photos.map((photo, index) => `
            <div class="gallery-item interactive" data-photo-id="${photo.id}" 
                 data-category="${photo.category}"
                 data-aos="zoom-in" data-aos-delay="${(index % 6) * 50}">
                <div class="photo-container">
                    <img src="images/${photo.filename}" alt="${photo.title}" 
                         onerror="this.src='https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop'"
                         onclick="anniversaryInteractive.viewPhoto(${photo.id})">
                    
                    <div class="photo-overlay">
                        <h3 class="photo-title">${photo.title}</h3>
                        <p class="photo-date">${this.api.formatDate(photo.date)}</p>
                        <div class="photo-actions">
                            <button onclick="anniversaryInteractive.viewPhoto(${photo.id})" class="view-btn">👁️</button>
                            <button onclick="anniversaryInteractive.toggleFavorite('photo', ${photo.id})" 
                                    class="favorite-btn ${photo.favorite ? 'active' : ''}">
                                ${photo.favorite ? '💖' : '🤍'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Refresh AOS animations if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    filterPhotos(category) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Filter and re-render gallery
        const filterCategory = category === 'all' ? null : category;
        this.renderInteractiveGallery(filterCategory);
    }

    // =================== LOVE LETTER WRITER ===================

    initializeLoveLetterWriter() {
        this.components.loveLetterWriter = {
            show: () => this.showLoveLetterWriter(),
            save: (letterData) => this.saveLoveLetter(letterData)
        };
    }

    showLoveLetterWriter() {
        const modal = this.createModal('love-letter-writer', 'Write a Love Letter 💌');
        
        modal.body.innerHTML = `
            <form class="love-letter-form" onsubmit="anniversaryInteractive.saveLoveLetter(event)">
                <div class="form-group">
                    <label for="letterTitle">Letter Title</label>
                    <input type="text" id="letterTitle" name="title" required 
                           placeholder="e.g., My Heart for You">
                </div>
                
                <div class="form-group">
                    <label for="letterDate">Date</label>
                    <input type="date" id="letterDate" name="date" 
                           value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                
                <div class="form-group">
                    <label for="letterMood">Mood</label>
                    <select id="letterMood" name="mood">
                        <option value="romantic">💕 Romantic</option>
                        <option value="sweet">🍯 Sweet</option>
                        <option value="passionate">🔥 Passionate</option>
                        <option value="grateful">🙏 Grateful</option>
                        <option value="playful">😊 Playful</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="letterContent">Your Love Letter</label>
                    <textarea id="letterContent" name="content" rows="10" required
                              placeholder="Write your heart out... Express all the love you feel..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="letterTags">Tags (comma separated)</label>
                    <input type="text" id="letterTags" name="tags" 
                           placeholder="love, anniversary, special, sweet">
                </div>
                
                <div class="form-actions">
                    <button type="button" onclick="anniversaryInteractive.closeModal('love-letter-writer')" 
                            class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">💌 Save Letter</button>
                </div>
            </form>
        `;
        
        this.showModal('love-letter-writer');
    }

    saveLoveLetter(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const letterData = {
            title: formData.get('title'),
            date: formData.get('date'),
            content: formData.get('content'),
            mood: formData.get('mood'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        const savedLetter = this.api.addLoveLetter(letterData);
        
        this.showNotification('💌 Love letter saved successfully!', 'success');
        this.closeModal('love-letter-writer');
        
        // Refresh any letter displays
        this.refreshLoveLettersDisplay();
        
        return savedLetter;
    }

    // =================== MEMORY ADDER ===================

    initializeMemoryAdder() {
        this.components.memoryAdder = {
            show: () => this.showAddMemoryModal(),
            save: (memoryData) => this.saveMemory(memoryData)
        };
    }

    showAddMemoryModal() {
        const modal = this.createModal('add-memory', 'Add New Memory ✨');
        
        modal.body.innerHTML = `
            <form class="memory-form" onsubmit="anniversaryInteractive.saveMemory(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="memoryTitle">Memory Title</label>
                        <input type="text" id="memoryTitle" name="title" required 
                               placeholder="e.g., Our First Kiss">
                    </div>
                    
                    <div class="form-group">
                        <label for="memoryDate">Date</label>
                        <input type="date" id="memoryDate" name="date" 
                               value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="memoryCategory">Category</label>
                    <select id="memoryCategory" name="category">
                        <option value="milestone">🏆 Milestone</option>
                        <option value="memory">💭 Sweet Memory</option>
                        <option value="date">💕 Date Night</option>
                        <option value="celebration">🎉 Celebration</option>
                        <option value="growth">🌱 Growth</option>
                        <option value="connection">💖 Connection</option>
                        <option value="friendship">👫 Friendship</option>
                        <option value="anniversary">🎊 Anniversary</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="memoryDescription">Description</label>
                    <textarea id="memoryDescription" name="description" rows="6" required
                              placeholder="Tell the story of this beautiful memory..."></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="memoryLocation">Location (optional)</label>
                        <input type="text" id="memoryLocation" name="location" 
                               placeholder="e.g., Central Park, Our favorite café">
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="memoryFavorite" name="favorite">
                            Mark as Favorite 💖
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="memoryTags">Tags (comma separated)</label>
                    <input type="text" id="memoryTags" name="tags" 
                           placeholder="romantic, first, special, unforgettable">
                </div>
                
                <div class="form-actions">
                    <button type="button" onclick="anniversaryInteractive.closeModal('add-memory')" 
                            class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">✨ Save Memory</button>
                </div>
            </form>
        `;
        
        this.showModal('add-memory');
    }

    saveMemory(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const memoryData = {
            title: formData.get('title'),
            date: formData.get('date'),
            description: formData.get('description'),
            category: formData.get('category'),
            location: formData.get('location') || null,
            favorite: formData.has('favorite'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        const savedMemory = this.api.addMemory(memoryData);
        
        this.showNotification('✨ Memory saved successfully!', 'success');
        this.closeModal('add-memory');
        
        // Refresh timeline display
        if (this.components.timeline) {
            this.components.timeline.render();
        }
        
        // Update dashboard
        if (this.components.dashboard) {
            this.components.dashboard.update();
        }
        
        return savedMemory;
    }

    // =================== SEARCH FEATURES ===================

    initializeSearchFeatures() {
        this.components.search = {
            global: (query) => this.performGlobalSearch(query),
            byTag: (tag) => this.searchByTag(tag),
            render: (results) => this.renderSearchResults(results)
        };
        
        this.createSearchInterface();
    }

    createSearchInterface() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-interface';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="globalSearch" placeholder="Search memories, photos, letters..." 
                       onkeypress="if(event.key==='Enter') anniversaryInteractive.performGlobalSearch(this.value)">
                <button onclick="anniversaryInteractive.performGlobalSearch(document.getElementById('globalSearch').value)" 
                        class="search-btn">🔍</button>
            </div>
            <div id="searchResults" class="search-results" style="display: none;"></div>
        `;
        
        // Add to navigation or header
        const nav = document.querySelector('nav, .nav-container, header');
        if (nav) {
            nav.appendChild(searchContainer);
        }
    }

    performGlobalSearch(query) {
        if (!query.trim()) return;
        
        const results = this.api.globalSearch(query.trim());
        this.renderSearchResults(results, query);
    }

    renderSearchResults(results, query) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;
        
        const totalResults = results.memories.length + results.photos.length + results.letters.length;
        
        if (totalResults === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No results found for "${query}" 😔</p>
                    <p>Try searching for different keywords or check your spelling.</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <div class="search-summary">
                    <h3>Search Results for "${query}" (${totalResults} found)</h3>
                    <button onclick="anniversaryInteractive.closeSearch()" class="close-search">✕</button>
                </div>
                
                ${results.memories.length > 0 ? `
                    <div class="result-section">
                        <h4>💭 Memories (${results.memories.length})</h4>
                        ${results.memories.map(memory => `
                            <div class="search-result-item" onclick="anniversaryInteractive.viewMemory(${memory.id})">
                                <h5>${memory.title}</h5>
                                <p>${memory.description.substring(0, 100)}...</p>
                                <span class="result-date">${this.api.formatDate(memory.date)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${results.photos.length > 0 ? `
                    <div class="result-section">
                        <h4>📸 Photos (${results.photos.length})</h4>
                        ${results.photos.map(photo => `
                            <div class="search-result-item" onclick="anniversaryInteractive.viewPhoto(${photo.id})">
                                <h5>${photo.title}</h5>
                                <p>${photo.description}</p>
                                <span class="result-date">${this.api.formatDate(photo.date)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${results.letters.length > 0 ? `
                    <div class="result-section">
                        <h4>💌 Love Letters (${results.letters.length})</h4>
                        ${results.letters.map(letter => `
                            <div class="search-result-item" onclick="anniversaryInteractive.viewLetter(${letter.id})">
                                <h5>${letter.title}</h5>
                                <p>${letter.content.substring(0, 100)}...</p>
                                <span class="result-date">${this.api.formatDate(letter.date)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            `;
        }
        
        resultsContainer.style.display = 'block';
    }

    closeSearch() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
        
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    // =================== SETTINGS PANEL ===================

    initializeSettingsPanel() {
        this.components.settings = {
            show: () => this.showSettingsPanel(),
            update: (settings) => this.updateSettings(settings)
        };
    }

    showSettingsPanel() {
        const modal = this.createModal('settings-panel', 'Settings ⚙️');
        const settings = this.api.getSettings();
        
        modal.body.innerHTML = `
            <div class="settings-form">
                <div class="settings-section">
                    <h4>🎨 Appearance</h4>
                    <label>
                        <input type="checkbox" ${settings.animations ? 'checked' : ''} 
                               onchange="anniversaryInteractive.toggleSetting('animations')">
                        Enable animations and effects
                    </label>
                    <label>
                        <input type="checkbox" ${settings.display.heartAnimations ? 'checked' : ''} 
                               onchange="anniversaryInteractive.toggleSetting('display.heartAnimations')">
                        Show floating hearts
                    </label>
                </div>
                
                <div class="settings-section">
                    <h4>🎵 Music & Audio</h4>
                    <label>
                        <input type="checkbox" ${settings.musicAutoplay ? 'checked' : ''} 
                               onchange="anniversaryInteractive.toggleSetting('musicAutoplay')">
                        Auto-play background music
                    </label>
                </div>
                
                <div class="settings-section">
                    <h4>🔔 Notifications</h4>
                    <label>
                        <input type="checkbox" ${settings.notifications ? 'checked' : ''} 
                               onchange="anniversaryInteractive.toggleSetting('notifications')">
                        Enable anniversary reminders
                    </label>
                </div>
                
                <div class="settings-section">
                    <h4>🔒 Privacy</h4>
                    <label>
                        <input type="checkbox" ${settings.privacy.sharePhotos ? 'checked' : ''} 
                               onchange="anniversaryInteractive.toggleSetting('privacy.sharePhotos')">
                        Allow photo sharing
                    </label>
                </div>
                
                <div class="settings-section">
                    <h4>💾 Data Management</h4>
                    <button onclick="anniversaryInteractive.exportData()" class="settings-btn">
                        📤 Export Data
                    </button>
                    <button onclick="anniversaryInteractive.showImportDialog()" class="settings-btn">
                        📥 Import Data
                    </button>
                    <button onclick="anniversaryInteractive.createBackup()" class="settings-btn">
                        💾 Create Backup
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('settings-panel');
    }

    // =================== UTILITY METHODS ===================

    viewMemory(id) {
        const memory = this.api.dataManager.data.timeline.find(m => m.id === id);
        if (!memory) return;
        
        const modal = this.createModal('view-memory', memory.title);
        modal.body.innerHTML = `
            <div class="memory-detail">
                <div class="memory-header">
                    <span class="memory-date">${this.api.formatDate(memory.date)}</span>
                    <span class="memory-category">${memory.category}</span>
                </div>
                
                ${memory.image ? `<img src="${memory.image}" alt="${memory.title}" class="memory-image">` : ''}
                
                <p class="memory-description">${memory.description}</p>
                
                ${memory.location ? `<p class="memory-location">📍 ${memory.location}</p>` : ''}
                
                ${memory.tags.length > 0 ? `
                    <div class="memory-tags">
                        ${memory.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="memory-actions">
                    <button onclick="anniversaryInteractive.toggleFavorite('memory', ${id})" 
                            class="favorite-btn ${memory.favorite ? 'active' : ''}">
                        ${memory.favorite ? '💖 Remove from Favorites' : '🤍 Add to Favorites'}
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('view-memory');
    }

    viewPhoto(id) {
        const photo = this.api.dataManager.data.photos.find(p => p.id === id);
        if (!photo) return;
        
        const modal = this.createModal('view-photo', photo.title);
        modal.body.innerHTML = `
            <div class="photo-detail">
                <img src="images/${photo.filename}" alt="${photo.title}" 
                     onerror="this.src='https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop'"
                     class="photo-large">
                
                <div class="photo-info">
                    <h3>${photo.title}</h3>
                    <p class="photo-date">${this.api.formatDate(photo.date)}</p>
                    <p class="photo-description">${photo.description}</p>
                    
                    ${photo.tags.length > 0 ? `
                        <div class="photo-tags">
                            ${photo.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="photo-actions">
                    <button onclick="anniversaryInteractive.toggleFavorite('photo', ${id})" 
                            class="favorite-btn ${photo.favorite ? 'active' : ''}">
                        ${photo.favorite ? '💖 Remove from Favorites' : '🤍 Add to Favorites'}
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('view-photo');
    }

    toggleFavorite(type, id) {
        if (type === 'memory') {
            const memory = this.api.dataManager.data.timeline.find(m => m.id === id);
            if (memory) {
                memory.favorite = !memory.favorite;
                this.api.dataManager.saveData();
                this.showNotification(
                    memory.favorite ? '💖 Added to favorites!' : '🤍 Removed from favorites',
                    'success'
                );
                
                // Refresh displays
                if (this.components.timeline) {
                    this.components.timeline.render();
                }
            }
        } else if (type === 'photo') {
            this.api.togglePhotoFavorite(id);
            this.showNotification('Photo favorite status updated!', 'success');
            
            // Refresh gallery
            if (this.components.photoGallery) {
                this.components.photoGallery.render();
            }
        }
    }

    // =================== MODAL SYSTEM ===================

    createModal(id, title) {
        const existingModal = document.getElementById(id);
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'anniversary-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="anniversaryInteractive.closeModal('${id}')"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button onclick="anniversaryInteractive.closeModal('${id}')" class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <!-- Content will be inserted here -->
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        this.modals[id] = modal;
        
        return {
            element: modal,
            body: modal.querySelector('.modal-body'),
            header: modal.querySelector('.modal-header')
        };
    }

    showModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // =================== NOTIFICATION SYSTEM ===================

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `anniversary-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">✕</button>
        `;
        
        // Add to notification container or create one
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // =================== EVENT LISTENERS ===================

    setupEventListeners() {
        // Listen for API events
        this.api.on('memoryAdded', (memory) => {
            this.showNotification(`✨ New memory "${memory.title}" added!`, 'success');
        });
        
        this.api.on('photoAdded', (photo) => {
            this.showNotification(`📸 New photo "${photo.title}" added!`, 'success');
        });
        
        this.api.on('letterAdded', (letter) => {
            this.showNotification(`💌 New love letter "${letter.title}" saved!`, 'success');
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('globalSearch')?.focus();
            }
            
            if (e.key === 'Escape') {
                // Close any open modals
                Object.keys(this.modals).forEach(modalId => {
                    this.closeModal(modalId);
                });
                this.closeSearch();
            }
        });
    }

    // =================== DATA EXPORT/IMPORT ===================

    exportData() {
        this.api.exportData('json');
        this.showNotification('📤 Data exported successfully!', 'success');
    }

    showImportDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    await this.api.importData(file);
                    this.showNotification('📥 Data imported successfully!', 'success');
                    
                    // Refresh all displays
                    Object.values(this.components).forEach(component => {
                        if (component.render) component.render();
                        if (component.update) component.update();
                    });
                } catch (error) {
                    this.showNotification('❌ Import failed. Please check your file.', 'error');
                }
            }
        };
        input.click();
    }

    createBackup() {
        const success = this.api.dataManager.createBackup();
        if (success) {
            this.showNotification('💾 Backup created successfully!', 'success');
        } else {
            this.showNotification('❌ Backup failed.', 'error');
        }
    }

    toggleSetting(settingPath) {
        this.api.toggleSetting(settingPath);
        this.showNotification('⚙️ Setting updated!', 'success');
    }
}

// Initialize global interactive instance
window.anniversaryInteractive = new AnniversaryInteractive();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnniversaryInteractive;
}

console.log('✨ Anniversary Interactive features loaded successfully!');
