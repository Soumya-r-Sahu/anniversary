// Memory Box Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check unlock status
    const messageWallUnlocked = localStorage.getItem('messageWallCompleted') === 'true';
    
    if (!messageWallUnlocked) {
        alert('🔒 Please complete the Message Wall first to access the Memory Box!');
        window.location.href = 'message-wall.html';
        return;
    }
    
    initializeMemoryBox();
});

let memoryBoxOpened = false;
let memoryBoxCompleted = false;

const memoryCategories = {
    photos: {
        title: "📸 Our Photos",
        count: 47,
        description: "Pictures that captured our beautiful moments",
        memories: [
            "First selfie together",
            "Anniversary dinner photos", 
            "Travel adventures",
            "Silly candid shots",
            "Special occasion memories"
        ]
    },
    videos: {
        title: "🎥 Our Videos", 
        count: 23,
        description: "Moving memories that bring back the emotions",
        memories: [
            "First video message",
            "Birthday surprise videos",
            "Travel vlogs together",
            "Funny moments compilation",
            "Anniversary wishes"
        ]
    },
    letters: {
        title: "💌 Love Letters",
        count: 15,
        description: "Written words straight from our hearts",
        memories: [
            "First love letter",
            "Anniversary notes",
            "Apology letters",
            "Encouragement messages",
            "Future promises"
        ]
    },
    gifts: {
        title: "🎁 Special Gifts",
        count: 32,
        description: "Tokens of love and thoughtfulness",
        memories: [
            "First gift exchanged",
            "Handmade surprises",
            "Birthday presents",
            "Just-because gifts",
            "Anniversary treasures"
        ]
    },
    moments: {
        title: "✨ Special Moments",
        count: 68,
        description: "Memories that live in our hearts forever",
        memories: [
            "First 'I love you'",
            "Meeting the families",
            "Moving in together",
            "Overcoming challenges",
            "Future planning talks"
        ]
    },
    dreams: {
        title: "🌟 Shared Dreams",
        count: 12,
        description: "Plans and hopes for our future together",
        memories: [
            "Dream home discussions",
            "Travel bucket list",
            "Future family plans",
            "Career support goals",
            "Growing old together"
        ]
    }
};

function initializeMemoryBox() {
    // Initialize the box opening interaction
    const memoryBox = document.getElementById('memoryBox');
    const openBtn = document.getElementById('openBoxBtn');
    
    if (openBtn) {
        openBtn.addEventListener('click', openMemoryBox);
    }
    
    // Initialize stats
    updateMemoryStats();
}

function openMemoryBox() {
    if (memoryBoxOpened) return;
    
    memoryBoxOpened = true;
    const memoryBox = document.getElementById('memoryBox');
    const boxContents = document.getElementById('boxContents');
    
    // Add opening animation class
    memoryBox.classList.add('opening');
    
    // Show contents after animation
    setTimeout(() => {
        boxContents.style.display = 'block';
        boxContents.classList.add('revealed');
        
        // Populate memory categories
        populateMemoryCategories();
        
        // Show unlock section after all memories are shown
        setTimeout(() => {
            showUnlockSection();
        }, 2000);
        
    }, 1000);
    
    // Create opening effect
    createOpeningEffect();
}

function populateMemoryCategories() {
    const categoriesGrid = document.getElementById('memoryCategoriesGrid');
    categoriesGrid.innerHTML = '';
    
    Object.keys(memoryCategories).forEach((key, index) => {
        const category = memoryCategories[key];
        
        const categoryCard = document.createElement('div');
        categoryCard.className = 'memory-category-card';
        categoryCard.innerHTML = `
            <div class="category-header">
                <h4 class="category-title">${category.title}</h4>
                <span class="category-count">${category.count} items</span>
            </div>
            <p class="category-description">${category.description}</p>
            <div class="category-memories">
                ${category.memories.map(memory => `
                    <div class="memory-item">💕 ${memory}</div>
                `).join('')}
            </div>
        `;
        
        // Add reveal animation with delay
        setTimeout(() => {
            categoryCard.classList.add('revealed');
            createCategoryEffect(categoryCard);
        }, index * 300);
        
        categoriesGrid.appendChild(categoryCard);
    });
}

function createOpeningEffect() {
    const sparkles = ['✨', '⭐', '💫', '🌟', '💖'];
    const memoryBox = document.getElementById('memoryBox');
    const rect = memoryBox.getBoundingClientRect();
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'fixed';
        sparkle.style.left = (rect.left + rect.width/2) + 'px';
        sparkle.style.top = (rect.top + rect.height/2) + 'px';
        sparkle.style.fontSize = '1.5rem';
        sparkle.style.animation = `boxOpenEffect ${1 + Math.random()}s ease-out forwards`;
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
}

function createCategoryEffect(card) {
    const rect = card.getBoundingClientRect();
    const hearts = ['💕', '💖', '💗'];
    
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.left = (rect.left + Math.random() * rect.width) + 'px';
        heart.style.top = (rect.top + Math.random() * rect.height) + 'px';
        heart.style.fontSize = '1rem';
        heart.style.animation = 'categoryRevealEffect 1.5s ease-out forwards';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }
}

function updateMemoryStats() {
    const totalMemories = Object.values(memoryCategories).reduce((sum, category) => sum + category.count, 0);
    const totalCategories = Object.keys(memoryCategories).length;
    
    document.getElementById('totalMemories').textContent = totalMemories;
    document.getElementById('totalCategories').textContent = totalCategories;
    document.getElementById('memoryYears').textContent = '2+'; // Customize based on relationship
}

function showUnlockSection() {
    const unlockSection = document.getElementById('unlockSection');
    if (unlockSection) {
        unlockSection.style.display = 'block';
        unlockSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function startMemoryChallenge() {
    const challengeText = document.getElementById('challengeText');
    const unlockBtn = document.getElementById('unlockMemoryBoxBtn');
    
    if (memoryBoxCompleted) {
        window.location.href = 'bucket-list.html';
        return;
    }
    
    // Start the memory challenge
    challengeText.innerHTML = `
        <div class="text-center">
            <h3 class="text-2xl font-dancing text-white mb-6">📦 Memory Challenge 📦</h3>
            <p class="text-white/90 mb-4">After exploring our memory box...</p>
            <p class="text-xl font-dancing text-white mb-6">
                "Which category has the most memories?"
            </p>
            <div class="grid grid-cols-2 gap-4 mb-6">
                <button onclick="checkMemoryAnswer('photos')" class="memory-option">📸 Photos (47)</button>
                <button onclick="checkMemoryAnswer('moments')" class="memory-option">✨ Moments (68)</button>
                <button onclick="checkMemoryAnswer('gifts')" class="memory-option">🎁 Gifts (32)</button>
                <button onclick="checkMemoryAnswer('videos')" class="memory-option">🎥 Videos (23)</button>
            </div>
        </div>
    `;
    
    // Add styles for memory options
    const style = document.createElement('style');
    style.textContent = `
        .memory-option {
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 15px;
            padding: 1.5rem;
            color: white;
            font-size: 1rem;
            font-family: 'Dancing Script', cursive;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .memory-option:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
}

function checkMemoryAnswer(answer) {
    const challengeText = document.getElementById('challengeText');
    
    if (answer === 'moments') {
        // Correct answer!
        memoryBoxCompleted = true;
        localStorage.setItem('memoryBoxCompleted', 'true');
        
        challengeText.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-2xl font-dancing text-white mb-4">Perfect! Memory Box Challenge Completed!</h3>
                <p class="text-white/90 mb-6">You're right! Special Moments (68) are our most precious memories because they live in our hearts forever!</p>
                <button onclick="proceedToBucketList()" class="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-8 rounded-full font-dancing text-xl hover:shadow-lg transition-all">
                    📝 Continue to Bucket List 📝
                </button>
            </div>
        `;
        
        // Show success effect
        createSuccessEffect();
        
    } else {
        // Wrong answer
        challengeText.innerHTML = `
            <div class="text-center">
                <div class="text-4xl mb-4">✨</div>
                <p class="text-white/90 mb-4">Close! "Special Moments" (68) has the most memories!</p>
                <p class="text-white/80 mb-6">The moments we share together are what matter most! 💖</p>
                <button onclick="startMemoryChallenge()" class="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-lg font-dancing text-lg hover:shadow-lg transition-all">
                    Try Again 📦
                </button>
            </div>
        `;
    }
}

function proceedToBucketList() {
    window.location.href = 'bucket-list.html';
}

function createSuccessEffect() {
    const celebrationSymbols = ['🎉', '📦', '💖', '✨', '🌟', '💫'];
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
    @keyframes boxOpenEffect {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(1.5) rotate(360deg);
        }
    }
    
    @keyframes categoryRevealEffect {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: scale(1.5) rotate(180deg) translateY(-30px);
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
    
    .memory-category-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .memory-category-card.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

console.log('🚀 Memory Box page initialized');
