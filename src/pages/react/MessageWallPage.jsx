
import React, { useState, useEffect } from 'react';
import '../css/message-wall.css';

const MessageWallPage = () => {
    const [revealedMessages, setRevealedMessages] = useState(new Set());
    const [loveChallenge, setLoveChallenge] = useState(null);
    const [challengeCompleted, setChallengeCompleted] = useState(false);
    const [showChallengeModal, setShowChallengeModal] = useState(false);

    const messages = [
        {
            id: 1,
            text: "Every sunrise is more beautiful when I imagine sharing it with you ☀️",
            author: "Jerry",
            theme: "morning"
        },
        {
            id: 2,
            text: "Your laugh is my favorite melody, and I want to hear it every day 🎵",
            author: "Soumya",
            theme: "joy"
        },
        {
            id: 3,
            text: "In your eyes, I found my home and my adventure all at once 🏡✨",
            author: "Jerry",
            theme: "home"
        },
        {
            id: 4,
            text: "You make ordinary moments feel like magic, and magic feel possible 💫",
            author: "Soumya",
            theme: "magic"
        },
        {
            id: 5,
            text: "I love how you see the world - with kindness, wonder, and endless hope 🌍💕",
            author: "Jerry",
            theme: "perspective"
        },
        {
            id: 6,
            text: "Your hand in mine feels like the missing piece I never knew I needed 🧩❤️",
            author: "Soumya",
            theme: "connection"
        },
        {
            id: 7,
            text: "Every day with you is a new page in our beautiful love story 📖💝",
            author: "Jerry",
            theme: "story"
        },
        {
            id: 8,
            text: "You're not just my love, you're my best friend, my partner in everything 👫💕",
            author: "Soumya",
            theme: "friendship"
        },
        {
            id: 9,
            text: "The way you care about the little things makes me love you even more 🌺",
            author: "Jerry",
            theme: "care"
        },
        {
            id: 10,
            text: "With you, I've learned that love isn't just a feeling - it's a choice we make every day 💑",
            author: "Soumya",
            theme: "commitment"
        },
        {
            id: 11,
            text: "You make me want to be the best version of myself, not by changing me, but by believing in me 🌟",
            author: "Jerry",
            theme: "growth"
        },
        {
            id: 12,
            text: "Forever isn't long enough for all the love I want to give you 💖∞",
            author: "Soumya",
            theme: "forever"
        }
    ];

    const loveChallenges = [
        {
            question: "Complete this message: 'Your laugh is my favorite...'",
            options: ["song", "melody", "sound", "music"],
            correct: 1,
            messageId: 2
        },
        {
            question: "What did Jerry find in Soumya's eyes?",
            options: ["love", "home and adventure", "the future", "happiness"],
            correct: 1,
            messageId: 3
        },
        {
            question: "According to the messages, love is described as what kind of choice?",
            options: ["difficult", "daily", "important", "special"],
            correct: 1,
            messageId: 10
        }
    ];

    useEffect(() => {
        // Check completion status
        const completed = localStorage.getItem('messageWallCompleted') === 'true';
        setChallengeCompleted(completed);

        // Load saved progress
        const savedProgress = localStorage.getItem('messageWallProgress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                setRevealedMessages(new Set(progress.revealedMessages || []));
            } catch (error) {
                console.warn('Failed to load message wall progress:', error);
            }
        }
    }, []);

    const revealMessage = (messageId) => {
        if (!revealedMessages.has(messageId)) {
            const newRevealed = new Set(revealedMessages);
            newRevealed.add(messageId);
            setRevealedMessages(newRevealed);
            
            // Create sparkle effect
            createSparkleEffect(messageId);
            
            // Play reveal sound
            playRevealSound();
            
            // Save progress
            saveProgress(newRevealed);
            
            // Check if all messages revealed
            if (newRevealed.size >= messages.length) {
                setTimeout(() => {
                    alert('💌 All messages revealed! Ready for the love challenge?');
                }, 1000);
            }
        }
    };

    const createSparkleEffect = (messageId) => {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (!messageElement) return;
        
        const sparkles = ['✨', '⭐', '💫', '🌟', '💖', '💕'];
        
        for (let i = 0; i < 10; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: 1.5rem;
                color: #FFD700;
                animation: sparkleFloat 2s ease-out forwards;
                pointer-events: none;
                z-index: 100;
            `;
            
            messageElement.style.position = 'relative';
            messageElement.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 2000);
        }
    };

    const playRevealSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.1); // G5
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            // Silent fail for audio
        }
    };

    const startLoveChallenge = () => {
        if (revealedMessages.size >= messages.length) {
            const randomChallenge = loveChallenges[Math.floor(Math.random() * loveChallenges.length)];
            setLoveChallenge(randomChallenge);
            setShowChallengeModal(true);
        } else {
            alert(`💌 Please reveal all ${messages.length} messages first! You've found ${revealedMessages.size} so far.`);
        }
    };

    const handleChallengeAnswer = (selectedIndex) => {
        if (selectedIndex === loveChallenge.correct) {
            setChallengeCompleted(true);
            localStorage.setItem('messageWallCompleted', 'true');
            localStorage.setItem('messageWallCompletionTime', new Date().toISOString());
            setShowChallengeModal(false);
            
            // Create celebration effect
            createCelebrationEffect();
            
            setTimeout(() => {
                alert('💕 Perfect! You truly understand our love language! Memory Box unlocked!');
            }, 1000);
        } else {
            alert('💭 Not quite right! Read the messages more carefully...');
        }
    };

    const createCelebrationEffect = () => {
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
        
        const celebrationEmojis = ['💌', '💕', '💖', '✨', '🌟', '💫', '❤️', '💝'];
        
        for (let i = 0; i < 30; i++) {
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
        
        setTimeout(() => {
            if (celebrationContainer.parentNode) {
                celebrationContainer.remove();
            }
        }, 4000);
    };

    const saveProgress = (revealed) => {
        const progress = {
            revealedMessages: Array.from(revealed),
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('messageWallProgress', JSON.stringify(progress));
    };

    const unlockNextPage = () => {
        if (challengeCompleted) {
            window.location.href = '/memory-box';
        } else {
            alert('💌 Complete the love challenge first!');
        }
    };

    const getProgressPercentage = () => {
        return Math.round((revealedMessages.size / messages.length) * 100);
    };

    return (
        <div className="message-wall-hero">
            <div className="message-wall-container">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-dancing gradient-text mb-4 animate-float">
                        💌 Wall of Love 💌
                    </h1>
                    <p className="text-xl text-white/90 font-dancing mb-8">
                        Discover the beautiful messages we've shared
                    </p>
                    
                    {/* Progress Indicator */}
                    <div className="progress-indicator">
                        <div className="progress-text">
                            {revealedMessages.size}/{messages.length} Messages Revealed ({getProgressPercentage()}%)
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${getProgressPercentage()}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Message Grid */}
                <div className="message-grid">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            data-message-id={message.id}
                            className={`message-card ${message.theme} ${revealedMessages.has(message.id) ? 'revealed' : ''}`}
                            onClick={() => revealMessage(message.id)}
                        >
                            <div className="message-front">
                                <div className="message-icon">💌</div>
                                <div className="message-hint">Click to reveal</div>
                            </div>
                            <div className="message-back">
                                <div className="message-text">"{message.text}"</div>
                                <div className="message-author">- {message.author}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Love Challenge Section */}
                <div className="challenge-section">
                    <h3 className="text-2xl font-dancing text-white mb-4">
                        💕 Love Challenge 💕
                    </h3>
                    <p className="text-white/80 mb-6">
                        Test your knowledge of our beautiful messages
                    </p>
                    <button 
                        className="challenge-btn"
                        onClick={startLoveChallenge}
                        disabled={revealedMessages.size < messages.length}
                    >
                        {revealedMessages.size >= messages.length ? '❤️ Start Love Challenge ❤️' : '💌 Reveal All Messages First 💌'}
                    </button>
                </div>

                {/* Unlock Section */}
                <div className="unlock-section">
                    <h3 className="text-2xl font-dancing text-white mb-4">
                        {challengeCompleted ? '🎉 Love Challenge Completed! 🎉' : '💌 Complete All Messages 💌'}
                    </h3>
                    <p className="text-white/80 mb-6">
                        {challengeCompleted 
                            ? "Amazing! Ready to explore our memory box?"
                            : "Discover all our love messages and complete the challenge!"
                        }
                    </p>
                    <button 
                        className={`unlock-btn ${challengeCompleted ? 'enabled' : 'disabled'}`}
                        onClick={unlockNextPage}
                        disabled={!challengeCompleted}
                    >
                        {challengeCompleted ? '📦 Continue to Memory Box 📦' : '💕 Complete Love Challenge First 💕'}
                    </button>
                </div>
            </div>

            {/* Love Challenge Modal */}
            {showChallengeModal && loveChallenge && (
                <div className="challenge-modal">
                    <div className="modal-content">
                        <h3 className="modal-title">💕 Love Challenge</h3>
                        <p className="modal-question">{loveChallenge.question}</p>
                        <div className="modal-options">
                            {loveChallenge.options.map((option, index) => (
                                <button
                                    key={index}
                                    className="option-btn"
                                    onClick={() => handleChallengeAnswer(index)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button 
                            className="modal-close"
                            onClick={() => setShowChallengeModal(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Add required CSS animations
const messageWallStyles = `
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
    
    @keyframes celebrationFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('message-wall-animations')) {
    const style = document.createElement('style');
    style.id = 'message-wall-animations';
    style.textContent = messageWallStyles;
    document.head.appendChild(style);
}

export default MessageWallPage;
