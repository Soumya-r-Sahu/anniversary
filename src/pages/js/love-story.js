// Love Story Page JavaScript Module
// Handles interactive timeline, stats animation, and romantic effects

export class LoveStoryManager {
    constructor() {
        this.storyData = {
            startDate: new Date('2023-01-15'), // Customize with actual start date
            milestones: [
                { date: '2023-01-15', title: 'First Meeting', description: 'The day our paths crossed' },
                { date: '2023-02-14', title: 'First Date', description: 'Our first official date' },
                { date: '2023-03-20', title: 'First "I Love You"', description: 'Three words that changed everything' },
                { date: '2024-01-15', title: 'First Anniversary', description: 'Celebrating our first year' },
                { date: new Date().toISOString().split('T')[0], title: 'Our Story Continues', description: 'Building our future together' }
            ],
            stats: {
                memoriesCreated: 1247,
                laughsShared: 3892,
                dailyGrowthRate: 2.3
            }
        };
    }

    init() {
        this.initializeStoryParticles();
        this.initializeStatsAnimation();
        this.initializeTimelineInteractions();
        this.initializeFeatureCardEffects();
        this.setupStoryMusicIntegration();
    }

    // Story-themed particle system
    initializeStoryParticles() {
        const storyParticles = ['📖', '💕', '✨', '📱', '💌', '💖', '🌟', '💫', '📝', '💭'];
        
        const createStoryParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'story-particle';
            particle.textContent = storyParticles[Math.floor(Math.random() * storyParticles.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            particle.style.animationDelay = Math.random() * 3 + 's';
            
            const container = document.getElementById('story-particle-container');
            if (container) {
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 10000);
            }
        };
        
        // Create particles periodically
        setInterval(createStoryParticle, 1200);
        
        // Initial burst of particles
        for (let i = 0; i < 5; i++) {
            setTimeout(createStoryParticle, i * 300);
        }
    }

    // Animated stats counter
    initializeStatsAnimation() {
        const animateCounter = (element, endValue, duration = 2000) => {
            if (!element) return;
            
            const startValue = 0;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);
                
                element.textContent = currentValue.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            requestAnimationFrame(updateCounter);
        };

        // Calculate days together
        const daysTogether = Math.floor((new Date() - this.storyData.startDate) / (1000 * 60 * 60 * 24));
        
        // Animate stats when they come into view
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statsSection = entry.target;
                    
                    setTimeout(() => {
                        animateCounter(document.getElementById('daysTogether'), daysTogether, 2000);
                        animateCounter(document.getElementById('memoriesCreated'), this.storyData.stats.memoriesCreated, 2500);
                        animateCounter(document.getElementById('laughsShared'), this.storyData.stats.laughsShared, 3000);
                    }, 300);
                    
                    statsObserver.unobserve(statsSection);
                }
            });
        }, observerOptions);

        const statsSection = document.querySelector('.love-stats-section');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    // Interactive timeline effects
    initializeTimelineInteractions() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            // Add hover effects
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.02) translateY(-5px)';
                item.style.zIndex = '10';
                
                const marker = item.querySelector('.timeline-marker');
                if (marker) {
                    marker.style.transform = 'scale(1.3) rotate(360deg)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1) translateY(0)';
                item.style.zIndex = '1';
                
                const marker = item.querySelector('.timeline-marker');
                if (marker) {
                    marker.style.transform = 'scale(1) rotate(0deg)';
                }
            });
            
            // Add click interaction for timeline details
            item.addEventListener('click', () => {
                this.showTimelineDetails(index);
            });
        });
    }

    // Show detailed timeline information
    showTimelineDetails(index) {
        const milestone = this.storyData.milestones[index];
        if (!milestone) return;
        
        // Create modal or detailed view
        const modal = document.createElement('div');
        modal.className = 'timeline-modal';
        modal.innerHTML = `
            <div class="timeline-modal-content">
                <div class="timeline-modal-header">
                    <h3>${milestone.title}</h3>
                    <button class="timeline-modal-close">&times;</button>
                </div>
                <div class="timeline-modal-body">
                    <p class="timeline-modal-date">${new Date(milestone.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                    <p class="timeline-modal-description">${milestone.description}</p>
                    <div class="timeline-modal-memory">
                        💝 This moment holds a special place in our hearts
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.timeline-modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Animate modal appearance
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    // Enhanced 3D feature card effects
    initializeFeatureCardEffects() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                card.style.transformOrigin = `${centerX}px ${centerY}px`;
            });
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 8;
                const rotateY = (centerX - x) / 8;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            });
        });
    }

    // Story-specific music integration
    setupStoryMusicIntegration() {
        // Add story-specific music controls
        const musicControls = {
            romantic: ['romantic-melody.mp3', 'love-theme.mp3'],
            nostalgic: ['memory-lane.mp3', 'first-dance.mp3'],
            upbeat: ['celebration.mp3', 'our-song.mp3']
        };
        
        // Enhanced music player for story page
        const musicPlayer = document.querySelector('#music-play');
        const volumeControl = document.querySelector('#music-volume');
        
        if (musicPlayer && volumeControl) {
            let currentMood = 'romantic';
            let isPlaying = false;
            
            musicPlayer.addEventListener('click', () => {
                if (isPlaying) {
                    this.pauseStoryMusic();
                    musicPlayer.textContent = '▶️';
                } else {
                    this.playStoryMusic(currentMood);
                    musicPlayer.textContent = '⏸️';
                }
                isPlaying = !isPlaying;
            });
            
            volumeControl.addEventListener('input', (e) => {
                this.setStoryMusicVolume(parseFloat(e.target.value));
            });
        }
    }

    // Story music methods
    playStoryMusic(mood = 'romantic') {
        if (window.musicManager) {
            window.musicManager.playRomanticBackground();
        }
    }
    
    pauseStoryMusic() {
        if (window.musicManager) {
            window.musicManager.pause();
        }
    }
    
    setStoryMusicVolume(volume) {
        if (window.musicManager) {
            window.musicManager.setVolume(volume);
        }
    }

    // Calculate relationship duration
    getRelationshipDuration() {
        const now = new Date();
        const start = this.storyData.startDate;
        const diffTime = Math.abs(now - start);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);
        
        return {
            days: diffDays,
            months: diffMonths,
            years: diffYears,
            formatted: this.formatDuration(diffYears, diffMonths % 12, diffDays % 30)
        };
    }
    
    formatDuration(years, months, days) {
        const parts = [];
        if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
        if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
        if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
        
        return parts.join(', ');
    }
}

// Utility functions for timeline and story effects
export function createTimelineEntry(title, date, description, icon = '💕') {
    return {
        title,
        date,
        description,
        icon,
        id: Date.now() + Math.random()
    };
}

export function animateHeartFloat(element) {
    if (!element) return;
    
    element.style.animation = 'heart-float 2s ease-in-out infinite';
}

export function createMemoryCard(memory) {
    const card = document.createElement('div');
    card.className = 'memory-card-dynamic';
    card.innerHTML = `
        <div class="memory-icon">${memory.icon}</div>
        <h3 class="memory-title">${memory.title}</h3>
        <p class="memory-description">${memory.description}</p>
        <div class="memory-date">${memory.date}</div>
    `;
    
    return card;
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loveStoryManager = new LoveStoryManager();
    loveStoryManager.init();
    
    // Make available globally for other scripts
    window.loveStoryManager = loveStoryManager;
});

// Export for module usage
export default LoveStoryManager;
