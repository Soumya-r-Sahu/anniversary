
import React, { useState, useEffect, useRef } from 'react';
import '../css/puzzle.css';

const PuzzlePage = () => {
    const [puzzlePieces, setPuzzlePieces] = useState([]);
    const [emptyPosition, setEmptyPosition] = useState(15);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isCompleted, setCom pleted] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const timerRef = useRef(null);

    // Initialize puzzle
    useEffect(() => {
        initializePuzzle();
        startTimer();
        
        // Check completion status
        const completed = localStorage.getItem('puzzleCompleted') === 'true';
        setCompleted(completed);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const initializePuzzle = () => {
        // Create initial solved state (1-15, then empty)
        let pieces = Array.from({ length: 15 }, (_, i) => i + 1);
        pieces.push(null); // empty space
        
        // Shuffle the puzzle
        pieces = shufflePuzzle(pieces);
        setPuzzlePieces(pieces);
        
        // Find empty position
        const emptyIndex = pieces.findIndex(piece => piece === null);
        setEmptyPosition(emptyIndex);
    };

    const shufflePuzzle = (pieces) => {
        // Ensure solvable puzzle by making even number of inversions
        let shuffled = [...pieces];
        
        // Simple shuffle that maintains solvability
        for (let i = 0; i < 1000; i++) {
            const emptyIndex = shuffled.findIndex(piece => piece === null);
            const possibleMoves = getValidMoves(emptyIndex);
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            
            // Swap empty with random valid piece
            [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
        }
        
        return shuffled;
    };

    const getValidMoves = (emptyIndex) => {
        const moves = [];
        const row = Math.floor(emptyIndex / 4);
        const col = emptyIndex % 4;
        
        // Up
        if (row > 0) moves.push(emptyIndex - 4);
        // Down
        if (row < 3) moves.push(emptyIndex + 4);
        // Left
        if (col > 0) moves.push(emptyIndex - 1);
        // Right
        if (col < 3) moves.push(emptyIndex + 1);
        
        return moves;
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
    };

    const handlePieceClick = (index) => {
        if (isCompleted) return;
        
        const validMoves = getValidMoves(emptyPosition);
        
        if (validMoves.includes(index)) {
            // Valid move - swap piece with empty space
            const newPieces = [...puzzlePieces];
            [newPieces[emptyPosition], newPieces[index]] = [newPieces[index], newPieces[emptyPosition]];
            
            setPuzzlePieces(newPieces);
            setEmptyPosition(index);
            setMoves(prev => prev + 1);
            
            // Check if puzzle is solved
            if (isPuzzleSolved(newPieces)) {
                completePuzzle();
            }
        }
    };

    const isPuzzleSolved = (pieces) => {
        for (let i = 0; i < 15; i++) {
            if (pieces[i] !== i + 1) {
                return false;
            }
        }
        return pieces[15] === null;
    };

    const completePuzzle = () => {
        setCompleted(true);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        // Calculate score based on time and moves
        const timeBonus = Math.max(0, 300 - timer); // Bonus for solving under 5 minutes
        const moveBonus = Math.max(0, 200 - moves); // Bonus for solving in fewer moves
        const finalScore = timeBonus + moveBonus + 500; // Base completion score
        
        setScore(finalScore);
        
        // Save completion
        localStorage.setItem('puzzleCompleted', 'true');
        localStorage.setItem('puzzleCompletionTime', new Date().toISOString());
        localStorage.setItem('puzzleScore', finalScore.toString());
        localStorage.setItem('puzzleMoves', moves.toString());
        localStorage.setItem('puzzleTime', timer.toString());
        
        // Trigger fireworks
        createFireworksEffect();
        
        setTimeout(() => {
            alert(`🎉 Puzzle Completed! Score: ${finalScore} | Time: ${formatTime(timer)} | Moves: ${moves}`);
        }, 1000);
    };

    const createFireworksEffect = () => {
        const fireworksContainer = document.createElement('div');
        fireworksContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(fireworksContainer);
        
        const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createSingleFirework(fireworksContainer, colors);
            }, i * 200);
        }
        
        setTimeout(() => {
            if (fireworksContainer.parentNode) {
                fireworksContainer.remove();
            }
        }, 5000);
    };

    const createSingleFirework = (container, colors) => {
        const firework = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        firework.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
        `;
        
        container.appendChild(firework);
        
        // Create explosion particles
        for (let j = 0; j < 12; j++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                left: 0;
                top: 0;
                animation: fireworkParticle 1s ease-out forwards;
                animation-delay: ${j * 0.05}s;
            `;
            
            const angle = (j / 12) * 2 * Math.PI;
            const distance = 50 + Math.random() * 50;
            
            particle.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
            
            firework.appendChild(particle);
        }
        
        setTimeout(() => {
            if (firework.parentNode) {
                firework.remove();
            }
        }, 1500);
    };

    const resetPuzzle = () => {
        setMoves(0);
        setTimer(0);
        setCompleted(false);
        setScore(0);
        setShowHint(false);
        
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        initializePuzzle();
        startTimer();
    };

    const toggleHint = () => {
        setShowHint(!showHint);
    };

    const unlockNextPage = () => {
        if (isCompleted) {
            window.location.href = '/message-wall';
        } else {
            alert('🧩 Complete the puzzle first!');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getPieceStyle = (piece, index) => {
        if (piece === null) {
            return { visibility: 'hidden' };
        }
        
        const targetRow = Math.floor((piece - 1) / 4);
        const targetCol = (piece - 1) % 4;
        const currentRow = Math.floor(index / 4);
        const currentCol = index % 4;
        
        return {
            backgroundPosition: `-${targetCol * 100}px -${targetRow * 100}px`,
            border: showHint && (targetRow !== currentRow || targetCol !== currentCol) ? 
                '2px solid #ff6b6b' : '2px solid #333'
        };
    };

    return (
        <div className="puzzle-hero">
            <div className="puzzle-container">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-dancing gradient-text mb-4 animate-float">
                        🧩 Love Puzzle 🧩
                    </h1>
                    <p className="text-xl text-white/90 font-dancing mb-8">
                        Piece together our beautiful memories
                    </p>
                </div>

                {/* Game Stats */}
                <div className="game-stats">
                    <div className="stat-item">
                        <div className="stat-label">Time</div>
                        <div className="stat-value">{formatTime(timer)}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Moves</div>
                        <div className="stat-value">{moves}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Score</div>
                        <div className="stat-value">{score}</div>
                    </div>
                </div>

                {/* Puzzle Grid */}
                <div className="puzzle-grid">
                    {puzzlePieces.map((piece, index) => (
                        <div
                            key={index}
                            className={`puzzle-piece ${piece === null ? 'empty' : ''}`}
                            style={getPieceStyle(piece, index)}
                            onClick={() => handlePieceClick(index)}
                        >
                            {piece}
                        </div>
                    ))}
                </div>

                {/* Game Controls */}
                <div className="game-controls">
                    <button className="control-btn" onClick={resetPuzzle}>
                        🔄 Reset Puzzle
                    </button>
                    <button className="control-btn" onClick={toggleHint}>
                        {showHint ? '👁️ Hide Hints' : '💡 Show Hints'}
                    </button>
                </div>

                {/* Instructions */}
                <div className="instructions">
                    <h3 className="text-xl font-dancing text-white mb-4">How to Play:</h3>
                    <ul className="instruction-list">
                        <li>Click on pieces adjacent to the empty space to move them</li>
                        <li>Arrange the numbers 1-15 in order</li>
                        <li>Complete the puzzle to unlock the next page</li>
                        <li>Try to solve it in the fewest moves for a higher score!</li>
                    </ul>
                </div>

                {/* Unlock Section */}
                <div className="unlock-section">
                    <h3 className="text-2xl font-dancing text-white mb-4">
                        {isCompleted ? '🎉 Puzzle Mastered! 🎉' : '🧩 Complete the Puzzle 🧩'}
                    </h3>
                    <p className="text-white/80 mb-6">
                        {isCompleted 
                            ? "Brilliant! Ready to explore our message wall?"
                            : "Solve the puzzle to continue your journey!"
                        }
                    </p>
                    <button 
                        className={`unlock-btn ${isCompleted ? 'enabled' : 'disabled'}`}
                        onClick={unlockNextPage}
                        disabled={!isCompleted}
                    >
                        {isCompleted ? '💌 Continue to Messages 💌' : '🧩 Solve Puzzle First 🧩'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Add required CSS animations
const puzzleStyles = `
    @keyframes fireworkParticle {
        0% {
            transform: translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y));
            opacity: 0;
        }
    }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('puzzle-fireworks-styles')) {
    const style = document.createElement('style');
    style.id = 'puzzle-fireworks-styles';
    style.textContent = puzzleStyles;
    document.head.appendChild(style);
}

export default PuzzlePage;
