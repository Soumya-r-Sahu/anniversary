
import React, { useState, useEffect } from 'react';
import '../css/quiz.css';

const QuizPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const questions = [
        {
            id: 1,
            question: "What was the first thing you noticed about me?",
            options: ["Your smile", "Your eyes", "Your laugh", "Your kindness"],
            correct: 0,
            explanation: "Your beautiful smile was the first thing that caught my attention and made my heart skip a beat! 😊"
        },
        {
            id: 2,
            question: "What's my favorite way to spend a Sunday morning with you?",
            options: ["Cooking breakfast together", "Sleeping in and cuddling", "Going for a walk", "Reading together"],
            correct: 1,
            explanation: "Those lazy Sunday mornings cuddling together are pure magic - no place I'd rather be! 💕"
        },
        {
            id: 3,
            question: "What song makes me think of you every time?",
            options: ["Perfect by Ed Sheeran", "All of Me by John Legend", "Thinking Out Loud", "A Thousand Years"],
            correct: 2,
            explanation: "'Thinking Out Loud' perfectly captures how I feel about growing old with you! 🎵"
        },
        {
            id: 4,
            question: "What's the sweetest thing I've ever done for you?",
            options: ["Surprise date night", "Handwritten love letters", "Cooking your favorite meal", "Remembering small details"],
            correct: 3,
            explanation: "The way you remember the tiniest details about what I love shows how much you care! 💝"
        },
        {
            id: 5,
            question: "What's my biggest dream for our future?",
            options: ["Traveling the world", "Building a family", "Buying a house", "Growing old together"],
            correct: 3,
            explanation: "More than anything, I dream of growing old with you, sharing every moment of this beautiful life! 👫"
        },
        {
            id: 6,
            question: "What's my love language?",
            options: ["Words of affirmation", "Physical touch", "Quality time", "Acts of service"],
            correct: 2,
            explanation: "Spending quality time together, being fully present with each other - that's how I feel most loved! ⏰"
        },
        {
            id: 7,
            question: "What makes me laugh the most?",
            options: ["Your silly jokes", "Funny movies", "Our inside jokes", "Your funny faces"],
            correct: 2,
            explanation: "Our inside jokes are the best - they're uniquely ours and always make me burst out laughing! 😄"
        },
        {
            id: 8,
            question: "What's my favorite memory of us so far?",
            options: ["Our first date", "First 'I love you'", "Moving in together", "Every quiet moment"],
            correct: 3,
            explanation: "Every quiet moment we share feels like magic - they're all my favorite memories! ✨"
        },
        {
            id: 9,
            question: "What do I love most about you?",
            options: ["Your humor", "Your kindness", "Your heart", "Everything"],
            correct: 3,
            explanation: "I love absolutely everything about you - you're perfect just as you are! 💖"
        },
        {
            id: 10,
            question: "How do you make me feel?",
            options: ["Happy", "Loved", "Complete", "Home"],
            correct: 3,
            explanation: "You make me feel like I'm home, no matter where we are. You're my safe place! 🏠"
        }
    ];

    useEffect(() => {
        // Check completion status
        const completed = localStorage.getItem('quizCompleted') === 'true';
        setQuizCompleted(completed);

        // Start timer when quiz begins
        if (!completed && !isTimerRunning) {
            setIsTimerRunning(true);
        }
    }, [isTimerRunning]);

    useEffect(() => {
        let timer;
        if (isTimerRunning && timeRemaining > 0 && !showResults) {
            timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
        } else if (timeRemaining === 0 && !showResults) {
            // Time's up!
            handleTimeUp();
        }

        return () => clearTimeout(timer);
    }, [timeRemaining, isTimerRunning, showResults]);

    const handleTimeUp = () => {
        setIsTimerRunning(false);
        calculateScore();
        setShowResults(true);
        alert('⏰ Time\'s up! Let\'s see how you did!');
    };

    const handleAnswerSelect = (answerIndex) => {
        if (showResults) return;

        const newAnswers = [...userAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setUserAnswers(newAnswers);
        
        // Create answer effect
        createAnswerEffect(answerIndex === questions[currentQuestion].correct);
        
        // Move to next question after a brief delay
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                // Quiz completed
                finishQuiz(newAnswers);
            }
        }, 1000);
    };

    const createAnswerEffect = (isCorrect) => {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            z-index: 1000;
            animation: answerEffect 1s ease-out forwards;
            pointer-events: none;
        `;
        effect.innerHTML = isCorrect ? '✅' : '❤️';
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 1000);
    };

    const finishQuiz = (answers) => {
        setIsTimerRunning(false);
        setUserAnswers(answers);
        calculateScore(answers);
        setShowResults(true);
    };

    const calculateScore = (answers = userAnswers) => {
        let correct = 0;
        answers.forEach((answer, index) => {
            if (answer === questions[index]?.correct) {
                correct++;
            }
        });
        
        // Bonus points for time remaining
        const timeBonus = Math.floor(timeRemaining / 10);
        const finalScore = (correct * 10) + timeBonus;
        
        setScore(finalScore);
        
        // Mark quiz as completed
        setQuizCompleted(true);
        localStorage.setItem('quizCompleted', 'true');
        localStorage.setItem('quizScore', finalScore.toString());
        localStorage.setItem('quizCorrectAnswers', correct.toString());
        localStorage.setItem('quizCompletionTime', new Date().toISOString());
        
        return { correct, finalScore };
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setUserAnswers([]);
        setShowResults(false);
        setScore(0);
        setTimeRemaining(300);
        setIsTimerRunning(true);
    };

    const unlockNextPage = () => {
        if (quizCompleted) {
            // Create celebration effect
            createCelebrationEffect();
            
            setTimeout(() => {
                window.location.href = '/starmap'; // Next page to be created
            }, 2000);
        } else {
            alert('🧠 Complete the quiz first!');
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
        
        const celebrationEmojis = ['🧠', '💖', '🎉', '⭐', '✨', '💫', '🏆', '👫'];
        
        for (let i = 0; i < 50; i++) {
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

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getScoreMessage = () => {
        const correct = userAnswers.filter((answer, index) => answer === questions[index]?.correct).length;
        const percentage = (correct / questions.length) * 100;
        
        if (percentage >= 90) return "Perfect! You know me so well! 💖";
        if (percentage >= 70) return "Amazing! You really pay attention! 😍";
        if (percentage >= 50) return "Good job! You're learning about me! 😊";
        return "We have more to discover about each other! 💕";
    };

    if (showResults) {
        const correct = userAnswers.filter((answer, index) => answer === questions[index]?.correct).length;
        
        return (
            <div className="quiz-hero">
                <div className="quiz-container">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-dancing gradient-text mb-4 animate-float">
                            🎉 Quiz Results! 🎉
                        </h1>
                        
                        <div className="results-card">
                            <div className="score-display">
                                <div className="score-number">{score}</div>
                                <div className="score-label">Final Score</div>
                            </div>
                            
                            <div className="results-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{correct}</span>
                                    <span className="stat-label">Correct</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{questions.length - correct}</span>
                                    <span className="stat-label">Missed</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{Math.round((correct / questions.length) * 100)}%</span>
                                    <span className="stat-label">Accuracy</span>
                                </div>
                            </div>
                            
                            <div className="score-message">
                                {getScoreMessage()}
                            </div>
                            
                            <div className="results-actions">
                                <button className="action-btn secondary" onClick={restartQuiz}>
                                    🔄 Try Again
                                </button>
                                <button 
                                    className="action-btn primary"
                                    onClick={unlockNextPage}
                                >
                                    ⭐ Continue to Starmap ⭐
                                </button>
                            </div>
                        </div>
                        
                        {/* Answer Review */}
                        <div className="answer-review">
                            <h3 className="text-2xl font-dancing text-white mb-4">💖 Answer Explanations 💖</h3>
                            <div className="review-grid">
                                {questions.map((question, index) => (
                                    <div key={question.id} className="review-item">
                                        <div className="review-question">Q{index + 1}: {question.question}</div>
                                        <div className={`review-answer ${userAnswers[index] === question.correct ? 'correct' : 'incorrect'}`}>
                                            Your answer: {question.options[userAnswers[index]] || 'Not answered'}
                                            {userAnswers[index] === question.correct ? ' ✅' : ' ❌'}
                                        </div>
                                        {userAnswers[index] !== question.correct && (
                                            <div className="correct-answer">
                                                Correct: {question.options[question.correct]}
                                            </div>
                                        )}
                                        <div className="answer-explanation">{question.explanation}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-hero">
            <div className="quiz-container">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-dancing gradient-text mb-4 animate-float">
                        🧠 Love Quiz 🧠
                    </h1>
                    <p className="text-xl text-white/90 font-dancing mb-8">
                        Test how well you know our love story
                    </p>
                </div>

                {/* Quiz Progress */}
                <div className="quiz-progress">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                    <div className="progress-info">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span className="timer">⏰ {formatTime(timeRemaining)}</span>
                    </div>
                </div>

                {/* Current Question */}
                <div className="question-card">
                    <div className="question-number">Question {currentQuestion + 1}</div>
                    <div className="question-text">{questions[currentQuestion]?.question}</div>
                    
                    <div className="answer-options">
                        {questions[currentQuestion]?.options.map((option, index) => (
                            <button
                                key={index}
                                className="answer-btn"
                                onClick={() => handleAnswerSelect(index)}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                <span className="option-text">{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quiz Instructions */}
                <div className="quiz-instructions">
                    <h3 className="text-xl font-dancing text-white mb-4">How to Play:</h3>
                    <ul className="instruction-list">
                        <li>Answer all 10 questions about our relationship</li>
                        <li>You have 5 minutes to complete the quiz</li>
                        <li>Choose the answer that best represents our love story</li>
                        <li>Complete the quiz to unlock the starmap!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Add required CSS animations
const quizStyles = `
    @keyframes answerEffect {
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
    
    @keyframes celebrationFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('quiz-animations')) {
    const style = document.createElement('style');
    style.id = 'quiz-animations';
    style.textContent = quizStyles;
    document.head.appendChild(style);
}

export default QuizPage;
