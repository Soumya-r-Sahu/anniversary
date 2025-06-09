// Memory Book Manager - Comprehensive Memory Collection System
// filepath: d:\Projects\Coding\Github\soumya\anniversary\src\scripts\pages\memory-book.js

export class MemoryBookManager {
    constructor() {
        this.memories = [];
        this.currentFilter = 'all';
        this.particleSystem = null;
        this.init();
    }

    init() {
        this.setupMemoryFlipCards();
        this.setupCategoryFilters();
        this.setupMemoryForm();
        this.setupTimelineInteractions();
        this.initParticleSystem();
        this.init3DEffects();
        this.animateCounters();
        this.loadSampleMemories();
    }

    // Memory Flip Cards System
    setupMemoryFlipCards() {
        const memoryPages = document.querySelectorAll('.memory-page');
        
        memoryPages.forEach((page, index) => {
            // Add hover effects
            page.addEventListener('mouseenter', () => {
                this.playFlipSound();
                this.createCelebrationEffect(page);
            });

            // Add click interaction for mobile
            page.addEventListener('click', () => {
                page.classList.toggle('flipped');
                this.playFlipSound();
            });

            // Add typewriter effect to content
            const contentText = page.querySelector('.memory-text p');
            if (contentText) {
                this.addTypewriterEffect(contentText, index * 500);
            }
        });
    }

    // Category Filtering System
    setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.memory-filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Get filter category
                const category = button.dataset.category;
                this.currentFilter = category;
                
                // Apply filter with animation
                this.filterMemories(category);
                
                // Create filter effect
                this.createFilterEffect(button);
            });
        });
    }

    // Memory Form Handling
    setupMemoryForm() {
        const form = document.getElementById('memoryForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitMemory(form);
        });

        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateField(input);
            });
        });
    }

    // Timeline Interactions
    setupTimelineInteractions() {
        const timelineYears = document.querySelectorAll('.timeline-year');
        
        timelineYears.forEach(year => {
            year.addEventListener('click', () => {
                const yearValue = year.dataset.year;
                this.expandTimelineYear(year, yearValue);
            });

            year.addEventListener('mouseenter', () => {
                this.animateMemoryCount(year);
            });
        });
    }

    // Particle System
    initParticleSystem() {
        this.particleSystem = new MemoryParticleSystem();
    }

    // 3D Effects System
    init3DEffects() {
        const cards = document.querySelectorAll('.memory-card, .card-3d-hover, .stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    // Animated Counters
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = element.textContent === '∞' ? '∞' : parseInt(element.textContent);
        if (target === '∞') return;

        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 50);
    }

    // Load Sample Memories
    loadSampleMemories() {
        this.memories = [
            {
                id: 1,
                title: 'Our First Date',
                date: '2020-02-14',
                category: 'romantic',
                description: 'That magical day at the cozy café where our love story began.',
                mood: '💕',
                rating: 5
            },
            {
                id: 2,
                title: 'Beach Adventure',
                date: '2020-05-20',
                category: 'adventure',
                description: 'Our first getaway together to the beautiful coastal town.',
                mood: '🌅',
                rating: 5
            },
            {
                id: 3,
                title: 'Christmas Together',
                date: '2020-12-25',
                category: 'milestone',
                description: 'Decorating our first Christmas tree together.',
                mood: '🎄',
                rating: 5
            }
        ];
    }

    // Memory Filtering with Animation
    filterMemories(category) {
        const memoryPages = document.querySelectorAll('.memory-page');
        
        memoryPages.forEach((page, index) => {
            setTimeout(() => {
                if (category === 'all') {
                    page.style.display = 'block';
                    page.style.animation = 'slideInUp 0.6s ease forwards';
                } else {
                    const pageCategory = this.getMemoryCategory(page);
                    if (pageCategory === category) {
                        page.style.display = 'block';
                        page.style.animation = 'slideInUp 0.6s ease forwards';
                    } else {
                        page.style.animation = 'slideOutDown 0.4s ease forwards';
                        setTimeout(() => {
                            page.style.display = 'none';
                        }, 400);
                    }
                }
            }, index * 100);
        });
    }

    getMemoryCategory(page) {
        const title = page.querySelector('.memory-title')?.textContent.toLowerCase();
        if (title?.includes('date') || title?.includes('proposal')) return 'romantic';
        if (title?.includes('trip') || title?.includes('adventure')) return 'adventure';
        if (title?.includes('christmas') || title?.includes('moving')) return 'milestone';
        return 'everyday';
    }

    // Submit New Memory
    submitMemory(form) {
        const formData = new FormData(form);
        const newMemory = {
            id: Date.now(),
            title: formData.get('memoryTitle'),
            date: formData.get('memoryDate'),
            category: formData.get('memoryCategory'),
            location: formData.get('memoryLocation'),
            description: formData.get('memoryDescription'),
            mood: formData.get('memoryMood'),
            rating: parseInt(formData.get('memoryRating'))
        };

        // Validate memory
        if (this.validateMemory(newMemory)) {
            this.memories.push(newMemory);
            this.showSuccessMessage('Memory saved successfully! 📚💕');
            form.reset();
            this.createCelebrationEffect(form);
        }
    }

    validateMemory(memory) {
        return memory.title && memory.date && memory.category && memory.description && memory.mood && memory.rating;
    }

    validateField(field) {
        if (field.checkValidity()) {
            field.style.borderColor = '#28a745';
        } else {
            field.style.borderColor = '#dc3545';
        }
    }

    // Timeline Year Expansion
    expandTimelineYear(yearElement, year) {
        const memoriesForYear = this.memories.filter(memory => 
            memory.date.startsWith(year)
        );

        // Create expanded view
        this.showYearMemories(yearElement, year, memoriesForYear);
    }

    showYearMemories(yearElement, year, memories) {
        // Create notification with year memories
        if (window.notificationManager) {
            window.notificationManager.show(
                'info',
                `Memories from ${year} 📅`,
                `Found ${memories.length} beautiful memories from this year!`
            );
        }
    }

    // Effects and Animations
    createCelebrationEffect(element) {
        const celebration = document.createElement('div');
        celebration.innerHTML = '✨💕📚💖✨';
        celebration.className = 'celebration-burst';
        celebration.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.5rem;
            pointer-events: none;
            animation: celebrationBurst 1.5s ease-out forwards;
            z-index: 1000;
        `;

        element.appendChild(celebration);
        setTimeout(() => celebration.remove(), 1500);
    }

    createFilterEffect(button) {
        const ripple = document.createElement('div');
        ripple.className = 'filter-ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    animateMemoryCount(yearElement) {
        const countElement = yearElement.querySelector('.memory-count');
        countElement.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            countElement.style.animation = '';
        }, 600);
    }

    addTypewriterEffect(element, delay = 0) {
        const text = element.textContent;
        element.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 30);
        }, delay);
    }

    // Audio Effects
    playFlipSound() {
        // Create audio context for page flip sound
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }

    // Utility Methods
    showSuccessMessage(message) {
        if (window.notificationManager) {
            window.notificationManager.show('success', 'Success! 📚', message);
        }
    }

    showErrorMessage(message) {
        if (window.notificationManager) {
            window.notificationManager.show('error', 'Error! ❌', message);
        }
    }
}

// Memory Particle System
class MemoryParticleSystem {
    constructor() {
        this.container = document.getElementById('memory-particles');
        this.particles = [];
        this.memorySymbols = ['📚', '📖', '📝', '💝', '🎉', '✈️', '🏠', '💕', '✨', '🌟'];
        this.init();
    }

    init() {
        if (!this.container) return;
        this.createParticles();
        setInterval(() => this.createParticles(), 3500);
    }

    createParticles() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.createParticle(), i * 600);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'memory-particle';
        particle.textContent = this.memorySymbols[Math.floor(Math.random() * this.memorySymbols.length)];
        
        // Random positioning and styling
        particle.style.left = Math.random() * 100 + '%';
        particle.style.fontSize = (Math.random() * 22 + 14) + 'px';
        
        // Add random animation delay
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 8) + 's';
        
        this.container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 12000);
    }
}

// Utility Functions
export function initMemoryBook() {
    return new MemoryBookManager();
}

// CSS Animation Keyframes (injected dynamically)
const animationStyles = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(30px);
        }
    }
    
    @keyframes celebrationBurst {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8) translateY(-50px);
        }
    }
    
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;

// Inject animation styles
if (!document.getElementById('memory-book-animations')) {
    const style = document.createElement('style');
    style.id = 'memory-book-animations';
    style.textContent = animationStyles;
    document.head.appendChild(style);
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMemoryBook);
} else {
    initMemoryBook();
}
