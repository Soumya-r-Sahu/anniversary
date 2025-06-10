/**
 * Love Letters Page Manager
 * Handles interactive love letter functionality, letter composer, and archive management
 */
class LoveLettersManager {
    constructor() {
        this.currentFilter = 'all';
        this.letters = [];
        this.init();
    }
    init() {
        // Create notification manager if it doesn't exist
        if (!window.notificationManager) {
            window.notificationManager = {
                show: (type, title, message) => {
                    const notification = document.createElement('div');
                    notification.className = `notification ${type}`;
                    notification.innerHTML = `
                        <div class="notification-header">
                            <span class="notification-title">${title}</span>
                            <button class="notification-close">&times;</button>
                        </div>
                        <div class="notification-body">${message}</div>
                    `;
                    
                    // Style the notification
                    notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: var(--glass-bg);
                        backdrop-filter: blur(15px);
                        border: 1px solid var(--glass-border);
                        border-radius: 15px;
                        padding: 1rem;
                        z-index: 10000;
                        width: 320px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                        transform: translateX(100%);
                        transition: transform 0.3s ease-out;
                    `;
                    
                    document.body.appendChild(notification);
                    
                    // Show the notification
                    setTimeout(() => {
                        notification.style.transform = 'translateX(0)';
                    }, 100);
                    
                    // Add close button event
                    const closeBtn = notification.querySelector('.notification-close');
                    closeBtn.addEventListener('click', () => {
                        notification.style.transform = 'translateX(100%)';
                        setTimeout(() => {
                            notification.remove();
                        }, 300);
                    });
                    
                    // Auto close after 5 seconds
                    setTimeout(() => {
                        notification.style.transform = 'translateX(100%)';
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.remove();
                            }
                        }, 300);
                    }, 5000);
                }
            };
        }
        
        this.initializeParticles();
        this.setupEventListeners();
        this.initializeLetters();
        this.showWelcomeNotification();
        }
    initializeParticles() {
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'letters-particle-container';
        document.body.appendChild(this.particleContainer);
        // Create romantic particles
        const symbols = ['💌', '💕', '💖', '✨', '💫', '📝', '💐', '🌹'];
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'letter-particle';
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 20 + 15}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${Math.random() * 0.7 + 0.3};
                pointer-events: none;
                z-index: 1;
                animation: float-particle ${Math.random() * 10 + 15}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            this.particleContainer.appendChild(particle);
        }
    }
    setupEventListeners() {
        // Letter envelope interactions
        const loveLetters = document.querySelectorAll('.love-letter');
        loveLetters.forEach(letterCard => {
            letterCard.addEventListener('click', () => this.openLetter(letterCard.querySelector('.letter-envelope')));
        });
        
        // Letter reader modal close button
        const readerClose = document.querySelector('.reader-close');
        if (readerClose) {
            readerClose.addEventListener('click', () => {
                const letterReader = document.querySelector('.letter-reader');
                if (letterReader) {
                    letterReader.classList.remove('active');
                }
            });
        }
        
        // Category filter buttons
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByCategory(e.target.dataset.category));
        });
        
        // Letter form submission
        const letterForm = document.getElementById('letterForm');
        if (letterForm) {
            letterForm.addEventListener('submit', (e) => this.submitLetter(e));
        }
        
        // Clear form button
        const clearBtn = document.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (letterForm) {
                    letterForm.reset();
                    // Add visual feedback
                    const inputs = letterForm.querySelectorAll('input, textarea');
                    inputs.forEach((input, index) => {
                        setTimeout(() => {
                            input.style.transition = 'all 0.3s ease-out';
                            input.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                input.style.transform = 'scale(1)';
                            }, 150);
                        }, index * 50);
                    });
                }
            });
        }
        
        // Archive year navigation
        const archiveYears = document.querySelectorAll('.archive-year');
        archiveYears.forEach(year => {
            year.addEventListener('click', () => this.showArchiveYear(year.dataset.year));
        });
        
        // 3D card interactions
        this.init3DCards();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.createFloatingHearts();
            } else if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                this.createLoveRain();
            } else if (e.key === 'Escape') {
                const letterReader = document.querySelector('.letter-reader');
                if (letterReader && letterReader.classList.contains('active')) {
                    letterReader.classList.remove('active');
                }
            }
        });
    }
    openLetter(envelope) {
        const letterId = envelope.closest('.love-letter').dataset.id;
        const letterTitle = envelope.querySelector('.letter-from')?.textContent || 'My Love';
        const letterDate = envelope.querySelector('.letter-date')?.textContent || 'Forever';
        const letterContent = envelope.querySelector('.letter-preview')?.textContent || '';
        
        // Find the letter reader modal
        const letterReader = document.querySelector('.letter-reader');
        
        if (letterReader) {
            // Update modal content
            letterReader.querySelector('.reader-title').textContent = letterTitle;
            letterReader.querySelector('.reader-meta').textContent = letterDate;
            
            const readerBody = letterReader.querySelector('.reader-body');
            readerBody.innerHTML = `
                <div class="letter-salutation">My Dearest Love,</div>
                <div class="letter-body">${letterContent}</div>
                <div class="letter-signature">Forever Yours,<br>Your Love</div>
            `;
            
            // Show the modal
            letterReader.classList.add('active');
            
            // Add opening animation
            envelope.classList.add('letter-opening');
            
            // Play sound effect
            this.playLetterSound();
            
            // Show letter content with typewriter effect
            setTimeout(() => {
                const letterBodyContent = readerBody.querySelector('.letter-body');
                if (letterBodyContent && !letterBodyContent.classList.contains('typed')) {
                    this.typewriterEffect(letterBodyContent);
                    letterBodyContent.classList.add('typed');
                }
            }, 600);
            
            // Create floating hearts around the letter
            this.createFloatingHearts(10);
        }
        
        // Show notification
        if (window.notificationManager) {
            window.notificationManager.show(
                'success',
                'Letter Opened! 💌',
                'Reading our beautiful love letter...'
            );
        }
    }
    typewriterEffect(element) {
        const text = element.innerHTML;
        element.innerHTML = '';
        element.style.opacity = '1';
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30);
    }
    filterByCategory(category) {
        this.currentFilter = category;
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
        
        // Filter letters
        const letters = document.querySelectorAll('.love-letter');
        letters.forEach(letter => {
            if (category === 'all') {
                // Show all letters with animation
                letter.style.display = 'block';
                setTimeout(() => {
                    letter.style.opacity = '1';
                    letter.style.transform = 'translateY(0)';
                }, 50);
            } else if (letter.dataset.category === category) {
                // Show matching letters with animation
                letter.style.display = 'block';
                setTimeout(() => {
                    letter.style.opacity = '1';
                    letter.style.transform = 'translateY(0)';
                }, 50);
            } else {
                // Hide non-matching letters
                letter.style.opacity = '0';
                letter.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    letter.style.display = 'none';
                }, 300);
            }
        });
        
        // Create sparkle effect
        this.createFilterSparkles(category);
        
        // Show notification
        if (window.notificationManager) {
            window.notificationManager.show(
                'info',
                'Filter Applied! 📝',
                `Showing ${category === 'all' ? 'all' : category} letters`
            );
        }
    }
    
    createFilterSparkles(category) {
        // Create sparkle effect when filtering
        const sparkleColors = {
            all: '#ffc107',
            romantic: '#e91e63',
            special: '#9c27b0',
            anniversary: '#3f51b5',
            future: '#2196f3'
        };
        
        const color = sparkleColors[category] || '#ffc107';
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${color};
                    border-radius: 50%;
                    box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
                    top: 50%;
                    left: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: filter-sparkle 1.5s ease-out forwards;
                `;
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.remove();
                    }
                }, 1500);
            }, i * 50);
        }
    }
    submitLetter(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const letterData = {
            to: formData.get('letterTo'),
            date: formData.get('letterDate'),
            subject: formData.get('letterSubject'),
            message: formData.get('letterMessage'),
            category: formData.get('letterCategory'),
            mood: formData.get('letterMood'),
            signature: formData.get('letterSignature'),
            timestamp: new Date().toISOString()
        };
        // Validate required fields
        if (!letterData.to || !letterData.message || !letterData.signature) {
            if (window.notificationManager) {
                window.notificationManager.show(
                    'error',
                    'Missing Information',
                    'Please fill in all required fields.'
                );
            }
            return;
        }
        // Simulate saving letter
        this.saveLetter(letterData);
        // Reset form
        e.target.reset();
        // Show success notification
        if (window.notificationManager) {
            window.notificationManager.show(
                'success',
                'Letter Sent! 💌',
                'Your beautiful love letter has been saved to our collection.'
            );
        }
        // Add celebration effect
        this.celebrateLetter();
    }
    saveLetter(letterData) {
        // In a real app, this would save to a database
        this.letters.push(letterData);
        // Update statistics
        this.updateLetterStats();
    }
    updateLetterStats() {
        // Update the statistics display
        const totalLetters = document.querySelector('.stat-item:first-child .stat-number');
        if (totalLetters) {
            const currentCount = parseInt(totalLetters.textContent) || 47;
            totalLetters.textContent = currentCount + 1;
            // Animate the number change
            totalLetters.style.transform = 'scale(1.2)';
            setTimeout(() => {
                totalLetters.style.transform = 'scale(1)';
            }, 300);
        }
    }
    celebrateLetter() {
        // Create celebration particles
        const colors = ['#ec4899', '#8b5cf6', '#f59e0b', '#10b981'];
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: 50%;
                top: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: celebrate-particle 2s ease-out forwards;
                animation-delay: ${i * 0.1}s;
            `;
            document.body.appendChild(particle);
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2100);
        }
        
        // Add love rain effect
        this.createLoveRain();
    }
    
    createFloatingHearts(count = 20) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = ['💖', '💕', '💗', '💘', '💌'][Math.floor(Math.random() * 5)];
                heart.style.cssText = `
                    position: fixed;
                    font-size: ${Math.random() * 25 + 15}px;
                    left: ${Math.random() * 100}vw;
                    top: 100vh;
                    pointer-events: none;
                    z-index: 9999;
                    animation: floatUpHeart 5s ease-out forwards;
                `;
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                    }
                }, 5000);
            }, i * 100);
        }
    }
    
    createLoveRain() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const letter = document.createElement('div');
                letter.innerHTML = ['💌', '✉️', '💝', '📝'][Math.floor(Math.random() * 4)];
                letter.style.cssText = `
                    position: fixed;
                    font-size: ${Math.random() * 20 + 15}px;
                    left: ${Math.random() * 100}vw;
                    top: -50px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: loveRain 4s linear forwards;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                document.body.appendChild(letter);
                
                setTimeout(() => {
                    if (letter.parentNode) {
                        letter.remove();
                    }
                }, 4000);
            }, i * 100);
        }
    }
    showArchiveYear(year) {
        // Update active year
        document.querySelectorAll('.archive-year').forEach(yearEl => {
            yearEl.classList.remove('active');
        });
        document.querySelector(`[data-year="${year}"]`).classList.add('active');
        // Show letters for that year (placeholder)
        if (window.notificationManager) {
            window.notificationManager.show(
                'info',
                `${year} Archive`,
                `Viewing love letters from ${year}`
            );
        }
    }
    initializeLetters() {
        // Add reading status to letters
        const letters = document.querySelectorAll('.letter-envelope');
        letters.forEach((letter, index) => {
            letter.dataset.read = 'false';
            // Add random opening delay animation
            letter.style.animationDelay = `${index * 0.2}s`;
            letter.classList.add('letter-entrance');
        });
    }
    playLetterSound() {
        // Create audio context for letter opening sound
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            try {
                const AudioContextClass = AudioContext || webkitAudioContext;
                const audioContext = new AudioContextClass();
                // Create a simple letter opening sound
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (error) {
                }
        }
    }
    init3DCards() {
        const cards = document.querySelectorAll('.letter-envelope, .stat-item, .archive-year');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }
    showWelcomeNotification() {
        setTimeout(() => {
            if (window.notificationManager) {
                window.notificationManager.show(
                    'info',
                    'Love Letters Collection! 💌',
                    'Click on any letter envelope to read our beautiful messages of love.'
                );
            }
        }, 1000);
    }
}
// CSS animations for celebration particles
const celebrationStyles = `
@keyframes celebrate-particle {
    0% {
        transform: translate(-50%, -50%) scale(0) rotate(0deg);
        opacity: 1;
    }
    50% {
        transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(1) rotate(180deg);
        opacity: 1;
    }
    100% {
        transform: translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px) scale(0) rotate(360deg);
        opacity: 0;
    }
}
.letter-entrance {
    opacity: 0;
    transform: translateY(30px);
    animation: letterEntrance 0.8s ease-out forwards;
}
@keyframes letterEntrance {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.letter-opening {
    animation: letterOpen 0.6s ease-out;
}
@keyframes letterOpen {
    0% { transform: scale(1) rotateZ(0deg); }
    50% { transform: scale(1.05) rotateZ(2deg); }
    100% { transform: scale(1) rotateZ(0deg); }
}
`;
// Add additional animations for love letter effects
const additionalAnimations = `
@keyframes floatUpHeart {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
}
            
@keyframes loveRain {
    0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

@keyframes letterFloat {
    0% {
        transform: translate(0, 0) rotate(0deg);
    }
    33% {
        transform: translate(30px, -50px) rotate(10deg);
    }
    66% {
        transform: translate(-20px, -100px) rotate(-5deg);
    }
    100% {
        transform: translate(0, -150px) rotate(0deg);
        opacity: 0;
    }
}

@keyframes envelope3DFloat {
    0% {
        transform: translate(0, 0) rotate(0deg) rotateY(0deg);
    }
    25% {
        transform: translate(30px, -30px) rotate(5deg) rotateY(30deg);
    }
    50% {
        transform: translate(10px, -60px) rotate(-3deg) rotateY(60deg);
    }
    75% {
        transform: translate(-20px, -90px) rotate(8deg) rotateY(30deg);
    }
    100% {
        transform: translate(0, -120px) rotate(0deg) rotateY(0deg);
        opacity: 0;
    }
}

@keyframes iconPulse {
    0% { transform: scale(1); filter: drop-shadow(0 0 5px var(--romantic-gold)); }
    50% { transform: scale(1.1); filter: drop-shadow(0 0 20px var(--romantic-gold)); }
    100% { transform: scale(1); filter: drop-shadow(0 0 5px var(--romantic-gold)); }
}

@keyframes sparkle {
    0% { transform: scale(0) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
    100% { transform: scale(0) rotate(360deg); opacity: 0; }
}

@keyframes filter-sparkle {
    0% { 
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
    }
    50% { 
        transform: translate(
            calc(-50% + ${Math.random() * 300 - 150}px),
            calc(-50% + ${Math.random() * 300 - 150}px)
        ) scale(1.2);
        opacity: 0.7;
    }
    100% { 
        transform: translate(
            calc(-50% + ${Math.random() * 600 - 300}px),
            calc(-50% + ${Math.random() * 600 - 300}px)
        ) scale(0);
        opacity: 0;
    }
}
`;

// Add all styles to document
const styleElement = document.createElement('style');
styleElement.textContent = celebrationStyles + additionalAnimations;
document.head.appendChild(styleElement);

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoveLettersManager();
});

// Export for module use
export { LoveLettersManager };