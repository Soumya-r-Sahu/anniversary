/**
 * Behind the Scenes Page Manager
 * Handles interactive elements, code demonstrations, and development insights
 */
class BTSManager {
    constructor() {
        this.currentCodeTab = 'javascript';
        this.isStatsVisible = false;
        this.isCodeViewVisible = false;
        this.demoEffects = [];
        this.audioManager = null;
        this.animationCounters = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudioManager();
        this.initializeTimelineAnimation();
        this.setupTechCardInteractions();
        this.setupCodeShowcase();
        this.initializeDemoArea();
        this.startStatsCounters();
        this.setupScrollAnimations();
    }

    setupEventListeners() {
        // Navigation controls
        const codeViewToggle = document.getElementById('codeViewToggle');
        const statsToggle = document.getElementById('statsToggle');

        codeViewToggle?.addEventListener('click', () => this.toggleCodeView());
        statsToggle?.addEventListener('click', () => this.toggleStats());

        // Code tabs
        const codeTabs = document.querySelectorAll('.code-tab');
        codeTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchCodeTab(tab.dataset.lang));
        });

        // Demo controls
        const createHeartsBtn = document.getElementById('createHeartsBtn');
        const sparkleBtn = document.getElementById('sparkleBtn');
        const musicBtn = document.getElementById('musicBtn');
        const resetBtn = document.getElementById('resetBtn');

        createHeartsBtn?.addEventListener('click', () => this.createDemoHearts());
        sparkleBtn?.addEventListener('click', () => this.createDemoSparkles());
        musicBtn?.addEventListener('click', () => this.toggleDemoMusic());
        resetBtn?.addEventListener('click', () => this.resetDemo());

        // Tech card interactions
        const techCards = document.querySelectorAll('.tech-card');
        techCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.animateTechCard(card));
            card.addEventListener('click', () => this.showTechDetails(card));
        });

        // Timeline interactions
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.addEventListener('click', () => this.showTimelineDetails(item));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    setupAudioManager() {
        this.audioManager = {
            demoMusic: document.getElementById('demoMusic'),
            clickSound: document.getElementById('clickSound'),
            isPlaying: false,
            userInteracted: false
        };

        // Enable audio after user interaction
        document.addEventListener('click', () => {
            this.audioManager.userInteracted = true;
        }, { once: true });
    }

    playSound(soundType) {
        if (!this.audioManager.userInteracted) return;
        
        const sound = this.audioManager[soundType];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(console.warn);
        }
    }

    toggleCodeView() {
        const codeShowcase = document.getElementById('codeShowcase');
        const toggleBtn = document.getElementById('codeViewToggle');
        
        this.isCodeViewVisible = !this.isCodeViewVisible;
        
        if (this.isCodeViewVisible) {
            codeShowcase.style.display = 'block';
            codeShowcase.scrollIntoView({ behavior: 'smooth' });
            toggleBtn.textContent = '✕ Close Code';
            this.highlightCodeSyntax();
        } else {
            codeShowcase.style.display = 'none';
            toggleBtn.textContent = '💻 Code View';
        }
        
        this.playSound('clickSound');
    }

    toggleStats() {
        const statsSection = document.getElementById('statsSection');
        const toggleBtn = document.getElementById('statsToggle');
        
        this.isStatsVisible = !this.isStatsVisible;
        
        if (this.isStatsVisible) {
            statsSection.scrollIntoView({ behavior: 'smooth' });
            toggleBtn.textContent = '✕ Close Stats';
            this.animateStatsNumbers();
        } else {
            toggleBtn.textContent = '📊 Stats';
        }
        
        this.playSound('clickSound');
    }

    switchCodeTab(language) {
        // Update active tab
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-lang="${language}"]`).classList.add('active');

        // Show corresponding code example
        document.querySelectorAll('.code-example').forEach(example => {
            example.classList.remove('active');
        });
        document.querySelector(`.code-example[data-lang="${language}"]`).classList.add('active');

        this.currentCodeTab = language;
        this.highlightCodeSyntax();
        this.playSound('clickSound');
    }

    highlightCodeSyntax() {
        // Simple syntax highlighting for demo purposes
        const codeBlocks = document.querySelectorAll('.code-example.active pre code');
        
        codeBlocks.forEach(block => {
            let html = block.innerHTML;
            
            // Highlight keywords based on language
            switch (this.currentCodeTab) {
                case 'javascript':
                    html = html.replace(/\\b(class|function|const|let|var|if|else|for|while|return|new|this)\\b/g, '<span class="keyword">$1</span>');
                    html = html.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '<span class="comment">$&</span>');
                    html = html.replace(/\\/\\/.*$/gm, '<span class="comment">$&</span>');
                    break;
                case 'css':
                    html = html.replace(/@[a-zA-Z-]+/g, '<span class="keyword">$&</span>');
                    html = html.replace(/\\{[^}]*\\}/g, '<span class="property">$&</span>');
                    break;
                case 'react':
                    html = html.replace(/\\b(import|export|from|React|useState|useEffect)\\b/g, '<span class="keyword">$1</span>');
                    html = html.replace(/<[^>]*>/g, '<span class="tag">$&</span>');
                    break;
                case 'html':
                    html = html.replace(/<[^>]*>/g, '<span class="tag">$&</span>');
                    html = html.replace(/&lt;[^&]*&gt;/g, '<span class="tag">$&</span>');
                    break;
            }
            
            block.innerHTML = html;
        });
    }

    initializeTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                this.createTimelineSparkle(item);
            }, index * 300);
        });
    }

    createTimelineSparkle(item) {
        const marker = item.querySelector('.timeline-marker');
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = '0.8rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10';
        
        marker.style.position = 'relative';
        marker.appendChild(sparkle);
        
        const animation = sparkle.animate([
            { transform: 'scale(0) rotate(0deg)', opacity: 1 },
            { transform: 'scale(1.5) rotate(360deg)', opacity: 0 }
        ], {
            duration: 1500,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => sparkle.remove();
    }

    showTimelineDetails(item) {
        const phase = item.dataset.phase;
        const details = {
            planning: "Brainstorming the perfect way to celebrate our anniversary digitally. Sketching layouts, choosing color schemes, and planning the user journey through our love story.",
            development: "The coding marathon begins! Building components, creating animations, debugging with love, and bringing each page to life with careful attention to detail.",
            polish: "Fine-tuning every animation, optimizing performance, testing across devices, and adding those special touches that make the experience magical.",
            launch: "The moment of truth! Deploying our love story to the web and sharing it with the world. Every click, every smile makes it all worthwhile."
        };
        
        this.showDetailModal(phase, details[phase]);
        this.playSound('clickSound');
    }

    showDetailModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'detail-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                margin: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            ">
                <h3 style="margin-bottom: 15px; text-transform: capitalize;">${title} Phase</h3>
                <p style="line-height: 1.6; margin-bottom: 20px;">${content}</p>
                <button class="close-modal" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    setupTechCardInteractions() {
        const techCards = document.querySelectorAll('.tech-card');
        
        techCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateY(5deg)';
                this.createTechSparkles(card);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    animateTechCard(card) {
        const icon = card.querySelector('.tech-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        }
    }

    createTechSparkles(card) {
        const rect = card.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.fontSize = '1rem';
            
            document.body.appendChild(sparkle);
            
            const animation = sparkle.animate([
                { transform: 'scale(0)', opacity: 1 },
                { transform: 'scale(1)', opacity: 0 }
            ], {
                duration: 800,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => sparkle.remove();
        }
    }

    showTechDetails(card) {
        const tech = card.dataset.tech;
        const techDetails = {
            frontend: "Our frontend stack focuses on creating smooth, interactive experiences. React provides component-based architecture while vanilla JavaScript handles custom animations and complex interactions.",
            styling: "CSS3 animations bring our love story to life with smooth transitions, floating hearts, and responsive design that works beautifully on all devices.",
            tools: "Modern development tools ensure code quality and fast iteration. Vite provides lightning-fast hot reload, while TypeScript catches errors before they reach production.",
            features: "Advanced web APIs create magical experiences - canvas rendering for the star map, audio management for romantic soundtracks, and local storage for personalized journeys."
        };
        
        this.showDetailModal(tech, techDetails[tech]);
    }

    setupCodeShowcase() {
        const codeExamples = document.querySelectorAll('.code-example');
        
        // Initially hide all but first
        codeExamples.forEach((example, index) => {
            if (index > 0) example.classList.remove('active');
        });
    }

    animateStatsNumbers() {
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach((card, index) => {
            const numberElement = card.querySelector('.stat-number');
            const targetValue = parseInt(numberElement.dataset.count);
            
            setTimeout(() => {
                this.animateCounter(numberElement, 0, targetValue, 2000);
                this.createStatCelebration(card);
            }, index * 200);
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    createStatCelebration(card) {
        const icon = card.querySelector('.stat-icon');
        if (icon) {
            icon.style.transform = 'scale(1.3)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 500);
        }
    }

    startStatsCounters() {
        // Auto-trigger stats animation when section comes into view
        const statsSection = document.getElementById('statsSection');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isStatsVisible) {
                    this.animateStatsNumbers();
                    this.isStatsVisible = true;
                }
            });
        }, { threshold: 0.5 });
        
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    initializeDemoArea() {
        const demoArea = document.getElementById('demoArea');
        if (demoArea) {
            demoArea.style.position = 'relative';
            demoArea.style.overflow = 'hidden';
        }
    }

    createDemoHearts() {
        const demoArea = document.getElementById('demoArea');
        const heartCount = 5;
        
        for (let i = 0; i < heartCount; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = ['💕', '💖', '💝', '💗', '💘'][Math.floor(Math.random() * 5)];
                heart.style.position = 'absolute';
                heart.style.left = Math.random() * (demoArea.offsetWidth - 30) + 'px';
                heart.style.top = demoArea.offsetHeight + 'px';
                heart.style.fontSize = '1.5rem';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '10';
                
                demoArea.appendChild(heart);
                this.demoEffects.push(heart);
                
                const animation = heart.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
                    { transform: 'translateY(-200px) rotate(360deg)', opacity: 1 }
                ], {
                    duration: 3000,
                    easing: 'ease-out'
                });
                
                animation.onfinish = () => {
                    heart.remove();
                    this.demoEffects = this.demoEffects.filter(effect => effect !== heart);
                };
            }, i * 200);
        }
        
        this.playSound('clickSound');
    }

    createDemoSparkles() {
        const demoArea = document.getElementById('demoArea');
        const sparkleCount = 8;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * demoArea.offsetWidth + 'px';
            sparkle.style.top = Math.random() * demoArea.offsetHeight + 'px';
            sparkle.style.fontSize = '1.2rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '10';
            
            demoArea.appendChild(sparkle);
            this.demoEffects.push(sparkle);
            
            const animation = sparkle.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 1 },
                { transform: 'scale(1.5) rotate(180deg)', opacity: 0 }
            ], {
                duration: 1500,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => {
                sparkle.remove();
                this.demoEffects = this.demoEffects.filter(effect => effect !== sparkle);
            };
        }
        
        this.playSound('clickSound');
    }

    toggleDemoMusic() {
        const musicBtn = document.getElementById('musicBtn');
        
        if (!this.audioManager.userInteracted) return;
        
        if (this.audioManager.isPlaying) {
            this.audioManager.demoMusic.pause();
            musicBtn.textContent = '🔇 Music';
            this.audioManager.isPlaying = false;
        } else {
            this.audioManager.demoMusic.play().catch(console.warn);
            musicBtn.textContent = '🎵 Music';
            this.audioManager.isPlaying = true;
        }
    }

    resetDemo() {
        const demoArea = document.getElementById('demoArea');
        
        // Remove all demo effects
        this.demoEffects.forEach(effect => effect.remove());
        this.demoEffects = [];
        
        // Stop music
        if (this.audioManager.isPlaying) {
            this.audioManager.demoMusic.pause();
            this.audioManager.isPlaying = false;
            document.getElementById('musicBtn').textContent = '🎵 Music';
        }
        
        // Reset demo area content
        demoArea.innerHTML = '<p>Click the buttons above to see some of the magic in action!</p>';
        
        this.playSound('clickSound');
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.challenge-card, .fact-item, .note-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('.tech-stack-section, .challenges-section, .fun-facts-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.2 });
        
        sections.forEach(section => observer.observe(section));
    }

    handleKeyboard(e) {
        switch (e.key) {
            case 'c':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.toggleCodeView();
                }
                break;
            case 's':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.toggleStats();
                }
                break;
            case 'Escape':
                // Close any open modals
                const modals = document.querySelectorAll('.detail-modal');
                modals.forEach(modal => {
                    modal.style.opacity = '0';
                    setTimeout(() => modal.remove(), 300);
                });
                break;
        }
    }

    // Cleanup method
    destroy() {
        // Remove all demo effects
        this.demoEffects.forEach(effect => effect.remove());
        
        // Stop audio
        if (this.audioManager.demoMusic) {
            this.audioManager.demoMusic.pause();
        }
        
        // Clear animation counters
        this.animationCounters.clear();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboard);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const btsManager = new BTSManager();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        btsManager.destroy();
    });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BTSManager;
}
