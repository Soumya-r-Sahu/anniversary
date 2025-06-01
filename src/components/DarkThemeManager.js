/**
 * Dark Theme Manager for Anniversary Website
 * Handles theme switching and persistence
 * Version: 1.0.0
 */

class DarkThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // Default to dark theme
        this.toggleButton = null;
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        // Load saved theme or use system preference
        this.loadTheme();
        
        // Create theme toggle button
        this.createToggleButton();
        
        // Apply theme
        this.applyTheme();
        
        // Listen for system theme changes
        this.setupSystemThemeListener();
        
        console.log('🌙 Dark Theme Manager initialized');
    }    /**
     * Load theme from localStorage or use dark theme as default
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('anniversary-theme');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Always default to dark theme
            this.currentTheme = 'dark';
        }
    }

    /**
     * Save theme to localStorage
     */
    saveTheme() {
        localStorage.setItem('anniversary-theme', this.currentTheme);
    }

    /**
     * Apply theme to document
     */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update toggle button appearance
        this.updateToggleButton();
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        }));

        // Update particles and effects for theme
        this.updateEffectsForTheme();
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.saveTheme();
        this.applyTheme();
        
        console.log(`🎨 Theme switched to: ${this.currentTheme}`);
    }

    /**
     * Set specific theme
     */
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.saveTheme();
            this.applyTheme();
        }
    }

    /**
     * Create theme toggle button
     */
    createToggleButton() {
        // Remove existing toggle if any
        const existing = document.querySelector('.theme-toggle');
        if (existing) existing.remove();

        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'theme-toggle';
        this.toggleButton.setAttribute('aria-label', 'Toggle theme');
        this.toggleButton.setAttribute('title', 'Switch between light and dark theme');
        
        // Position the button
        this.toggleButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 130px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        `;

        // Add click event
        this.toggleButton.addEventListener('click', () => {
            this.toggleTheme();
            this.animateToggle();
        });

        // Add hover effects
        this.toggleButton.addEventListener('mouseenter', () => {
            this.toggleButton.style.transform = 'scale(1.1)';
            this.toggleButton.style.boxShadow = '0 6px 20px rgba(255, 107, 157, 0.3)';
        });

        this.toggleButton.addEventListener('mouseleave', () => {
            this.toggleButton.style.transform = 'scale(1)';
            this.toggleButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });

        document.body.appendChild(this.toggleButton);
    }

    /**
     * Update toggle button appearance based on current theme
     */
    updateToggleButton() {
        if (!this.toggleButton) return;

        if (this.currentTheme === 'dark') {
            this.toggleButton.innerHTML = '☀️';
            this.toggleButton.style.background = 'rgba(30, 30, 30, 0.8)';
            this.toggleButton.style.color = '#f5f5f5';
            this.toggleButton.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            this.toggleButton.setAttribute('title', 'Switch to light theme');
        } else {
            this.toggleButton.innerHTML = '🌙';
            this.toggleButton.style.background = 'rgba(255, 255, 255, 0.8)';
            this.toggleButton.style.color = '#333';
            this.toggleButton.style.border = '1px solid rgba(0, 0, 0, 0.1)';
            this.toggleButton.setAttribute('title', 'Switch to dark theme');
        }
    }

    /**
     * Animate toggle button on click
     */
    animateToggle() {
        if (!this.toggleButton) return;

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 107, 157, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: 100px;
            height: 100px;
            left: -25px;
            top: -25px;
        `;

        this.toggleButton.style.position = 'relative';
        this.toggleButton.appendChild(ripple);

        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);

        // Button scale animation
        this.toggleButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.toggleButton.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.toggleButton.style.transform = 'scale(1)';
            }, 150);
        }, 100);
    }

    /**
     * Setup system theme preference listener
     */
    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            const hasManualPreference = localStorage.getItem('anniversary-theme');
            
            if (!hasManualPreference) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme();
                console.log(`🔄 Auto-switched to ${this.currentTheme} theme based on system preference`);
            }
        });
    }

    /**
     * Update visual effects for current theme
     */
    updateEffectsForTheme() {
        // Update particles.js colors for dark theme
        if (window.pJSDom && window.pJSDom[0]) {
            const particles = window.pJSDom[0].pJS;
            
            if (this.currentTheme === 'dark') {
                // Dark theme particles
                particles.particles.color.value = ["#ff6b9d", "#ffa8cc", "#ffb3d6"];
                particles.particles.line_linked.color = "#ff6b9d";
                particles.particles.line_linked.opacity = 0.2;
            } else {
                // Light theme particles
                particles.particles.color.value = ["#ff6b9d", "#ffa8cc", "#ffb3d6"];
                particles.particles.line_linked.color = "#ff6b9d";
                particles.particles.line_linked.opacity = 0.4;
            }
            
            // Refresh particles
            particles.fn.particlesRefresh();
        }

        // Update music visualizer colors
        const musicBars = document.querySelectorAll('.music-bar');
        musicBars.forEach(bar => {
            if (this.currentTheme === 'dark') {
                bar.style.background = 'linear-gradient(to top, #ff6b9d, #ffa8cc)';
            } else {
                bar.style.background = 'linear-gradient(to top, #ec4899, #f472b6)';
            }
        });

        // Update floating bubbles
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            if (this.currentTheme === 'dark') {
                bubble.style.background = 'linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(255, 168, 204, 0.1))';
                bubble.style.border = '1px solid rgba(255, 107, 157, 0.2)';
            }
        });
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Check if dark theme is active
     */
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    /**
     * Destroy theme manager
     */
    destroy() {
        if (this.toggleButton) {
            this.toggleButton.remove();
        }
        
        // Remove theme attribute
        document.documentElement.removeAttribute('data-theme');
        
        // Clear saved theme
        localStorage.removeItem('anniversary-theme');
    }
}

// Auto-initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.darkThemeManager = new DarkThemeManager();
    }, 500);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkThemeManager;
}
