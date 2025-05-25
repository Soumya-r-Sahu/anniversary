// Enhanced Random Heart Animation System
class RandomHeartAnimation {
    constructor() {
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
        
        // Page visibility API for performance
        let isPageVisible = !document.hidden;
        document.addEventListener('visibilitychange', () => {
            isPageVisible = !document.hidden;
        });
          // Create hearts at random intervals
        const createRandomHeart = () => {
            if (this.isRunning && isPageVisible) {
                // Create multiple hearts at once for more density
                const heartsToCreate = Math.floor(Math.random() * 3) + 2; // 2-4 hearts at once
                for (let i = 0; i < heartsToCreate; i++) {
                    setTimeout(() => this.createRandomHeart(), i * 200); // Stagger by 200ms
                }
            }
            
            // Reduced delay between 0.5-2 seconds (was 1-4 seconds)
            const nextDelay = (Math.random() * 1500) + 500;
            this.heartInterval = setTimeout(createRandomHeart, nextDelay);
        };
        
        createRandomHeart();
    }
    
    createRandomHeart() {
        const heart = document.createElement('div');
        heart.className = 'random-heart';
        
        // Random heart type
        const heartType = this.heartTypes[Math.floor(Math.random() * this.heartTypes.length)];
        
        // Simple floating animation from bottom to top
        const startX = Math.random() * (window.innerWidth - 50);
        const startY = window.innerHeight + 50;
        const endX = startX + (Math.random() - 0.5) * 200; // Some horizontal drift
        const endY = -50;
        
        // Random properties
        const size = Math.random() * 20 + 12; // 12-32px
        const duration = Math.random() * 6 + 3; // 3-9 seconds
        const rotationSpeed = Math.random() * 720 + 180; // 180-900 degrees
        const opacity = Math.random() * 0.6 + 0.4; // 0.4-1.0
        const randomHue = Math.random() * 60 - 30; // Color variety
        
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
        
        // Animate the heart
        requestAnimationFrame(() => {
            const curveX = (Math.random() - 0.5) * 200;
            heart.style.transform = `
                translate(${endX - startX + curveX}px, ${endY - startY}px) 
                rotate(${rotationSpeed}deg) 
                scale(${Math.random() * 0.8 + 0.6})
            `;
            heart.style.opacity = '0';
        });
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, duration * 1000 + 500);
    }
    
    stop() {
        this.isRunning = false;
        if (this.heartInterval) {
            clearTimeout(this.heartInterval);
            this.heartInterval = null;
        }
    }
}
