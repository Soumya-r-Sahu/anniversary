/**
 * Enhanced Romantic Effects System
 * Creates beautiful romantic animations and effects for the anniversary website
 */

class RomanticEffects {
    constructor() {
        this.isInitialized = false;
        this.effectsEnabled = true;
        this.heartInterval = null;
        this.sparkleInterval = null;
        this.messageTimeout = null;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.createFloatingHearts();
        this.addSparkleEffects();
        this.setupLoveMessages();
        this.addInteractiveEffects();
        this.createRomanticCursor();
        
        this.isInitialized = true;
    }

    createFloatingHearts() {
        // Create hearts container if it doesn't exist
        let heartsContainer = document.querySelector('.floating-hearts-romantic');
        if (!heartsContainer) {
            heartsContainer = document.createElement('div');
            heartsContainer.className = 'floating-hearts-romantic';
            heartsContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
                overflow: hidden;
            `;
            document.body.appendChild(heartsContainer);
        }

        // Create hearts periodically
        this.heartInterval = setInterval(() => {
            if (Math.random() < 0.4 && this.effectsEnabled) {
                this.createHeart(heartsContainer);
            }
        }, 3000);
    }

    createHeart(container) {
        const heart = document.createElement('div');
        const heartEmojis = ['💕', '💖', '💗', '💝', '💘', '❤️', '💜', '🧡', '💛'];
        
        heart.className = 'romantic-heart';
        heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        
        // Random positioning and animation
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 200;
        const duration = Math.random() * 4 + 3; // 3-7 seconds
        const size = Math.random() * 20 + 15; // 15-35px
        
        heart.style.cssText = `
            position: absolute;
            left: ${startX}px;
            bottom: -50px;
            font-size: ${size}px;
            animation: floatUpHeart ${duration}s ease-out forwards;
            animation-delay: ${Math.random() * 0.5}s;
            --end-x: ${endX}px;
        `;

        container.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, (duration + 0.5) * 1000);
    }

    addSparkleEffects() {
        // Create sparkle container
        let sparkleContainer = document.querySelector('.sparkle-container');
        if (!sparkleContainer) {
            sparkleContainer = document.createElement('div');
            sparkleContainer.className = 'sparkle-container';
            sparkleContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 999;
                overflow: hidden;
            `;
            document.body.appendChild(sparkleContainer);
        }

        // Create sparkles on click
        document.addEventListener('click', (e) => {
            if (this.effectsEnabled) {
                this.createSparklesBurst(e.clientX, e.clientY, sparkleContainer);
            }
        });

        // Random sparkles
        this.sparkleInterval = setInterval(() => {
            if (Math.random() < 0.3 && this.effectsEnabled) {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                this.createSparkle(x, y, sparkleContainer);
            }
        }, 2000);
    }

    createSparklesBurst(x, y, container) {
        const burstCount = 8;
        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = (Math.random() - 0.5) * 100;
                this.createSparkle(x + offsetX, y + offsetY, container);
            }, i * 100);
        }
    }

    createSparkle(x, y, container) {
        const sparkle = document.createElement('div');
        const sparkleSymbols = ['✨', '⭐', '💫', '🌟', '✴️'];
        
        sparkle.innerHTML = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
        sparkle.className = 'romantic-sparkle';
        
        sparkle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: ${Math.random() * 15 + 10}px;
            animation: sparkleAnimation ${Math.random() * 2 + 1}s ease-out forwards;
            transform: translate(-50%, -50%);
        `;

        container.appendChild(sparkle);

        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 3000);
    }

    setupLoveMessages() {
        const loveMessages = [
            "Every moment with you is magical ✨",
            "You are my forever and always 💕",
            "Love grows stronger every day 🌹",
            "You make my world complete 🌍",
            "Together we are infinite ♾️",
            "My heart beats for you 💓",
            "You are my sunshine ☀️",
            "Love you to the moon and back 🌙",
            "You're my happy place 🏡",
            "Forever grateful for your love 🙏"
        ];

        let messageIndex = 0;
        
        const showNextMessage = () => {
            if (this.effectsEnabled) {
                this.showLoveMessage(loveMessages[messageIndex]);
                messageIndex = (messageIndex + 1) % loveMessages.length;
            }
            
            // Schedule next message (20-40 seconds)
            this.messageTimeout = setTimeout(showNextMessage, Math.random() * 20000 + 20000);
        };

        // Show first message after 10 seconds
        setTimeout(showNextMessage, 10000);
    }

    showLoveMessage(message) {
        // Remove existing message
        const existingMessage = document.querySelector('.love-message-romantic');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageEl = document.createElement('div');
        messageEl.className = 'love-message-romantic';
        messageEl.textContent = message;
        
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.95), rgba(255, 192, 203, 0.95));
            color: #d63384;
            padding: 20px 30px;
            border-radius: 25px;
            font-family: 'Dancing Script', cursive;
            font-size: 1.2rem;
            font-weight: 600;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            z-index: 2000;
            opacity: 0;
            animation: loveMessageAnimation 4s ease-in-out forwards;
            pointer-events: none;
            max-width: 80%;
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 4000);
    }

    addInteractiveEffects() {
        // Add hover effects to buttons and links
        const interactiveElements = document.querySelectorAll('button, a, .enhanced-button');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.effectsEnabled) {
                    this.createHoverEffect(element);
                }
            });
        });
    }

    createHoverEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create small hearts around the element
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💕';
                heart.style.cssText = `
                    position: fixed;
                    left: ${centerX + (Math.random() - 0.5) * 60}px;
                    top: ${centerY + (Math.random() - 0.5) * 60}px;
                    font-size: 12px;
                    pointer-events: none;
                    z-index: 1500;
                    animation: miniHeartAnimation 1s ease-out forwards;
                `;
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                    }
                }, 1000);
            }, i * 200);
        }
    }

    createRomanticCursor() {
        // Create custom cursor trail
        let cursorTrail = [];
        const maxTrailLength = 10;

        document.addEventListener('mousemove', (e) => {
            if (!this.effectsEnabled) return;

            // Add current position to trail
            cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            // Limit trail length
            if (cursorTrail.length > maxTrailLength) {
                cursorTrail.shift();
            }

            // Occasionally create a small sparkle at cursor
            if (Math.random() < 0.1) {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.cssText = `
                    position: fixed;
                    left: ${e.clientX}px;
                    top: ${e.clientY}px;
                    font-size: 8px;
                    pointer-events: none;
                    z-index: 1500;
                    animation: cursorSparkle 0.8s ease-out forwards;
                    transform: translate(-50%, -50%);
                `;
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.remove();
                    }
                }, 800);
            }
        });
    }

    addRomanticStyles() {
        // Add CSS animations for romantic effects
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUpHeart {
                0% {
                    transform: translateY(0) translateX(0) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: translateY(-50vh) translateX(calc(var(--end-x) * 0.5)) rotate(180deg);
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(-100vh) translateX(var(--end-x)) rotate(360deg);
                    opacity: 0;
                }
            }

            @keyframes sparkleAnimation {
                0% {
                    transform: translate(-50%, -50%) scale(0) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
                    opacity: 0.8;
                }
                100% {
                    transform: translate(-50%, -50%) scale(0) rotate(360deg);
                    opacity: 0;
                }
            }

            @keyframes loveMessageAnimation {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                20% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                80% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
            }

            @keyframes miniHeartAnimation {
                0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.2) rotate(180deg);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(0) rotate(360deg);
                    opacity: 0;
                }
            }

            @keyframes cursorSparkle {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
            }

            .romantic-heart, .romantic-sparkle {
                user-select: none;
                -webkit-user-select: none;
            }
        `;
        document.head.appendChild(style);
    }

    toggleEffects() {
        this.effectsEnabled = !this.effectsEnabled;
        
        if (!this.effectsEnabled) {
            // Clear intervals
            if (this.heartInterval) clearInterval(this.heartInterval);
            if (this.sparkleInterval) clearInterval(this.sparkleInterval);
            if (this.messageTimeout) clearTimeout(this.messageTimeout);
            
            // Remove existing effects
            document.querySelectorAll('.romantic-heart, .romantic-sparkle, .love-message-romantic').forEach(el => el.remove());
        } else {
            // Restart effects
            this.createFloatingHearts();
            this.addSparkleEffects();
            this.setupLoveMessages();
        }
    }

    destroy() {
        this.effectsEnabled = false;
        
        // Clear all intervals and timeouts
        if (this.heartInterval) clearInterval(this.heartInterval);
        if (this.sparkleInterval) clearInterval(this.sparkleInterval);
        if (this.messageTimeout) clearTimeout(this.messageTimeout);
        
        // Remove all effect elements
        document.querySelectorAll('.floating-hearts-romantic, .sparkle-container, .romantic-heart, .romantic-sparkle, .love-message-romantic').forEach(el => el.remove());
        
        this.isInitialized = false;
    }
}

// Initialize Romantic Effects
document.addEventListener('DOMContentLoaded', () => {
    // Add romantic styles first
    const romanticEffects = new RomanticEffects();
    romanticEffects.addRomanticStyles();
    
    // Initialize effects after a short delay to ensure page is ready
    setTimeout(() => {
        window.romanticEffects = romanticEffects;
    }, 1000);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RomanticEffects;
}
