// Photo Gallery Page JavaScript Module
// Handles photo filtering, lightbox, upload, and interactive gallery effects

export class PhotoGalleryManager {
    constructor() {
        this.currentCategory = 'all';
        this.photos = [
            { id: 'date1', category: 'dates', title: 'First Date Night', date: '2023-02-14' },
            { id: 'date2', category: 'dates', title: 'Romantic Dinner', date: '2023-03-20' },
            { id: 'travel1', category: 'travel', title: 'Beach Getaway', date: '2023-06-15' },
            { id: 'travel2', category: 'travel', title: 'Mountain Adventure', date: '2023-08-10' },
            { id: 'candid1', category: 'candid', title: 'Spontaneous Laughter', date: '2023-04-05' },
            { id: 'candid2', category: 'candid', title: 'Cozy Home Morning', date: '2023-05-12' },
            { id: 'special1', category: 'special', title: 'Birthday Celebration', date: '2023-07-25' },
            { id: 'special2', category: 'special', title: 'Anniversary Celebration', date: '2024-01-15' },
            { id: 'recent1', category: 'candid', title: 'Spring Walk', date: '2024-03-30' }
        ];
        this.isLightboxOpen = false;
    }

    init() {
        this.initializeCategoryFilters();
        this.initializePhotoViewer();
        this.initializePhotoUpload();
        this.initializePhotoEffects();
        this.initializeGalleryParticles();
        this.updatePhotoStats();
    }

    // Category filtering system
    initializeCategoryFilters() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active button
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter photos
                const category = btn.dataset.category;
                this.filterPhotos(category);
                
                // Add button animation
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });
        });
    }

    // Filter photos by category
    filterPhotos(category) {
        this.currentCategory = category;
        const photoItems = document.querySelectorAll('.photo-item');
        
        photoItems.forEach((item, index) => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || itemCategory === category;
            
            // Add staggered animation delay
            setTimeout(() => {
                if (shouldShow) {
                    item.classList.remove('filtered-out');
                    item.classList.add('filtered-in');
                    item.style.display = 'block';
                } else {
                    item.classList.remove('filtered-in');
                    item.classList.add('filtered-out');
                    setTimeout(() => {
                        if (item.classList.contains('filtered-out')) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            }, index * 50);
        });
        
        // Update stats
        this.updateFilteredStats(category);
    }

    // Update stats based on filtered category
    updateFilteredStats(category) {
        const filteredPhotos = category === 'all' ? 
            this.photos : 
            this.photos.filter(photo => photo.category === category);
        
        const totalPhotosEl = document.getElementById('totalPhotos');
        if (totalPhotosEl) {
            this.animateNumber(totalPhotosEl, filteredPhotos.length);
        }
    }

    // Photo viewer/lightbox functionality
    initializePhotoViewer() {
        const viewButtons = document.querySelectorAll('.view-photo-btn');
        
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const photoId = btn.dataset.photo;
                this.openPhotoLightbox(photoId);
            });
        });
        
        // ESC key to close lightbox
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isLightboxOpen) {
                this.closeLightbox();
            }
        });
    }

    // Open photo in lightbox
    openPhotoLightbox(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) return;
        
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'photo-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <div class="lightbox-image-container">
                    <div class="lightbox-placeholder">
                        <div class="lightbox-icon">📸</div>
                        <h3 class="lightbox-title">${photo.title}</h3>
                        <p class="lightbox-date">${new Date(photo.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</p>
                        <div class="lightbox-description">
                            This beautiful moment captured forever in our hearts 💕
                        </div>
                        <div class="lightbox-actions">
                            <button class="lightbox-btn" onclick="window.photoGalleryManager.addToFavorites('${photoId}')">
                                ⭐ Add to Favorites
                            </button>
                            <button class="lightbox-btn" onclick="window.photoGalleryManager.sharePhoto('${photoId}')">
                                📤 Share
                            </button>
                        </div>
                    </div>
                </div>
                <div class="lightbox-nav">
                    <button class="lightbox-prev" onclick="window.photoGalleryManager.prevPhoto('${photoId}')">‹</button>
                    <button class="lightbox-next" onclick="window.photoGalleryManager.nextPhoto('${photoId}')">›</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        this.isLightboxOpen = true;
        
        // Add event listeners
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        
        closeBtn.addEventListener('click', () => this.closeLightbox());
        backdrop.addEventListener('click', () => this.closeLightbox());
        
        // Animate appearance
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightbox.querySelector('.lightbox-content').style.transform = 'scale(1)';
        }, 10);
    }

    // Close lightbox
    closeLightbox() {
        const lightbox = document.querySelector('.photo-lightbox');
        if (lightbox) {
            lightbox.style.opacity = '0';
            lightbox.querySelector('.lightbox-content').style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                document.body.removeChild(lightbox);
                this.isLightboxOpen = false;
            }, 300);
        }
    }

    // Navigate to previous photo
    prevPhoto(currentId) {
        const currentIndex = this.photos.findIndex(p => p.id === currentId);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.photos.length - 1;
        const prevPhoto = this.photos[prevIndex];
        
        this.closeLightbox();
        setTimeout(() => this.openPhotoLightbox(prevPhoto.id), 100);
    }

    // Navigate to next photo
    nextPhoto(currentId) {
        const currentIndex = this.photos.findIndex(p => p.id === currentId);
        const nextIndex = currentIndex < this.photos.length - 1 ? currentIndex + 1 : 0;
        const nextPhoto = this.photos[nextIndex];
        
        this.closeLightbox();
        setTimeout(() => this.openPhotoLightbox(nextPhoto.id), 100);
    }

    // Photo upload functionality
    initializePhotoUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('photoUpload');
        
        if (!uploadArea || !fileInput) return;
        
        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(255, 107, 157, 0.8)';
            uploadArea.style.background = 'rgba(255, 107, 157, 0.2)';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(255, 107, 157, 0.3)';
            uploadArea.style.background = 'rgba(255, 255, 255, 0.05)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(255, 107, 157, 0.3)';
            uploadArea.style.background = 'rgba(255, 255, 255, 0.05)';
            
            const files = e.dataTransfer.files;
            this.handleFileUpload(files);
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
    }

    // Handle file upload
    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                this.processPhotoUpload(file);
            }
        });
    }

    // Process individual photo upload
    processPhotoUpload(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            // Show upload success notification
            if (window.notificationManager) {
                window.notificationManager.show(
                    'success',
                    'Photo Uploaded! 📸',
                    `${file.name} has been added to your gallery`
                );
            }
            
            // Simulate adding to gallery (in real app, would upload to server)
            this.addNewPhotoToGallery(file.name, e.target.result);
        };
        
        reader.readAsDataURL(file);
    }

    // Add new photo to gallery
    addNewPhotoToGallery(filename, dataUrl) {
        const newPhoto = {
            id: 'upload_' + Date.now(),
            category: 'candid',
            title: filename.replace(/\.[^/.]+$/, ''),
            date: new Date().toISOString().split('T')[0],
            dataUrl: dataUrl
        };
        
        this.photos.unshift(newPhoto);
        this.createPhotoElement(newPhoto);
        this.updatePhotoStats();
    }

    // Create photo element and add to grid
    createPhotoElement(photo) {
        const photoGrid = document.getElementById('photoGrid');
        if (!photoGrid) return;
        
        const photoElement = document.createElement('div');
        photoElement.className = 'photo-item';
        photoElement.dataset.category = photo.category;
        photoElement.innerHTML = `
            <div class="photo-placeholder">
                <div class="photo-icon">📸</div>
                <div class="photo-title">${photo.title}</div>
                <div class="photo-description">A new beautiful memory added to our collection</div>
                <div class="photo-date">${new Date(photo.date).toLocaleDateString()}</div>
            </div>
            <div class="photo-overlay">
                <button class="view-photo-btn" data-photo="${photo.id}">View</button>
            </div>
        `;
        
        photoGrid.insertBefore(photoElement, photoGrid.firstChild);
        
        // Add event listener to new button
        const viewBtn = photoElement.querySelector('.view-photo-btn');
        viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openPhotoLightbox(photo.id);
        });
        
        // Animate entrance
        setTimeout(() => {
            photoElement.style.transform = 'scale(1)';
            photoElement.style.opacity = '1';
        }, 100);
    }

    // Photo interaction effects
    initializePhotoEffects() {
        const photoItems = document.querySelectorAll('.photo-item');
        
        photoItems.forEach(item => {
            // Enhanced hover effects
            item.addEventListener('mouseenter', () => {
                item.style.zIndex = '10';
                this.createPhotoHoverEffect(item);
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.zIndex = '1';
            });
            
            // Double-click to favorite
            item.addEventListener('dblclick', () => {
                this.toggleFavorite(item);
            });
        });
    }

    // Create hover effect for photos
    createPhotoHoverEffect(item) {
        const sparkles = ['✨', '💫', '⭐', '🌟'];
        const sparkle = document.createElement('div');
        sparkle.className = 'photo-sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'absolute';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.animation = 'sparkle-float 2s ease-out forwards';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '20';
        
        item.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 2000);
    }

    // Gallery-specific particle system
    initializeGalleryParticles() {
        const galleryParticles = ['📸', '💕', '✨', '📱', '🎨', '💫', '🌟', '📷'];
        
        const createGalleryParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'gallery-particle';
            particle.textContent = galleryParticles[Math.floor(Math.random() * galleryParticles.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            particle.style.animationDelay = Math.random() * 3 + 's';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 10000);
        };
        
        // Create particles periodically
        setInterval(createGalleryParticle, 2000);
    }

    // Update photo statistics
    updatePhotoStats() {
        const stats = this.calculatePhotoStats();
        
        this.animateNumber(document.getElementById('totalPhotos'), stats.total);
        this.animateNumber(document.getElementById('favoriteMoments'), stats.favorites);
        this.animateNumber(document.getElementById('monthsDocumented'), stats.months);
    }

    // Calculate photo statistics
    calculatePhotoStats() {
        const uniqueMonths = new Set(
            this.photos.map(photo => photo.date.substring(0, 7))
        ).size;
        
        return {
            total: this.photos.length,
            favorites: Math.floor(this.photos.length * 0.25),
            months: uniqueMonths
        };
    }

    // Animate number counter
    animateNumber(element, targetValue, duration = 1000) {
        if (!element) return;
        
        const startValue = parseInt(element.textContent) || 0;
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }

    // Utility methods
    addToFavorites(photoId) {
        if (window.notificationManager) {
            window.notificationManager.show(
                'success',
                'Added to Favorites! ⭐',
                'This special moment is now in your favorites'
            );
        }
    }

    sharePhoto(photoId) {
        if (window.notificationManager) {
            window.notificationManager.show(
                'info',
                'Share Feature Coming Soon! 📤',
                'We\'re working on making sharing even easier'
            );
        }
    }

    toggleFavorite(item) {
        item.classList.toggle('favorite');
        this.createPhotoHoverEffect(item);
    }
}

// Utility functions
export function createPhotoCard(photo) {
    return {
        id: photo.id || Date.now(),
        category: photo.category || 'candid',
        title: photo.title || 'Untitled',
        date: photo.date || new Date().toISOString().split('T')[0],
        description: photo.description || 'A beautiful moment captured'
    };
}

export function formatPhotoDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const photoGalleryManager = new PhotoGalleryManager();
    photoGalleryManager.init();
    
    // Make available globally
    window.photoGalleryManager = photoGalleryManager;
});

// CSS for dynamic elements
const additionalStyles = `
    .photo-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .lightbox-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
    }
    
    .lightbox-content {
        position: relative;
        width: 90%;
        max-width: 800px;
        margin: 5% auto;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(30px);
        border-radius: 2rem;
        padding: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }
    
    .lightbox-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        color: white;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .lightbox-close:hover {
        opacity: 1;
    }
    
    .lightbox-placeholder {
        text-align: center;
        color: white;
    }
    
    .lightbox-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    
    .lightbox-title {
        font-size: 2rem;
        font-family: 'Dancing Script', cursive;
        margin-bottom: 0.5rem;
    }
    
    .lightbox-date {
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 1rem;
    }
    
    .lightbox-description {
        margin-bottom: 2rem;
        line-height: 1.5;
    }
    
    .lightbox-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .lightbox-btn {
        background: rgba(255, 107, 157, 0.2);
        border: 1px solid rgba(255, 107, 157, 0.5);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .lightbox-btn:hover {
        background: rgba(255, 107, 157, 0.4);
        transform: scale(1.05);
    }
    
    .lightbox-nav {
        position: absolute;
        top: 50%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        transform: translateY(-50%);
        pointer-events: none;
    }
    
    .lightbox-prev, .lightbox-next {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        pointer-events: all;
        transition: all 0.3s ease;
    }
    
    .lightbox-prev:hover, .lightbox-next:hover {
        background: rgba(255, 107, 157, 0.3);
        transform: scale(1.1);
    }
    
    .gallery-particle {
        position: fixed;
        font-size: 1.5rem;
        opacity: 0.6;
        pointer-events: none;
        z-index: 1;
        animation: gallery-particle-float 10s linear infinite;
    }
    
    @keyframes gallery-particle-float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.6;
        }
        90% {
            opacity: 0.6;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes sparkle-float {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    .photo-item.favorite::after {
        content: '⭐';
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        z-index: 10;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

export default PhotoGalleryManager;
