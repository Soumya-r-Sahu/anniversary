/**
 * Typed.js Wrapper with Romantic Enhancements
 * Enhanced with romantic typing effects for our anniversary website
 */

class TypedWrapper {
    constructor() {
        this.instances = new Map();
        this.romanticConfig = {
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '💖',
            contentType: 'html',
            smartBackspace: true
        };
        
        this.romanticPhrases = this.getRomanticPhrases();
        this.isLoaded = false;
        
        this.init();
    }

    /**
     * Initialize Typed.js wrapper
     */
    init() {
        if (typeof Typed === 'undefined') {
            console.warn('⚠️ Typed.js not loaded. Please include typed.js library first.');
            return;
        }
        
        this.isLoaded = true;
        console.log('💕 Typed Romantic Wrapper initialized');
    }

    /**
     * Get romantic phrases collections
     */
    getRomanticPhrases() {
        return {
            love: [
                "I love you more than words can say 💕",
                "You are my heart and soul ❤️",
                "Forever and always, my love 💖",
                "You make my world complete 🌟",
                "In your arms, I found my home 🏠"
            ],
            memories: [
                "Remember when we first met? ✨",
                "Our first dance under the stars 💃",
                "The way you smiled that day 😊",
                "Every moment with you is precious 💎",
                "Creating beautiful memories together 📷"
            ],
            promises: [
                "I promise to love you always 💍",
                "Together, we can conquer anything 💪",
                "My heart belongs to you forever 💕",
                "I'll stand by you through everything 🤝",
                "You and me, against the world 🌍"
            ],
            sweet: [
                "You're my sunshine ☀️",
                "Sweet dreams, my love 🌙",
                "You're absolutely perfect 💯",
                "My beautiful angel 👼",
                "You light up my life ✨"
            ],
            future: [
                "Our future looks so bright ✨",
                "Growing old together 👫",
                "Building our dreams side by side 🏗️",
                "Forever starts with you 💖",
                "The best is yet to come 🚀"
            ],
            gratitude: [
                "Thank you for being you 🙏",
                "Grateful for every day with you 💝",
                "You're my greatest blessing 🌟",
                "Lucky to call you mine 🍀",
                "Thankful for your love 💕"
            ]
        };
    }

    /**
     * Create romantic typing effect
     */
    create(elementSelector, strings, options = {}) {
        if (!this.isLoaded) {
            console.warn('⚠️ Typed.js wrapper not initialized');
            return null;
        }

        const element = typeof elementSelector === 'string' 
            ? document.querySelector(elementSelector) 
            : elementSelector;
            
        if (!element) {
            console.warn(`⚠️ Element not found: ${elementSelector}`);
            return null;
        }

        // Merge configurations
        const config = {
            ...this.romanticConfig,
            ...options,
            strings: strings
        };

        // Add romantic styling to element
        this.addRomanticStyling(element);

        // Create Typed instance
        const typed = new Typed(element, config);
        
        // Store instance
        const instanceId = this.generateInstanceId();
        this.instances.set(instanceId, {
            typed: typed,
            element: element,
            config: config,
            selector: elementSelector
        });

        console.log(`💝 Romantic typing effect created for ${elementSelector}`);
        return { id: instanceId, instance: typed };
    }

    /**
     * Create love letter typing effect
     */
    createLoveLetter(elementSelector, customStrings = null, options = {}) {
        const strings = customStrings || this.romanticPhrases.love;
        
        const loveLetterConfig = {
            typeSpeed: 60,
            backSpeed: 20,
            backDelay: 2000,
            startDelay: 1000,
            loop: true,
            cursorChar: '💕',
            fadeOut: true,
            fadeOutClass: 'typed-fade-out',
            fadeOutDelay: 500,
            ...options
        };

        return this.create(elementSelector, strings, loveLetterConfig);
    }

    /**
     * Create memory typewriter effect
     */
    createMemoryTypewriter(elementSelector, customStrings = null, options = {}) {
        const strings = customStrings || this.romanticPhrases.memories;
        
        const memoryConfig = {
            typeSpeed: 40,
            backSpeed: 25,
            backDelay: 3000,
            startDelay: 500,
            loop: true,
            cursorChar: '✨',
            smartBackspace: false,
            ...options
        };

        return this.create(elementSelector, strings, memoryConfig);
    }

    /**
     * Create promise typing effect
     */
    createPromiseTyping(elementSelector, customStrings = null, options = {}) {
        const strings = customStrings || this.romanticPhrases.promises;
        
        const promiseConfig = {
            typeSpeed: 70,
            backSpeed: 30,
            backDelay: 2500,
            startDelay: 800,
            loop: false,
            cursorChar: '💍',
            showCursor: true,
            ...options
        };

        return this.create(elementSelector, strings, promiseConfig);
    }

    /**
     * Create sweet whispers effect
     */
    createSweetWhispers(elementSelector, customStrings = null, options = {}) {
        const strings = customStrings || this.romanticPhrases.sweet;
        
        const whisperConfig = {
            typeSpeed: 35,
            backSpeed: 20,
            backDelay: 1800,
            startDelay: 300,
            loop: true,
            cursorChar: '💫',
            fadeOut: true,
            ...options
        };

        return this.create(elementSelector, strings, whisperConfig);
    }

    /**
     * Create countdown typing effect
     */
    createCountdown(elementSelector, targetDate, options = {}) {
        const countdownStrings = this.generateCountdownStrings(targetDate);
        
        const countdownConfig = {
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 1000,
            startDelay: 0,
            loop: true,
            cursorChar: '⏰',
            ...options
        };

        // Update countdown periodically
        const instance = this.create(elementSelector, countdownStrings, countdownConfig);
        
        if (instance) {
            setInterval(() => {
                const updatedStrings = this.generateCountdownStrings(targetDate);
                this.updateStrings(instance.id, updatedStrings);
            }, 60000); // Update every minute
        }

        return instance;
    }

    /**
     * Generate countdown strings
     */
    generateCountdownStrings(targetDate) {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const difference = target - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

            return [
                `${days} days until our special moment 💕`,
                `${hours} hours and counting... ⏰`,
                `${minutes} minutes to go! 🎉`,
                `Can't wait to celebrate with you! 💖`
            ];
        } else {
            return [
                "The special day is here! 🎉",
                "Our love story continues! 💕",
                "Celebrating us today! 🥳",
                "Forever and always! 💖"
            ];
        }
    }

    /**
     * Add romantic styling to element
     */
    addRomanticStyling(element) {
        // Add romantic CSS classes
        element.classList.add('romantic-typing');
        
        // Apply inline styles if no CSS is present
        if (!document.querySelector('.romantic-typing')) {
            const style = document.createElement('style');
            style.textContent = `
                .romantic-typing {
                    font-family: 'Georgia', serif;
                    color: #ec4899;
                    text-shadow: 0 0 10px rgba(236, 72, 153, 0.3);
                    background: linear-gradient(45deg, #ec4899, #ff1744);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: romanticGlow 2s ease-in-out infinite alternate;
                }
                
                @keyframes romanticGlow {
                    0% { filter: brightness(1); }
                    100% { filter: brightness(1.2); }
                }
                
                .typed-cursor {
                    animation: romanticBlink 1s infinite;
                }
                
                @keyframes romanticBlink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                
                .typed-fade-out {
                    opacity: 0;
                    transition: opacity 0.5s ease-out;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Update strings for existing instance
     */
    updateStrings(instanceId, newStrings) {
        const instance = this.instances.get(instanceId);
        if (!instance) {
            console.warn(`⚠️ Instance ${instanceId} not found`);
            return;
        }

        // Destroy current instance
        instance.typed.destroy();
        
        // Update config with new strings
        instance.config.strings = newStrings;
        
        // Create new instance with updated strings
        instance.typed = new Typed(instance.element, instance.config);
        
        console.log(`💖 Updated strings for instance ${instanceId}`);
    }

    /**
     * Pause typing animation
     */
    pause(instanceId) {
        const instance = this.instances.get(instanceId);
        if (instance && instance.typed.stop) {
            instance.typed.stop();
        }
    }

    /**
     * Resume typing animation
     */
    resume(instanceId) {
        const instance = this.instances.get(instanceId);
        if (instance && instance.typed.start) {
            instance.typed.start();
        }
    }

    /**
     * Destroy specific instance
     */
    destroy(instanceId) {
        const instance = this.instances.get(instanceId);
        if (instance) {
            instance.typed.destroy();
            this.instances.delete(instanceId);
            console.log(`💔 Destroyed typing instance ${instanceId}`);
        }
    }

    /**
     * Destroy all instances
     */
    destroyAll() {
        this.instances.forEach((instance, id) => {
            this.destroy(id);
        });
    }

    /**
     * Get instance by ID
     */
    getInstance(instanceId) {
        return this.instances.get(instanceId);
    }

    /**
     * Get all instances
     */
    getAllInstances() {
        return Array.from(this.instances.entries());
    }

    /**
     * Generate unique instance ID
     */
    generateInstanceId() {
        return 'typed_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get phrase collection by category
     */
    getPhrases(category) {
        return this.romanticPhrases[category] || [];
    }

    /**
     * Add custom phrase to category
     */
    addPhrase(category, phrase) {
        if (!this.romanticPhrases[category]) {
            this.romanticPhrases[category] = [];
        }
        this.romanticPhrases[category].push(phrase);
    }

    /**
     * Create typing sequence with multiple elements
     */
    createSequence(elements, delay = 1000) {
        const instances = [];
        
        elements.forEach((config, index) => {
            setTimeout(() => {
                const instance = this.create(
                    config.selector, 
                    config.strings, 
                    { ...config.options, startDelay: 0 }
                );
                if (instance) {
                    instances.push(instance);
                }
            }, index * delay);
        });

        return instances;
    }
}

// Create global instance
window.RomanticTyped = new TypedWrapper();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypedWrapper;
}
