/**
 * Anniversary Website v4.0.0 - Content-Focused Class/ID Naming System
 * Professional, semantic, meaningful names based on content purpose
 * Replaces technical/framework-based naming with user-centric terminology
 */

// =================== CONTENT-FOCUSED NAMING STANDARDS ===================

/**
 * NAMING PRINCIPLES:
 * 1. Content-First: Name reflects what the user sees/experiences
 * 2. Relationship-Focused: Uses couple's terminology and story elements  
 * 3. Semantic Meaning: Clear purpose without technical jargon
 * 4. Emotional Context: Captures the feeling/mood of content
 * 5. Professional Standards: Clean, maintainable, scalable
 */

const CONTENT_FOCUSED_NAMING = {
    
    // =================== CORE RELATIONSHIP ELEMENTS ===================
    couples: {
        // Primary couple information
        'jerry-info': 'Information about Jerry (Puja)',
        'mankada-info': 'Information about Mankada (Soumya)', 
        'couple-journey': 'Their relationship journey',
        'love-story': 'Main love story narrative',
        'relationship-stats': 'Days together, milestones',
        'couple-motto': 'Their shared motto/tagline'
    },

    // =================== MEMORY & TIMELINE ELEMENTS ===================
    memories: {
        'first-message': 'Their very first interaction',
        'first-love-confession': 'When love was first expressed',
        'monthly-celebration': 'Monthly anniversary celebrations',
        'special-moments': 'Highlighted precious moments',
        'memory-collection': 'Main timeline container',
        'memory-card': 'Individual memory display',
        'milestone-marker': 'Important relationship milestones',
        'favorite-memories': 'Most cherished moments',
        'memory-categories': 'Types of memories (milestone, growth, etc.)',
        'timeline-navigator': 'Controls for browsing memories'
    },

    // =================== PHOTO & VISUAL ELEMENTS ===================
    photos: {
        'photo-gallery': 'Main photo collection',
        'couple-photos': 'Photos of them together',
        'memory-photos': 'Photos tied to specific memories',
        'favorite-photos': 'Most beloved photos',
        'photo-album': 'Organized photo collections',
        'photo-viewer': 'Full-size photo display',
        'photo-caption': 'Photo descriptions/stories',
        'photo-tags': 'Photo categorization',
        'slideshow-viewer': 'Automatic photo presentation'
    },

    // =================== COMMUNICATION ELEMENTS ===================
    communication: {
        'love-letters': 'Written messages between them',
        'letter-collection': 'All love letters container',
        'featured-letter': 'Highlighted letter',
        'letter-content': 'Letter text/body',
        'letter-signature': 'Letter closing/signature',
        'sweet-messages': 'Short sweet communications',
        'daily-affirmations': 'Regular loving messages',
        'anniversary-messages': 'Special celebration letters'
    },

    // =================== MUSIC & ENTERTAINMENT ===================
    music: {
        'love-songs': 'Music playlist for the couple',
        'our-songs': 'Songs that are meaningful to them',
        'romantic-playlist': 'Romantic music collection',
        'music-player': 'Audio playback controls',
        'song-info': 'Current/selected song details',
        'music-memories': 'Songs tied to specific memories',
        'favorite-tracks': 'Most loved songs'
    },

    // =================== CELEBRATION & COUNTDOWN ===================
    celebrations: {
        'anniversary-countdown': 'Time until next anniversary',
        'days-together': 'Total time as a couple',
        'countdown-display': 'Visual countdown presentation',
        'celebration-calendar': 'Important dates',
        'milestone-tracker': 'Achievement markers',
        'special-dates': 'Recurring/important events',
        'anniversary-badge': 'Achievement displays'
    },

    // =================== PLANNING & FUTURE ===================
    planning: {
        'dream-plans': 'Future aspirations together',
        'romantic-wishlist': 'Things they want to do',
        'travel-dreams': 'Places they want to visit',
        'shared-goals': 'Common objectives',
        'bucket-list': 'Life experiences to share',
        'anniversary-plans': 'Celebration planning'
    },

    // =================== EMOTIONAL & INTERACTIVE ===================
    interactive: {
        'heart-animations': 'Romantic visual effects',
        'love-particles': 'Floating romantic elements',
        'romantic-background': 'Themed visual backdrop',
        'mood-indicator': 'Emotional state display',
        'interactive-hearts': 'Clickable love elements',
        'surprise-elements': 'Hidden romantic features',
        'romantic-cursor': 'Custom cursor effects'
    },

    // =================== NAVIGATION & STRUCTURE ===================
    navigation: {
        'love-story-nav': 'Main story navigation',
        'memory-browser': 'Memory section navigation',
        'photo-explorer': 'Photo section navigation', 
        'letter-reader': 'Letters section navigation',
        'music-center': 'Music section navigation',
        'home-sanctuary': 'Homepage navigation',
        'celebration-hub': 'Countdown/anniversary navigation'
    },

    // =================== USER INTERFACE ===================
    interface: {
        'romantic-theme': 'Overall visual theme',
        'dark-romance': 'Dark theme styling',
        'light-love': 'Light theme styling',
        'content-area': 'Main content display',
        'sidebar-details': 'Secondary information',
        'action-buttons': 'Interactive controls',
        'love-badge': 'Status/achievement indicators',
        'romantic-card': 'Styled content containers'
    }
};

// =================== CLASS NAME GENERATORS ===================

class ContentFocusedNaming {
    
    /**
     * Generate content-focused class name
     */
    static generateClass(category, element, modifier = '') {
        const base = CONTENT_FOCUSED_NAMING[category]?.[element] || element;
        const className = base.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-');
        
        return modifier ? `${className}--${modifier}` : className;
    }

    /**
     * Generate semantic ID
     */
    static generateId(category, element, instance = '') {
        const base = this.generateClass(category, element);
        return instance ? `${base}-${instance}` : base;
    }

    /**
     * Convert technical class to content-focused
     */
    static convertTechnicalClass(technicalClass) {
        const conversions = {
            // Common technical to content-focused conversions
            'container': 'content-area',
            'wrapper': 'content-section',
            'component': 'feature-element',
            'module': 'story-section',
            'widget': 'interactive-element',
            'panel': 'info-display',
            'sidebar': 'details-panel',
            'header': 'title-section',
            'footer': 'closing-section',
            'nav': 'story-navigation',
            'btn': 'action-button',
            'form': 'input-collection',
            'input': 'user-input',
            'card': 'memory-card',
            'modal': 'overlay-story',
            'dropdown': 'option-selector',
            'tab': 'section-switcher',
            'accordion': 'expandable-story',
            'carousel': 'memory-slideshow',
            'grid': 'content-collection',
            'list': 'story-sequence',
            'item': 'story-element'
        };

        return conversions[technicalClass] || technicalClass;
    }

    /**
     * Generate comprehensive naming map for a page
     */
    static generatePageNaming(pageType) {
        const pageNaming = {
            'love-letters': {
                container: 'letter-sanctuary',
                title: 'letter-collection-title',
                content: 'love-messages',
                featured: 'highlighted-letter',
                card: 'letter-card',
                body: 'letter-content',
                signature: 'love-signature'
            },
            'memory-book': {
                container: 'memory-sanctuary',
                title: 'memory-collection-title',
                timeline: 'love-journey',
                memory: 'precious-moment',
                milestone: 'relationship-milestone',
                category: 'memory-type'
            },
            'photo-gallery': {
                container: 'photo-sanctuary',
                gallery: 'couple-photos',
                album: 'memory-album',
                photo: 'captured-moment',
                caption: 'photo-story',
                favorite: 'treasured-photo'
            },
            'music-playlist': {
                container: 'music-sanctuary', 
                playlist: 'love-songs',
                player: 'music-heart',
                track: 'romantic-melody',
                controls: 'music-controls'
            },
            'countdown': {
                container: 'celebration-sanctuary',
                countdown: 'anniversary-countdown',
                timer: 'love-timer',
                stats: 'relationship-stats',
                milestone: 'love-achievement'
            }
        };

        return pageNaming[pageType] || {};
    }
}

// =================== EXPORT FOR GLOBAL USE ===================

// Make available globally
window.ContentFocusedNaming = ContentFocusedNaming;
window.CONTENT_FOCUSED_NAMING = CONTENT_FOCUSED_NAMING;

export { ContentFocusedNaming, CONTENT_FOCUSED_NAMING };
export default ContentFocusedNaming;
