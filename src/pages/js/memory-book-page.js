// Memory Book Page JavaScript
import { MemoryBookManager } from './memory-book.js';

// Initialize Memory Book when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const memoryBook = new MemoryBookManager();

    // Show welcome notification
    setTimeout(() => {
        if (window.notificationManager) {
            window.notificationManager.show(
                'info',
                'Memory Book Ready! 📚✨',
                'Explore our precious memories and create new ones! Click on memory pages to flip them and see the stories.'
            );
        }
    }, 1000);
});

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Initialize unified systems when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Unified systems loaded for memory-book');
});
