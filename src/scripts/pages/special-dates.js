/**
 * Special Dates Page Manager
 * Handles timeline functionality, date management, and interactive features
 */

class SpecialDatesManager {
    constructor() {
        this.specialDates = [];
        this.currentFilter = 'all';
        this.relationshipStartDate = new Date('2020-02-14');
        
        this.init();
    }

    init() {
        this.loadSpecialDates();
        this.setupEventListeners();
        this.startCounterAnimation();
        this.initializeTimeline();
        console.log('SpecialDatesManager initialized');
    }

    loadSpecialDates() {
        this.specialDates = [
            {
                id: 1,
                title: "First Date",
                date: "2020-02-14",
                category: "romantic",
                description: "The magical day when our journey began at the cozy café downtown. We talked for hours about everything and nothing, and I knew something special was starting.",
                tags: ["💕 Beginning", "☕ Café Date"],
                icon: "💝"
            },
            {
                id: 2,
                title: "First Kiss",
                date: "2020-03-08",
                category: "romantic",
                description: "Under the starlit sky in the park, our first kiss sealed the promise of our love. Time stood still in that perfect moment.",
                tags: ["⭐ Starlit", "🌙 Evening"],
                icon: "💋"
            },
            {
                id: 3,
                title: "Moved in Together",
                date: "2020-12-01",
                category: "milestone",
                description: "Our first apartment together! Creating a home filled with love, laughter, and countless beautiful memories. Every corner tells our story.",
                tags: ["🏡 Home", "📦 Moving Day"],
                icon: "🏠"
            },
            {
                id: 4,
                title: "First Anniversary",
                date: "2021-02-14",
                category: "milestone",
                description: "Celebrating one year of incredible love and growth together. A romantic dinner where we reminisced about our journey and dreamed about our future.",
                tags: ["🥂 Celebration", "🍽️ Dinner"],
                icon: "🎉"
            },
            {
                id: 5,
                title: "Engagement Day",
                date: "2022-06-15",
                category: "milestone",
                description: "The day I asked you to be mine forever! At sunset on the beach, with the waves as our witness, you said yes and made me the happiest person alive.",
                tags: ["🏖️ Beach", "🌅 Sunset"],
                icon: "💍"
            },
            {
                id: 6,
                title: "4 Years Strong",
                date: "2024-02-14",
                category: "milestone",
                description: "Four amazing years of love, growth, and countless beautiful memories. Here's to many more years of our incredible journey together!",
                tags: ["🎊 Milestone", "💕 Forever"],
                icon: "💖"
            }
        ];
    }

    setupEventListeners() {
        // Category filter buttons
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Add date form
        const addDateForm = document.getElementById('addDateForm');
        if (addDateForm) {
            addDateForm.addEventListener('submit', (e) => this.addSpecialDate(e));
        }

        // Timeline item interactions
        this.setupTimelineInteractions();
    }

    setupTimelineInteractions() {
        // Add click handlers to timeline items for enhanced interaction
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.addEventListener('click', () => this.highlightTimelineItem(item));
        });
    }

    highlightTimelineItem(item) {
        // Remove previous highlights
        document.querySelectorAll('.timeline-item').forEach(el => {
            el.classList.remove('highlighted');
        });
        
        // Add highlight to clicked item
        item.classList.add('highlighted');
        
        // Add highlight styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .timeline-item.highlighted .timeline-content {
                border-color: var(--romantic-pink) !important;
                box-shadow: 0 0 30px rgba(236, 72, 153, 0.3) !important;
                transform: perspective(1000px) rotateX(0deg) translateY(-10px) scale(1.02) !important;
            }
            .timeline-item.highlighted .timeline-marker {
                transform: translateX(-50%) scale(1.2) !important;
                box-shadow: 0 0 25px rgba(236, 72, 153, 0.5) !important;
            }
        `;
        
        // Remove existing highlight style and add new one
        const existingStyle = document.getElementById('timeline-highlight-style');
        if (existingStyle) existingStyle.remove();
        style.id = 'timeline-highlight-style';
        document.head.appendChild(style);
    }

    filterByCategory(category) {
        this.currentFilter = category;
        
        // Update category card active states
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
        });
        
        if (category !== 'all') {
            const activeCard = document.querySelector(`[data-category="${category}"]`);
            if (activeCard) activeCard.classList.add('active');
        }
        
        this.updateTimelineDisplay();
    }

    updateTimelineDisplay() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            const itemDate = this.specialDates[index];
            if (!itemDate) return;
            
            if (this.currentFilter === 'all' || itemDate.category === this.currentFilter) {
                item.style.display = 'block';
                item.style.animation = `timelineSlideIn 0.8s ease-out ${index * 0.2}s forwards`;
            } else {
                item.style.display = 'none';
            }
        });
    }

    startCounterAnimation() {
        const counters = [
            { id: 'daysCounter', target: this.calculateDaysTogether() },
            { id: 'datesCounter', target: this.specialDates.length + 35 }, // Total dates including regular ones
            { id: 'memoriesCounter', target: 247 }, // Beautiful memories count
            { id: 'milestonesCounter', target: this.specialDates.filter(d => d.category === 'milestone').length }
        ];

        counters.forEach(counter => {
            this.animateCounter(counter.id, counter.target);
        });
    }

    calculateDaysTogether() {
        const today = new Date();
        const timeDifference = today.getTime() - this.relationshipStartDate.getTime();
        return Math.floor(timeDifference / (1000 * 3600 * 24));
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = Math.ceil(target / 100);
        const duration = 2000; // 2 seconds
        const stepTime = duration / (target / increment);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = current.toLocaleString();
        }, stepTime);
    }

    addSpecialDate(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const newDate = {
            id: this.specialDates.length + 1,
            title: formData.get('dateTitle'),
            date: formData.get('dateDate'),
            category: formData.get('dateCategory'),
            description: formData.get('dateDescription'),
            tags: [`🆕 New Memory`],
            icon: this.getCategoryIcon(formData.get('dateCategory'))
        };

        this.specialDates.push(newDate);
        this.addToTimeline(newDate);
        this.updateCategoryCounts();
        this.startCounterAnimation(); // Refresh counters
        
        // Reset form
        event.target.reset();
        
        // Show success notification
        this.showNotification('Special date added successfully! 💕');
    }

    getCategoryIcon(category) {
        const icons = {
            romantic: '💕',
            adventure: '🎒',
            milestone: '🏆',
            surprise: '🎁'
        };
        return icons[category] || '📅';
    }

    addToTimeline(dateData) {
        const timelineContainer = document.querySelector('.timeline-container');
        if (!timelineContainer) return;

        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-marker">${dateData.icon}</div>
            <div class="timeline-content">
                <div class="timeline-date">${this.formatDate(dateData.date)}</div>
                <h3 class="timeline-title">${dateData.title}</h3>
                <p class="timeline-description">${dateData.description}</p>
                <div class="timeline-tags">
                    ${dateData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        timelineContainer.appendChild(timelineItem);
        
        // Animate the new item
        setTimeout(() => {
            timelineItem.style.opacity = '0';
            timelineItem.style.transform = 'translateY(30px)';
            timelineItem.style.animation = 'timelineSlideIn 0.8s ease-out forwards';
        }, 100);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    updateCategoryCounts() {
        const categoryCounts = {
            romantic: this.specialDates.filter(d => d.category === 'romantic').length,
            adventure: this.specialDates.filter(d => d.category === 'adventure').length,
            milestone: this.specialDates.filter(d => d.category === 'milestone').length,
            surprise: this.specialDates.filter(d => d.category === 'surprise').length
        };

        Object.keys(categoryCounts).forEach(category => {
            const countElement = document.querySelector(`[data-category="${category}"] .category-count`);
            if (countElement) {
                countElement.textContent = `${categoryCounts[category]} dates`;
            }
        });
    }

    initializeTimeline() {
        // Add intersection observer for timeline animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--romantic-pink), var(--romantic-purple));
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
            animation: slideInNotification 0.3s ease-out;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInNotification {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutNotification {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutNotification 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
    }
}

// Utility functions
const DateUtils = {
    formatRelativeTime(date) {
        const now = new Date();
        const diffTime = Math.abs(now - new Date(date));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    },

    getNextAnniversary(startDate) {
        const now = new Date();
        const thisYear = now.getFullYear();
        const anniversary = new Date(startDate);
        anniversary.setFullYear(thisYear);
        
        if (anniversary < now) {
            anniversary.setFullYear(thisYear + 1);
        }
        
        return anniversary;
    },

    calculateTimeTogether(startDate) {
        const now = new Date();
        const start = new Date(startDate);
        const diffTime = Math.abs(now - start);
        
        const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        
        return { years, months, days };
    }
};

// Initialize when DOM is loaded
let specialDatesManager;

document.addEventListener('DOMContentLoaded', () => {
    specialDatesManager = new SpecialDatesManager();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SpecialDatesManager, DateUtils };
}
