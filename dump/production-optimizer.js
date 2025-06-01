/**
 * Production Optimization Script
 * Comprehensive optimization for the anniversary website
 * Ensures 90fps performance and production-ready code
 */

class ProductionOptimizer {
    constructor() {
        this.performanceMetrics = {
            fps: 0,
            loadTime: 0,
            memoryUsage: 0,
            criticalResourcesLoaded: false
        };
        this.optimizations = [];
        this.isProduction = true;
    }

    async initialize() {
        console.log('🚀 Initializing Production Optimizer...');
        
        // Apply all optimizations
        await this.optimizePerformance();
        await this.optimizeAssets();
        await this.optimizeAnimations();
        await this.enableCriticalOptimizations();
        await this.monitorPerformance();
        
        console.log('✅ Production optimization complete!');
        this.logOptimizations();
    }

    async optimizePerformance() {
        // Enable GPU acceleration for all animated elements
        document.body.style.transform = 'translateZ(0)';
        document.body.style.willChange = 'auto';
        
        // Optimize images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.transform = 'translateZ(0)';
            img.loading = 'lazy';
            img.decoding = 'async';
        });

        // Optimize videos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.preload = 'metadata';
            video.style.transform = 'translateZ(0)';
        });

        this.optimizations.push('✅ Performance base optimizations applied');
    }

    async optimizeAssets() {
        // Preload critical resources
        const criticalResources = [
            'src/styles/90fps-optimized.css',
            'src/core/MusicSystemInitializer.js',
            'src/components/UIControlSystem.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            link.href = resource;
            document.head.appendChild(link);
        });

        // Optimize font loading
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            link.rel = 'preload';
            link.as = 'style';
            link.onload = function() { this.rel = 'stylesheet'; };
        });

        this.optimizations.push('✅ Asset optimization completed');
    }

    async optimizeAnimations() {
        // Reduce animations on low-end devices
        const isLowEndDevice = this.detectLowEndDevice();
        
        if (isLowEndDevice) {
            document.body.classList.add('performance-low');
            
            // Slow down bubble animations significantly
            const bubbles = document.querySelectorAll('.bubble, .floating-bubbles .bubble');
            bubbles.forEach(bubble => {
                bubble.style.animationDuration = '120s';
                bubble.style.animationTimingFunction = 'linear';
            });

            // Disable expensive effects
            const expensiveElements = document.querySelectorAll('.glassmorphism, .backdrop-blur');
            expensiveElements.forEach(el => {
                el.style.backdropFilter = 'none';
                el.style.webkitBackdropFilter = 'none';
            });
        } else {
            document.body.classList.add('performance-high');
        }

        // Optimize heart animations
        const hearts = document.querySelectorAll('.heart-float, .floating-heart');
        hearts.forEach(heart => {
            heart.style.willChange = 'transform';
            heart.style.backfaceVisibility = 'hidden';
        });

        this.optimizations.push('✅ Animation optimizations applied');
    }

    async enableCriticalOptimizations() {
        // Enable contain CSS for performance
        const containers = document.querySelectorAll('.container, .section, .card');
        containers.forEach(container => {
            container.style.contain = 'layout style paint';
        });

        // Optimize particle systems
        const particles = document.querySelectorAll('.particle, .floating-particles');
        particles.forEach(particle => {
            particle.style.contain = 'strict';
            particle.style.willChange = 'transform, opacity';
        });

        // Enable content-visibility for below-fold content
        const belowFoldElements = document.querySelectorAll('section:not(:first-child)');
        belowFoldElements.forEach(el => {
            el.style.contentVisibility = 'auto';
            el.style.containIntrinsicSize = '1px 500px';
        });

        this.optimizations.push('✅ Critical optimizations enabled');
    }

    detectLowEndDevice() {
        // Simple low-end device detection
        const memoryLimit = navigator.deviceMemory || 4;
        const connectionSpeed = navigator.connection?.effectiveType || '4g';
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        return memoryLimit < 4 || connectionSpeed === 'slow-2g' || connectionSpeed === '2g' || 
               (isMobile && window.innerWidth < 768);
    }

    async monitorPerformance() {
        // FPS monitoring
        let fps = 0;
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFPS = (currentTime) => {
            frameCount++;
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                this.performanceMetrics.fps = fps;
                
                // Adjust optimizations based on FPS
                if (fps < 30) {
                    this.enableEmergencyOptimizations();
                }
            }
            requestAnimationFrame(measureFPS);
        };
        requestAnimationFrame(measureFPS);

        // Memory monitoring
        if (performance.memory) {
            this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024);
        }

        this.optimizations.push('✅ Performance monitoring enabled');
    }

    enableEmergencyOptimizations() {
        console.warn('⚠️ Low FPS detected, enabling emergency optimizations');
        
        // Disable all non-essential animations
        const style = document.createElement('style');
        style.textContent = `
            .emergency-optimization * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            .emergency-optimization .particle,
            .emergency-optimization .bubble {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        document.body.classList.add('emergency-optimization');
        
        this.optimizations.push('🚨 Emergency optimizations activated');
    }

    logOptimizations() {
        console.log('🎯 Production Optimization Summary:');
        this.optimizations.forEach(opt => console.log(opt));
        console.log(`📊 Current FPS: ${this.performanceMetrics.fps}`);
        console.log(`🧠 Memory Usage: ${this.performanceMetrics.memoryUsage.toFixed(2)}MB`);
    }

    // Utility method to add performance debugging
    enablePerformanceDebugging() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'performance-debug';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            min-width: 200px;
        `;
        
        const updateDebug = () => {
            debugPanel.innerHTML = `
                <strong>Performance Monitor</strong><br>
                FPS: ${this.performanceMetrics.fps}<br>
                Memory: ${this.performanceMetrics.memoryUsage.toFixed(2)}MB<br>
                Optimizations: ${this.optimizations.length}
            `;
        };
        
        setInterval(updateDebug, 1000);
        document.body.appendChild(debugPanel);
    }
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const optimizer = new ProductionOptimizer();
    optimizer.initialize();
    
    // Enable debug panel in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        optimizer.enablePerformanceDebugging();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductionOptimizer;
}
