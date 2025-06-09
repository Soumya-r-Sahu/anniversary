// Message Wall Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check unlock status
    const puzzleUnlocked = localStorage.getItem('puzzleCompleted') === 'true';
    
    if (!puzzleUnlocked) {
        alert('🔒 Please complete the Puzzle first to access the Message Wall!');
        window.location.href = 'puzzle.html';
        return;
    }
    
    initializeMessageWall();
});

let revealedMessages = 0;
let messageWallCompleted = false;
const totalMessages = 12;

const loveMessages = [
    {
        id: 1,
        message: "Every day with you feels like a beautiful dream come true 💕",
        author: "Jerry",
        date: "Every day"
    },
    {
        id: 2,
        message: "You make my heart skip a beat every single time I see you 💖",
        author: "Soumya", 
        date: "Always"
    },
    {
        id: 3,
        message: "Thank you for being my partner, my best friend, and my everything ✨",
        author: "Jerry",
        date: "Forever"
    },
    {
        id: 4,
        message: "In your arms, I've found my home and my peace 🏠",
        author: "Soumya",
        date: "Always"
    },
    {
        id: 5,
        message: "You're not just my love, you're my favorite adventure 🌟",
        author: "Jerry",
        date: "Every moment"
    },
    {
        id: 6,
        message: "With you, I'm the best version of myself 💫",
        author: "Soumya",
        date: "Every day"
    },
    {
        id: 7,
        message: "Your smile is my favorite sight in the whole world 😊",
        author: "Jerry",
        date: "Every morning"
    },
    {
        id: 8,
        message: "I fall in love with you more and more each day 💗",
        author: "Soumya",
        date: "Endlessly"
    },
    {
        id: 9,
        message: "You make ordinary moments feel extraordinary 🌈",
        author: "Jerry",
        date: "Always"
    },
    {
        id: 10,
        message: "My heart chose you, and it was the best decision ever made 💝",
        author: "Soumya",
        date: "From the start"
    },
    {
        id: 11,
        message: "Together, we can conquer anything life throws our way 💪",
        author: "Jerry",
        date: "Forever"
    },
    {
        id: 12,
        message: "You're my forever and always, my one and only 💖",
        author: "Soumya",
        date: "Eternally"
    }
];

function initializeMessageWall() {
    // Create floating hearts background
    createFloatingHearts();
    
    // Initialize progress tracking
    updateProgress();
    
    // Set up message cards interaction
    setupMessageCards();
    
    // Initialize unlock section (hidden initially)
    const unlockSection = document.getElementById('unlockSection');
    if (unlockSection) {
        unlockSection.style.display = 'none';
    }
}

function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    const heartSymbols = ['💕', '💖', '💗', '💘', '💝', '💞'];
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heartsContainer.appendChild(heart);
    }
}

function setupMessageCards() {
    const messageCards = document.querySelectorAll('.message-card');
    
    messageCards.forEach((card, index) => {
        const messageData = loveMessages[index];
        
        // Set up the card content
        const messageText = card.querySelector('.message-text');
        const messageAuthor = card.querySelector('.message-author');
        const messageDate = card.querySelector('.message-date');
        
        if (messageText && messageData) {
            messageText.textContent = messageData.message;
        }
        if (messageAuthor && messageData) {
            messageAuthor.textContent = `- ${messageData.author}`;
        }
        if (messageDate && messageData) {
            messageDate.textContent = messageData.date;
        }
        
        // Add hover event listeners
        card.addEventListener('mouseenter', () => revealMessage(card, index));
        card.addEventListener('click', () => revealMessage(card, index));
    });
}

function revealMessage(card, index) {
    if (card.classList.contains('revealed')) return;
    
    card.classList.add('revealed');
    revealedMessages++;
    
    // Create sparkle effect
    createSparkleEffect(card);
    
    // Update progress
    updateProgress();
    
    // Play reveal sound effect (if audio is enabled)
    playRevealSound();
    
    // Check if all messages are revealed
    if (revealedMessages >= totalMessages) {
        setTimeout(() => {
            showUnlockSection();
        }, 1000);
    }
}

function createSparkleEffect(card) {
    const rect = card.getBoundingClientRect();
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'fixed';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        sparkle.style.fontSize = '1.2rem';
        sparkle.style.animation = 'sparkleEffect 1.5s ease-out forwards';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1500);
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const progress = (revealedMessages / totalMessages) * 100;
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    if (progressText) {
        progressText.textContent = `${revealedMessages}/${totalMessages} Messages Revealed`;
    }
}

function showUnlockSection() {
    const unlockSection = document.getElementById('unlockSection');
    if (unlockSection) {
        unlockSection.style.display = 'block';
        unlockSection.scrollIntoView({ behavior: 'smooth' });
        
        // Add celebration effect
        createCompletionEffect();
    }
}

function startMessageChallenge() {
    const challengeText = document.getElementById('challengeText');
    const unlockBtn = document.getElementById('unlockMessageWallBtn');
    
    if (messageWallCompleted) {
        window.location.href = 'memory-box.html';
        return;
    }
    
    // Start the message challenge
    challengeText.innerHTML = `
        <div class="text-center">
            <h3 class="text-2xl font-dancing text-white mb-6">💌 Love Message Challenge 💌</h3>
            <p class="text-white/90 mb-4">After reading all these beautiful messages...</p>
            <p class="text-xl font-dancing text-white mb-6">
                "Which word appears most often in these love messages?"
            </p>
            <div class="grid grid-cols-2 gap-4 mb-6">
                <button onclick="checkMessageAnswer('love')" class="message-option">Love</button>
                <button onclick="checkMessageAnswer('you')" class="message-option">You</button>
                <button onclick="checkMessageAnswer('my')" class="message-option">My</button>
                <button onclick="checkMessageAnswer('together')" class="message-option">Together</button>
            </div>
        </div>
    `;
    
    // Add styles for message options
    const style = document.createElement('style');
    style.textContent = `
        .message-option {
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 15px;
            padding: 1.5rem;
            color: white;
            font-size: 1.2rem;
            font-family: 'Dancing Script', cursive;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .message-option:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
}

function checkMessageAnswer(answer) {
    const challengeText = document.getElementById('challengeText');
    
    if (answer === 'you') {
        // Correct answer!
        messageWallCompleted = true;
        localStorage.setItem('messageWallCompleted', 'true');
        
        challengeText.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-2xl font-dancing text-white mb-4">Perfect! Message Wall Challenge Completed!</h3>
                <p class="text-white/90 mb-6">You noticed that "you" is the most important word in all our love messages!</p>
                <button onclick="proceedToMemoryBox()" class="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-8 rounded-full font-dancing text-xl hover:shadow-lg transition-all">
                    📦 Continue to Memory Box 📦
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
                <p class="text-white/90 mb-4">Close! The word "you" appears most often because every message is about YOU!</p>
                <p class="text-white/80 mb-6">Love is always about the other person! 💖</p>
                <button onclick="startMessageChallenge()" class="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-lg font-dancing text-lg hover:shadow-lg transition-all">
                    Try Again 💌
                </button>
            </div>
        `;
    }
}

function proceedToMemoryBox() {
    window.location.href = 'memory-box.html';
}

function playRevealSound() {
    // Simple audio feedback (can be enhanced with actual sound files)
    if (typeof(Audio) !== "undefined") {
        // Create a simple tone using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Silent fail if audio context not available
        }
    }
}

function createCompletionEffect() {
    const celebrationSymbols = ['🎉', '💖', '✨', '🌟', '💕', '💫'];
    const container = document.body;
    
    for (let i = 0; i < 25; i++) {
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

function createSuccessEffect() {
    const hearts = ['💖', '💕', '💗', '💘'];
    const container = document.body;
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = '1.5rem';
        heart.style.animation = 'heartFloat 2s ease-out forwards';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '10000';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 2000);
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
    
    @keyframes heartFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-80vh) scale(1.5);
        }
    }
`;
document.head.appendChild(style);

console.log('🚀 Message Wall page initialized');
