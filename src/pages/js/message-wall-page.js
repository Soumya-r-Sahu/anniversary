// Message Wall JavaScript
class MessageWall {
    constructor() {
        this.messages = [
            {
                emoji: "💕",
                text: "From the moment I met you, I knew my heart had found its home. Every day with you feels like a beautiful dream come true.",
                author: "Jerry to Soumya"
            },
            {
                emoji: "🌟",
                text: "You light up my world in ways I never thought possible. Your smile is my favorite sunrise, your laugh my favorite song.",
                author: "Soumya to Jerry"
            },
            {
                emoji: "🌹",
                text: "In a garden full of flowers, you'd still be the one I'd pick. You're not just my love, you're my entire universe.",
                author: "Jerry to Soumya"
            },
            {
                emoji: "✨",
                text: "Every moment spent with you is a moment I treasure. You make ordinary days feel extraordinary just by being in them.",
                author: "Soumya to Jerry"
            },
            {
                emoji: "🎈",
                text: "You're the reason I believe in forever. With you, every day is Valentine's Day, every night is magical.",
                author: "Jerry to Soumya"
            },
            {
                emoji: "🦋",
                text: "You gave me butterflies from day one, and they still haven't settled. I hope they never do because loving you feels like flying.",
                author: "Soumya to Jerry"
            },
            {
                emoji: "🌙",
                text: "I love you to the moon and back, but that's not far enough. I love you to the edge of the universe and beyond.",
                author: "Jerry to Soumya"
            },
            {
                emoji: "☀️",
                text: "You're my sunshine on cloudy days, my strength when I'm weak, and my happiness when I'm sad. You complete me.",
                author: "Soumya to Jerry"
            },
            {
                emoji: "🎭",
                text: "Life with you is the greatest adventure. Every chapter we write together is better than the last.",
                author: "Jerry to Soumya"
            },
            {
                emoji: "🎨",
                text: "You paint my world in the most beautiful colors. Before you, everything was black and white. Now it's a masterpiece.",
                author: "Soumya to Jerry"
            },
            {
                emoji: "🎵",
                text: "You're the melody to my heart's song, the rhythm to my soul's dance. Together we create the most beautiful music.",
                author: "Jerry to Soumya"
            },
            {
                emoji: "🏠",
                text: "Home isn't a place when you're with me; it's a feeling. Wherever you are, that's where I belong, that's where I'm home.",
                author: "Soumya to Jerry"
            }
        ];
        
        this.revealedCount = 0;
        this.totalMessages = this.messages.length;
        
        this.init();
    }
    
    init() {
        this.createMessageCards();
        this.updateProgress();
        this.startFloatingHearts();
        this.addSparkleStyles();
    }
    
    createMessageCards() {
        const grid = document.getElementById('messageGrid');
        
        this.messages.forEach((message, index) => {
            const card = document.createElement('div');
            card.className = 'message-card';
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="glow-effect"></div>
                <div class="message-emoji">${message.emoji}</div>
                <div class="message-text">${message.text}</div>
                <div class="message-author">- ${message.author}</div>
            `;
            
            // Add hover event listener
            card.addEventListener('mouseenter', () => this.revealMessage(card, index));
            
            grid.appendChild(card);
        });
    }
    
    revealMessage(card, index) {
        if (!card.classList.contains('revealed')) {
            card.classList.add('revealed');
            this.revealedCount++;
            this.updateProgress();
            
            // Create sparkle effect
            this.createSparkleEffect(card);
            
            // Check if all messages are revealed
            if (this.revealedCount === this.totalMessages) {
                setTimeout(() => this.showUnlockNotice(), 1000);
            }
        }
    }
    
    createSparkleEffect(card) {
        const sparkles = ['✨', '💫', '⭐', '🌟'];
        
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.cssText = `
                    position: absolute;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: 1.5rem;
                    pointer-events: none;
                    animation: sparkleFloat 2s ease-out forwards;
                    z-index: 100;
                `;
                
                card.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 2000);
            }, i * 200);
        }
    }
    
    updateProgress() {
        const progress = (this.revealedCount / this.totalMessages) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('revealedCount').textContent = this.revealedCount;
        document.getElementById('totalMessages').textContent = this.totalMessages;
    }
    
    showUnlockNotice() {
        document.getElementById('unlockNotice').style.display = 'block';
        document.getElementById('unlockNotice').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Save unlock state
        localStorage.setItem('message-wall-completed', 'true');
        localStorage.setItem('memory-box-unlocked', 'true');
    }
    
    startFloatingHearts() {
        setInterval(() => {
            this.createFloatingHeart();
        }, 3000);
        
        // Initial hearts
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.createFloatingHeart(), i * 1000);
        }
    }
    
    createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = ['💕', '💖', '💗', '💝'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 6) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        
        document.getElementById('floatingHearts').appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }
    
    addSparkleStyles() {
        // Add sparkle animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkleFloat {
                0% {
                    transform: translateY(0) scale(0);
                    opacity: 1;
                }
                50% {
                    transform: translateY(-30px) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-60px) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Global function for unlock button
function unlockMemoryBox() {
    const button = event.target;
    button.innerHTML = 'Opening Memory Box... 📦';
    button.disabled = true;
    
    setTimeout(() => {
        window.location.href = 'memory-box.html';
    }, 1000);
}

// Check if page is unlocked
function checkAccess() {
    const messageWallUnlocked = localStorage.getItem('message-wall-unlocked');
    if (!messageWallUnlocked) {
        window.location.href = 'puzzle.html';
        return;
    }
}

// Initialize message wall
document.addEventListener('DOMContentLoaded', function() {
    checkAccess();
    window.messageWall = new MessageWall();
    
    console.log('💌 Message wall initialized');
});

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Initialize unified systems when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Unified systems loaded for message-wall');
});
