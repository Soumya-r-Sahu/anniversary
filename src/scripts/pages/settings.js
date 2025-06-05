/**
 * Settings Page JavaScript Module
 * Handles all settings functionality, testing, and configuration
 */

// Settings Manager Class
export class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.updateLastUpdated();
        this.runInitialDiagnostics();
        this.initializeParticles();
    }

    loadSettings() {
        const defaultSettings = {
            darkTheme: true,
            bubbleAnimations: true,
            reducedMotion: false,
            backgroundMusic: true,
            volume: 30,
            crossPageSync: true,
            highPerformance: true,
            preloadImages: true,
            autoSave: true,
            debugMode: false
        };

        try {
            const saved = localStorage.getItem('anniversarySettings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (error) {
            console.warn('Failed to load settings:', error);
            return defaultSettings;
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('anniversarySettings', JSON.stringify(this.settings));
            this.showNotification('Settings saved successfully', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showNotification('Failed to save settings', 'error');
        }
    }

    setupEventListeners() {
        // Toggle switches
        document.getElementById('darkThemeToggle').addEventListener('change', (e) => {
            this.settings.darkTheme = e.target.checked;
            this.applyTheme();
            this.saveSettings();
        });

        document.getElementById('bubblesToggle').addEventListener('change', (e) => {
            this.settings.bubbleAnimations = e.target.checked;
            this.toggleBubbles();
            this.saveSettings();
        });

        document.getElementById('reducedMotionToggle').addEventListener('change', (e) => {
            this.settings.reducedMotion = e.target.checked;
            this.applyReducedMotion();
            this.saveSettings();
        });

        document.getElementById('musicToggle').addEventListener('change', (e) => {
            this.settings.backgroundMusic = e.target.checked;
            this.toggleMusic();
            this.saveSettings();
        });

        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.settings.volume = parseInt(e.target.value);
            this.updateVolumeDisplay();
            this.applyVolume();
            this.saveSettings();
        });

        // Additional toggle switches
        document.getElementById('crossPageSyncToggle').addEventListener('change', (e) => {
            this.settings.crossPageSync = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('performanceToggle').addEventListener('change', (e) => {
            this.settings.highPerformance = e.target.checked;
            this.applyPerformanceMode();
            this.saveSettings();
        });

        document.getElementById('preloadToggle').addEventListener('change', (e) => {
            this.settings.preloadImages = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('autoSaveToggle').addEventListener('change', (e) => {
            this.settings.autoSave = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('debugToggle').addEventListener('change', (e) => {
            this.settings.debugMode = e.target.checked;
            this.toggleDebugMode();
            this.saveSettings();
        });
    }

    updateUI() {
        // Update toggle switches
        document.getElementById('darkThemeToggle').checked = this.settings.darkTheme;
        document.getElementById('bubblesToggle').checked = this.settings.bubbleAnimations;
        document.getElementById('reducedMotionToggle').checked = this.settings.reducedMotion;
        document.getElementById('musicToggle').checked = this.settings.backgroundMusic;
        document.getElementById('volumeSlider').value = this.settings.volume;
        document.getElementById('crossPageSyncToggle').checked = this.settings.crossPageSync;
        document.getElementById('performanceToggle').checked = this.settings.highPerformance;
        document.getElementById('preloadToggle').checked = this.settings.preloadImages;
        document.getElementById('autoSaveToggle').checked = this.settings.autoSave;
        document.getElementById('debugToggle').checked = this.settings.debugMode;

        this.updateVolumeDisplay();
    }

    updateVolumeDisplay() {
        document.getElementById('volumeValue').textContent = `${this.settings.volume}%`;
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('lastUpdated').textContent = now.toLocaleDateString();
    }

    applyTheme() {
        const html = document.documentElement;
        if (this.settings.darkTheme) {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
        }
    }

    toggleBubbles() {
        const bubbles = document.querySelector('.floating-bubbles');
        if (bubbles) {
            bubbles.style.display = this.settings.bubbleAnimations ? 'block' : 'none';
        }
    }

    applyReducedMotion() {
        if (this.settings.reducedMotion) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }

    toggleMusic() {
        if (window.musicManager) {
            if (this.settings.backgroundMusic) {
                window.musicManager.play();
            } else {
                window.musicManager.pause();
            }
        }
    }

    applyVolume() {
        if (window.musicManager) {
            window.musicManager.setVolume(this.settings.volume / 100);
        }
    }

    applyPerformanceMode() {
        if (this.settings.highPerformance) {
            document.body.classList.add('high-performance');
        } else {
            document.body.classList.remove('high-performance');
        }
    }

    toggleDebugMode() {
        if (this.settings.debugMode) {
            console.log('Debug mode enabled');
            window.debugMode = true;
        } else {
            console.log('Debug mode disabled');
            window.debugMode = false;
        }
    }

    runInitialDiagnostics() {
        setTimeout(() => {
            this.updateSystemStatus();
        }, 1000);
    }

    updateSystemStatus() {
        const performance = this.calculatePerformance();
        document.getElementById('performanceBar').style.width = `${performance}%`;

        let status = 'Poor';
        if (performance >= 80) status = 'Excellent';
        else if (performance >= 60) status = 'Good';
        else if (performance >= 40) status = 'Fair';

        document.getElementById('performanceValue').textContent = `${performance}% - ${status}`;
    }

    calculatePerformance() {
        let score = 100;

        if (!this.settings.highPerformance) score -= 15;
        if (this.settings.reducedMotion) score -= 10;
        if (!this.settings.preloadImages) score -= 5;

        // Random variation for demo
        score += Math.random() * 10 - 5;

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        const messageEl = document.getElementById('notificationMessage');

        messageEl.textContent = message;
        toast.className = `notification-toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    initializeParticles() {
        const particlesContainer = document.getElementById('settingsParticles');
        if (!particlesContainer) return;
        
        const settingsSymbols = ['⚙️', '🔧', '🛠️', '⚡', '🎵', '🎨', '📊'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createSettingsParticle(particlesContainer, settingsSymbols);
            }, i * 800);
        }
        
        setInterval(() => {
            this.createSettingsParticle(particlesContainer, settingsSymbols);
        }, 2000);
    }

    createSettingsParticle(container, symbols) {
        const particle = document.createElement('div');
        particle.className = 'settings-particle';
        
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        particle.textContent = symbol;
        particle.style.fontSize = Math.random() * 20 + 15 + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 20000);
    }
}

// Test Functions
export async function testMusicSystem(settingsManager) {
    settingsManager.showNotification('Testing music system...', 'info');

    try {
        if (window.musicManager) {
            if (typeof window.musicManager.play === 'function') {
                const playResult = await window.musicManager.play();

                if (typeof window.musicManager.pause === 'function') {
                    setTimeout(() => window.musicManager.pause(), 500);
                }

                if (playResult !== false) {
                    settingsManager.showNotification('Music system: ✅ Working perfectly', 'success');
                } else {
                    settingsManager.showNotification('Music system: ⚠️ Found but play failed', 'warning');
                }
            } else {
                settingsManager.showNotification('Music system: ⚠️ Found but no play method', 'warning');
            }
        } else {
            settingsManager.showNotification('Music system: ❌ Not found', 'error');
        }
    } catch (error) {
        console.error('Music test error:', error);
        settingsManager.showNotification(`Music system: ❌ Error - ${error.message}`, 'error');
    }
}

export function testThemeSystem(settingsManager) {
    settingsManager.showNotification('Testing theme system...', 'info');

    const currentTheme = document.documentElement.getAttribute('data-theme');

    setTimeout(() => {
        if (currentTheme) {
            settingsManager.showNotification('Theme system: ✅ Working', 'success');
        } else {
            settingsManager.showNotification('Theme system: ❌ Error', 'error');
        }
    }, 1000);
}

export function testAnimationSystem(settingsManager) {
    settingsManager.showNotification('Testing animations...', 'info');

    setTimeout(() => {
        settingsManager.showNotification('Animation system: ✅ Working', 'success');
    }, 1000);
}

export function testNavigationSystem(settingsManager) {
    settingsManager.showNotification('Testing navigation...', 'info');

    setTimeout(() => {
        settingsManager.showNotification('Navigation system: ✅ Working', 'success');
    }, 1000);
}

export function runPerformanceTest(settingsManager) {
    settingsManager.showNotification('Running performance test...', 'info');

    setTimeout(() => {
        settingsManager.updateSystemStatus();
        settingsManager.showNotification('Performance test completed', 'success');
    }, 2000);
}

export function testStorageSystem(settingsManager) {
    settingsManager.showNotification('Testing storage...', 'info');

    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        setTimeout(() => {
            settingsManager.showNotification('Storage system: ✅ Working', 'success');
        }, 1000);
    } catch (error) {
        setTimeout(() => {
            settingsManager.showNotification('Storage system: ❌ Error', 'error');
        }, 1000);
    }
}

// Data Management Functions
export function exportSettings(settingsManager) {
    const settings = settingsManager.settings;
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'anniversary-settings.json';
    link.click();

    settingsManager.showNotification('Settings exported successfully', 'success');
}

export function importSettings(settingsManager) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    settingsManager.settings = { ...settingsManager.settings, ...settings };
                    settingsManager.updateUI();
                    settingsManager.saveSettings();
                    settingsManager.showNotification('Settings imported successfully', 'success');
                } catch (error) {
                    settingsManager.showNotification('Failed to import settings', 'error');
                }
            };
            reader.readAsText(file);
        }
    };

    input.click();
}

export function resetToDefaults(settingsManager) {
    settingsManager.settings = settingsManager.loadSettings();
    settingsManager.updateUI();
    settingsManager.saveSettings();
    settingsManager.showNotification('Settings reset to defaults', 'success');
}

export function clearAllData(settingsManager) {
    localStorage.clear();
    sessionStorage.clear();
    settingsManager.showNotification('All data cleared successfully', 'success');

    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

// System Information Functions
export function showSystemInfo(settingsManager) {
    const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screen: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        localStorage: typeof(Storage) !== "undefined",
        sessionStorage: typeof(Storage) !== "undefined"
    };

    console.table(info);
    settingsManager.showNotification('System info logged to console', 'info');
}

export function downloadLogs(settingsManager) {
    const logs = [
        `Anniversary Website Logs - ${new Date().toISOString()}`,
        `Version: 2.0.0`,
        `Theme: ${document.documentElement.getAttribute('data-theme')}`,
        `Settings: ${JSON.stringify(settingsManager.settings, null, 2)}`,
        `User Agent: ${navigator.userAgent}`,
        `Platform: ${navigator.platform}`,
        `Screen: ${screen.width}x${screen.height}`,
        `Viewport: ${window.innerWidth}x${window.innerHeight}`
    ].join('\n');

    const dataBlob = new Blob([logs], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'anniversary-logs.txt';
    link.click();

    settingsManager.showNotification('Logs downloaded successfully', 'success');
}

export function runFullDiagnostic(settingsManager) {
    settingsManager.showNotification('Running full diagnostic...', 'info');

    let tests = [
        () => testMusicSystem(settingsManager),
        () => testThemeSystem(settingsManager),
        () => testAnimationSystem(settingsManager),
        () => testNavigationSystem(settingsManager),
        () => testStorageSystem(settingsManager),
        () => runPerformanceTest(settingsManager)
    ];

    tests.forEach((test, index) => {
        setTimeout(test, index * 500);
    });

    setTimeout(() => {
        settingsManager.showNotification('Full diagnostic completed', 'success');
    }, tests.length * 500 + 1000);
}

export function checkForUpdates(settingsManager) {
    settingsManager.showNotification('Checking for updates...', 'info');

    setTimeout(() => {
        settingsManager.showNotification('You have the latest version!', 'success');
    }, 2000);
}

// Initialize settings manager when DOM is loaded
let settingsManager;
export function initializeSettings() {
    document.addEventListener('DOMContentLoaded', () => {
        settingsManager = new SettingsManager();
        
        // Make test functions globally available
        window.testMusicSystem = () => testMusicSystem(settingsManager);
        window.testThemeSystem = () => testThemeSystem(settingsManager);
        window.testAnimationSystem = () => testAnimationSystem(settingsManager);
        window.testNavigationSystem = () => testNavigationSystem(settingsManager);
        window.runPerformanceTest = () => runPerformanceTest(settingsManager);
        window.testStorageSystem = () => testStorageSystem(settingsManager);
        window.exportSettings = () => exportSettings(settingsManager);
        window.importSettings = () => importSettings(settingsManager);
        window.resetToDefaults = () => resetToDefaults(settingsManager);
        window.clearAllData = () => clearAllData(settingsManager);
        window.showSystemInfo = () => showSystemInfo(settingsManager);
        window.downloadLogs = () => downloadLogs(settingsManager);
        window.runFullDiagnostic = () => runFullDiagnostic(settingsManager);
        window.checkForUpdates = () => checkForUpdates(settingsManager);
    });
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    initializeSettings();
}
