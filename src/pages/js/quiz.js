// Quiz Page JavaScript

// Check if user has access to this page
document.addEventListener('DOMContentLoaded', function() {
    // Check unlock status
    const bucketListUnlocked = localStorage.getItem('bucketListCompleted') === 'true';
    
    if (!bucketListUnlocked) {
        // Redirect to bucket list if not completed
        alert('🔒 Please complete the Bucket List first to access the Love Quiz!');
        window.location.href = 'bucket-list.html';
        return;
    }
    
    initializeQuiz();
});

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let quizCompleted = false;

const quizQuestions = [
    {
        question: "What was the first movie you watched together?",
        answers: ["The Notebook", "Titanic", "La La Land", "A romantic comedy"],
        correct: 0,
        explanation: "Our first movie date was magical - even if we were both too nervous to focus on the screen!"
    },
    {
        question: "What is Jerry's favorite way to show love?",
        answers: ["Surprise gifts", "Quality time together", "Words of affirmation", "Acts of service"],
        correct: 1,
        explanation: "Jerry believes that spending quality time together is the most precious gift of all."
    },
    {
        question: "What is Soumya's favorite flower?",
        answers: ["Roses", "Sunflowers", "Lilies", "Tulips"],
        correct: 0,
        explanation: "Soumya loves roses because they symbolize the beauty and complexity of love."
    },
    {
        question: "Where did you have your first official date?",
        answers: ["A coffee shop", "The movies", "A restaurant", "A park"],
        correct: 1,
        explanation: "The movies - where we shared popcorn and stolen glances throughout the film."
    },
    {
        question: "What song reminds you most of your relationship?",
        answers: ["Perfect by Ed Sheeran", "All of Me by John Legend", "A Thousand Years", "Can't Help Myself"],
        correct: 2,
        explanation: "A Thousand Years perfectly captures the feeling of wanting to love someone forever."
    },
    {
        question: "What is your shared dream vacation destination?",
        answers: ["Paris, France", "Maldives", "Japan", "New Zealand"],
        correct: 0,
        explanation: "Paris - the city of love, where you want to walk hand in hand along the Seine."
    },
    {
        question: "What do you both love doing together on weekends?",
        answers: ["Cooking together", "Watching movies", "Going for walks", "All of the above"],
        correct: 3,
        explanation: "You love doing everything together - cooking, movies, walks - it's all perfect when you're together!"
    },
    {
        question: "What was your first impression of each other?",
        answers: ["Love at first sight", "Nervous excitement", "Instant connection", "All of the above"],
        correct: 3,
        explanation: "It was everything at once - love, nerves, and an instant connection that couldn't be denied."
    },
    {
        question: "What is your relationship motto?",
        answers: ["Together forever", "Love conquers all", "Better together", "All you need is love"],
        correct: 2,
        explanation: "Better together - because you both know that everything is better when you're side by side."
    },
    {
        question: "What are you most excited about for your future together?",
        answers: ["Building a home", "Traveling the world", "Growing old together", "All of the above"],
        correct: 3,
        explanation: "Everything! Your future together is filled with endless possibilities and love."
    }
];

function initializeQuiz() {
    // Create floating question marks
    createFloatingQuestions();
    
    // Start the quiz
    loadQuestion();
}

function createFloatingQuestions() {
    const questionsContainer = document.getElementById('floatingQuestions');
    const questionMarks = ['❓', '❔', '🤔', '💭', '💡'];
    
    for (let i = 0; i < 20; i++) {
        const mark = document.createElement('div');
        mark.className = 'question-mark';
        mark.innerHTML = questionMarks[Math.floor(Math.random() * questionMarks.length)];
        mark.style.left = Math.random() * 100 + '%';
        mark.style.top = Math.random() * 100 + '%';
        mark.style.animationDelay = Math.random() * 6 + 's';
        mark.style.animationDuration = (Math.random() * 3 + 4) + 's';
        questionsContainer.appendChild(mark);
    }
}

function loadQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showResults();
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    
    // Update progress bar
    const progress = ((currentQuestion) / quizQuestions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // Update question number
    document.getElementById('questionNumber').textContent = 
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    
    // Update question text
    document.getElementById('questionText').textContent = question.question;
    
    // Create answer buttons
    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        answersGrid.appendChild(button);
    });
    
    // Reset controls
    selectedAnswer = null;
    document.getElementById('nextBtn').disabled = true;
}

function selectAnswer(answerIndex) {
    if (selectedAnswer !== null) return; // Already answered
    
    selectedAnswer = answerIndex;
    const question = quizQuestions[currentQuestion];
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    // Show correct/incorrect feedback
    answerButtons.forEach((btn, index) => {
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === answerIndex && answerIndex !== question.correct) {
            btn.classList.add('incorrect');
        }
        btn.style.pointerEvents = 'none';
    });
    
    // Update score
    if (answerIndex === question.correct) {
        score++;
        createCorrectEffect();
    } else {
        createIncorrectEffect();
    }
    
    // Show explanation after a delay
    setTimeout(() => {
        showExplanation(question.explanation);
    }, 1000);
    
    // Enable next button
    setTimeout(() => {
        document.getElementById('nextBtn').disabled = false;
    }, 1500);
}

function showExplanation(explanation) {
    // Create explanation popup
    const explanationDiv = document.createElement('div');
    explanationDiv.innerHTML = `
        <div style="
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
            font-style: italic;
            border-left: 4px solid #ff6b9d;
        ">
            💡 ${explanation}
        </div>
    `;
    document.getElementById('questionContainer').appendChild(explanationDiv);
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function showResults() {
    quizCompleted = true;
    
    // Hide quiz content
    document.getElementById('quizContent').style.display = 'none';
    
    // Show results
    const resultsDiv = document.getElementById('quizResults');
    resultsDiv.style.display = 'block';
    
    // Update progress bar to 100%
    document.getElementById('progressBar').style.width = '100%';
    
    // Display score
    document.getElementById('scoreDisplay').textContent = `${score}/${quizQuestions.length}`;
    
    // Generate score message
    const percentage = (score / quizQuestions.length) * 100;
    let message = '';
    
    if (percentage >= 90) {
        message = "🎉 Perfect! You two know each other amazingly well! Your connection is truly extraordinary and beautiful. 💕";
    } else if (percentage >= 70) {
        message = "💖 Excellent! You have a wonderful understanding of each other. Your love story is filled with beautiful details! ✨";
    } else if (percentage >= 50) {
        message = "😊 Good job! You know each other well, and there's always more to discover in your beautiful journey together! 🌟";
    } else {
        message = "💕 Keep learning about each other! Every day brings new opportunities to deepen your connection and love. 🌈";
    }
    
    document.getElementById('scoreMessage').textContent = message;
    
    // Show breakdown
    document.getElementById('scoreBreakdown').innerHTML = `
        <h4 style="color: white; margin-bottom: 1rem;">Your Love Knowledge Breakdown:</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; text-align: center;">
            <div>
                <div style="font-size: 2rem; color: #00c851;">${score}</div>
                <div style="color: rgba(255,255,255,0.8);">Correct Answers</div>
            </div>
            <div>
                <div style="font-size: 2rem; color: #ff6b9d;">${Math.round(percentage)}%</div>
                <div style="color: rgba(255,255,255,0.8);">Love Score</div>
            </div>
        </div>
    `;
    
    // Show completion effect
    createCompletionEffect();
    
    // Save quiz results
    localStorage.setItem('quizResults', JSON.stringify({
        score: score,
        total: quizQuestions.length,
        percentage: percentage,
        completedAt: new Date().toISOString()
    }));
}

function createCorrectEffect() {
    const hearts = ['💚', '✅', '🎉', '⭐'];
    createFloatingEffect(hearts, '#00c851');
}

function createIncorrectEffect() {
    const symbols = ['💔', '❌', '😅', '🤔'];
    createFloatingEffect(symbols, '#ff4444');
}

function createFloatingEffect(symbols, color) {
    const container = document.querySelector('.quiz-card');
    
    for (let i = 0; i < 5; i++) {
        const symbol = document.createElement('div');
        symbol.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.position = 'absolute';
        symbol.style.left = Math.random() * 100 + '%';
        symbol.style.top = Math.random() * 100 + '%';
        symbol.style.fontSize = '1.5rem';
        symbol.style.color = color;
        symbol.style.animation = 'floatUp 2s ease-out forwards';
        symbol.style.pointerEvents = 'none';
        symbol.style.zIndex = '100';
        
        container.appendChild(symbol);
        
        setTimeout(() => {
            symbol.remove();
        }, 2000);
    }
}

function createCompletionEffect() {
    const celebrationSymbols = ['🎉', '🎊', '💖', '⭐', '🌟', '💫'];
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

function unlockNextPage() {
    if (quizCompleted) {
        // Mark quiz as completed
        localStorage.setItem('quizCompleted', 'true');
        
        // Redirect to surprises page
        window.location.href = 'surprises.html';
    } else {
        alert('🔒 Please complete the quiz first!');
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.5);
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

// Initialize unified systems when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Unified systems loaded for quiz');
});
