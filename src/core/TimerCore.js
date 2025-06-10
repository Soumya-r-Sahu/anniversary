/**
 * TimerCore - Advanced timer and scheduling logic
 * GitHub Pages compatible with localStorage persistence
 */

import { BaseCore } from './BaseCore.js';

export class TimerCore extends BaseCore {
    constructor(options = {}) {
        super(options);
        
        this.timers = new Map();
        this.storage = window.localStorage;
        
        this.loadPersistedTimers();
    }

    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            persistTimers: true,
            maxTimers: 10,
            defaultInterval: 1000
        };
    }

    // Create a new timer
    create(id, options = {}) {
        const timer = {
            id,
            duration: options.duration || 0,
            remaining: options.duration || 0,
            interval: options.interval || this.config.defaultInterval,
            callback: options.callback || (() => {}),
            repeat: options.repeat || false,
            autoStart: options.autoStart !== false,
            intervalId: null,
            isPaused: false,
            isRunning: false,
            createdAt: Date.now()
        };

        this.timers.set(id, timer);
        
        if (timer.autoStart) {
            this.start(id);
        }

        this.persistTimers();
        return timer;
    }

    // Start a timer
    start(id) {
        const timer = this.timers.get(id);
        if (!timer || timer.isRunning) return false;

        timer.isRunning = true;
        timer.isPaused = false;
        
        timer.intervalId = setInterval(() => {
            timer.remaining -= timer.interval;
            
            if (timer.remaining <= 0) {
                this.complete(id);
            } else {
                timer.callback(timer.remaining);
                this.emit('tick', { id, remaining: timer.remaining });
            }
        }, timer.interval);

        this.emit('start', { id });
        return true;
    }

    // Pause a timer
    pause(id) {
        const timer = this.timers.get(id);
        if (!timer || !timer.isRunning) return false;

        clearInterval(timer.intervalId);
        timer.isRunning = false;
        timer.isPaused = true;
        
        this.emit('pause', { id });
        this.persistTimers();
        return true;
    }

    // Complete a timer
    complete(id) {
        const timer = this.timers.get(id);
        if (!timer) return;

        clearInterval(timer.intervalId);
        timer.isRunning = false;
        
        this.emit('complete', { id });
        
        if (timer.repeat) {
            timer.remaining = timer.duration;
            this.start(id);
        } else {
            this.remove(id);
        }
    }

    // Remove a timer
    remove(id) {
        const timer = this.timers.get(id);
        if (timer?.intervalId) {
            clearInterval(timer.intervalId);
        }
        
        this.timers.delete(id);
        this.persistTimers();
        this.emit('remove', { id });
    }

    // Get timer status
    get(id) {
        return this.timers.get(id);
    }

    // List all timers
    list() {
        return Array.from(this.timers.values());
    }

    // Persist timers to localStorage
    persistTimers() {
        if (!this.config.persistTimers) return;
        
        const serializable = Array.from(this.timers.entries()).map(([id, timer]) => ({
            id,
            duration: timer.duration,
            remaining: timer.remaining,
            repeat: timer.repeat,
            isPaused: timer.isPaused,
            createdAt: timer.createdAt
        }));

        try {
            this.storage.setItem(`${this.config.storagePrefix}_timers`, JSON.stringify(serializable));
        } catch (error) {
            console.warn('Failed to persist timers:', error);
        }
    }

    // Load persisted timers
    loadPersistedTimers() {
        if (!this.config.persistTimers) return;

        try {
            const data = this.storage.getItem(`${this.config.storagePrefix}_timers`);
            if (!data) return;

            const timers = JSON.parse(data);
            timers.forEach(timerData => {
                if (this.timers.size < this.config.maxTimers) {
                    this.create(timerData.id, {
                        duration: timerData.duration,
                        repeat: timerData.repeat,
                        autoStart: false
                    });
                    
                    const timer = this.timers.get(timerData.id);
                    timer.remaining = timerData.remaining;
                    timer.isPaused = timerData.isPaused;
                }
            });
        } catch (error) {
            console.warn('Failed to load persisted timers:', error);
        }
    }

    // Clear all timers
    clear() {
        this.timers.forEach((timer, id) => {
            this.remove(id);
        });
    }

    destroy() {
        this.clear();
        super.destroy();
    }
}
