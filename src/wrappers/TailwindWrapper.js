/**
 * Tailwind CSS Wrapper - Custom inheritance for easier maintenance
 * Provides personalized utility classes and extends Tailwind functionality
 * Version: 1.0.0
 */

class TailwindWrapper {
    constructor() {
        this.config = {
            // Custom anniversary website colors
            colors: {
                primary: '#ec4899',      // Pink-500
                secondary: '#f472b6',    // Pink-400
                accent: '#be185d',       // Pink-700
                romantic: '#fdf2f8',     // Pink-50
                love: '#ff1744',         // Custom love red
                warm: '#ffa8cc',         // Custom warm pink
                soft: '#ffb3d6'          // Custom soft pink
            },
            
            // Custom spacing scale
            spacing: {
                'romantic': '0.875rem',  // 14px
                'love': '1.125rem',      // 18px
                'tender': '1.375rem',    // 22px
                'passion': '1.625rem'    // 26px
            },

            // Custom animations
            animations: {
                'float': 'float 6s ease-in-out infinite',
                'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
                'romantic-fade': 'romantic-fade 2s ease-in-out infinite',
                'love-pulse': 'love-pulse 2s ease-in-out infinite'
            }
        };

        this.init();
    }

    /**
     * Initialize custom Tailwind extensions
     */
    init() {
        this.addCustomClasses();
        this.addUtilities();
        this.addAnimations();
        console.log('💗 TailwindWrapper initialized with custom romantic styles');
    }

    /**
     * Add custom utility classes extending Tailwind
     */
    addCustomClasses() {
        const style = document.createElement('style');
        style.id = 'tailwind-custom-extensions';
        style.textContent = `
            /* === ROMANTIC COLORS === */
            .bg-romantic { background-color: ${this.config.colors.romantic} !important; }
            .bg-love { background-color: ${this.config.colors.love} !important; }
            .bg-warm { background-color: ${this.config.colors.warm} !important; }
            .bg-soft { background-color: ${this.config.colors.soft} !important; }
            
            .text-romantic { color: ${this.config.colors.romantic} !important; }
            .text-love { color: ${this.config.colors.love} !important; }
            .text-warm { color: ${this.config.colors.warm} !important; }
            .text-soft { color: ${this.config.colors.soft} !important; }
            
            .border-romantic { border-color: ${this.config.colors.romantic} !important; }
            .border-love { border-color: ${this.config.colors.love} !important; }
            .border-warm { border-color: ${this.config.colors.warm} !important; }
            .border-soft { border-color: ${this.config.colors.soft} !important; }

            /* === ROMANTIC SPACING === */
            .p-romantic { padding: ${this.config.spacing.romantic} !important; }
            .p-love { padding: ${this.config.spacing.love} !important; }
            .p-tender { padding: ${this.config.spacing.tender} !important; }
            .p-passion { padding: ${this.config.spacing.passion} !important; }
            
            .m-romantic { margin: ${this.config.spacing.romantic} !important; }
            .m-love { margin: ${this.config.spacing.love} !important; }
            .m-tender { margin: ${this.config.spacing.tender} !important; }
            .m-passion { margin: ${this.config.spacing.passion} !important; }

            /* === ROMANTIC GRADIENTS === */
            .bg-gradient-romantic {
                background: linear-gradient(135deg, ${this.config.colors.romantic} 0%, ${this.config.colors.warm} 50%, ${this.config.colors.soft} 100%) !important;
            }
            
            .bg-gradient-love {
                background: linear-gradient(135deg, ${this.config.colors.love} 0%, ${this.config.colors.primary} 50%, ${this.config.colors.secondary} 100%) !important;
            }
            
            .bg-gradient-sunset {
                background: linear-gradient(135deg, #ff6b9d 0%, #ffa8cc 25%, #ffb3d6 50%, #c084fc 75%, #60a5fa 100%) !important;
            }

            /* === ROMANTIC SHADOWS === */
            .shadow-romantic {
                box-shadow: 0 10px 25px rgba(236, 72, 153, 0.15), 0 4px 10px rgba(236, 72, 153, 0.1) !important;
            }
            
            .shadow-love {
                box-shadow: 0 8px 20px rgba(255, 23, 68, 0.2), 0 3px 8px rgba(255, 23, 68, 0.15) !important;
            }
            
            .shadow-soft {
                box-shadow: 0 6px 15px rgba(255, 179, 214, 0.25), 0 2px 6px rgba(255, 179, 214, 0.2) !important;
            }

            /* === GLASS EFFECTS === */
            .glass-romantic {
                background: rgba(255, 255, 255, 0.1) !important;
                backdrop-filter: blur(25px) !important;
                -webkit-backdrop-filter: blur(25px) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
            
            .glass-love {
                background: rgba(255, 23, 68, 0.1) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(255, 23, 68, 0.2) !important;
            }

            /* === BUTTON VARIANTS === */
            .btn-romantic {
                background: ${this.config.colors.primary} !important;
                color: white !important;
                padding: 0.75rem 1.5rem !important;
                border-radius: 25px !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3) !important;
            }
            
            .btn-romantic:hover {
                background: ${this.config.colors.accent} !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4) !important;
            }
            
            .btn-love {
                background: ${this.config.colors.love} !important;
                color: white !important;
                padding: 0.75rem 1.5rem !important;
                border-radius: 25px !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 15px rgba(255, 23, 68, 0.3) !important;
            }
            
            .btn-love:hover {
                background: #d50000 !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 25px rgba(255, 23, 68, 0.5) !important;
            }

            /* === CARD VARIANTS === */
            .card-romantic {
                background: rgba(255, 255, 255, 0.1) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border-radius: 20px !important;
                padding: 2rem !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
            }
            
            .card-love {
                background: linear-gradient(135deg, rgba(255, 23, 68, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border-radius: 20px !important;
                padding: 2rem !important;
                border: 1px solid rgba(255, 23, 68, 0.2) !important;
                box-shadow: 0 8px 32px rgba(255, 23, 68, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add custom utility functions
     */
    addUtilities() {
        // Responsive utilities
        this.addResponsiveUtilities();
        
        // Animation utilities
        this.addAnimationUtilities();
        
        // Layout utilities
        this.addLayoutUtilities();
    }

    /**
     * Add responsive utilities
     */
    addResponsiveUtilities() {
        const style = document.createElement('style');
        style.id = 'tailwind-responsive-utilities';
        style.textContent = `
            /* === RESPONSIVE ROMANTIC UTILITIES === */
            @media (min-width: 768px) {
                .md\\:card-love-large {
                    padding: 3rem !important;
                    border-radius: 30px !important;
                }
                
                .md\\:text-love-xl {
                    font-size: 2.5rem !important;
                    line-height: 1.2 !important;
                }
            }
            
            @media (min-width: 1024px) {
                .lg\\:glass-love-strong {
                    backdrop-filter: blur(40px) !important;
                    -webkit-backdrop-filter: blur(40px) !important;
                }
            }
            
            @media (max-width: 767px) {
                .mobile\\:p-romantic {
                    padding: 1rem !important;
                }
                
                .mobile\\:text-romantic-sm {
                    font-size: 0.875rem !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add animation utilities
     */
    addAnimationUtilities() {
        const style = document.createElement('style');
        style.id = 'tailwind-animation-utilities';
        style.textContent = `
            /* === CUSTOM ANIMATIONS === */
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(2deg); }
            }
            
            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                25% { transform: scale(1.1); }
                50% { transform: scale(1.05); }
                75% { transform: scale(1.15); }
            }
            
            @keyframes romantic-fade {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }
            
            @keyframes love-pulse {
                0%, 100% { 
                    transform: scale(1);
                    box-shadow: 0 0 20px rgba(255, 23, 68, 0.3);
                }
                50% { 
                    transform: scale(1.05);
                    box-shadow: 0 0 30px rgba(255, 23, 68, 0.6);
                }
            }

            /* === ANIMATION CLASSES === */
            .animate-float { animation: ${this.config.animations.float}; }
            .animate-heartbeat { animation: ${this.config.animations.heartbeat}; }
            .animate-romantic-fade { animation: ${this.config.animations['romantic-fade']}; }
            .animate-love-pulse { animation: ${this.config.animations['love-pulse']}; }
            
            /* === HOVER ANIMATIONS === */
            .hover-float:hover { animation: float 2s ease-in-out infinite; }
            .hover-heartbeat:hover { animation: heartbeat 1s ease-in-out infinite; }
            .hover-glow:hover { 
                box-shadow: 0 0 30px rgba(236, 72, 153, 0.5), 0 0 60px rgba(236, 72, 153, 0.3);
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add layout utilities
     */
    addLayoutUtilities() {
        const style = document.createElement('style');
        style.id = 'tailwind-layout-utilities';
        style.textContent = `
            /* === ROMANTIC LAYOUTS === */
            .layout-romantic-grid {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
                gap: 2rem !important;
                padding: 2rem !important;
            }
            
            .layout-love-flex {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 1.5rem !important;
            }
            
            .layout-center-romantic {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 100vh !important;
                padding: 2rem !important;
            }

            /* === CONTAINER VARIANTS === */
            .container-romantic {
                max-width: 1200px !important;
                margin: 0 auto !important;
                padding: 0 2rem !important;
            }
            
            .container-love {
                max-width: 800px !important;
                margin: 0 auto !important;
                padding: 0 1.5rem !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add custom animations
     */
    addAnimations() {
        // Animations are handled in addAnimationUtilities()
        console.log('💫 Custom animations added to TailwindWrapper');
    }

    /**
     * Utility method to apply romantic classes to elements
     */
    applyRomanticStyling(element, variant = 'default') {
        if (!element) return;

        const variants = {
            'default': ['glass-romantic', 'shadow-romantic', 'animate-float'],
            'love': ['glass-love', 'shadow-love', 'animate-heartbeat'],
            'card': ['card-romantic', 'hover-glow'],
            'button': ['btn-romantic', 'hover-float'],
            'text': ['text-love', 'animate-romantic-fade']
        };

        const classes = variants[variant] || variants.default;
        element.classList.add(...classes);
    }

    /**
     * Utility method to create romantic gradients
     */
    createRomanticGradient(type = 'romantic') {
        const gradients = {
            'romantic': this.config.colors.romantic + ' to ' + this.config.colors.warm,
            'love': this.config.colors.love + ' to ' + this.config.colors.primary,
            'sunset': '#ff6b9d to #ffa8cc to #ffb3d6 to #c084fc to #60a5fa'
        };

        return `linear-gradient(135deg, ${gradients[type] || gradients.romantic})`;
    }

    /**
     * Get color palette
     */
    getColors() {
        return this.config.colors;
    }

    /**
     * Get spacing scale
     */
    getSpacing() {
        return this.config.spacing;
    }

    /**
     * Get animations
     */
    getAnimations() {
        return this.config.animations;
    }
}

// Initialize and expose globally
window.TailwindWrapper = TailwindWrapper;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (!window.tailwindWrapper) {
        window.tailwindWrapper = new TailwindWrapper();
    }
});

// Export for module systems
export { TailwindWrapper };
