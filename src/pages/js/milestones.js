// Milestones Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check unlock status
    const timelineUnlocked = localStorage.getItem('timelineCompleted') === 'true';
    
    if (!timelineUnlocked) {
        alert('🔒 Please complete the Timeline first to access the Milestones!');
        window.location.href = 'timeline.html';
        return;
    }
    
    initializeMilestones();
});

let currentMilestone = 0;
let milestonesUnlocked = false;
const totalMilestones = 8;

const milestones = [
    {
        id: 1,
        title: "First Meeting",
        date: "The Day It All Began",
        description: "When two hearts found each other in the most unexpected way",
        icon: "👫",
        memory: "That nervous excitement when we first said hello..."
    },
    {
        id: 2,
        title: "First Date",
        date: "A Perfect Beginning",
        description: "Our first official date where time seemed to stand still",
        icon: "🥰",
        memory: "The butterflies, the laughs, and the feeling that this was special..."
    },
    {
        id: 3,
        title: "First 'I Love You'",
        date: "Words From The Heart",
        description: "When we both knew this was forever",
        icon: "💕",
        memory: "Those three little words that changed everything..."
    },
    {
        id: 4,
        title: "First Adventure Together",
        date: "Exploring The World",
        description: "Our first trip together, creating memories to last a lifetime",
        icon: "✈️",
        memory: "New places, new experiences, but best of all - together..."
    },
    {
        id: 5,
        title: "Meeting The Family",
        date: "Becoming Part Of Each Other's World",
        description: "When we knew we were in this for the long haul",
        icon: "👨‍👩‍👧‍👦",
        memory: "Nervous introductions that turned into warm welcomes..."
    },
    {
        id: 6,
        title: "Moving In Together",
        date: "Building Our Home",
        description: "Creating our own little world, just for us",
        icon: "🏠",
        memory: "Boxes everywhere, but feeling at home for the first time..."
    },
    {
        id: 7,
        title: "Anniversary Celebration",
        date: "Celebrating Our Love",
        description: "Each year together, each moment more precious than the last",
        icon: "🎉",
        memory: "Looking back at how far we've come, looking forward to forever..."
    },
    {
        id: 8,
        title: "Today & Forever",
        date: "Every Day Forward",
        description: "Each day is a new milestone in our love story",
        icon: "💖",
        memory: "This very moment, reading this together, is another beautiful milestone..."
    }
];

function initializeMilestones() {
    // Initialize progress tracking
    updateProgress();
    
    // Set up scroll-based reveal
    window.addEventListener('scroll', revealMilestonesOnScroll);
    
    // Initialize milestone cards
    revealMilestonesOnScroll();
    
    // Initialize unlock button
    const unlockBtn = document.getElementById('unlockMilestonesBtn');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', startMilestoneChallenge);
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const progress = (currentMilestone / totalMilestones) * 100;
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    if (progressText) {
        progressText.textContent = `${currentMilestone}/${totalMilestones} Milestones Revealed`;
    }
}

function revealMilestonesOnScroll() {
    const milestoneCards = document.querySelectorAll('.milestone-card');
    
    milestoneCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible && !card.classList.contains('revealed')) {
            setTimeout(() => {
                card.classList.add('revealed');
                if (index + 1 > currentMilestone) {
                    currentMilestone = index + 1;
                    updateProgress();
                    createMilestoneEffect(card);
                }
            }, index * 200);
        }
    });
    
    // Check if all milestones are revealed
    if (currentMilestone >= totalMilestones) {
        setTimeout(() => {
            showUnlockSection();
        }, 1000);
    }
}

function createMilestoneEffect(card) {
    const rect = card.getBoundingClientRect();
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'fixed';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        sparkle.style.fontSize = '1.5rem';
        sparkle.style.animation = 'sparkleEffect 2s ease-out forwards';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
}

function showUnlockSection() {
    const unlockSection = document.getElementById('unlockSection');
    if (unlockSection) {
        unlockSection.style.display = 'block';
        unlockSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function startMilestoneChallenge() {
    const challengeText = document.getElementById('challengeText');
    const unlockBtn = document.getElementById('unlockMilestonesBtn');
    
    if (milestonesUnlocked) {
        window.location.href = 'puzzle.html';
        return;
    }
    
    // Start the milestone challenge
    challengeText.innerHTML = `
        <div class="text-center">
            <h3 class="text-2xl font-dancing text-white mb-6">💖 Memory Challenge 💖</h3>
            <p class="text-white/90 mb-4">Based on the milestones you just explored...</p>
            <p class="text-xl font-dancing text-white mb-6">
                "What was the icon for your 'First I Love You' milestone?"
            </p>
            <div class="grid grid-cols-2 gap-4 mb-6">
                <button onclick="checkMilestoneAnswer('👫')" class="milestone-option">👫</button>
                <button onclick="checkMilestoneAnswer('💕')" class="milestone-option">💕</button>
                <button onclick="checkMilestoneAnswer('🥰')" class="milestone-option">🥰</button>
                <button onclick="checkMilestoneAnswer('💖')" class="milestone-option">💖</button>
            </div>
        </div>
    `;
    
    // Add styles for milestone options
    const style = document.createElement('style');
    style.textContent = `
        .milestone-option {
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 15px;
            padding: 2rem;
            font-size: 3rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .milestone-option:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
}

function checkMilestoneAnswer(answer) {
    const challengeText = document.getElementById('challengeText');
    
    if (answer === '💕') {
        // Correct answer!
        milestonesUnlocked = true;
        localStorage.setItem('milestonesCompleted', 'true');
        
        challengeText.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-2xl font-dancing text-white mb-4">Perfect! Milestones Challenge Completed!</h3>
                <p class="text-white/90 mb-6">You remember our beautiful journey together!</p>
                <button onclick="proceedToPuzzle()" class="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-8 rounded-full font-dancing text-xl hover:shadow-lg transition-all">
                    🧩 Continue to Puzzle 🧩
                </button>
            </div>
        `;
        
        // Show success effect
        createSuccessEffect();
        
    } else {
        // Wrong answer
        challengeText.innerHTML = `
            <div class="text-center">
                <div class="text-4xl mb-4">💕</div>
                <p class="text-white/90 mb-4">Close! The correct answer was 💕 (love hearts)</p>
                <p class="text-white/80 mb-6">Remember our "First I Love You" milestone?</p>
                <button onclick="startMilestoneChallenge()" class="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-lg font-dancing text-lg hover:shadow-lg transition-all">
                    Try Again 💕
                </button>
            </div>
        `;
    }
}

function proceedToPuzzle() {
    window.location.href = 'puzzle.html';
}

function createSuccessEffect() {
    const celebrationSymbols = ['🎉', '⭐', '💖', '🌟', '💫', '✨'];
    const container = document.body;
    
    for (let i = 0; i < 30; i++) {
        const symbol = document.createElement('div');
        symbol.innerHTML = celebrationSymbols[Math.floor(Math.random() * celebrationSymbols.length)];
        symbol.style.position = 'fixed';
        symbol.style.left = Math.random() * 100 + 'vw';
        symbol.style.top = '100vh';
        symbol.style.fontSize = '2rem';
        symbol.style.animation = 'celebrationFloat 3s ease-out forwards';
        symbol.style.pointerEvents = 'none';
        symbol.style.zIndex = '10000';
        
        container.appendChild(symbol);
        
        setTimeout(() => {
            symbol.remove();
        }, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleEffect {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: scale(1.5) rotate(180deg) translateY(-50px);
        }
    }
    
    @keyframes celebrationFloat {
        0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translateY(-100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

console.log('🚀 Milestones page initialized');
