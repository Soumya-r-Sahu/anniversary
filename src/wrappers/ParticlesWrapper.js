/**
 * Particles.js Wrapper with Romantic Enhancements
 * Enhanced with romantic particle effects for our anniversary website
 */

class ParticlesWrapper {
    constructor() {
        this.instances = new Map();
        this.presets = this.getPresets();
        this.isLoaded = false;
        
        this.init();
    }

    /**
     * Initialize Particles.js wrapper
     */
    init() {
        if (typeof particlesJS === 'undefined') {
            console.warn('⚠️ Particles.js not loaded. Please include particles.js library first.');
            return;
        }
        
        this.isLoaded = true;
        console.log('💝 Particles Romantic Wrapper initialized');
    }

    /**
     * Get romantic particle presets
     */
    getPresets() {
        return {
            hearts: {
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 800 } },
                    color: { value: ["#ff1744", "#ec4899", "#ffa8cc", "#ffb3d6"] },
                    shape: {
                        type: "image",
                        image: [
                            { src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDE4TDguNTUgMTYuN0M0IDEyLjYgMSA5LjkgMSA2LjVDMSA0LjYgMi42IDMgNC41IDNDNi4xIDMgNy42IDMuOCA4LjUgNUM5LjQgMy44IDEwLjkgMyAxMi41IDNDMTQuNCAzIDE2IDQuNiAxNiA2LjVDMTYgOS45IDEzIDEyLjYgOC41NSAxNi43TDEwIDE4WiIgZmlsbD0iIzAwMDAwMCIvPgo8L3N2Zz4K", width: 20, height: 20 }
                        ]
                    },
                    opacity: { value: 0.7, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3 } },
                    size: { value: 15, random: true, anim: { enable: true, speed: 2, size_min: 5 } },
                    line_linked: { enable: false },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "top",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: { enable: true, rotateX: 300, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "bubble" },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    },
                    modes: {
                        bubble: { distance: 200, size: 25, duration: 2, opacity: 0.9, speed: 3 },
                        push: { particles_nb: 3 }
                    }
                },
                retina_detect: true
            },

            romantic: {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#ec4899" },
                    shape: {
                        type: "circle",
                        stroke: { width: 0, color: "#000000" },
                        polygon: { nb_sides: 5 }
                    },
                    opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1 } },
                    size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1 } },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#ffa8cc",
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 6,
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: { enable: false, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "grab" },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 140, line_linked: { opacity: 1 } },
                        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                        repulse: { distance: 200, duration: 0.4 },
                        push: { particles_nb: 4 },
                        remove: { particles_nb: 2 }
                    }
                },
                retina_detect: true
            },

            snow: {
                particles: {
                    number: { value: 100, density: { enable: true, value_area: 800 } },
                    color: { value: "#ffffff" },
                    shape: {
                        type: "circle",
                        stroke: { width: 0, color: "#000000" }
                    },
                    opacity: { value: 0.8, random: true, anim: { enable: false, speed: 1, opacity_min: 0.1 } },
                    size: { value: 5, random: true, anim: { enable: false, speed: 40, size_min: 0.1 } },
                    line_linked: { enable: false },
                    move: {
                        enable: true,
                        speed: 3,
                        direction: "bottom",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: { enable: false, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: false, mode: "grab" },
                        onclick: { enable: false, mode: "push" },
                        resize: true
                    }
                },
                retina_detect: true
            },

            constellation: {
                particles: {
                    number: { value: 60, density: { enable: true, value_area: 800 } },
                    color: { value: "#ffb3d6" },
                    shape: {
                        type: "star",
                        stroke: { width: 0, color: "#000000" },
                        polygon: { nb_sides: 5 }
                    },
                    opacity: { value: 0.6, random: true, anim: { enable: true, speed: 1, opacity_min: 0.2 } },
                    size: { value: 4, random: true, anim: { enable: true, speed: 3, size_min: 2 } },
                    line_linked: {
                        enable: true,
                        distance: 200,
                        color: "#ec4899",
                        opacity: 0.3,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: { enable: false, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "grab" },
                        onclick: { enable: true, mode: "bubble" },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 300, line_linked: { opacity: 0.8 } },
                        bubble: { distance: 250, size: 8, duration: 2, opacity: 0.9, speed: 3 }
                    }
                },
                retina_detect: true
            },

            bubbles: {
                particles: {
                    number: { value: 40, density: { enable: true, value_area: 800 } },
                    color: { value: ["#ec4899", "#ffa8cc", "#ffb3d6"] },
                    shape: {
                        type: "circle",
                        stroke: { width: 2, color: "#ffffff" }
                    },
                    opacity: { value: 0.4, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
                    size: { value: 20, random: true, anim: { enable: true, speed: 2, size_min: 5 } },
                    line_linked: { enable: false },
                    move: {
                        enable: true,
                        speed: 3,
                        direction: "top",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: { enable: false, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "bubble" },
                        onclick: { enable: true, mode: "repulse" },
                        resize: true
                    },
                    modes: {
                        bubble: { distance: 150, size: 30, duration: 2, opacity: 0.6, speed: 3 },
                        repulse: { distance: 100, duration: 0.4 }
                    }
                },
                retina_detect: true
            }
        };
    }

    /**
     * Create particles with preset configuration
     */
    create(elementId, presetName = 'romantic', customConfig = {}) {
        if (!this.isLoaded) {
            console.warn('⚠️ Particles.js wrapper not initialized');
            return null;
        }

        const preset = this.presets[presetName];
        if (!preset) {
            console.warn(`⚠️ Preset "${presetName}" not found. Available presets:`, Object.keys(this.presets));
            return null;
        }

        // Deep merge custom config with preset
        const config = this.deepMerge(preset, customConfig);
        
        // Add performance optimizations
        this.optimizeConfig(config);

        // Create particles
        particlesJS(elementId, config);
        
        // Store instance reference
        this.instances.set(elementId, {
            config: config,
            preset: presetName,
            element: document.getElementById(elementId)
        });

        console.log(`💖 Romantic particles "${presetName}" created for #${elementId}`);
        return this.instances.get(elementId);
    }

    /**
     * Create romantic hearts effect
     */
    createHearts(elementId, options = {}) {
        const heartConfig = {
            particles: {
                number: { value: options.count || 30 },
                color: { value: options.colors || ["#ff1744", "#ec4899", "#ffa8cc"] },
                size: { value: options.size || 15, random: true },
                move: { speed: options.speed || 2 }
            }
        };
        
        return this.create(elementId, 'hearts', heartConfig);
    }

    /**
     * Create constellation of love
     */
    createConstellation(elementId, options = {}) {
        const constellationConfig = {
            particles: {
                number: { value: options.count || 60 },
                color: { value: options.color || "#ffb3d6" },
                line_linked: {
                    distance: options.connectionDistance || 200,
                    opacity: options.connectionOpacity || 0.3
                }
            }
        };
        
        return this.create(elementId, 'constellation', constellationConfig);
    }

    /**
     * Create floating bubbles
     */
    createBubbles(elementId, options = {}) {
        const bubbleConfig = {
            particles: {
                number: { value: options.count || 40 },
                size: { value: options.size || 20, random: true },
                move: { speed: options.speed || 3 }
            }
        };
        
        return this.create(elementId, 'bubbles', bubbleConfig);
    }

    /**
     * Update existing particles configuration
     */
    updateConfig(elementId, newConfig) {
        const instance = this.instances.get(elementId);
        if (!instance) {
            console.warn(`⚠️ No particles instance found for #${elementId}`);
            return;
        }

        const mergedConfig = this.deepMerge(instance.config, newConfig);
        this.optimizeConfig(mergedConfig);
        
        // Recreate particles with new config
        particlesJS(elementId, mergedConfig);
        
        // Update stored instance
        instance.config = mergedConfig;
        
        console.log(`💝 Updated particles configuration for #${elementId}`);
    }

    /**
     * Add performance optimizations to config
     */
    optimizeConfig(config) {
        // Ensure retina detection is enabled for performance
        config.retina_detect = true;
        
        // Optimize interactivity for mobile
        if (window.innerWidth < 768) {
            config.particles.number.value = Math.floor(config.particles.number.value * 0.6);
            config.interactivity.events.onhover.enable = false;
        }
        
        // Add performance hints
        if (config.particles.move) {
            config.particles.move.attract = config.particles.move.attract || {};
            config.particles.move.attract.enable = config.particles.move.attract.enable || false;
        }
    }

    /**
     * Pause particles animation
     */
    pause(elementId) {
        if (window.pJSDom && window.pJSDom.length > 0) {
            const canvas = document.querySelector(`#${elementId} canvas`);
            if (canvas && canvas.pJS) {
                canvas.pJS.fn.vendors.destroypJS();
            }
        }
    }

    /**
     * Resume particles animation
     */
    resume(elementId) {
        const instance = this.instances.get(elementId);
        if (instance) {
            particlesJS(elementId, instance.config);
        }
    }

    /**
     * Destroy particles instance
     */
    destroy(elementId) {
        this.pause(elementId);
        this.instances.delete(elementId);
        console.log(`💔 Destroyed particles for #${elementId}`);
    }

    /**
     * Destroy all particles instances
     */
    destroyAll() {
        this.instances.forEach((instance, elementId) => {
            this.destroy(elementId);
        });
    }

    /**
     * Get instance information
     */
    getInstance(elementId) {
        return this.instances.get(elementId);
    }

    /**
     * Get all instances
     */
    getAllInstances() {
        return Array.from(this.instances.entries());
    }

    /**
     * Deep merge objects
     */
    deepMerge(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    /**
     * Check if value is object
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Responsive particles management
     */
    handleResize() {
        this.instances.forEach((instance, elementId) => {
            if (instance.element) {
                // Recreate particles on resize for proper scaling
                particlesJS(elementId, instance.config);
            }
        });
    }
}

// Create global instance
window.RomanticParticles = new ParticlesWrapper();

// Handle window resize
window.addEventListener('resize', () => {
    window.RomanticParticles.handleResize();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticlesWrapper;
}
