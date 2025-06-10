/**
 * CountdownCore - Centralized countdown logic for GitHub Pages
 * Optimized for performance and simplicity
 */

import { DateUtils } from '../utils/DateUtils.js';
import { BaseCore } from './BaseCore.js';

export class CountdownCore extends BaseCore {
    constructor(options = {}) {
        super(options);
        
        this.targetDate = options.targetDate || '2024-06-16T00:00:00';
        this.interval = null;
        this.callbacks = new Set();
        
        this.init();
    }

    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            updateInterval: 1000,
            precision: 'seconds',
            autoStart: true,
            syncAcrossPages: true
        };
    }

    init() {
        if (this.config.autoStart) {
            this.start();
        }
    }

    start() {
        if (this.interval) return;
        
        this.interval = setInterval(() => {
            this.update();
        }, this.config.updateInterval);
        
        this.update(); // Initial update
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    update() {
        const now = new Date();
        const target = new Date(this.targetDate);
        const timeData = DateUtils.calculateDifference(target, now);
        
        // Notify all callbacks
        this.callbacks.forEach(callback => {
            try {
                callback(timeData);
            } catch (error) {
                console.warn('Countdown callback error:', error);
            }
        });
        
        this.emit('update', timeData);
    }

    subscribe(callback) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }

    setTarget(dateString) {
        this.targetDate = dateString;
        this.update();
    }

    // Static method for one-time calculations
    static calculate(targetDate, currentDate = new Date()) {
        return DateUtils.calculateDifference(new Date(targetDate), currentDate);
    }

    destroy() {
        this.stop();
        this.callbacks.clear();
        super.destroy();
    }
}
