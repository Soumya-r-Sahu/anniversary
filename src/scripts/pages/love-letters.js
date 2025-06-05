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
        const envelopes = document.querySelectorAll('.letter-envelope');
        envelopes.forEach(envelope => {
            envelope.addEventListener('click', () => this.openLetter(envelope));
        });
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
        // Archive year navigation
        const archiveYears = document.querySelectorAll('.archive-year');
        archiveYears.forEach(year => {
            year.addEventListener('click', () => this.showArchiveYear(year.dataset.year));
        });
        // 3D card interactions
        this.init3DCards();
    }
    openLetter(envelope) {
        const letterId = envelope.dataset.letter;
        // Add opening animation
        envelope.classList.add('letter-opening');
        // Play sound effect (if available)
        this.playLetterSound();
        // Show letter content with typewriter effect
        setTimeout(() => {
            const letterContent = envelope.querySelector('.letter-body');
            if (letterContent && !letterContent.classList.contains('typed')) {
                this.typewriterEffect(letterContent);
                letterContent.classList.add('typed');
            }
        }, 600);
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
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        // Filter letters (placeholder for now)
        // Show notification
        if (window.notificationManager) {
            window.notificationManager.show(
                'info',
                'Filter Applied! 📝',
                `Showing ${category === 'all' ? 'all' : category} letters`
            );
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
// Add celebration styles to document
const styleElement = document.createElement('style');
styleElement.textContent = celebrationStyles;
document.head.appendChild(styleElement);
// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoveLettersManager();
});
// Export for module use
export { LoveLettersManager };