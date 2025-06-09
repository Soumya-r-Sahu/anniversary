
/**
 * Bucket List Interactive JavaScript
 * Manages the dual-column bucket list interface with completed and todo items
 * Features: floating dreams, progress tracking, item viewing, and unlock system
 */

class BucketListManager {
    constructor() {
        this.itemsViewed = 0;
        this.totalItems = 9; // 4 completed + 5 todo
        this.isUnlocked = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.checkAccess();
        this.createFloatingDreams();
        this.setupItemHandlers();
        this.updateStats();
        this.loadSavedData();
        
        console.log('🎯 Bucket List Manager initialized');
    }
    
    checkAccess() {
        const memoryBoxUnlocked = localStorage.getItem('memoryBoxCompleted') === 'true';
        const futurePlansUnlocked = localStorage.getItem('futurePlansCompleted') === 'true';
        
        if (!memoryBoxUnlocked && !futurePlansUnlocked) {
            alert('🔒 Please complete the Memory Box or Future Plans first to access the Bucket List!');
            window.location.href = 'memory-box.html';
            return;
        }
    }
    
    createFloatingDreams() {
        const dreamsContainer = document.getElementById('floatingDreams');
        if (!dreamsContainer) return;
        
        const dreamEmojis = ['✨', '🌟', '💫', '🎯', '💭', '🌈', '⭐', '🎪', '🎨', '🎵'];
        
        // Clear existing dreams
        dreamsContainer.innerHTML = '';
        
        for (let i = 0; i < 30; i++) {
            const dream = document.createElement('div');
            dream.className = 'dream-item';
            dream.innerHTML = dreamEmojis[Math.floor(Math.random() * dreamEmojis.length)];
            dream.style.left = Math.random() * 100 + '%';
            dream.style.top = Math.random() * 100 + '%';
            dream.style.animationDelay = Math.random() * 8 + 's';
            dream.style.animationDuration = (Math.random() * 4 + 6) + 's';
            dreamsContainer.appendChild(dream);
        }
    }
    
    setupItemHandlers() {
        const bucketItems = document.querySelectorAll('.bucket-item');
        bucketItems.forEach(item => {
            item.addEventListener('click', () => this.viewItem(item));
        });
        
        // Update total items count
        this.totalItems = bucketItems.length;
    }
    
    viewItem(item) {
        if (!item.classList.contains('viewed')) {
            item.classList.add('viewed');
            this.itemsViewed++;
            
            // Add sparkle effect
            this.createSparkleEffect(item);
            
            // Play success sound
            this.playSuccessSound();
            
            // Check if all items viewed
            if (this.itemsViewed >= this.totalItems) {
                this.enableUnlockButton();
            }
            
            // Update progress
            this.updateViewProgress();
        }
    }
    
    createSparkleEffect(element) {
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = '1.5rem';
            sparkle.style.color = '#FFD700';
            sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '100';
            
            element.style.position = 'relative';
            element.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 2000);
        }
    }
    
    addCompletedItem() {
        const title = prompt('🎉 What amazing thing did you two accomplish together?');
        if (title && title.trim()) {
            const description = prompt('💫 Tell us more about this beautiful achievement:');
            if (description && description.trim()) {
                this.addNewItem('completed', title.trim(), description.trim(), '🎊');
            }
        }
    }
    
    addTodoItem() {
        const title = prompt('🎯 What dream would you like to add to your bucket list?');
        if (title && title.trim()) {
            const description = prompt('✨ Describe this exciting future adventure:');
            if (description && description.trim()) {
                this.addNewItem('todo', title.trim(), description.trim(), '🌟');
            }
        }
    }
    
    addNewItem(type, title, description, icon) {
        const container = type === 'completed' ? 
            document.getElementById('completedItems') : 
            document.getElementById('todoItems');
        
        if (!container) return;
        
        const item = document.createElement('div');
        item.className = 'bucket-item';
        item.dataset.completed = type === 'completed' ? 'true' : 'false';
        
        item.innerHTML = `
            <span class="item-icon">${icon}</span>
            <div class="item-title">${title}</div>
            <div class="item-description">${description}</div>
            <div class="item-status">
                <span>${type === 'completed' ? '💚' : '💭'}</span>
                <span>${type === 'completed' ? 'Custom achievement unlocked!' : 'Personal dream added!'}</span>
            </div>
        `;
        
        item.addEventListener('click', () => this.viewItem(item));
        container.appendChild(item);
        
        // Update counts and totals
        this.totalItems++;
        this.updateStats();
        this.createSparkleEffect(item);
        this.saveBucketListData();
        
        // Play success sound
        this.playSuccessSound();
    }
    
    updateStats() {
        const completedItems = document.querySelectorAll('.completed-column .bucket-item').length;
        const todoItems = document.querySelectorAll('.todo-column .bucket-item').length;
        const totalItems = completedItems + todoItems;
        const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        
        const completedCountEl = document.getElementById('completedCount');
        const todoCountEl = document.getElementById('todoCount');
        const progressPercentageEl = document.getElementById('progressPercentage');
        
        if (completedCountEl) completedCountEl.textContent = completedItems;
        if (todoCountEl) todoCountEl.textContent = todoItems;
        if (progressPercentageEl) progressPercentageEl.textContent = percentage + '%';
    }
    
    updateViewProgress() {
        const progressText = `${this.itemsViewed}/${this.totalItems} items explored`;
        
        // Create or update progress indicator
        let progressIndicator = document.getElementById('viewProgress');
        if (!progressIndicator) {
            progressIndicator = document.createElement('div');
            progressIndicator.id = 'viewProgress';
            progressIndicator.style.cssText = `
                position: fixed;
                top: 120px;
                right: 20px;
                background: rgba(255, 255, 255, 0.9);
                padding: 10px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                color: #667eea;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(progressIndicator);
        }
        
        progressIndicator.textContent = progressText;
        
        // Remove after completion
        if (this.itemsViewed >= this.totalItems) {
            setTimeout(() => {
                if (progressIndicator.parentNode) {
                    progressIndicator.remove();
                }
            }, 3000);
        }
    }
    
    enableUnlockButton() {
        const unlockBtn = document.getElementById('unlockBtn');
        if (unlockBtn) {
            unlockBtn.style.background = 'linear-gradient(135deg, #00c851, #007e33)';
            unlockBtn.innerHTML = '🎉 All Items Explored - Continue to Quiz! 🎉';
            unlockBtn.disabled = false;
            this.isUnlocked = true;
            
            // Add celebration effect
            this.createCelebrationEffect();
        }
    }
    
    createCelebrationEffect() {
        const celebrationContainer = document.createElement('div');
        celebrationContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(celebrationContainer);
        
        const celebrationEmojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎯', '💚', '🏆'];
        
        for (let i = 0; i < 50; i++) {
            const emoji = document.createElement('div');
            emoji.innerHTML = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
            emoji.style.cssText = `
                position: absolute;
                font-size: 2rem;
                left: ${Math.random() * 100}vw;
                top: -50px;
                animation: celebrationFall ${Math.random() * 3 + 2}s linear forwards;
            `;
            celebrationContainer.appendChild(emoji);
        }
        
        // Add celebration animation styles
        if (!document.getElementById('celebrationStyles')) {
            const style = document.createElement('style');
            style.id = 'celebrationStyles';
            style.textContent = `
                @keyframes celebrationFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (celebrationContainer.parentNode) {
                celebrationContainer.remove();
            }
        }, 5000);
    }
    
    unlockNextPage() {
        if (this.itemsViewed >= this.totalItems) {
            // Mark bucket list as completed
            localStorage.setItem('bucketListCompleted', 'true');
            localStorage.setItem('bucketListCompletionTime', new Date().toISOString());
            
            // Save final progress
            this.saveBucketListData();
            
            // Show success message
            this.showSuccessMessage();
            
            // Navigate to quiz after delay
            setTimeout(() => {
                window.location.href = 'quiz.html';
            }, 2000);
        } else {
            alert(`🎯 Please explore all ${this.totalItems} bucket list items first! You've seen ${this.itemsViewed} so far.`);
        }
    }
    
    showSuccessMessage() {
        const successOverlay = document.createElement('div');
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(102, 126, 234, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.5s ease-in-out;
        `;
        
        successOverlay.innerHTML = `
            <div style="text-align: center; color: white; font-family: 'Dancing Script', cursive;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎯✨</div>
                <h2 style="font-size: 3rem; margin-bottom: 1rem;">Bucket List Explored!</h2>
                <p style="font-size: 1.5rem; margin-bottom: 2rem;">Dreams reviewed and memories cherished!</p>
                <div style="font-size: 2rem;">Moving to Quiz... 🧠</div>
            </div>
        `;
        
        document.body.appendChild(successOverlay);
        
        setTimeout(() => {
            if (successOverlay.parentNode) {
                successOverlay.remove();
            }
        }, 2000);
    }
    
    saveBucketListData() {
        const bucketListData = {
            completed: [],
            todo: [],
            viewProgress: {
                itemsViewed: this.itemsViewed,
                totalItems: this.totalItems,
                isUnlocked: this.isUnlocked
            },
            lastUpdated: new Date().toISOString()
        };
        
        // Save completed items
        document.querySelectorAll('.completed-column .bucket-item').forEach(item => {
            const titleEl = item.querySelector('.item-title');
            const descEl = item.querySelector('.item-description');
            const iconEl = item.querySelector('.item-icon');
            
            if (titleEl && descEl && iconEl) {
                bucketListData.completed.push({
                    title: titleEl.textContent,
                    description: descEl.textContent,
                    icon: iconEl.textContent,
                    viewed: item.classList.contains('viewed')
                });
            }
        });
        
        // Save todo items
        document.querySelectorAll('.todo-column .bucket-item').forEach(item => {
            const titleEl = item.querySelector('.item-title');
            const descEl = item.querySelector('.item-description');
            const iconEl = item.querySelector('.item-icon');
            
            if (titleEl && descEl && iconEl) {
                bucketListData.todo.push({
                    title: titleEl.textContent,
                    description: descEl.textContent,
                    icon: iconEl.textContent,
                    viewed: item.classList.contains('viewed')
                });
            }
        });
        
        localStorage.setItem('bucketListData', JSON.stringify(bucketListData));
    }
    
    loadSavedData() {
        try {
            const savedData = localStorage.getItem('bucketListData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                if (data.viewProgress) {
                    this.itemsViewed = data.viewProgress.itemsViewed || 0;
                    this.isUnlocked = data.viewProgress.isUnlocked || false;
                    
                    // Restore viewed states
                    if (this.itemsViewed > 0) {
                        this.restoreViewedItems(data);
                    }
                    
                    if (this.isUnlocked) {
                        this.enableUnlockButton();
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to load saved bucket list data:', error);
        }
    }
    
    restoreViewedItems(data) {
        const allItems = [...data.completed, ...data.todo];
        const bucketItems = document.querySelectorAll('.bucket-item');
        
        bucketItems.forEach((item, index) => {
            if (allItems[index] && allItems[index].viewed) {
                item.classList.add('viewed');
            }
        });
    }
    
    playSuccessSound() {
        try {
            // Create a simple audio feedback using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Silent fail for audio
        }
    }
}

// Global functions for HTML onclick handlers
window.addCompletedItem = function() {
    if (window.bucketListManager) {
        window.bucketListManager.addCompletedItem();
    }
};

window.addTodoItem = function() {
    if (window.bucketListManager) {
        window.bucketListManager.addTodoItem();
    }
};

window.unlockNextPage = function() {
    if (window.bucketListManager) {
        window.bucketListManager.unlockNextPage();
    }
};

// Initialize the bucket list manager
window.bucketListManager = new BucketListManager();

// Add required CSS animations
if (!document.getElementById('bucketListAnimations')) {
    const style = document.createElement('style');
    style.id = 'bucketListAnimations';
    style.textContent = `
        @keyframes sparkleFloat {
            0% {
                opacity: 1;
                transform: scale(0.5) translateY(0);
            }
            100% {
                opacity: 0;
                transform: scale(1.5) translateY(-30px);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .bucket-item.viewed {
            border: 2px solid #FFD700 !important;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.4) !important;
            transform: scale(1.02);
        }
        
        .bucket-item {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

export default BucketListManager;
