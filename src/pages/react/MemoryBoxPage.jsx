
import React, { useState, useEffect } from 'react';
import '../css/memory-box.css';

const MemoryBoxPage = () => {
    const [isBoxOpen, setIsBoxOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [memoryChallenge, setMemoryChallenge] = useState(null);
    const [challengeCompleted, setChallengeCompleted] = useState(false);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [viewedCategories, setViewedCategories] = useState(new Set());

    const memoryCategories = [
        {
            id: 1,
            name: "First Moments",
            icon: "🌟",
            color: "#FF6B9D",
            items: [
                "First text message exchange",
                "First phone call that lasted hours",
                "First time we said goodnight",
                "First compliment you gave me",
                "First inside joke we shared"
            ]
        },
        {
            id: 2,
            name: "Adventures",
            icon: "🎒",
            color: "#4ECDC4",
            items: [
                "Our first adventure together",
                "Getting lost but finding each other",
                "Trying new food together",
                "Dancing in the rain",
                "Watching sunrise from the hill"
            ]
        },
        {
            id: 3,
            name: "Quiet Moments",
            icon: "🕯️",
            color: "#45B7D1",
            items: [
                "Reading together in comfortable silence",
                "Cooking breakfast on Sunday morning",
                "Falling asleep during movie night",
                "Talking until 3 AM about everything",
                "Simply holding hands and walking"
            ]
        },
        {
            id: 4,
            name: "Silly Times",
            icon: "😄",
            color: "#96CEB4",
            items: [
                "Your terrible jokes that made me laugh",
                "Our ridiculous dance moves",
                "Singing off-key in the car",
                "Making funny faces at each other",
                "Our secret weird nicknames"
            ]
        },
        {
            id: 5,
            name: "Sweet Gestures",
            icon: "💝",
            color: "#FFEAA7",
            items: [
                "Surprise notes you left for me",
                "Your favorite way to make me smile",
                "Taking care of me when I was sick",
                "Remembering the little things I mentioned",
                "Your hugs that made everything better"
            ]
        },
        {
            id: 6,
            name: "Dreams Shared",
            icon: "✨",
            color: "#DDA0DD",
            items: [
                "Plans we made for our future",
                "Places we want to visit together",
                "Dreams we've shared late at night",
                "Goals we want to achieve as a team",
                "The family we hope to build"
            ]
        }
    ];

    const memoryChallenges = [
        {
            question: "Which category contains 'Dancing in the rain'?",
            options: ["First Moments", "Adventures", "Quiet Moments", "Silly Times"],
            correct: 1,
            categoryId: 2
        },
        {
            question: "What type of moments include 'Reading together in comfortable silence'?",
            options: ["Adventures", "Sweet Gestures", "Quiet Moments", "Dreams Shared"],
            correct: 2,
            categoryId: 3
        },
        {
            question: "Which category would 'Plans we made for our future' belong to?",
            options: ["Sweet Gestures", "Dreams Shared", "First Moments", "Adventures"],
            correct: 1,
            categoryId: 6
        }
    ];

    useEffect(() => {
        // Check completion status
        const completed = localStorage.getItem('memoryBoxCompleted') === 'true';
        setChallengeCompleted(completed);

        // Load saved progress
        const savedProgress = localStorage.getItem('memoryBoxProgress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                setViewedCategories(new Set(progress.viewedCategories || []));
                setIsBoxOpen(progress.isBoxOpen || false);
            } catch (error) {
                console.warn('Failed to load memory box progress:', error);
            }
        }
    }, []);

    const openBox = () => {
        if (!isBoxOpen) {
            setIsBoxOpen(true);
            createOpeningEffect();
            playOpeningSound();
            saveProgress();
        }
    };

    const createOpeningEffect = () => {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            color: #FFD700;
            animation: boxOpenEffect 2s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        effect.innerHTML = '✨🎁✨';
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 2000);
    };

    const playOpeningSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Play a magical opening sound
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            // Silent fail for audio
        }
    };

    const selectCategory = (category) => {
        setSelectedCategory(category);
        
        if (!viewedCategories.has(category.id)) {
            const newViewed = new Set(viewedCategories);
            newViewed.add(category.id);
            setViewedCategories(newViewed);
            
            createSparkleEffect(category);
            saveProgress(newViewed);
        }
    };

    const createSparkleEffect = (category) => {
        const categoryElement = document.querySelector(`[data-category-id="${category.id}"]`);
        if (!categoryElement) return;
        
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: 1.5rem;
                color: ${category.color};
                animation: sparkleFloat 2s ease-out forwards;
                pointer-events: none;
                z-index: 100;
            `;
            
            categoryElement.style.position = 'relative';
            categoryElement.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 2000);
        }
    };

    const startMemoryChallenge = () => {
        if (viewedCategories.size >= memoryCategories.length) {
            const randomChallenge = memoryChallenges[Math.floor(Math.random() * memoryChallenges.length)];
            setMemoryChallenge(randomChallenge);
            setShowChallengeModal(true);
        } else {
            alert(`📦 Please explore all ${memoryCategories.length} memory categories first! You've viewed ${viewedCategories.size} so far.`);
        }
    };

    const handleChallengeAnswer = (selectedIndex) => {
        if (selectedIndex === memoryChallenge.correct) {
            setChallengeCompleted(true);
            localStorage.setItem('memoryBoxCompleted', 'true');
            localStorage.setItem('memoryBoxCompletionTime', new Date().toISOString());
            setShowChallengeModal(false);
            
            createCelebrationEffect();
            
            setTimeout(() => {
                alert('🎉 Perfect memory! You truly know our story! Bucket List unlocked!');
            }, 1000);
        } else {
            alert('💭 Not quite right! Explore the memory categories more carefully...');
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
        
        const celebrationEmojis = ['📦', '💝', '✨', '🌟', '💫', '🎁', '💖', '🎉'];
        
        for (let i = 0; i < 40; i++) {
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
        }, 5000);
    };

    const saveProgress = (viewed = viewedCategories) => {
        const progress = {
            viewedCategories: Array.from(viewed),
            isBoxOpen: isBoxOpen,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('memoryBoxProgress', JSON.stringify(progress));
    };

    const unlockNextPage = () => {
        if (challengeCompleted) {
            window.location.href = '/bucket-list';
        } else {
            alert('📦 Complete the memory challenge first!');
        }
    };

    const getMemoryStats = () => {
        const totalMemories = memoryCategories.reduce((sum, cat) => sum + cat.items.length, 0);
        const viewedMemories = Array.from(viewedCategories).reduce((sum, catId) => {
            const category = memoryCategories.find(cat => cat.id === catId);
            return sum + (category ? category.items.length : 0);
        }, 0);
        
        return { totalMemories, viewedMemories };
    };

    const { totalMemories, viewedMemories } = getMemoryStats();

    return (
        <div className="memory-box-hero">
            <div className="memory-box-container">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-dancing gradient-text mb-4 animate-float">
                        📦 Memory Box 📦
                    </h1>
                    <p className="text-xl text-white/90 font-dancing mb-8">
                        A treasure chest of our beautiful moments together
                    </p>
                </div>

                {/* Memory Box 3D Container */}
                <div className="memory-box-3d">
                    <div className={`memory-box ${isBoxOpen ? 'open' : ''}`} onClick={openBox}>
                        <div className="box-lid">
                            <div className="lid-decoration">💝</div>
                        </div>
                        <div className="box-body">
                            <div className="box-interior">
                                {!isBoxOpen && (
                                    <div className="box-prompt">
                                        Click to open! ✨
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Memory Categories Grid */}
                {isBoxOpen && (
                    <div className="memory-categories">
                        <div className="categories-header">
                            <h3 className="text-2xl font-dancing text-white mb-4">
                                💖 Our Memory Categories 💖
                            </h3>
                            <div className="memory-stats">
                                <span>{viewedCategories.size}/{memoryCategories.length} Categories Explored</span>
                                <span>{viewedMemories}/{totalMemories} Memories Discovered</span>
                            </div>
                        </div>
                        
                        <div className="categories-grid">
                            {memoryCategories.map((category) => (
                                <div
                                    key={category.id}
                                    data-category-id={category.id}
                                    className={`category-card ${viewedCategories.has(category.id) ? 'viewed' : ''}`}
                                    style={{ borderColor: category.color }}
                                    onClick={() => selectCategory(category)}
                                >
                                    <div className="category-icon" style={{ color: category.color }}>
                                        {category.icon}
                                    </div>
                                    <div className="category-name">{category.name}</div>
                                    <div className="category-count">{category.items.length} memories</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected Category Details */}
                {selectedCategory && (
                    <div className="category-details">
                        <div className="details-header">
                            <span className="details-icon" style={{ color: selectedCategory.color }}>
                                {selectedCategory.icon}
                            </span>
                            <h3 className="details-title">{selectedCategory.name}</h3>
                        </div>
                        <div className="memory-items">
                            {selectedCategory.items.map((item, index) => (
                                <div key={index} className="memory-item">
                                    <span className="memory-bullet">💕</span>
                                    <span className="memory-text">{item}</span>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="close-details"
                            onClick={() => setSelectedCategory(null)}
                        >
                            Close ✕
                        </button>
                    </div>
                )}

                {/* Memory Challenge Section */}
                {isBoxOpen && (
                    <div className="challenge-section">
                        <h3 className="text-2xl font-dancing text-white mb-4">
                            💭 Memory Challenge 💭
                        </h3>
                        <p className="text-white/80 mb-6">
                            Test your knowledge of our categorized memories
                        </p>
                        <button 
                            className="challenge-btn"
                            onClick={startMemoryChallenge}
                            disabled={viewedCategories.size < memoryCategories.length}
                        >
                            {viewedCategories.size >= memoryCategories.length ? '🧠 Start Memory Challenge 🧠' : '📦 Explore All Categories First 📦'}
                        </button>
                    </div>
                )}

                {/* Unlock Section */}
                {isBoxOpen && (
                    <div className="unlock-section">
                        <h3 className="text-2xl font-dancing text-white mb-4">
                            {challengeCompleted ? '🎉 Memory Challenge Completed! 🎉' : '📦 Complete All Memories 📦'}
                        </h3>
                        <p className="text-white/80 mb-6">
                            {challengeCompleted 
                                ? "Incredible memory! Ready to explore our bucket list?"
                                : "Discover all our memory categories and complete the challenge!"
                            }
                        </p>
                        <button 
                            className={`unlock-btn ${challengeCompleted ? 'enabled' : 'disabled'}`}
                            onClick={unlockNextPage}
                            disabled={!challengeCompleted}
                        >
                            {challengeCompleted ? '📝 Continue to Bucket List 📝' : '💭 Complete Memory Challenge First 💭'}
                        </button>
                    </div>
                )}
            </div>

            {/* Memory Challenge Modal */}
            {showChallengeModal && memoryChallenge && (
                <div className="challenge-modal">
                    <div className="modal-content">
                        <h3 className="modal-title">💭 Memory Challenge</h3>
                        <p className="modal-question">{memoryChallenge.question}</p>
                        <div className="modal-options">
                            {memoryChallenge.options.map((option, index) => (
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
const memoryBoxStyles = `
    @keyframes boxOpenEffect {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
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
if (typeof document !== 'undefined' && !document.getElementById('memory-box-animations')) {
    const style = document.createElement('style');
    style.id = 'memory-box-animations';
    style.textContent = memoryBoxStyles;
    document.head.appendChild(style);
}

export default MemoryBoxPage;
