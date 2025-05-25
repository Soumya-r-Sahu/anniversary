// Enhanced Love Anniversary Website JavaScript
// Mobile Optimized with Advanced Music Player

// Mobile detection and performance optimization
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowPerformance = isMobile || navigator.hardwareConcurrency <= 2;

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Battery optimization
let isPageVisible = true;
document.addEventListener('visibilitychange', function() {
    isPageVisible = !document.hidden;
});

// Enhanced Music Player Class
class EnhancedMusicPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.3;
        this.button = null;
        this.icon = null;
        this.visualizer = null;
        this.autoplayAttempted = false;
        this.userInteracted = false;
        
        this.init();
    }
    
    init() {
        // Initialize audio element
        this.audio = document.getElementById('background-music');
        this.button = document.getElementById('music-toggle');
        this.icon = document.getElementById('music-icon');
        this.visualizer = document.getElementById('music-visualizer');
        
        if (!this.audio || !this.button) return;
        
        // Set initial properties
        this.audio.volume = this.volume;
        this.audio.loop = true;
        
        // Event listeners
        this.button.addEventListener('click', () => this.toggle());
        
        // Audio event listeners
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        this.audio.addEventListener('error', () => this.onError());
        this.audio.addEventListener('canplaythrough', () => this.onReady());
        
        // Attempt autoplay after user interaction
        this.setupAutoplay();
        
        // Update button state
        this.updateButton();
    }
    
    setupAutoplay() {
        const events = ['click', 'touchstart', 'keydown', 'scroll'];
        const handleFirstInteraction = () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                this.attemptAutoplay();
                
                // Remove listeners after first interaction
                events.forEach(event => {
                    document.removeEventListener(event, handleFirstInteraction);
                });
            }
        };
        
        events.forEach(event => {
            document.addEventListener(event, handleFirstInteraction, { once: true, passive: true });
        });
    }
    
    async attemptAutoplay() {
        if (this.autoplayAttempted || !this.audio) return;
        this.autoplayAttempted = true;
        
        try {
            await this.audio.play();
            console.log('🎵 Autoplay successful!');
        } catch (error) {
            console.log('🔇 Autoplay prevented by browser policy');
        }
    }
    
    async toggle() {
        if (!this.audio) return;
        
        try {
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                await this.audio.play();
            }
        } catch (error) {
            console.error('Audio playback error:', error);
            this.onError();
        }
    }
    
    onPlay() {
        this.isPlaying = true;
        this.updateButton();
        this.startVisualizer();
    }
    
    onPause() {
        this.isPlaying = false;
        this.updateButton();
        this.stopVisualizer();
    }
    
    onError() {
        this.isPlaying = false;
        this.updateButton();
        this.stopVisualizer();
        console.error('Audio playback error');
    }
    
    onReady() {
        console.log('🎵 Audio ready to play');
    }
    
    updateButton() {
        if (!this.icon) return;
        
        if (this.isPlaying) {
            this.icon.textContent = '🎵';
            this.button.style.background = 'linear-gradient(135deg, #ec4899, #f472b6, #fb7185)';
            this.button.setAttribute('aria-label', 'Pause Background Music');
        } else {
            this.icon.textContent = '🔇';
            this.button.style.background = 'linear-gradient(135deg, #6b7280, #9ca3af)';
            this.button.setAttribute('aria-label', 'Play Background Music');
        }
    }
    
    startVisualizer() {
        if (this.visualizer) {
            this.visualizer.style.display = 'inline-flex';
        }
    }
    
    stopVisualizer() {
        if (this.visualizer) {
            this.visualizer.style.display = 'none';
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }
}

// Initialize AOS (Animate On Scroll) with mobile optimizations
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: isMobile ? 600 : 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: isMobile ? 50 : 120,
        delay: isMobile ? 50 : 100
    });
});

// Enhanced Random Heart Animation System
class RandomHeartAnimation {    constructor() {
        this.heartContainer = null;
        this.isRunning = false;
        this.heartInterval = null;
        // Expanded heart emoji collection for more variety
        this.heartTypes = ['💕', '💖', '💝', '💗', '💘', '❤️', '💞', '💓', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '❣️', '💟', '♥️', '💋'];
        this.init();
    }
    
    init() {
        // Create heart container if it doesn't exist
        if (!document.querySelector('.floating-hearts')) {
            this.heartContainer = document.createElement('div');
            this.heartContainer.className = 'floating-hearts';
            this.heartContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 5;
                overflow: hidden;
            `;
            document.body.appendChild(this.heartContainer);
        } else {
            this.heartContainer = document.querySelector('.floating-hearts');
        }
        
        this.startAnimation();
    }
    
    startAnimation() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        // Create hearts at random intervals
        const createRandomHeart = () => {
            if (this.isRunning && isPageVisible) {
                this.createRandomHeart();
            }
            
            // Random delay between 1-4 seconds
            const nextDelay = (Math.random() * 3000) + 1000;
            this.heartInterval = setTimeout(createRandomHeart, nextDelay);
        };
        
        createRandomHeart();
    }
      createRandomHeart() {
        const heart = document.createElement('div');
        heart.className = 'random-heart';
        
        // Expanded heart emoji collection for more variety
        const heartType = this.heartTypes[Math.floor(Math.random() * this.heartTypes.length)];
        
        // Enhanced random movement patterns
        const movementPattern = Math.floor(Math.random() * 6); // 0-5: different movement patterns
        let startX, startY, endX, endY, animationType;
        
        switch(movementPattern) {
            case 0: // Traditional edge-to-edge
                const spawnSide = Math.floor(Math.random() * 4);
                switch(spawnSide) {
                    case 0: // From top
                        startX = Math.random() * window.innerWidth;
                        startY = -50;
                        endX = Math.random() * window.innerWidth;
                        endY = window.innerHeight + 50;
                        break;
                    case 1: // From right
                        startX = window.innerWidth + 50;
                        startY = Math.random() * window.innerHeight;
                        endX = -50;
                        endY = Math.random() * window.innerHeight;
                        break;
                    case 2: // From bottom
                        startX = Math.random() * window.innerWidth;
                        startY = window.innerHeight + 50;
                        endX = Math.random() * window.innerWidth;
                        endY = -50;
                        break;
                    case 3: // From left
                        startX = -50;
                        startY = Math.random() * window.innerHeight;
                        endX = window.innerWidth + 50;
                        endY = Math.random() * window.innerHeight;
                        break;
                }
                animationType = 'linear';
                break;
                
            case 1: // Spiral movement
                startX = Math.random() * window.innerWidth;
                startY = Math.random() * window.innerHeight;
                endX = Math.random() * window.innerWidth;
                endY = Math.random() * window.innerHeight;
                animationType = 'spiral';
                break;
                
            case 2: // Bouncing effect
                startX = Math.random() * window.innerWidth;
                startY = -50;
                endX = Math.random() * window.innerWidth;
                endY = window.innerHeight + 50;
                animationType = 'bounce';
                break;
                
            case 3: // Zigzag pattern
                startX = Math.random() * 100;
                startY = Math.random() * window.innerHeight;
                endX = window.innerWidth - Math.random() * 100;
                endY = Math.random() * window.innerHeight;
                animationType = 'zigzag';
                break;
                
            case 4: // Center explosion
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                startX = centerX + (Math.random() - 0.5) * 100;
                startY = centerY + (Math.random() - 0.5) * 100;
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * 300 + 200;
                endX = centerX + Math.cos(angle) * distance;
                endY = centerY + Math.sin(angle) * distance;
                animationType = 'explosion';
                break;
                
            case 5: // Random teleport (appear and disappear at random positions)
                startX = Math.random() * window.innerWidth;
                startY = Math.random() * window.innerHeight;
                endX = Math.random() * window.innerWidth;
                endY = Math.random() * window.innerHeight;
                animationType = 'teleport';
                break;
        }
        
        // Enhanced random properties
        const size = Math.random() * 20 + 12; // 12-32px (wider range)
        const duration = Math.random() * 6 + 3; // 3-9 seconds (wider range)
        const rotationSpeed = Math.random() * 720 + 180; // 180-900 degrees (more rotation)
        const opacity = Math.random() * 0.6 + 0.4; // 0.4-1.0
        const randomHue = Math.random() * 60 - 30; // -30 to +30 hue shift for color variety
        
        heart.style.cssText = `
            position: absolute;
            left: ${startX}px;
            top: ${startY}px;
            font-size: ${size}px;
            opacity: ${opacity};
            pointer-events: none;
            user-select: none;
            z-index: 5;
            filter: drop-shadow(0 0 10px rgba(255, 107, 157, 0.8)) hue-rotate(${randomHue}deg);
            transition: all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        heart.textContent = heartType;
        this.heartContainer.appendChild(heart);
        
        // Apply different animation based on pattern
        this.animateHeart(heart, startX, startY, endX, endY, duration, rotationSpeed, animationType);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, duration * 1000 + 500);
    }
    
    animateHeart(heart, startX, startY, endX, endY, duration, rotationSpeed, animationType) {
        switch(animationType) {
            case 'spiral':
                this.animateSpiral(heart, startX, startY, endX, endY, duration, rotationSpeed);
                break;
            case 'bounce':
                this.animateBounce(heart, startX, startY, endX, endY, duration, rotationSpeed);
                break;
            case 'zigzag':
                this.animateZigzag(heart, startX, startY, endX, endY, duration, rotationSpeed);
                break;
            case 'explosion':
                this.animateExplosion(heart, startX, startY, endX, endY, duration, rotationSpeed);
                break;
            case 'teleport':
                this.animateTeleport(heart, startX, startY, endX, endY, duration, rotationSpeed);
                break;
            default: // linear
                this.animateLinear(heart, startX, startY, endX, endY, duration, rotationSpeed);
        }
    }
    
    animateLinear(heart, startX, startY, endX, endY, duration, rotationSpeed) {
        requestAnimationFrame(() => {
            const curveX = (Math.random() - 0.5) * 300; // Increased curve intensity
            const curveY = (Math.random() - 0.5) * 150;
            
            heart.style.transform = `
                translate(${endX - startX + curveX}px, ${endY - startY + curveY}px) 
                rotate(${rotationSpeed}deg) 
                scale(${Math.random() * 0.8 + 0.6})
            `;
            heart.style.opacity = '0';
        });
    }
    
    animateSpiral(heart, startX, startY, endX, endY, duration, rotationSpeed) {
        const steps = 100;
        const stepDuration = duration * 1000 / steps;
        let currentStep = 0;
        
        const spiralAnimation = () => {
            if (currentStep >= steps || !heart.parentNode) return;
            
            const progress = currentStep / steps;
            const angle = progress * Math.PI * 4; // 2 full spirals
            const radius = 50 * (1 - progress); // Shrinking spiral
            
            const currentX = startX + (endX - startX) * progress + Math.cos(angle) * radius;
            const currentY = startY + (endY - startY) * progress + Math.sin(angle) * radius;
            const currentRotation = rotationSpeed * progress;
            
            heart.style.transform = `
                translate(${currentX - startX}px, ${currentY - startY}px) 
                rotate(${currentRotation}deg) 
                scale(${1 - progress * 0.5})
            `;
            heart.style.opacity = 1 - progress;
            
            currentStep++;
            setTimeout(spiralAnimation, stepDuration);
        };
        
        spiralAnimation();
    }
    
    animateBounce(heart, startX, startY, endX, endY, duration, rotationSpeed) {
        const bounces = 3;
        const bounceHeight = 100;
        
        requestAnimationFrame(() => {
            heart.style.transition = `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
            heart.style.transform = `
                translate(${endX - startX}px, ${endY - startY}px) 
                rotate(${rotationSpeed}deg) 
                scale(0.8)
            `;
            heart.style.opacity = '0';
        });
    }
    
    animateZigzag(heart, startX, startY, endX, endY, duration, rotationSpeed) {
        const zigzagSteps = 8;
        const stepDuration = duration * 1000 / zigzagSteps;
        let currentStep = 0;
        
        const zigzagAnimation = () => {
            if (currentStep >= zigzagSteps || !heart.parentNode) return;
            
            const progress = currentStep / zigzagSteps;
            const zigzagAmplitude = 80;
            const zigzagOffset = Math.sin(progress * Math.PI * 3) * zigzagAmplitude;
            
            const currentX = startX + (endX - startX) * progress + zigzagOffset;
            const currentY = startY + (endY - startY) * progress;
            const currentRotation = rotationSpeed * progress;
            
            heart.style.transform = `
                translate(${currentX - startX}px, ${currentY - startY}px) 
                rotate(${currentRotation}deg) 
                scale(${0.8 + Math.sin(progress * Math.PI * 2) * 0.3})
            `;
            heart.style.opacity = 1 - progress;
            
            currentStep++;
            setTimeout(zigzagAnimation, stepDuration);
        };
        
        zigzagAnimation();
    }
    
    animateExplosion(heart, startX, startY, endX, endY, duration, rotationSpeed) {
        requestAnimationFrame(() => {
            heart.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            heart.style.transform = `
                translate(${endX - startX}px, ${endY - startY}px) 
                rotate(${rotationSpeed}deg) 
                scale(${Math.random() * 1.5 + 0.5})
            `;
            heart.style.opacity = '0';
        });
    }
    
    animateTeleport(heart, startX, startY, endX, endY, duration, rotationSpeed) {
        // Fade out, move, then fade in
        heart.style.transition = 'opacity 0.3s ease-in-out';
        heart.style.opacity = '0';
        
        setTimeout(() => {
            heart.style.left = endX + 'px';
            heart.style.top = endY + 'px';
            heart.style.transform = `rotate(${rotationSpeed}deg) scale(${Math.random() * 0.5 + 0.75})`;
            heart.style.transition = `opacity ${duration - 0.6}s ease-in-out`;
            heart.style.opacity = '1';
            
            setTimeout(() => {
                heart.style.opacity = '0';
            }, (duration - 0.6) * 1000);
        }, 300);
    }
    
    stop() {
        this.isRunning = false;
        if (this.heartInterval) {
            clearTimeout(this.heartInterval);
            this.heartInterval = null;
        }
    }
}

// Initialize Particles.js with mobile optimization
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: isLowPerformance ? 25 : 50,
                density: {
                    enable: true,
                    value_area: isLowPerformance ? 1200 : 800
                }
            },
            color: {
                value: ["#ff6b9d", "#ffa8cc", "#ffb3d6"]
            },
            shape: {
                type: "circle",
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: isLowPerformance ? 1 : 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: !isLowPerformance,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// Enhanced smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (!element) return;
    
    const targetPosition = element.offsetTop - 80; // Account for fixed nav
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    
    let start = null;
    
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const ease = easeInOutCubic(progress / duration);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < duration) {
            window.requestAnimationFrame(step);
        }
    }
    
    window.requestAnimationFrame(step);
}

// Easing function for smooth animations
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Enhanced Gallery Functionality
class EnhancedGallery {
    constructor() {
        this.currentSlide = 0;
        this.gallerySlides = document.querySelectorAll('.gallery-slide');
        this.autoAdvanceInterval = null;
        this.init();
    }
    
    init() {
        if (this.gallerySlides.length === 0) return;
        
        this.showSlide(0);
        
        // Auto-advance gallery on desktop
        if (!isMobile && this.gallerySlides.length > 1) {
            this.startAutoAdvance();
        }
        
        // Pause auto-advance when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoAdvance();
            } else if (!isMobile) {
                this.startAutoAdvance();
            }
        });
    }
    
    showSlide(index) {
        this.gallerySlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            slide.style.transform = `translateX(${(i - index) * 100}%)`;
            slide.style.opacity = i === index ? '1' : '0';
        });
        this.currentSlide = index;
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.gallerySlides.length;
        this.showSlide(next);
    }
    
    previousSlide() {
        const prev = (this.currentSlide - 1 + this.gallerySlides.length) % this.gallerySlides.length;
        this.showSlide(prev);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.gallerySlides.length) {
            this.showSlide(index);
        }
    }
    
    startAutoAdvance() {
        this.stopAutoAdvance();
        this.autoAdvanceInterval = setInterval(() => {
            if (isPageVisible) {
                this.nextSlide();
            }
        }, 5000);
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }
}

// Global functions for gallery controls
let galleryInstance;

function nextSlide() {
    if (galleryInstance) galleryInstance.nextSlide();
}

function previousSlide() {
    if (galleryInstance) galleryInstance.previousSlide();
}

function currentSlide(index) {
    if (galleryInstance) galleryInstance.goToSlide(index - 1);
}

// Typed.js initialization
function initTypedText() {
    if (typeof Typed !== 'undefined' && document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                "From June 16, 2024 to forever...",
                "Every moment with you is magical ✨",
                "You are my greatest blessing 💕",
                "My sweet Jerry, my everything 🐒❤️"
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Surprise button functionality
function initSurpriseButton() {
    const surpriseBtn = document.getElementById('surprise-btn');
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', function() {
            // Create confetti effect
            createConfetti();
            
            // Show surprise modal or animation
            showSurpriseMessage();
        });
    }
}

// Confetti effect
function createConfetti() {
    const confettiCount = 50;
    const colors = ['#ff6b9d', '#ffa8cc', '#ffb3d6', '#ff8fab', '#ec4899'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            z-index: 9999;
            pointer-events: none;
            animation: confetti-fall 3s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(confettiStyle);

// Surprise message
function showSurpriseMessage() {
    const messages = [
        "You are the most beautiful thing that happened to me! 💕",
        "Every day with you feels like a dream come true! ✨",
        "My sweet Jerry, you make my heart skip a beat! 🐒❤️",
        "I love you more than words can express! 💖"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: linear-gradient(135deg, #ff6b9d, #ffa8cc);
        color: white;
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: modalAppear 0.5s ease-out;
    `;
    
    messageBox.innerHTML = `
        <h3 style="font-family: 'Dancing Script', cursive; font-size: 1.5rem; margin-bottom: 1rem;">
            💕 Special Message 💕
        </h3>
        <p style="font-size: 1.1rem; line-height: 1.5; margin-bottom: 1.5rem;">
            ${randomMessage}
        </p>
        <button onclick="this.closest('.modal').remove()" style="
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
        ">Close 💖</button>
    `;
    
    modal.className = 'modal';
    modal.appendChild(messageBox);
    document.body.appendChild(modal);
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Add modal animation CSS
const modalStyle = document.createElement('style');
modalStyle.textContent = `
    @keyframes modalAppear {
        from {
            transform: scale(0.5) translateY(-50px);
            opacity: 0;
        }
        to {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(modalStyle);

// Initialize everything when DOM is loaded
let musicPlayer, gallery;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize music player
    musicPlayer = new EnhancedMusicPlayer();
    
    // Initialize gallery
    galleryInstance = new EnhancedGallery();
    
    // Initialize typed text
    setTimeout(initTypedText, 1000);
    
    // Initialize surprise button
    initSurpriseButton();
    
    console.log('🎉 Enhanced Anniversary Website Initialized!');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`📊 Page Load Time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }, 0);
    });
}
