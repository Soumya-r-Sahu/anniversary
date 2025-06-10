/**
 * Anniversary Website v5.0.0 - Advanced Visual Effects
 * Magical animations and interactive effects 💫
 */

// Advanced Effects Manager
class EffectsManager {
    constructor() {
        this.activeEffects = new Map();
        this.animationFrameId = null;
        this.isRunning = false;
        
        // Effect configurations
        this.config = {
            particles: {
                maxCount: 100,
                spawnRate: 0.3,
                colors: ['#ec4899', '#f472b6', '#a855f7', '#06b6d4', '#10b981'],
                sizes: [2, 4, 6, 8],
                speeds: [0.5, 1, 1.5, 2]
            },
            aurora: {
                layers: 3,
                speed: 0.001,
                intensity: 0.8
            },
            hearts: {
                spawnRate: 0.1,
                maxCount: 20,
                emotions: ['💕', '💖', '💗', '💓', '💘', '💝', '💞', '💟']
            }
        };
    }

    // Initialize all effects
    init() {
        console.log('✨ Initializing magical effects...');
        
        this.setupParticleSystem();
        this.setupAuroraEffects();
        this.setupInteractionEffects();
        this.setupScrollEffects();
        this.startEffectLoop();
        
        console.log('🌟 All effects are ready!');
    }

    // Setup particle system
    setupParticleSystem() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) {
            console.warn('Particle canvas not found');
            return;
        }

        // Make canvas responsive
        this.resizeCanvas(canvas);
        window.addEventListener('resize', () => this.resizeCanvas(canvas));

        // Initialize particle effect
        this.activeEffects.set('particles', {
            canvas: canvas,
            ctx: canvas.getContext('2d'),
            particles: [],
            lastSpawn: 0
        });
    }

    // Resize canvas
    resizeCanvas(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Setup aurora background effects
    setupAuroraEffects() {
        const auroraContainer = document.querySelector('.aurora-background');
        if (!auroraContainer) return;

        // Enhance aurora with dynamic properties
        const layers = auroraContainer.querySelectorAll('.aurora-layer');
        layers.forEach((layer, index) => {
            layer.style.setProperty('--aurora-delay', `${index * 2}s`);
            layer.style.setProperty('--aurora-duration', `${20 + index * 5}s`);
            
            // Add subtle pulsing
            layer.style.animation += `, aurora-pulse ${15 + index * 3}s ease-in-out infinite alternate`;
        });
    }

    // Setup interaction effects
    setupInteractionEffects() {
        // Mouse trail effect
        document.addEventListener('mousemove', (e) => {
            this.createMouseTrail(e.clientX, e.clientY);
        });

        // Click ripple effect
        document.addEventListener('click', (e) => {
            this.createClickRipple(e.clientX, e.clientY);
        });

        // Card hover effects
        this.setupCardEffects();
    }

    // Setup card interaction effects
    setupCardEffects() {
        const cards = document.querySelectorAll('.nav-card, .stat-item, .button');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addMagicalGlow(e.currentTarget);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.removeMagicalGlow(e.currentTarget);
            });
            
            card.addEventListener('click', (e) => {
                this.createMagicalBurst(e.currentTarget);
            });
        });
    }

    // Setup scroll-based effects
    setupScrollEffects() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for scroll animations
        const animationTargets = document.querySelectorAll('.nav-card, .stat-item, .hero-title, .hero-subtitle');
        animationTargets.forEach(target => observer.observe(target));
    }

    // Start the main effect loop
    startEffectLoop() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.effectLoop();
    }

    // Main effect animation loop
    effectLoop() {
        if (!this.isRunning) return;

        this.updateParticles();
        this.updateHeartEffects();
        
        this.animationFrameId = requestAnimationFrame(() => this.effectLoop());
    }

    // Update particle system
    updateParticles() {
        const particleEffect = this.activeEffects.get('particles');
        if (!particleEffect) return;

        const { canvas, ctx, particles } = particleEffect;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Spawn new particles
        if (Math.random() < this.config.particles.spawnRate) {
            this.spawnParticle(particles, canvas);
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            this.updateParticle(particle);
            this.drawParticle(ctx, particle);
            
            // Remove dead particles
            if (particle.life <= 0 || particle.y < -50 || particle.y > canvas.height + 50) {
                particles.splice(i, 1);
            }
        }
    }

    // Spawn a new particle
    spawnParticle(particles, canvas) {
        if (particles.length >= this.config.particles.maxCount) return;
        
        const particle = {
            x: Math.random() * canvas.width,
            y: canvas.height + 50,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 1,
            size: this.config.particles.sizes[Math.floor(Math.random() * this.config.particles.sizes.length)],
            color: this.config.particles.colors[Math.floor(Math.random() * this.config.particles.colors.length)],
            life: 1.0,
            decay: Math.random() * 0.01 + 0.005,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        };
        
        particles.push(particle);
    }

    // Update individual particle
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;
        particle.rotation += particle.rotationSpeed;
        
        // Add some physics
        particle.vy += 0.02; // gravity
        particle.vx *= 0.999; // air resistance
    }

    // Draw individual particle
    drawParticle(ctx, particle) {
        ctx.save();
        
        ctx.globalAlpha = particle.life;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        
        // Create gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, particle.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    // Update floating heart effects
    updateHeartEffects() {
        if (Math.random() < this.config.hearts.spawnRate) {
            this.createFloatingHeart();
        }
    }

    // Create floating heart
    createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart-effect';
        heart.innerHTML = this.config.hearts.emotions[Math.floor(Math.random() * this.config.hearts.emotions.length)];
        
        const size = Math.random() * 20 + 15;
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 4 + 6;
        
        heart.style.cssText = `
            position: fixed;
            left: ${startX}px;
            bottom: -50px;
            font-size: ${size}px;
            pointer-events: none;
            z-index: 5;
            opacity: ${Math.random() * 0.7 + 0.3};
            text-shadow: 0 0 10px currentColor;
            animation: heart-float ${duration}s linear forwards;
        `;
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, duration * 1000);
    }

    // Create mouse trail effect
    createMouseTrail(x, y) {
        if (Math.random() > 0.3) return; // Limit spawn rate
        
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(236, 72, 153, 0.8), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: trail-fade 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.remove();
            }
        }, 800);
    }

    // Create click ripple effect
    createClickRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.cssText = `
            position: fixed;
            left: ${x - 25}px;
            top: ${y - 25}px;
            width: 50px;
            height: 50px;
            border: 2px solid rgba(236, 72, 153, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: ripple-expand 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    // Add magical glow to element
    addMagicalGlow(element) {
        element.style.transition = 'all 0.3s ease';
        element.style.boxShadow = '0 0 30px rgba(236, 72, 153, 0.4), 0 0 60px rgba(236, 72, 153, 0.2)';
        element.style.transform = 'translateY(-5px) scale(1.02)';
        
        // Add sparkles around element
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createSparkle(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }, i * 100);
        }
    }

    // Remove magical glow from element
    removeMagicalGlow(element) {
        element.style.boxShadow = '';
        element.style.transform = '';
    }

    // Create magical burst effect
    createMagicalBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create multiple sparkles in a burst pattern
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            setTimeout(() => {
                this.createSparkle(x, y);
            }, i * 50);
        }
    }

    // Create sparkle effect
    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'magical-sparkle';
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${Math.random() * 10 + 8}px;
            pointer-events: none;
            z-index: 1000;
            animation: sparkle-twinkle 1s ease-out forwards;
            color: hsl(${Math.random() * 60 + 300}, 70%, 70%);
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 1000);
    }

    // Trigger scroll animation
    triggerScrollAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }

    // Stop all effects
    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    // Cleanup
    destroy() {
        this.stop();
        this.activeEffects.clear();
    }
}

// CSS Animations for effects (injected dynamically)
const effectsCSS = `
@keyframes heart-float {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}

@keyframes trail-fade {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0.5);
    }
}

@keyframes ripple-expand {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes sparkle-twinkle {
    0%, 100% {
        opacity: 0;
        transform: scale(0.5) rotate(0deg);
    }
    50% {
        opacity: 1;
        transform: scale(1.5) rotate(180deg);
    }
}

@keyframes sparkle-fade {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0);
    }
}

@keyframes aurora-pulse {
    0% { opacity: 0.3; }
    100% { opacity: 0.8; }
}

.floating-heart-effect {
    will-change: transform, opacity;
}

.mouse-trail,
.click-ripple,
.magical-sparkle {
    will-change: transform, opacity;
}
`;

// Inject effects CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = effectsCSS;
document.head.appendChild(styleSheet);

// Initialize effects manager
window.EffectsManager = new EffectsManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.EffectsManager.init();
    });
} else {
    window.EffectsManager.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EffectsManager;
}
