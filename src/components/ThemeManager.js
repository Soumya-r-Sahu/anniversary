/**
 * Theme Manager
 * Enhanced theme management system for the anniversary website
 * Renamed from EnhancedThemeManager for clarity
 * Version: 2.0.0
 */

class ThemeManager {
    constructor(options = {}) {
        // Configuration
        this.config = {
            enableDarkMode: options.enableDarkMode !== false,
            enableAutoTheme: options.enableAutoTheme !== false,
            enableMobileOptimization: options.enableMobileOptimization !== false,
            enableAnimations: options.enableAnimations !== false,
            storageKey: options.storageKey || 'anniversaryTheme',
            defaultTheme: options.defaultTheme || 'dark',
            ...options
        };

        // State management
        this.state = {
            currentTheme: this.config.defaultTheme,
            isAutoMode: false,
            isMobile: this.detectMobile(),
            prefersDarkMode: this.detectDarkModePreference(),
            isHighContrast: this.detectHighContrastPreference(),
            reducedMotion: this.detectReducedMotionPreference()
        };

        // Theme definitions
        this.themes = {
            light: {
                name: 'Light',
                icon: '☀️',
                colors: {
                    primary: '#ff6b9d',
                    secondary: '#ff8a65',
                    background: '#ffffff',
                    surface: '#f8f9fa',
                    text: '#333333',
                    textSecondary: '#666666'
                }
            },
            dark: {
                name: 'Dark',
                icon: '🌙',
                colors: {
                    primary: '#ff6b9d',
                    secondary: '#ff8a65',
                    background: '#0f0f23',
                    surface: '#1a1a2e',
                    text: '#ffffff',
                    textSecondary: '#cccccc'
                }
            },
            romantic: {
                name: 'Romantic',
                icon: '💕',
                colors: {
                    primary: '#ff69b4',
                    secondary: '#ffc0cb',
                    background: '#fff0f5',
                    surface: '#ffe4e1',
                    text: '#8b0000',
                    textSecondary: '#cd5c5c'
                }
            },
            sunset: {
                name: 'Sunset',
                icon: '🌅',
                colors: {
                    primary: '#ff6347',
                    secondary: '#ffa500',
                    background: '#fff8dc',
                    surface: '#ffe4b5',
                    text: '#8b4513',
                    textSecondary: '#a0522d'
                }
            }
        };

        // UI elements - removed theme-toggle, theme-selector, auto-mode-container
        this.ui = {
            // Theme controls removed as per user request
        };

        // Event handlers
        this.boundHandlers = {
            onThemeToggle: this.onThemeToggle.bind(this),
            onThemeSelect: this.onThemeSelect.bind(this),
            onAutoModeToggle: this.onAutoModeToggle.bind(this),
            onMediaQueryChange: this.onMediaQueryChange.bind(this),
            onStorageChange: this.onStorageChange.bind(this)
        };

        // Media queries
        this.mediaQueries = {
            darkMode: window.matchMedia('(prefers-color-scheme: dark)'),
            highContrast: window.matchMedia('(prefers-contrast: high)'),
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
            mobile: window.matchMedia('(max-width: 768px)')
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        try {
            // Restore saved theme
            this.restoreTheme();

            // Setup DOM elements
            this.setupDOM();

            // Setup media query listeners
            this.setupMediaQueryListeners();

            // Setup storage listener
            this.setupStorageListener();

            // Apply initial theme
            this.applyTheme(this.state.currentTheme);

            // Setup mobile optimizations
            if (this.config.enableMobileOptimization) {
                this.setupMobileOptimizations();
            }

            console.log('🎨 Theme Manager initialized');
        } catch (error) {
            console.error('Failed to initialize theme manager:', error);
        }
    }

    /**
     * Setup DOM elements - Theme controls removed
     */
    setupDOM() {
        // Theme controls removed as per user request
        // Only programmatic theme management is available

        // Setup event listeners for system changes
        this.setupEventListeners();
    }

    // Theme UI creation methods removed as per user request

    // Auto mode toggle creation removed as per user request

    /**
     * Setup event listeners - UI controls removed
     */
    setupEventListeners() {
        // Theme UI controls removed as per user request
        // Only system-level listeners are maintained
        this.setupMediaQueryListeners();
        this.setupStorageListener();
    }

    /**
     * Setup media query listeners
     */
    setupMediaQueryListeners() {
        // Dark mode preference
        this.mediaQueries.darkMode.addEventListener('change', this.boundHandlers.onMediaQueryChange);

        // High contrast preference
        this.mediaQueries.highContrast.addEventListener('change', this.boundHandlers.onMediaQueryChange);

        // Reduced motion preference
        this.mediaQueries.reducedMotion.addEventListener('change', this.boundHandlers.onMediaQueryChange);

        // Mobile breakpoint
        this.mediaQueries.mobile.addEventListener('change', this.boundHandlers.onMediaQueryChange);
    }

    /**
     * Setup storage listener for cross-tab sync
     */
    setupStorageListener() {
        window.addEventListener('storage', this.boundHandlers.onStorageChange);
    }

    /**
     * Apply theme
     */
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) {
            console.warn(`Theme "${themeName}" not found`);
            return;
        }

        // Update state
        this.state.currentTheme = themeName;

        // Apply CSS custom properties
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(`--color-${property}`, value);
        });

        // Update body class
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        // Update data attribute
        document.documentElement.setAttribute('data-theme', themeName);

        // Update UI elements
        this.updateUI();

        // Save theme
        this.saveTheme();

        // Apply accessibility adjustments
        this.applyAccessibilityAdjustments();

        console.log(`🎨 Applied theme: ${theme.name}`);
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const currentTheme = this.state.currentTheme;
        let nextTheme;

        if (currentTheme === 'light') {
            nextTheme = 'dark';
        } else if (currentTheme === 'dark') {
            nextTheme = 'light';
        } else {
            // If using a custom theme, toggle to opposite based on background
            const theme = this.themes[currentTheme];
            const isLight = this.isLightColor(theme.colors.background);
            nextTheme = isLight ? 'dark' : 'light';
        }

        this.applyTheme(nextTheme);
    }

    /**
     * Set auto mode
     */
    setAutoMode(enabled) {
        this.state.isAutoMode = enabled;

        if (enabled) {
            // Apply theme based on system preference
            const preferredTheme = this.state.prefersDarkMode ? 'dark' : 'light';
            this.applyTheme(preferredTheme);
        }

        this.updateUI();
        this.saveTheme();
    }

    /**
     * Event handlers
     */
    onThemeToggle() {
        if (this.state.isAutoMode) {
            this.setAutoMode(false);
        }
        this.toggleTheme();
    }

    onThemeSelect(event) {
        const themeName = event.target.value;
        this.setAutoMode(false);
        this.applyTheme(themeName);
    }

    onAutoModeToggle(event) {
        this.setAutoMode(event.target.checked);
    }

    onMediaQueryChange() {
        // Update state
        this.state.prefersDarkMode = this.mediaQueries.darkMode.matches;
        this.state.isHighContrast = this.mediaQueries.highContrast.matches;
        this.state.reducedMotion = this.mediaQueries.reducedMotion.matches;
        this.state.isMobile = this.mediaQueries.mobile.matches;

        // Apply auto theme if enabled
        if (this.state.isAutoMode) {
            const preferredTheme = this.state.prefersDarkMode ? 'dark' : 'light';
            this.applyTheme(preferredTheme);
        }

        // Apply accessibility adjustments
        this.applyAccessibilityAdjustments();

        // Apply mobile optimizations
        if (this.config.enableMobileOptimization) {
            this.applyMobileOptimizations();
        }
    }

    onStorageChange(event) {
        if (event.key === this.config.storageKey) {
            const savedData = JSON.parse(event.newValue || '{}');
            if (savedData.theme && savedData.theme !== this.state.currentTheme) {
                this.applyTheme(savedData.theme);
            }
        }
    }

    /**
     * Utility methods
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    detectDarkModePreference() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    detectHighContrastPreference() {
        return window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches;
    }

    detectReducedMotionPreference() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    getThemeIcon(themeName) {
        return this.themes[themeName]?.icon || '🎨';
    }

    isLightColor(color) {
        // Simple light color detection
        return color === '#ffffff' || color.includes('fff') || color.includes('f8f9fa');
    }

    /**
     * Save and restore theme
     */
    saveTheme() {
        const data = {
            theme: this.state.currentTheme,
            isAutoMode: this.state.isAutoMode,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    }

    restoreTheme() {
        try {
            const saved = localStorage.getItem(this.config.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                this.state.currentTheme = data.theme || this.config.defaultTheme;
                this.state.isAutoMode = data.isAutoMode || false;
            }
        } catch (error) {
            console.warn('Failed to restore theme:', error);
        }
    }

    /**
     * Update UI elements - UI controls removed
     */
    updateUI() {
        // Theme UI controls removed as per user request
        // Only programmatic theme management is available
    }

    /**
     * Apply accessibility adjustments
     */
    applyAccessibilityAdjustments() {
        const root = document.documentElement;

        // High contrast mode
        if (this.state.isHighContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Reduced motion
        if (this.state.reducedMotion) {
            root.classList.add('reduced-motion');
        } else {
            root.classList.remove('reduced-motion');
        }
    }

    /**
     * Apply mobile optimizations
     */
    applyMobileOptimizations() {
        const root = document.documentElement;

        if (this.state.isMobile) {
            root.classList.add('mobile-optimized');
            // Reduce animation complexity on mobile
            root.style.setProperty('--animation-duration', '0.2s');
        } else {
            root.classList.remove('mobile-optimized');
            root.style.setProperty('--animation-duration', '0.3s');
        }
    }

    /**
     * Destroy theme manager
     */
    destroy() {
        // Theme UI controls removed as per user request

        // Remove media query listeners
        Object.values(this.mediaQueries).forEach(mq => {
            mq.removeEventListener('change', this.boundHandlers.onMediaQueryChange);
        });

        // Remove storage listener
        window.removeEventListener('storage', this.boundHandlers.onStorageChange);

        console.log('🎨 Theme Manager destroyed');
    }
}

// Export for module systems
export { ThemeManager };

// Legacy export for backward compatibility
export { ThemeManager as EnhancedThemeManager };
