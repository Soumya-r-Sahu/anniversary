/**
 * Thank You Page Manager
 * Handles interactive elements, animations, and user engagement for the gratitude page
 */
class ThankYouManager {
    constructor() {
        this.visitStartTime = new Date();
        this.stats = {
            visitTime: 0,
            pagesVisited: parseInt(localStorage.getItem('pagesVisited') || '1'),
            memoriesViewed: parseInt(localStorage.getItem('memoriesViewed') || '0')
        };
        this.audioManager = null;
        this.floatingElements = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeStats();
        this.setupAudioManager();
        this.startFloatingHearts();
        this.animateStatsCounters();
        this.setupCardInteractions();
        this.setupFloatingThankYous();
        this.showFinalMessage();
    }

    setupEventListeners() {
        // Navigation controls
        const creditsToggle = document.getElementById('creditsToggle');
        const musicToggle = document.getElementById('musicToggle');
        const closeCredits = document.getElementById('closeCredits');

        creditsToggle?.addEventListener('click', () => this.toggleCredits());
        musicToggle?.addEventListener('click', () => this.toggleMusic());
        closeCredits?.addEventListener('click', () => this.closeCredits());

        // Final message actions
        const shareStoryBtn = document.getElementById('shareStoryBtn');
        const createOwnBtn = document.getElementById('createOwnBtn');
        const backHomeBtn = document.getElementById('backHomeBtn');

        shareStoryBtn?.addEventListener('click', () => this.openShareModal());
        createOwnBtn?.addEventListener('click', () => this.handleCreateOwn());
        backHomeBtn?.addEventListener('click', () => this.returnHome());

        // Share modal
        const shareButtons = document.querySelectorAll('.share-btn');
        const closeShare = document.getElementById('closeShare');

        shareButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleShare(e.target.dataset.platform));
        });
        closeShare?.addEventListener('click', () => this.closeShareModal());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Visibility change to track time
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    initializeStats() {
        // Update visit time every second
        setInterval(() => {
            this.stats.visitTime = Math.floor((new Date() - this.visitStartTime) / 1000 / 60);
            this.updateStatDisplay('visitTime', this.stats.visitTime);
        }, 1000);

        // Load other stats from localStorage
        this.updateStatDisplay('pagesVisited', this.stats.pagesVisited);
        this.updateStatDisplay('memoriesViewed', this.stats.memoriesViewed);
    }

    updateStatDisplay(statType, value) {
        const element = document.getElementById(statType);
        if (element) {
            element.textContent = value;
        }
    }

    animateStatsCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach((stat, index) => {
            setTimeout(() => {
                const targetValue = parseInt(stat.textContent) || 0;
                this.animateCounter(stat, 0, targetValue, 1500);
            }, index * 300);
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    setupAudioManager() {
        this.audioManager = {
            music: document.getElementById('thankYouMusic'),
            cardFlip: document.getElementById('cardFlipSound'),
            gratitude: document.getElementById('gratitudeSound'),
            isPlaying: false,
            userInteracted: false
        };

        // Enable audio after user interaction
        document.addEventListener('click', () => {
            this.audioManager.userInteracted = true;
        }, { once: true });
    }

    toggleMusic() {
        if (!this.audioManager.userInteracted) return;

        const musicToggle = document.getElementById('musicToggle');
        
        if (this.audioManager.isPlaying) {
            this.audioManager.music.pause();
            musicToggle.textContent = '🔇 Music';
            this.audioManager.isPlaying = false;
        } else {
            this.audioManager.music.play().catch(console.warn);
            musicToggle.textContent = '🎵 Music';
            this.audioManager.isPlaying = true;
        }
    }

    playSound(soundType) {
        if (!this.audioManager.userInteracted) return;
        
        const sound = this.audioManager[soundType];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(console.warn);
        }
    }

    setupCardInteractions() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => this.flipCard(card));
            card.addEventListener('mouseenter', () => this.cardHover(card));
        });
    }

    flipCard(card) {
        if (card.classList.contains('flipped')) return;
        
        card.classList.add('flipped');
        this.playSound('cardFlip');
        this.createCardSparkles(card);
        
        // Track interaction
        this.trackInteraction('card_flip', card.dataset.card);
    }

    cardHover(card) {
        if (card.classList.contains('flipped')) return;
        
        card.style.transform = 'translateY(-10px) rotateY(5deg)';
        setTimeout(() => {
            card.style.transform = '';
        }, 300);
    }

    createCardSparkles(card) {
        const rect = card.getBoundingClientRect();
        const sparkleCount = 8;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-effect';
            sparkle.textContent = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.fontSize = '1.2rem';
            
            document.body.appendChild(sparkle);
            
            const animation = sparkle.animate([
                { transform: 'translateY(0) scale(0)', opacity: 1 },
                { transform: 'translateY(-50px) scale(1)', opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => sparkle.remove();
        }
    }

    startFloatingHearts() {
        const createHeart = () => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart-effect';
            heart.textContent = ['💕', '💖', '💝', '💗', '💘'][Math.floor(Math.random() * 5)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = window.innerHeight + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '100';
            heart.style.fontSize = '1.5rem';
            
            document.body.appendChild(heart);
            
            const animation = heart.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
                { transform: 'translateY(-100vh) rotate(360deg)', opacity: 1 }
            ], {
                duration: 8000,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => heart.remove();
        };

        // Create hearts periodically
        setInterval(createHeart, 3000);
        createHeart(); // Create first heart immediately
    }

    setupFloatingThankYous() {
        const thankYouElements = document.querySelectorAll('.floating-thank-you');
        
        thankYouElements.forEach((element, index) => {
            // Animate on page load
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 500);

            // Add hover interaction
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-10px) scale(1.1)';
                this.playSound('gratitude');
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    showFinalMessage() {
        setTimeout(() => {
            const overlay = document.getElementById('finalMessageOverlay');
            if (overlay) {
                overlay.style.display = 'flex';
                overlay.style.opacity = '1';
                this.playSound('gratitude');
                this.createCelebrationEffect();
            }
        }, 10000); // Show after 10 seconds
    }

    createCelebrationEffect() {
        const colors = ['💖', '💕', '✨', '🌟', '💝'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const celebration = document.createElement('div');
                celebration.textContent = colors[Math.floor(Math.random() * colors.length)];
                celebration.style.position = 'fixed';
                celebration.style.left = Math.random() * window.innerWidth + 'px';
                celebration.style.top = Math.random() * window.innerHeight + 'px';
                celebration.style.pointerEvents = 'none';
                celebration.style.zIndex = '1001';
                celebration.style.fontSize = '2rem';
                
                document.body.appendChild(celebration);
                
                const animation = celebration.animate([
                    { transform: 'scale(0) rotate(0deg)', opacity: 1 },
                    { transform: 'scale(1.5) rotate(360deg)', opacity: 0 }
                ], {
                    duration: 2000,
                    easing: 'ease-out'
                });
                
                animation.onfinish = () => celebration.remove();
            }, i * 100);
        }
    }

    toggleCredits() {
        const creditsSection = document.getElementById('creditsSection');
        const creditsToggle = document.getElementById('creditsToggle');
        
        if (creditsSection.style.display === 'flex') {
            this.closeCredits();
        } else {
            creditsSection.style.display = 'flex';
            creditsSection.style.opacity = '1';
            creditsToggle.textContent = '✕ Close';
            this.startCreditsScroll();
        }
    }

    closeCredits() {
        const creditsSection = document.getElementById('creditsSection');
        const creditsToggle = document.getElementById('creditsToggle');
        
        creditsSection.style.opacity = '0';
        setTimeout(() => {
            creditsSection.style.display = 'none';
        }, 300);
        creditsToggle.textContent = '👥 Credits';
    }

    startCreditsScroll() {
        const creditsContent = document.querySelector('.credits-content');
        if (creditsContent) {
            creditsContent.scrollTop = 0;
            
            // Auto-scroll credits
            const scrollSpeed = 1;
            const scroll = () => {
                creditsContent.scrollTop += scrollSpeed;
                if (creditsContent.scrollTop < creditsContent.scrollHeight - creditsContent.clientHeight) {
                    setTimeout(scroll, 50);
                }
            };
            setTimeout(scroll, 1000);
        }
    }

    openShareModal() {
        const shareModal = document.getElementById('shareModal');
        if (shareModal) {
            shareModal.style.display = 'flex';
            shareModal.style.opacity = '1';
        }
    }

    closeShareModal() {
        const shareModal = document.getElementById('shareModal');
        if (shareModal) {
            shareModal.style.opacity = '0';
            setTimeout(() => {
                shareModal.style.display = 'none';
            }, 300);
        }
    }

    handleShare(platform) {
        const url = window.location.origin;
        const text = "Check out this beautiful anniversary website - a digital love story! 💕";
        
        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'email':
                window.open(`mailto:?subject=Our Anniversary Website&body=${encodeURIComponent(text + '\n\n' + url)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    this.showNotification('Link copied to clipboard! 📋');
                }).catch(() => {
                    this.showNotification('Could not copy link 😅');
                });
                break;
        }
        
        this.closeShareModal();
        this.trackInteraction('share', platform);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    handleCreateOwn() {
        this.showNotification('Inspiring others to create their own love stories! 💕');
        // Could open a tutorial or template link
        window.open('https://github.com/anniversary-templates', '_blank');
    }

    returnHome() {
        // Save final stats
        localStorage.setItem('thankYouVisited', 'true');
        localStorage.setItem('totalTimeSpent', (new Date() - this.visitStartTime) / 1000);
        
        // Navigate home with a beautiful transition
        document.body.style.transition = 'opacity 0.5s ease-out';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 500);
    }

    handleKeyboard(e) {
        switch (e.key) {
            case 'Escape':
                this.closeCredits();
                this.closeShareModal();
                break;
            case 'h':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.returnHome();
                }
                break;
            case 's':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.openShareModal();
                }
                break;
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations and audio when tab is hidden
            if (this.audioManager.isPlaying) {
                this.audioManager.music.pause();
            }
        } else {
            // Resume when tab is visible
            if (this.audioManager.isPlaying) {
                this.audioManager.music.play().catch(console.warn);
            }
        }
    }

    trackInteraction(action, detail) {
        // Track user interactions for analytics
        const interaction = {
            action,
            detail,
            timestamp: new Date().toISOString(),
            page: 'thankyou'
        };
        
        // Store in localStorage for potential analytics
        const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
        interactions.push(interaction);
        localStorage.setItem('userInteractions', JSON.stringify(interactions.slice(-100))); // Keep last 100
    }

    // Cleanup method
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboard);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Stop audio
        if (this.audioManager.music) {
            this.audioManager.music.pause();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const thankYouManager = new ThankYouManager();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        thankYouManager.destroy();
    });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThankYouManager;
}
