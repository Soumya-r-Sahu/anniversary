// Timeline Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check unlock status
    const countdownUnlocked = localStorage.getItem('countdownCompleted') === 'true';
    
    if (!countdownUnlocked) {
        alert('🔒 Please complete the Countdown first to access the Timeline!');
        window.location.href = 'countdown.html';
        return;
    }
    
    initializeTimeline();
});

let timelineUnlocked = false;

function initializeTimeline() {
    // Start the real-time clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Create floating hearts
    createFloatingHearts();
    
    // Initialize unlock button
    const unlockBtn = document.getElementById('unlockTimelineBtn');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', startUnlockChallenge);
    }
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('currentTime').textContent = timeString;
    document.getElementById('currentDate').textContent = dateString;
}

function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    const heartSymbols = ['💖', '💕', '💗', '💓', '💝', '💘'];
    
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heartsContainer.appendChild(heart);
    }
}

function startUnlockChallenge() {
    const challengeText = document.getElementById('challengeText');
    const unlockBtn = document.getElementById('unlockTimelineBtn');
    
    if (timelineUnlocked) {
        window.location.href = 'milestones.html';
        return;
    }
    
    // Start the time-based challenge
    challengeText.innerHTML = `
        <p class="text-white/90 mb-4">
            ⏰ <strong>Time Challenge:</strong> Look at the clock above and tell me...
        </p>
        <p class="text-2xl font-dancing text-white mb-6">
            "What time will it be in exactly 2 minutes from now?"
        </p>
        <input type="text" id="timeAnswer" placeholder="Enter time (e.g., 3:45 PM)" 
               class="w-full p-3 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/70 text-center text-lg mb-4">
        <button onclick="checkTimeAnswer()" class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-dancing text-xl hover:shadow-lg transition-all">
            Submit Answer ⏰
        </button>
    `;
}

function checkTimeAnswer() {
    const userAnswer = document.getElementById('timeAnswer').value.trim();
    const now = new Date();
    const futureTime = new Date(now.getTime() + 2 * 60000); // Add 2 minutes
    
    const correctTime = futureTime.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
    });
    
    // Flexible answer checking
    const userTime = userAnswer.toLowerCase().replace(/\s+/g, '');
    const correctTimeFormatted = correctTime.toLowerCase().replace(/\s+/g, '');
    
    if (userTime === correctTimeFormatted || 
        userAnswer.toLowerCase().includes(futureTime.getHours() % 12 || 12) &&
        userAnswer.includes(futureTime.getMinutes().toString().padStart(2, '0'))) {
        
        // Correct answer!
        timelineUnlocked = true;
        localStorage.setItem('timelineCompleted', 'true');
        
        document.getElementById('challengeText').innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-2xl font-dancing text-white mb-4">Perfect! Time Challenge Completed!</h3>
                <p class="text-white/90 mb-6">You've proven you can keep track of time in your relationship!</p>
                <button onclick="proceedToMilestones()" class="bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-8 rounded-full font-dancing text-xl hover:shadow-lg transition-all">
                    🌟 Continue to Milestones 🌟
                </button>
            </div>
        `;
        
        // Show success effect
        createSuccessEffect();
        
    } else {
        // Wrong answer
        document.getElementById('challengeText').innerHTML = `
            <div class="text-center">
                <div class="text-4xl mb-4">⏰</div>
                <p class="text-white/90 mb-4">Not quite right! The correct time in 2 minutes will be: <strong>${correctTime}</strong></p>
                <p class="text-white/80 mb-6">Try again with the current time!</p>
                <button onclick="startUnlockChallenge()" class="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-lg font-dancing text-lg hover:shadow-lg transition-all">
                    Try Again ⏰
                </button>
            </div>
        `;
    }
}

function proceedToMilestones() {
    window.location.href = 'milestones.html';
}

function createSuccessEffect() {
    const celebrationSymbols = ['🎉', '⭐', '💖', '⏰', '🌟', '💫'];
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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

console.log('🚀 Timeline page initialized');
