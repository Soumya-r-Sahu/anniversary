
import React, { useState, useEffect, useRef } from 'react';
import '../css/timeline.css';

const TimelinePage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timeChallenge, setTimeChallenge] = useState(null);
    const [challengeCompleted, setChallengeCompleted] = useState(false);
    const [heartsCount, setHeartsCount] = useState(0);
    const floatingHeartsRef = useRef(null);

    useEffect(() => {
        // Update time every second
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Generate time challenge
        generateTimeChallenge();

        // Create floating hearts
        createFloatingHearts();

        // Check completion status
        const completed = localStorage.getItem('timelineCompleted') === 'true';
        setChallengeCompleted(completed);

        return () => {
            clearInterval(timeInterval);
        };
    }, []);

    const generateTimeChallenge = () => {
        const challenges = [
            { question: "What time did we first meet?", answer: "14:30", hint: "It was in the afternoon..." },
            { question: "What time was our first kiss?", answer: "20:15", hint: "It was in the evening..." },
            { question: "What time do we usually say good morning?", answer: "07:00", hint: "Early morning..." },
            { question: "What time is our daily video call?", answer: "21:00", hint: "After dinner time..." }
        ];
        
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        setTimeChallenge(randomChallenge);
    };

    const createFloatingHearts = () => {
        if (!floatingHeartsRef.current) return;

        const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '💘', '💟', '❤️'];
        
        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
            
            floatingHeartsRef.current?.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
            }, 7000);
            
            setHeartsCount(prev => prev + 1);
        }, 1000);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleChallengeSubmit = (answer) => {
        if (answer === timeChallenge?.answer) {
            setChallengeCompleted(true);
            localStorage.setItem('timelineCompleted', 'true');
            localStorage.setItem('timelineCompletionTime', new Date().toISOString());
            
            // Show success message
            alert('🎉 Perfect! Time challenge completed! You can now access the Milestones!');
        } else {
            alert(`⏰ Not quite right! ${timeChallenge?.hint}`);
        }
    };

    const unlockNextPage = () => {
        if (challengeCompleted) {
            window.location.href = '/milestones';
        } else {
            alert('⏰ Complete the time challenge first!');
        }
    };

    return (
        <div className="timeline-hero">
            <div className="floating-hearts" ref={floatingHeartsRef}></div>
            
            <div className="timeline-container">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-dancing gradient-text mb-4 animate-float">
                        ⏰ Our Time Together ⏰
                    </h1>
                    <p className="text-xl text-white/90 font-dancing mb-8">
                        Every second with you is precious and counted
                    </p>
                </div>

                {/* Real-time Clock */}
                <div className="clock-section">
                    <div className="digital-clock">
                        <div className="time-display">{formatTime(currentTime)}</div>
                        <div className="date-display">{formatDate(currentTime)}</div>
                    </div>
                    
                    <div className="time-stats">
                        <div className="stat-item">
                            <div className="stat-number">{heartsCount}</div>
                            <div className="stat-label">Hearts Floating</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{Math.floor((new Date() - new Date('2024-01-01')) / (1000 * 60 * 60 * 24))}</div>
                            <div className="stat-label">Days Together</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{Math.floor((new Date() - new Date('2024-01-01')) / (1000 * 60 * 60))}</div>
                            <div className="stat-label">Hours of Love</div>
                        </div>
                    </div>
                </div>

                {/* Time Challenge */}
                {timeChallenge && !challengeCompleted && (
                    <div className="challenge-section">
                        <h3 className="text-2xl font-dancing text-white mb-4">
                            ⏰ Time Challenge ⏰
                        </h3>
                        <div className="challenge-card">
                            <p className="challenge-question">{timeChallenge.question}</p>
                            <div className="challenge-input">
                                <input 
                                    type="time" 
                                    className="time-input"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleChallengeSubmit(e.target.value);
                                        }
                                    }}
                                />
                            </div>
                            <p className="challenge-hint">{timeChallenge.hint}</p>
                        </div>
                    </div>
                )}

                {/* Time Milestones Preview */}
                <div className="milestones-preview">
                    <h3 className="text-2xl font-dancing text-white mb-4">
                        🕰️ Special Moments in Time 🕰️
                    </h3>
                    <div className="preview-grid">
                        <div className="preview-item">
                            <span className="preview-icon">🌅</span>
                            <div className="preview-text">First Meeting: 2:30 PM</div>
                        </div>
                        <div className="preview-item">
                            <span className="preview-icon">💕</span>
                            <div className="preview-text">First Kiss: 8:15 PM</div>
                        </div>
                        <div className="preview-item">
                            <span className="preview-icon">🌙</span>
                            <div className="preview-text">First "I Love You": 11:11 PM</div>
                        </div>
                    </div>
                </div>

                {/* Unlock Section */}
                <div className="unlock-section">
                    <h3 className="text-2xl font-dancing text-white mb-4">
                        {challengeCompleted ? '🎉 Time Challenge Completed! 🎉' : '⏰ Complete the Time Challenge ⏰'}
                    </h3>
                    <p className="text-white/80 mb-6">
                        {challengeCompleted 
                            ? "Perfect timing! Ready to explore our relationship milestones?"
                            : "Show your knowledge of our special times together!"
                        }
                    </p>
                    <button 
                        className={`unlock-btn ${challengeCompleted ? 'enabled' : 'disabled'}`}
                        onClick={unlockNextPage}
                        disabled={!challengeCompleted}
                    >
                        {challengeCompleted ? '📅 Continue to Milestones 📅' : '⏰ Complete Challenge First ⏰'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimelinePage;
