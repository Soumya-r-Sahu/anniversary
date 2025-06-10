// Challenges Page JavaScript
// Extracted from challenges.html inline scripts

import { ChallengesManager } from './challenges.js';

// Initialize Challenges Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Challenges page loaded with enhanced interactive system');
    
    // ChallengesManager will auto-initialize
    // Additional page-specific initialization can go here
});

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Initialize unified systems when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Unified systems loaded for challenges');
});
