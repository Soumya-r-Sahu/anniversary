/**
 * Countdown Page Controller
 * Manages countdown timer, milestone celebrations, and interactive elements
 */

import { PerformanceUtils } from '../utils/performance.js';
import { throttle, debounce } from '../utils/throttle.js';
import { UnifiedMusicManager } from '../core/UnifiedMusicManager.js';
import { UnifiedHeartAnimation } from '../components/UnifiedHeartAnimation.js';
import { UnifiedParticleSystem } from '../components/UnifiedParticleSystem.js';

class CountdownPageController {
    constructor() {
        this.targetDate = null;
        this.countdownInterval = null;
        this.musicManager = null;
        this.heartAnimation = null;
        this.particleSystem = null;
        this.milestones = [];
        this.celebrationActive = false;

        // Performance monitoring
        this.performanceMonitor = PerformanceUtils.createFPSMonitor();

        // Throttled update function
        this.updateDisplay = throttle(this._updateDisplay.bind(this), 100);

        this.init();
    }

    async init() {
        try {
            console.log('🎉 Initializing Countdown Page...');

            // Initialize performance monitoring
            console.log('📊 Performance monitoring started');

            // Set target date (anniversary date)
            this.setTargetDate();

            // Initialize components
            await this.initializeComponents();

            // Setup countdown timer
            this.startCountdown();

            // Setup milestone celebrations
            this.setupMilestones();

            // Setup interactive elements
            this.setupInteractivity();

            // Setup responsive handlers
            this.setupResponsiveHandlers();

            console.log('✅ Countdown Page initialized successfully');

        } catch (error) {
            console.error('❌ Error initializing countdown page:', error);
            this.handleError(error);
        }
    }

    setTargetDate() {
        // Set target date to June 16, 2025 at 12:00 AM
        this.targetDate = new Date(2025, 5, 16, 0, 0, 0, 0); // Month is 0-indexed, so 5 = June

        // Save to localStorage for consistency
        localStorage.setItem('anniversaryDate', this.targetDate.toISOString());

        console.log('🎯 Target date set to June 16, 2025 at 12:00 AM:', this.targetDate);
        console.log('🎯 Target date ISO string:', this.targetDate.toISOString());
        console.log('🎯 Target date local string:', this.targetDate.toLocaleString());
    }

    async initializeComponents() {
        // Initialize music manager
        this.musicManager = new UnifiedMusicManager({
            autoPlay: false,
            volume: 0.7,
            playlist: ['romantic1.mp3', 'romantic2.mp3', 'romantic3.mp3']
        });

        // Initialize heart animation
        this.heartAnimation = new UnifiedHeartAnimation({
            container: document.querySelector('.countdown-container'),
            pattern: 'floating',
            intensity: 'medium'
        });

        // Initialize particle system for celebrations
        this.particleSystem = new UnifiedParticleSystem({
            container: document.querySelector('.celebration-particles'),
            type: 'hearts',
            count: 50,
            autoStart: false
        });
    }

    startCountdown() {
        // Clear any existing interval
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        // Update immediately
        this.updateDisplay();

        // Set interval for updates
        this.countdownInterval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    _updateDisplay() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;

        if (distance < 0) {
            this.handleCountdownComplete();
            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update display elements
        this.updateTimeDisplays(days, hours, minutes, seconds);

        // Check for milestones
        this.checkMilestones(distance);

        // Update progress indicators
        this.updateProgress(distance);
    }

    updateTimeDisplays(days, hours, minutes, seconds) {
        const updates = [
            { selector: '#days', value: days, label: 'Days' },
            { selector: '#hours', value: hours, label: 'Hours' },
            { selector: '#minutes', value: minutes, label: 'Minutes' },
            { selector: '#seconds', value: seconds, label: 'Seconds' }
        ];

        updates.forEach(({ selector, value, label }) => {
            const element = document.querySelector(selector);
            if (element) {
                const currentValue = parseInt(element.textContent);
                if (currentValue !== value) {
                    this.animateNumberChange(element, value);
                }

                // Update the label element (next sibling)
                const labelElement = element.parentElement.querySelector('.countdown-label');
                if (labelElement) {
                    labelElement.textContent = value === 1 ? label.slice(0, -1) : label;
                }
            }
        });
    }

    animateNumberChange(element, newValue) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#ff6b9d';

        setTimeout(() => {
            element.textContent = newValue.toString().padStart(2, '0');
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 150);
    }

    setupMilestones() {
        this.milestones = [
            { days: 365, message: "One year to go! 💕", celebration: 'hearts' },
            { days: 100, message: "100 days left! 🎉", celebration: 'confetti' },
            { days: 30, message: "One month remaining! 💖", celebration: 'hearts' },
            { days: 7, message: "One week to go! 🎊", celebration: 'fireworks' },
            { days: 1, message: "Tomorrow is the day! 💫", celebration: 'stars' },
            { hours: 12, message: "12 hours left! 💝", celebration: 'hearts' },
            { hours: 1, message: "One hour remaining! 🎆", celebration: 'fireworks' },
            { minutes: 10, message: "10 minutes to go! 💕", celebration: 'hearts' }
        ];
    }

    checkMilestones(distance) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        this.milestones.forEach(milestone => {
            const key = `milestone_${JSON.stringify(milestone)}`;

            if (localStorage.getItem(key)) return; // Already celebrated

            let shouldCelebrate = false;

            if (milestone.days && days === milestone.days) {
                shouldCelebrate = true;
            } else if (milestone.hours && days === 0 && hours === milestone.hours) {
                shouldCelebrate = true;
            } else if (milestone.minutes && days === 0 && hours === 0 && minutes === milestone.minutes) {
                shouldCelebrate = true;
            }

            if (shouldCelebrate) {
                this.celebrateMilestone(milestone);
                localStorage.setItem(key, 'true');
            }
        });
    }

    celebrateMilestone(milestone) {
        console.log('🎉 Milestone reached:', milestone.message);

        // Show milestone message
        this.showMilestoneMessage(milestone.message);

        // Trigger celebration animation
        this.triggerCelebration(milestone.celebration);

        // Play celebration sound
        if (this.musicManager) {
            this.musicManager.playSoundEffect('celebration');
        }
    }

    showMilestoneMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'milestone-message';
        messageElement.textContent = message;

        document.body.appendChild(messageElement);

        // Animate in
        setTimeout(() => messageElement.classList.add('show'), 100);

        // Remove after delay
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => messageElement.remove(), 500);
        }, 3000);
    }

    triggerCelebration(type) {
        if (this.celebrationActive) return;

        this.celebrationActive = true;

        switch (type) {
            case 'hearts':
                this.heartAnimation?.burst(20);
                break;
            case 'confetti':
                this.particleSystem?.burst({ type: 'confetti', count: 100 });
                break;
            case 'fireworks':
                this.particleSystem?.burst({ type: 'fireworks', count: 50 });
                break;
            case 'stars':
                this.particleSystem?.burst({ type: 'stars', count: 30 });
                break;
        }

        setTimeout(() => {
            this.celebrationActive = false;
        }, 3000);
    }

    updateProgress(distance) {
        const totalTime = this.targetDate.getTime() - new Date(this.targetDate.getFullYear() - 1, this.targetDate.getMonth(), this.targetDate.getDate()).getTime();
        const elapsed = totalTime - distance;
        const progress = (elapsed / totalTime) * 100;

        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
        }

        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}% Complete`;
        }
    }

    handleCountdownComplete() {
        clearInterval(this.countdownInterval);

        console.log('🎊 Countdown Complete!');

        // Update display to show zeros
        this.updateTimeDisplays(0, 0, 0, 0);

        // Show completion message with redirect countdown
        this.showCompletionCelebration();

        // Start redirect countdown
        this.startRedirectCountdown();
    }

    showCompletionCelebration() {
        // Create full-screen celebration overlay
        const overlay = document.createElement('div');
        overlay.className = 'completion-celebration';
        overlay.innerHTML = `
            <div class="celebration-content">
                <h1>🎉 Happy Anniversary! 🎉</h1>
                <p>The day has finally arrived!</p>
                <div class="celebration-hearts"></div>
                <div class="redirect-info">
                    <p>Redirecting to anniversary page in <span id="redirect-countdown">5</span> seconds...</p>
                    <button id="redirect-now" class="redirect-button">Go Now! 💕</button>
                </div>
            </div>
        `;

        // Add styles for the celebration overlay
        const style = document.createElement('style');
        style.textContent = `
            .completion-celebration {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #ff6b9d, #c44569, #f8b500);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: celebrationFadeIn 0.5s ease-out;
            }

            .celebration-content {
                text-align: center;
                color: white;
                max-width: 600px;
                padding: 2rem;
            }

            .celebration-content h1 {
                font-size: 3rem;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                animation: bounce 1s infinite alternate;
            }

            .celebration-content p {
                font-size: 1.5rem;
                margin-bottom: 2rem;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }

            .redirect-info {
                background: rgba(255,255,255,0.2);
                padding: 1.5rem;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                margin-top: 2rem;
            }

            .redirect-info p {
                font-size: 1.2rem;
                margin-bottom: 1rem;
            }

            #redirect-countdown {
                font-weight: bold;
                font-size: 1.5em;
                color: #ffeb3b;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }

            .redirect-button {
                background: linear-gradient(45deg, #ff4081, #e91e63);
                color: white;
                border: none;
                padding: 12px 30px;
                font-size: 1.1rem;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }

            .redirect-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                background: linear-gradient(45deg, #e91e63, #ad1457);
            }

            @keyframes celebrationFadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }

            @keyframes bounce {
                from { transform: translateY(0); }
                to { transform: translateY(-10px); }
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(overlay);

        // Setup immediate redirect button
        const redirectButton = overlay.querySelector('#redirect-now');
        if (redirectButton) {
            redirectButton.addEventListener('click', () => {
                this.redirectToAnniversary();
            });
        }

        // Trigger massive celebration
        this.triggerMassiveCelebration();

        // Play anniversary music
        if (this.musicManager) {
            this.musicManager.play('anniversary-theme');
        }
    }

    triggerMassiveCelebration() {
        // Multiple particle systems
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.particleSystem?.burst({
                    type: 'fireworks',
                    count: 200,
                    duration: 2000
                });
            }, i * 500);
        }

        // Continuous heart animation
        this.heartAnimation?.startContinuous();
    }

    startRedirectCountdown() {
        let redirectSeconds = 5;
        const redirectCountdownElement = document.getElementById('redirect-countdown');

        // Update countdown display immediately
        if (redirectCountdownElement) {
            redirectCountdownElement.textContent = redirectSeconds;
        }

        // Start countdown interval
        const redirectInterval = setInterval(() => {
            redirectSeconds--;

            if (redirectCountdownElement) {
                redirectCountdownElement.textContent = redirectSeconds;

                // Add visual emphasis for last 3 seconds
                if (redirectSeconds <= 3) {
                    redirectCountdownElement.style.animation = 'pulse 0.5s ease-in-out';
                    redirectCountdownElement.style.color = '#ff5722';
                }
            }

            // Redirect when countdown reaches 0
            if (redirectSeconds <= 0) {
                clearInterval(redirectInterval);
                this.redirectToAnniversary();
            }
        }, 1000);

        // Store interval for cleanup if needed
        this.redirectInterval = redirectInterval;
    }

    redirectToAnniversary() {
        console.log('🎊 Redirecting to anniversary page...');

        // Clear any existing intervals
        if (this.redirectInterval) {
            clearInterval(this.redirectInterval);
        }

        // Add fade out effect before redirect
        const overlay = document.querySelector('.completion-celebration');
        if (overlay) {
            overlay.style.transition = 'opacity 0.5s ease-out';
            overlay.style.opacity = '0';
        }

        // Perform redirect with fallback
        setTimeout(() => {
            try {
                // Try to use the history API for smoother transition
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, null, 'anniversary.html');
                    window.location.reload();
                } else {
                    // Fallback to direct navigation
                    window.location.href = 'anniversary.html';
                }
            } catch (error) {
                console.error('Redirect error:', error);
                // Ultimate fallback
                window.location.replace('anniversary.html');
            }
        }, 500);
    }

    setupInteractivity() {
        // Custom date picker
        const dateInput = document.querySelector('#anniversary-date');
        if (dateInput) {
            dateInput.addEventListener('change', debounce((e) => {
                this.targetDate = new Date(e.target.value);
                localStorage.setItem('anniversaryDate', this.targetDate.toISOString());
                this.startCountdown();
            }, 500));
        }

        // Music controls
        const musicToggle = document.querySelector('.music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                if (this.musicManager) {
                    this.musicManager.toggle();
                    musicToggle.classList.toggle('playing', this.musicManager.isPlaying());
                }
            });
        }

        // Share countdown
        const shareButton = document.querySelector('.share-countdown');
        if (shareButton) {
            shareButton.addEventListener('click', () => {
                this.shareCountdown();
            });
        }

        // Test countdown complete button (for development/testing)
        const testButton = document.querySelector('#test-countdown-complete');
        if (testButton) {
            testButton.addEventListener('click', () => {
                console.log('🧪 Testing countdown complete functionality...');
                this.handleCountdownComplete();
            });
        }
    }

    shareCountdown() {
        const days = Math.floor((this.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const message = `Only ${days} days until our anniversary! 💕`;

        if (navigator.share) {
            navigator.share({
                title: 'Anniversary Countdown',
                text: message,
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(message + ' ' + window.location.href);
            this.showMilestoneMessage('Countdown link copied to clipboard! 📋');
        }
    }

    setupResponsiveHandlers() {
        const resizeHandler = debounce(() => {
            // Update particle system for new dimensions
            if (this.particleSystem) {
                this.particleSystem.resize();
            }

            // Update heart animation
            if (this.heartAnimation) {
                this.heartAnimation.resize();
            }
        }, 250);

        window.addEventListener('resize', resizeHandler);
    }

    handleError(error) {
        console.error('Countdown page error:', error);

        // Show user-friendly error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = 'Something went wrong. Please refresh the page.';

        document.body.appendChild(errorElement);

        // Auto-remove after 5 seconds
        setTimeout(() => errorElement.remove(), 5000);
    }

    destroy() {
        // Clean up intervals
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        if (this.redirectInterval) {
            clearInterval(this.redirectInterval);
        }

        // Clean up components
        this.musicManager?.destroy();
        this.heartAnimation?.destroy();
        this.particleSystem?.destroy();

        // Stop performance monitoring
        console.log('📊 Performance monitoring stopped');

        console.log('🧹 Countdown page cleaned up');
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.countdownController = new CountdownPageController();
    });
} else {
    window.countdownController = new CountdownPageController();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.countdownController?.destroy();
});

export { CountdownPageController };
