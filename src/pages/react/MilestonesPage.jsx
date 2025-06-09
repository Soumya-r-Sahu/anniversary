
import React, { useState, useEffect, useRef } from 'react';
import '../css/milestones.css';

const MilestonesPage = () => {
    const [visibleMilestones, setVisibleMilestones] = useState(0);
    const [memoryChallenge, setMemoryChallenge] = useState(null);
    const [challengeCompleted, setChallengeCompleted] = useState(false);
    const [showMemoryModal, setShowMemoryModal] = useState(false);
    const milestonesRef = useRef([]);

    const milestones = [
        {
            id: 1,
            date: "January 15, 2024",
            title: "First Meeting",
            description: "The day our paths crossed and changed everything forever. A simple hello that started our beautiful journey.",
            icon: "🌟",
            memory: "I remember your smile lighting up the entire room..."
        },
        {
            id: 2,
            date: "February 14, 2024",
            title: "First Date",
            description: "Our magical first date filled with nervous butterflies, genuine laughter, and the beginning of something special.",
            icon: "💕",
            memory: "You looked absolutely stunning, and I was so nervous I could barely speak..."
        },
        {
            id: 3,
            date: "March 10, 2024",
            title: "First Kiss",
            description: "That perfect moment when time stood still and our hearts spoke the same language without words.",
            icon: "💋",
            memory: "Under the starlight, everything felt perfect and right..."
        },
        {
            id: 4,
            date: "April 22, 2024",
            title: "Said 'I Love You'",
            description: "The three words that changed everything, spoken with complete honesty and overwhelming emotion.",
            icon: "❤️",
            memory: "I had been feeling it for weeks, but saying it out loud made it real..."
        },
        {
            id: 5,
            date: "June 5, 2024",
            title: "First Trip Together",
            description: "Our adventure that showed us how perfectly we travel together and create memories.",
            icon: "✈️",
            memory: "Every moment was an adventure, every sunrise was more beautiful with you..."
        },
        {
            id: 6,
            date: "August 18, 2024",
            title: "Moving In Together",
            description: "The day we decided to build our daily life together, sharing space, dreams, and morning coffee.",
            icon: "🏠",
            memory: "Unpacking boxes together felt like unpacking our future..."
        },
        {
            id: 7,
            date: "October 30, 2024",
            title: "Met the Family",
            description: "The milestone where our love expanded to include the people who raised us and shaped who we are.",
            icon: "👨‍👩‍👧‍👦",
            memory: "Seeing you with my family made me fall in love all over again..."
        },
        {
            id: 8,
            date: "December 31, 2024",
            title: "New Year Promise",
            description: "As the clock struck midnight, we promised to face whatever the future holds together.",
            icon: "🎆",
            memory: "Looking into your eyes as the year changed, I saw our entire future..."
        }
    ];

    const memoryQuestions = [
        {
            question: "What was special about our first meeting?",
            options: ["Your smile", "The weather", "The location", "The time"],
            correct: 0,
            milestone: 1
        },
        {
            question: "How did I feel on our first date?",
            options: ["Confident", "Nervous", "Tired", "Hungry"],
            correct: 1,
            milestone: 2
        },
        {
            question: "When did we first say 'I love you'?",
            options: ["March", "April", "May", "June"],
            correct: 1,
            milestone: 4
        }
    ];

    useEffect(() => {
        // Check completion status
        const completed = localStorage.getItem('milestonesCompleted') === 'true';
        setChallengeCompleted(completed);

        // Setup intersection observer for scroll reveals
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const milestoneIndex = parseInt(entry.target.dataset.index);
                        if (milestoneIndex >= visibleMilestones) {
                            setVisibleMilestones(milestoneIndex + 1);
                            createSparkleEffect(entry.target);
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        milestonesRef.current.forEach(milestone => {
            if (milestone) observer.observe(milestone);
        });

        return () => observer.disconnect();
    }, [visibleMilestones]);

    const createSparkleEffect = (element) => {
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        
        for (let i = 0; i < 8; i++) {
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
            
            element.style.position = 'relative';
            element.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 2000);
        }
    };

    const startMemoryChallenge = () => {
        if (visibleMilestones >= milestones.length) {
            const randomQuestion = memoryQuestions[Math.floor(Math.random() * memoryQuestions.length)];
            setMemoryChallenge(randomQuestion);
            setShowMemoryModal(true);
        } else {
            alert(`📜 Please explore all ${milestones.length} milestones first! You've seen ${visibleMilestones} so far.`);
        }
    };

    const handleMemoryAnswer = (selectedIndex) => {
        if (selectedIndex === memoryChallenge.correct) {
            setChallengeCompleted(true);
            localStorage.setItem('milestonesCompleted', 'true');
            localStorage.setItem('milestonesCompletionTime', new Date().toISOString());
            setShowMemoryModal(false);
            alert('🎉 Perfect memory! You know our story so well! Puzzle game unlocked!');
        } else {
            alert('💭 Not quite right! Think about our special moments...');
        }
    };

    const unlockNextPage = () => {
        if (challengeCompleted) {
            window.location.href = '/puzzle';
        } else {
            alert('📜 Complete the memory challenge first!');
        }
    };

    const updateProgress = () => {
        const progressPercentage = (visibleMilestones / milestones.length) * 100;
        return Math.round(progressPercentage);
    };

    return (
        <div className="milestones-hero">
            <div className="milestones-container">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-dancing gradient-text mb-4 animate-float">
                        📅 Our Journey Together 📅
                    </h1>
                    <p className="text-xl text-white/90 font-dancing mb-8">
                        Every milestone is a treasure in our love story
                    </p>
                    
                    {/* Progress Indicator */}
                    <div className="progress-indicator">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${updateProgress()}%` }}
                            ></div>
                        </div>
                        <div className="progress-text">
                            {visibleMilestones}/{milestones.length} Milestones Discovered ({updateProgress()}%)
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="timeline">
                    {milestones.map((milestone, index) => (
                        <div
                            key={milestone.id}
                            ref={el => milestonesRef.current[index] = el}
                            data-index={index}
                            className={`milestone-item ${index < visibleMilestones ? 'visible' : ''}`}
                        >
                            <div className="milestone-icon">
                                <span>{milestone.icon}</span>
                            </div>
                            <div className="milestone-content">
                                <div className="milestone-date">{milestone.date}</div>
                                <h3 className="milestone-title">{milestone.title}</h3>
                                <p className="milestone-description">{milestone.description}</p>
                                <div className="milestone-memory">
                                    <em>"{milestone.memory}"</em>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Memory Challenge Section */}
                <div className="challenge-section">
                    <h3 className="text-2xl font-dancing text-white mb-4">
                        💭 Memory Challenge 💭
                    </h3>
                    <p className="text-white/80 mb-6">
                        Test your memory of our beautiful journey together
                    </p>
                    <button 
                        className="challenge-btn"
                        onClick={startMemoryChallenge}
                        disabled={visibleMilestones < milestones.length}
                    >
                        {visibleMilestones >= milestones.length ? '🧠 Start Memory Challenge 🧠' : '📜 Explore All Milestones First 📜'}
                    </button>
                </div>

                {/* Unlock Section */}
                <div className="unlock-section">
                    <h3 className="text-2xl font-dancing text-white mb-4">
                        {challengeCompleted ? '🎉 Memory Challenge Completed! 🎉' : '📜 Complete All Milestones 📜'}
                    </h3>
                    <p className="text-white/80 mb-6">
                        {challengeCompleted 
                            ? "Amazing memory! Ready for a fun puzzle game?"
                            : "Explore our journey and test your memory!"
                        }
                    </p>
                    <button 
                        className={`unlock-btn ${challengeCompleted ? 'enabled' : 'disabled'}`}
                        onClick={unlockNextPage}
                        disabled={!challengeCompleted}
                    >
                        {challengeCompleted ? '🧩 Continue to Puzzle 🧩' : '💭 Complete Memory Challenge First 💭'}
                    </button>
                </div>
            </div>

            {/* Memory Challenge Modal */}
            {showMemoryModal && memoryChallenge && (
                <div className="memory-modal">
                    <div className="modal-content">
                        <h3 className="modal-title">💭 Memory Challenge</h3>
                        <p className="modal-question">{memoryChallenge.question}</p>
                        <div className="modal-options">
                            {memoryChallenge.options.map((option, index) => (
                                <button
                                    key={index}
                                    className="option-btn"
                                    onClick={() => handleMemoryAnswer(index)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button 
                            className="modal-close"
                            onClick={() => setShowMemoryModal(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MilestonesPage;
