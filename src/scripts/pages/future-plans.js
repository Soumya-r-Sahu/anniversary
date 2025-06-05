// Future Plans Manager - Comprehensive Future Planning System
// filepath: d:\Projects\Coding\Github\soumya\anniversary\src\scripts\pages\future-plans.js

export class FuturePlansManager {
    constructor() {
        this.plans = [];
        this.currentFilter = 'all';
        this.particleSystem = null;
        this.init();
    }

    init() {
        this.setupPlanCards();
        this.setupCategoryFilters();
        this.setupPlanForm();
        this.setupTimelineInteractions();
        this.initParticleSystem();
        this.init3DEffects();
        this.animateCounters();
        this.animateProgressBars();
        this.loadSamplePlans();
    }

    // Plan Cards System
    setupPlanCards() {
        const planCards = document.querySelectorAll('.plan-card');
        
        planCards.forEach((card, index) => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.createPlanEffect(card);
                this.animateProgressBar(card);
            });

            // Add click interaction
            card.addEventListener('click', () => {
                this.expandPlanDetails(card);
            });

            // Add staggered animation on load
            setTimeout(() => {
                card.style.animation = 'slideInUp 0.8s ease forwards';
            }, index * 200);
        });
    }

    // Category Filtering System
    setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.plan-filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Get filter category
                const category = button.dataset.category;
                this.currentFilter = category;
                
                // Apply filter with animation
                this.filterPlans(category);
                
                // Create filter effect
                this.createFilterEffect(button);
            });
        });
    }

    // Plan Form Handling
    setupPlanForm() {
        const form = document.getElementById('planForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitPlan(form);
        });

        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateField(input);
            });
        });

        // Add character count for textareas
        const textareas = form.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            this.addCharacterCounter(textarea);
        });
    }

    // Timeline Interactions
    setupTimelineInteractions() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            // Add staggered animation
            setTimeout(() => {
                item.style.animation = 'fadeInUp 0.8s ease forwards';
            }, index * 300);

            // Add hover effects
            item.addEventListener('mouseenter', () => {
                this.animateTimelineItem(item);
            });

            // Add click interaction
            item.addEventListener('click', () => {
                this.expandTimelineYear(item);
            });
        });
    }

    // Particle System
    initParticleSystem() {
        this.particleSystem = new FutureParticleSystem();
    }

    // 3D Effects System
    init3DEffects() {
        const cards = document.querySelectorAll('.plan-card, .stat-card, .timeline-content');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 12;
                const rotateY = (centerX - x) / 12;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(25px)`;
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
        const increment = target / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
                this.createCounterCelebration(element);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 40);
    }

    // Progress Bar Animations
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target.closest('.plan-card'));
                }
            });
        });

        progressBars.forEach(bar => observer.observe(bar));
    }

    animateProgressBar(card) {
        const progressFill = card.querySelector('.progress-fill');
        if (!progressFill) return;

        const targetWidth = progressFill.style.width;
        progressFill.style.width = '0%';
        
        setTimeout(() => {
            progressFill.style.width = targetWidth;
        }, 200);
    }

    // Load Sample Plans
    loadSamplePlans() {
        this.plans = [
            {
                id: 1,
                title: 'Our Dream Home',
                category: 'home',
                timeline: 'medium',
                priority: 'high',
                description: 'A beautiful place where we\'ll build our life together.',
                progress: 25
            },
            {
                id: 2,
                title: 'World Adventures',
                category: 'travel',
                timeline: 'long',
                priority: 'medium',
                description: 'Exploring amazing destinations around the world.',
                progress: 15
            },
            {
                id: 3,
                title: 'Growing Our Family',
                category: 'family',
                timeline: 'long',
                priority: 'high',
                description: 'Creating a loving family together.',
                progress: 10
            }
        ];
    }

    // Plan Filtering with Animation
    filterPlans(category) {
        const planCards = document.querySelectorAll('.plan-card');
        
        planCards.forEach((card, index) => {
            setTimeout(() => {
                if (category === 'all') {
                    card.style.display = 'block';
                    card.style.animation = 'slideInUp 0.6s ease forwards';
                } else {
                    const planCategory = this.getPlanCategory(card);
                    if (planCategory === category) {
                        card.style.display = 'block';
                        card.style.animation = 'slideInUp 0.6s ease forwards';
                    } else {
                        card.style.animation = 'slideOutDown 0.4s ease forwards';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 400);
                    }
                }
            }, index * 100);
        });
    }

    getPlanCategory(card) {
        const title = card.querySelector('h3')?.textContent.toLowerCase();
        if (title?.includes('home') || title?.includes('house')) return 'home';
        if (title?.includes('travel') || title?.includes('adventure')) return 'travel';
        if (title?.includes('family') || title?.includes('baby')) return 'family';
        if (title?.includes('career') || title?.includes('work')) return 'career';
        if (title?.includes('hobby') || title?.includes('learning')) return 'hobbies';
        return 'dreams';
    }

    // Submit New Plan
    submitPlan(form) {
        const formData = new FormData(form);
        const newPlan = {
            id: Date.now(),
            title: formData.get('planTitle'),
            category: formData.get('planCategory'),
            timeline: formData.get('planTimeline'),
            priority: formData.get('planPriority'),
            description: formData.get('planDescription'),
            steps: formData.get('planSteps'),
            motivation: formData.get('planMotivation'),
            progress: 0
        };

        // Validate plan
        if (this.validatePlan(newPlan)) {
            this.plans.push(newPlan);
            this.showSuccessMessage('Future plan saved successfully! 🌟✨');
            form.reset();
            this.createCelebrationEffect(form);
            this.updatePlanStats();
        }
    }

    validatePlan(plan) {
        return plan.title && plan.category && plan.timeline && plan.priority && plan.description;
    }

    validateField(field) {
        if (field.checkValidity()) {
            field.style.borderColor = '#28a745';
            this.createValidationEffect(field, true);
        } else {
            field.style.borderColor = '#dc3545';
            this.createValidationEffect(field, false);
        }
    }

    addCharacterCounter(textarea) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            font-size: 0.8rem;
            color: #666;
            text-align: right;
            margin-top: 0.5rem;
        `;
        
        const updateCounter = () => {
            const current = textarea.value.length;
            const max = textarea.maxLength || 500;
            counter.textContent = `${current}/${max} characters`;
            
            if (current > max * 0.9) {
                counter.style.color = '#dc3545';
            } else if (current > max * 0.7) {
                counter.style.color = '#ffc107';
            } else {
                counter.style.color = '#666';
            }
        };
        
        textarea.addEventListener('input', updateCounter);
        textarea.parentNode.appendChild(counter);
        updateCounter();
    }

    // Plan Details Expansion
    expandPlanDetails(card) {
        const title = card.querySelector('h3')?.textContent;
        const description = card.querySelector('p')?.textContent;
        
        if (window.notificationManager) {
            window.notificationManager.show(
                'info',
                `Plan Details: ${title} 📋`,
                description || 'Expanding plan details...'
            );
        }

        this.createPlanExpansionEffect(card);
    }

    // Timeline Year Expansion
    expandTimelineYear(item) {
        const year = item.querySelector('.timeline-year')?.textContent;
        const content = item.querySelector('.timeline-content');
        
        this.createTimelineExpansionEffect(content);
        
        if (window.notificationManager) {
            window.notificationManager.show(
                'info',
                `Timeline: ${year} 📅`,
                'Exploring our plans for this timeframe!'
            );
        }
    }

    // Effects and Animations
    createPlanEffect(card) {
        const sparkles = document.createElement('div');
        sparkles.innerHTML = '✨💫🌟⭐✨';
        sparkles.className = 'plan-sparkles';
        sparkles.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 1.2rem;
            pointer-events: none;
            animation: sparkleFloat 2s ease-out forwards;
            z-index: 1000;
        `;

        card.appendChild(sparkles);
        setTimeout(() => sparkles.remove(), 2000);
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

    createCelebrationEffect(element) {
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉🌟💫✨🎊';
        celebration.className = 'celebration-burst';
        celebration.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            pointer-events: none;
            animation: celebrationBurst 2s ease-out forwards;
            z-index: 1000;
        `;

        element.appendChild(celebration);
        setTimeout(() => celebration.remove(), 2000);
    }

    createCounterCelebration(element) {
        const celebration = document.createElement('div');
        celebration.innerHTML = '🏆';
        celebration.style.cssText = `
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 1.5rem;
            pointer-events: none;
            animation: trophyBounce 1s ease-out forwards;
            z-index: 1000;
        `;

        element.parentNode.appendChild(celebration);
        setTimeout(() => celebration.remove(), 1000);
    }

    createValidationEffect(field, isValid) {
        const effect = document.createElement('div');
        effect.innerHTML = isValid ? '✅' : '❌';
        effect.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.2rem;
            pointer-events: none;
            animation: validationPop 0.5s ease-out forwards;
            z-index: 1000;
        `;

        field.parentNode.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    createPlanExpansionEffect(card) {
        card.style.animation = 'planPulse 0.6s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 600);
    }

    createTimelineExpansionEffect(content) {
        content.style.animation = 'timelineGlow 1s ease-in-out';
        setTimeout(() => {
            content.style.animation = '';
        }, 1000);
    }

    animateTimelineItem(item) {
        const year = item.querySelector('.timeline-year');
        year.style.animation = 'yearPulse 0.8s ease-in-out';
        setTimeout(() => {
            year.style.animation = '';
        }, 800);
    }

    // Utility Methods
    updatePlanStats() {
        const totalPlans = this.plans.length;
        const inProgress = this.plans.filter(plan => plan.progress > 0 && plan.progress < 100).length;
        const completed = this.plans.filter(plan => plan.progress === 100).length;
        
        // Update stat displays if they exist
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = totalPlans;
            statNumbers[1].textContent = inProgress;
            statNumbers[2].textContent = completed;
        }
    }

    showSuccessMessage(message) {
        if (window.notificationManager) {
            window.notificationManager.show('success', 'Success! 🌟', message);
        }
    }

    showErrorMessage(message) {
        if (window.notificationManager) {
            window.notificationManager.show('error', 'Error! ❌', message);
        }
    }
}

// Future Particle System
class FutureParticleSystem {
    constructor() {
        this.container = document.getElementById('future-particles');
        this.particles = [];
        this.futureSymbols = ['🌟', '✨', '💫', '🎯', '🏆', '🚀', '💎', '⭐', '🌠', '🔮'];
        this.init();
    }

    init() {
        if (!this.container) {
            this.createContainer();
        }
        this.createParticles();
        setInterval(() => this.createParticles(), 4000);
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'future-particles';
        this.container.className = 'future-particle-container';
        document.body.appendChild(this.container);
    }

    createParticles() {
        for (let i = 0; i < 4; i++) {
            setTimeout(() => this.createParticle(), i * 700);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'future-particle';
        particle.textContent = this.futureSymbols[Math.floor(Math.random() * this.futureSymbols.length)];
        
        // Random positioning and styling
        particle.style.left = Math.random() * 100 + '%';
        particle.style.fontSize = (Math.random() * 24 + 16) + 'px';
        
        // Add random animation delay
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 9) + 's';
        
        this.container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 13000);
    }
}

// Utility Functions
export function initFuturePlans() {
    return new FuturePlansManager();
}

// CSS Animation Keyframes (injected dynamically)
const animationStyles = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
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
            transform: translateY(50px);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes celebrationBurst {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.3);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8) translateY(-80px);
        }
    }
    
    @keyframes sparkleFloat {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translateY(-40px) scale(0.8);
        }
    }
    
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    @keyframes trophyBounce {
        0% { transform: translateX(-50%) translateY(0) scale(0); }
        50% { transform: translateX(-50%) translateY(-30px) scale(1.3); }
        100% { transform: translateX(-50%) translateY(-50px) scale(1) rotateZ(10deg); opacity: 0; }
    }
    
    @keyframes validationPop {
        0% { transform: translateY(-50%) scale(0); }
        50% { transform: translateY(-50%) scale(1.3); }
        100% { transform: translateY(-50%) scale(1); }
    }
    
    @keyframes planPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); box-shadow: 0 25px 50px rgba(138, 43, 226, 0.3); }
        100% { transform: scale(1); }
    }
    
    @keyframes timelineGlow {
        0% { box-shadow: 0 0 0 rgba(138, 43, 226, 0.4); }
        50% { box-shadow: 0 0 30px rgba(138, 43, 226, 0.6); }
        100% { box-shadow: 0 0 0 rgba(138, 43, 226, 0.4); }
    }
    
    @keyframes yearPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;

// Inject animation styles
if (!document.getElementById('future-plans-animations')) {
    const style = document.createElement('style');
    style.id = 'future-plans-animations';
    style.textContent = animationStyles;
    document.head.appendChild(style);
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFuturePlans);
} else {
    initFuturePlans();
}
