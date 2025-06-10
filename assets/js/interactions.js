/**
 * Anniversary Website v5.0.0 - Interactive Features
 * Advanced user interactions and magical experiences 💖
 */

// Interactive Features Manager
class InteractionManager {
    constructor() {
        this.activeInteractions = new Map();
        this.touchSupported = 'ontouchstart' in window;
        this.gameStates = new Map();
        
        // Configuration
        this.config = {
            loveQuotes: [
                "In your eyes, I found my home 🏠💕",
                "Every heartbeat whispers your name 💓",
                "You are the poetry my heart writes 📝❤️",
                "With you, every moment is magical ✨💖",
                "My love for you grows stronger every day 🌱💕",
                "You make my world brighter than sunshine ☀️💛",
                "Forever isn't long enough with you ♾️💝",
                "You are my greatest adventure 🗺️💕"
            ],
            surpriseMessages: [
                "💕 Surprise! A virtual hug for you!",
                "🌟 You just unlocked a magical moment!",
                "💖 Random act of digital love activated!",
                "✨ Sparkles of joy sent your way!",
                "🎁 A little gift of happiness for you!",
                "💫 Magic happens when you click around!",
                "🌸 Flowers of love blooming for you!",
                "💝 A secret love note just for you!"
            ]
        };
    }

    // Initialize all interactive features
    init() {
        console.log('💖 Initializing magical interactions...');
        
        this.setupTouchInteractions();
        this.setupKeyboardShortcuts();
        this.setupSecretInteractions();
        this.setupLoveGames();
        this.setupSurpriseSystem();
        this.setupVoiceInteractions();
        
        console.log('🎮 All interactions are ready!');
    }

    // Setup touch and mobile interactions
    setupTouchInteractions() {
        if (!this.touchSupported) return;

        // Multi-touch heart creation
        let touches = [];
        
        document.addEventListener('touchstart', (e) => {
            touches = Array.from(e.touches);
            
            if (touches.length === 2) {
                // Two-finger tap creates special effect
                this.createHeartBurst(
                    (touches[0].clientX + touches[1].clientX) / 2,
                    (touches[0].clientY + touches[1].clientY) / 2
                );
            }
        });

        // Swipe gestures
        let startX, startY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Detect swipe direction
            if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
                this.handleSwipeGesture(deltaX, deltaY);
            }
        });
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Secret love combinations
            const key = e.key.toLowerCase();
            
            switch (key) {
                case 'l':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.showRandomLoveQuote();
                    }
                    break;
                    
                case 'h':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.createHeartRain();
                    }
                    break;
                    
                case 'm':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleMagicMode();
                    }
                    break;
                    
                case ' ':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.createRandomSurprise();
                    }
                    break;
            }
            
            // Konami code for special surprise
            this.checkKonamiCode(key);
        });
    }

    // Setup secret interactions
    setupSecretInteractions() {
        // Secret click areas
        this.createSecretZones();
        
        // Double-click magic
        document.addEventListener('dblclick', (e) => {
            this.createMagicalExplosion(e.clientX, e.clientY);
        });
        
        // Right-click context menu replacement
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextualSurprise(e.clientX, e.clientY);
        });
        
        // Mouse idle detection
        let idleTimer;
        document.addEventListener('mousemove', () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                this.triggerIdleAnimation();
            }, 5000);
        });
    }

    // Create secret interactive zones
    createSecretZones() {
        const zones = [
            { x: 10, y: 10, width: 50, height: 50, action: 'corner-surprise' },
            { x: window.innerWidth - 60, y: 10, width: 50, height: 50, action: 'corner-surprise' },
            { x: window.innerWidth / 2 - 25, y: window.innerHeight - 60, width: 50, height: 50, action: 'bottom-surprise' }
        ];

        zones.forEach((zone, index) => {
            const secretZone = document.createElement('div');
            secretZone.className = 'secret-zone';
            secretZone.style.cssText = `
                position: fixed;
                left: ${zone.x}px;
                top: ${zone.y}px;
                width: ${zone.width}px;
                height: ${zone.height}px;
                z-index: 9999;
                cursor: pointer;
                transition: all 0.3s ease;
                border-radius: 50%;
            `;
            
            secretZone.addEventListener('mouseenter', () => {
                secretZone.style.background = 'rgba(236, 72, 153, 0.1)';
                secretZone.style.backdropFilter = 'blur(10px)';
            });
            
            secretZone.addEventListener('mouseleave', () => {
                secretZone.style.background = 'transparent';
                secretZone.style.backdropFilter = 'none';
            });
            
            secretZone.addEventListener('click', () => {
                this.activateSecretZone(zone.action, zone.x + zone.width/2, zone.y + zone.height/2);
            });
            
            document.body.appendChild(secretZone);
        });
    }

    // Setup love-themed mini games
    setupLoveGames() {
        // Heart catching game
        this.activeInteractions.set('heartCatcher', {
            score: 0,
            active: false,
            hearts: []
        });
        
        // Love memory game
        this.activeInteractions.set('loveMemory', {
            cards: [],
            flipped: [],
            matches: 0,
            active: false
        });
    }

    // Setup surprise system
    setupSurpriseSystem() {
        // Random surprise timer
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.createRandomSurprise();
            }
        }, 30000); // Every 30 seconds
        
        // Page visibility change surprises
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => {
                    this.showSurpriseMessage('Welcome back, my love! 💕');
                }, 1000);
            }
        });
    }

    // Setup voice interactions (experimental)
    setupVoiceInteractions() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            
            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.handleVoiceCommand(command);
            };
        }
    }

    // Handle swipe gestures
    handleSwipeGesture(deltaX, deltaY) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                // Swipe right
                this.createHeartTrail('right');
            } else {
                // Swipe left
                this.createHeartTrail('left');
            }
        } else {
            if (deltaY > 0) {
                // Swipe down
                this.createHeartRain();
            } else {
                // Swipe up
                this.createFloatingHearts();
            }
        }
    }

    // Show random love quote
    showRandomLoveQuote() {
        const quote = this.config.loveQuotes[Math.floor(Math.random() * this.config.loveQuotes.length)];
        this.showFloatingMessage(quote, 'love-quote');
    }

    // Create heart rain effect
    createHeartRain() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createFallingHeart();
            }, i * 200);
        }
        
        this.showNotification('💕 Heart rain activated! Love is in the air!', 'love');
    }

    // Create falling heart
    createFallingHeart() {
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.innerHTML = ['💕', '💖', '💗', '💓', '💘'][Math.floor(Math.random() * 5)];
        
        heart.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: -50px;
            font-size: ${Math.random() * 20 + 20}px;
            pointer-events: none;
            z-index: 1000;
            animation: fall-down ${Math.random() * 3 + 2}s linear forwards;
            color: hsl(${Math.random() * 60 + 300}, 70%, 70%);
        `;
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 5000);
    }

    // Toggle magic mode
    toggleMagicMode() {
        const body = document.body;
        
        if (body.classList.contains('magic-mode')) {
            body.classList.remove('magic-mode');
            this.showNotification('✨ Magic mode disabled', 'info');
        } else {
            body.classList.add('magic-mode');
            this.showNotification('🪄 Magic mode activated! Everything is more magical now!', 'magic');
            this.activateEnhancedEffects();
        }
    }

    // Activate enhanced effects for magic mode
    activateEnhancedEffects() {
        // Enhanced particle count
        if (window.EffectsManager) {
            window.EffectsManager.config.particles.spawnRate *= 2;
            window.EffectsManager.config.hearts.spawnRate *= 1.5;
        }
        
        // Enhanced interactions
        document.querySelectorAll('.nav-card, .stat-item').forEach(el => {
            el.style.filter = 'hue-rotate(45deg) saturate(1.2) brightness(1.1)';
        });
    }

    // Create heart burst effect
    createHeartBurst(x, y) {
        for (let i = 0; i < 8; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '💕';
            heart.className = 'burst-heart';
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            
            heart.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: 20px;
                pointer-events: none;
                z-index: 1000;
                transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                opacity: 1;
            `;
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.style.left = targetX + 'px';
                heart.style.top = targetY + 'px';
                heart.style.opacity = '0';
                heart.style.transform = 'scale(1.5) rotate(360deg)';
            }, 100);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
            }, 1100);
        }
    }

    // Create magical explosion effect
    createMagicalExplosion(x, y) {
        // Create explosion container
        const explosion = document.createElement('div');
        explosion.className = 'magical-explosion';
        explosion.style.cssText = `
            position: fixed;
            left: ${x - 50}px;
            top: ${y - 50}px;
            width: 100px;
            height: 100px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Create explosion particles
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = ['✨', '💫', '⭐', '🌟'][Math.floor(Math.random() * 4)];
            particle.style.cssText = `
                position: absolute;
                left: 50%;
                top: 50%;
                font-size: 16px;
                animation: explode-${i} 1s ease-out forwards;
            `;
            explosion.appendChild(particle);
        }
        
        document.body.appendChild(explosion);
        
        setTimeout(() => {
            if (explosion.parentNode) {
                explosion.remove();
            }
        }, 1000);
        
        this.showNotification('💥 Magical explosion! Double-click for more magic!', 'magic');
    }

    // Show contextual surprise
    showContextualSurprise(x, y) {
        const surprises = ['🎁', '🌹', '💎', '🦋', '🌸', '✨'];
        const surprise = surprises[Math.floor(Math.random() * surprises.length)];
        
        const element = document.createElement('div');
        element.innerHTML = surprise;
        element.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 30px;
            pointer-events: none;
            z-index: 1000;
            animation: surprise-pop 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(element);
        
        setTimeout(() => {
            if (element.parentNode) {
                element.remove();
            }
        }, 1500);
    }

    // Trigger idle animation
    triggerIdleAnimation() {
        this.createFloatingMessage('Missing you... 💕', 'idle-message');
        this.createGentleHeartFloat();
    }

    // Create gentle floating hearts for idle state
    createGentleHeartFloat() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💕';
                heart.className = 'gentle-float';
                heart.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * window.innerWidth}px;
                    bottom: -50px;
                    font-size: 25px;
                    pointer-events: none;
                    z-index: 100;
                    opacity: 0.6;
                    animation: gentle-float ${Math.random() * 5 + 8}s ease-in-out forwards;
                `;
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                    }
                }, 13000);
            }, i * 1000);
        }
    }

    // Activate secret zone
    activateSecretZone(action, x, y) {
        switch (action) {
            case 'corner-surprise':
                this.createHeartBurst(x, y);
                this.showNotification('🔍 You found a secret zone! 🎉', 'secret');
                break;
            case 'bottom-surprise':
                this.showRandomLoveQuote();
                this.createMagicalExplosion(x, y);
                break;
        }
    }

    // Handle voice commands
    handleVoiceCommand(command) {
        if (command.includes('love') || command.includes('heart')) {
            this.createHeartRain();
            this.showNotification('🎤 Voice command activated: Love mode!', 'voice');
        } else if (command.includes('magic')) {
            this.toggleMagicMode();
        } else if (command.includes('surprise')) {
            this.createRandomSurprise();
        }
    }

    // Create random surprise
    createRandomSurprise() {
        const surprises = [
            () => this.createHeartRain(),
            () => this.showRandomLoveQuote(),
            () => this.createMagicalExplosion(window.innerWidth / 2, window.innerHeight / 2),
            () => this.createHeartBurst(Math.random() * window.innerWidth, Math.random() * window.innerHeight),
            () => this.triggerColorPulse()
        ];
        
        const surprise = surprises[Math.floor(Math.random() * surprises.length)];
        surprise();
        
        const message = this.config.surpriseMessages[Math.floor(Math.random() * this.config.surpriseMessages.length)];
        this.showNotification(message, 'surprise');
    }

    // Trigger color pulse effect
    triggerColorPulse() {
        document.body.style.transition = 'filter 0.5s ease';
        document.body.style.filter = 'hue-rotate(45deg) saturate(1.3)';
        
        setTimeout(() => {
            document.body.style.filter = '';
        }, 1000);
    }

    // Show floating message
    showFloatingMessage(text, className = '') {
        const message = document.createElement('div');
        message.className = `floating-message ${className}`;
        message.innerHTML = text;
        message.style.cssText = `
            position: fixed;
            left: 50%;
            top: 30%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-size: 18px;
            text-align: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(236, 72, 153, 0.5);
            animation: message-fade-in-out 4s ease-in-out forwards;
            max-width: 300px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 4000);
    }

    // Show notification (using existing notification system)
    showNotification(message, type) {
        if (window.AnniversaryApp && window.AnniversaryApp.showNotification) {
            window.AnniversaryApp.showNotification(message, type);
        } else {
            console.log(`📢 ${message}`);
        }
    }

    // Check Konami code
    checkKonamiCode(key) {
        if (!this.konamiSequence) {
            this.konamiSequence = [];
        }
        
        const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
        
        this.konamiSequence.push(key);
        
        if (this.konamiSequence.length > konamiCode.length) {
            this.konamiSequence.shift();
        }
        
        if (this.konamiSequence.length === konamiCode.length && 
            this.konamiSequence.every((key, index) => key === konamiCode[index])) {
            this.activateKonamiSurprise();
            this.konamiSequence = [];
        }
    }

    // Activate Konami code surprise
    activateKonamiSurprise() {
        this.showNotification('🎮 KONAMI CODE ACTIVATED! Ultimate love mode unlocked! 💕✨', 'konami');
        
        // Ultra magical effects
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createHeartBurst(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 200);
        }
        
        // Special color mode
        document.body.style.animation = 'rainbow-love 5s ease-in-out infinite';
    }
}

// Add required CSS animations
const interactionCSS = `
@keyframes fall-down {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

@keyframes gentle-float {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 0.6;
    }
    90% {
        opacity: 0.6;
    }
    100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}

@keyframes message-fade-in-out {
    0%, 100% {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px) scale(0.9);
    }
    20%, 80% {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
    }
}

@keyframes surprise-pop {
    0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
    }
    50% {
        transform: scale(1.5) rotate(180deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.8) rotate(360deg);
        opacity: 0;
    }
}

@keyframes rainbow-love {
    0%, 100% { filter: hue-rotate(0deg); }
    25% { filter: hue-rotate(90deg); }
    50% { filter: hue-rotate(180deg); }
    75% { filter: hue-rotate(270deg); }
}

.magic-mode {
    filter: saturate(1.2) brightness(1.1);
}

.magic-mode .nav-card {
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.4) !important;
}

.secret-zone:hover {
    animation: secret-glow 1s ease-in-out infinite alternate;
}

@keyframes secret-glow {
    0% { box-shadow: 0 0 10px rgba(236, 72, 153, 0.3); }
    100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.6); }
}
`;

// Inject interaction CSS
const interactionStyleSheet = document.createElement('style');
interactionStyleSheet.textContent = interactionCSS;
document.head.appendChild(interactionStyleSheet);

// Initialize interaction manager
window.InteractionManager = new InteractionManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.InteractionManager.init();
    });
} else {
    window.InteractionManager.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionManager;
}
