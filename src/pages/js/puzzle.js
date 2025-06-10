// Puzzle Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check unlock status
    const milestonesUnlocked = localStorage.getItem('milestonesCompleted') === 'true';
    
    if (!milestonesUnlocked) {
        alert('🔒 Please complete the Milestones first to access the Puzzle!');
        window.location.href = 'milestones.html';
        return;
    }
    
    initializePuzzle();
});

let puzzle = [];
let emptyIndex = 15; // Bottom-right corner
let moves = 0;
let puzzleCompleted = false;
let startTime = Date.now();

// Solution state (0-14 in order, 15 is empty)
const solution = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// Beautiful love-themed images for puzzle pieces
const puzzleImages = [
    '💕', '💖', '💗', '💘', '💝', '💞', '💟', '❤️',
    '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤', ''
];

function initializePuzzle() {
    // Initialize puzzle array
    puzzle = [...solution];
    
    // Shuffle the puzzle
    shufflePuzzle();
    
    // Render the puzzle
    renderPuzzle();
    
    // Update UI
    updateMoves();
    updateTimer();
    setInterval(updateTimer, 1000);
}

function shufflePuzzle() {
    // Perform valid moves to shuffle
    for (let i = 0; i < 1000; i++) {
        const neighbors = getValidMoves();
        if (neighbors.length > 0) {
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            swapPieces(emptyIndex, randomNeighbor);
            emptyIndex = randomNeighbor;
        }
    }
    moves = 0; // Reset move counter after shuffle
}

function getValidMoves() {
    const neighbors = [];
    const row = Math.floor(emptyIndex / 4);
    const col = emptyIndex % 4;
    
    // Check all 4 directions
    if (row > 0) neighbors.push((row - 1) * 4 + col); // Up
    if (row < 3) neighbors.push((row + 1) * 4 + col); // Down
    if (col > 0) neighbors.push(row * 4 + (col - 1)); // Left
    if (col < 3) neighbors.push(row * 4 + (col + 1)); // Right
    
    return neighbors;
}

function swapPieces(index1, index2) {
    const temp = puzzle[index1];
    puzzle[index1] = puzzle[index2];
    puzzle[index2] = temp;
}

function renderPuzzle() {
    const puzzleGrid = document.getElementById('puzzleGrid');
    puzzleGrid.innerHTML = '';
    
    puzzle.forEach((piece, index) => {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.dataset.index = index;
        
        if (piece === 15) {
            // Empty tile
            tile.classList.add('empty');
        } else {
            tile.innerHTML = puzzleImages[piece];
            tile.addEventListener('click', () => handleTileClick(index));
        }
        
        puzzleGrid.appendChild(tile);
    });
}

function handleTileClick(clickedIndex) {
    if (puzzleCompleted) return;
    
    const validMoves = getValidMoves();
    
    if (validMoves.includes(clickedIndex)) {
        // Valid move - swap with empty space
        swapPieces(emptyIndex, clickedIndex);
        emptyIndex = clickedIndex;
        moves++;
        
        // Re-render and update UI
        renderPuzzle();
        updateMoves();
        
        // Add move effect
        createMoveEffect();
        
        // Check if puzzle is solved
        if (isPuzzleSolved()) {
            completePuzzle();
        }
    } else {
        // Invalid move - show feedback
        const tile = document.querySelector(`[data-index="${clickedIndex}"]`);
        tile.classList.add('invalid-move');
        setTimeout(() => {
            tile.classList.remove('invalid-move');
        }, 300);
    }
}

function isPuzzleSolved() {
    return puzzle.every((piece, index) => piece === index);
}

function completePuzzle() {
    puzzleCompleted = true;
    const endTime = Date.now();
    const timeElapsed = Math.floor((endTime - startTime) / 1000);
    
    // Save completion data
    localStorage.setItem('puzzleCompleted', 'true');
    localStorage.setItem('puzzleStats', JSON.stringify({
        moves: moves,
        time: timeElapsed,
        completedAt: new Date().toISOString()
    }));
    
    // Show completion modal
    showCompletionModal(timeElapsed);
    
    // Create fireworks effect
    createFireworksEffect();
}

function showCompletionModal(timeElapsed) {
    const modal = document.getElementById('completionModal');
    const movesSpan = document.getElementById('finalMoves');
    const timeSpan = document.getElementById('finalTime');
    
    movesSpan.textContent = moves;
    timeSpan.textContent = formatTime(timeElapsed);
    
    // Calculate performance rating
    let rating = '';
    let message = '';
    
    if (moves <= 50 && timeElapsed <= 60) {
        rating = '🌟 AMAZING! 🌟';
        message = 'You two work together like a perfect team!';
    } else if (moves <= 100 && timeElapsed <= 120) {
        rating = '🎉 EXCELLENT! 🎉';
        message = 'Great teamwork and puzzle-solving skills!';
    } else if (moves <= 200 && timeElapsed <= 300) {
        rating = '😊 GOOD JOB! 😊';
        message = 'You stuck with it and solved it together!';
    } else {
        rating = '💕 COMPLETED! 💕';
        message = 'Every puzzle is easier when you\'re together!';
    }
    
    document.getElementById('performanceRating').textContent = rating;
    document.getElementById('performanceMessage').textContent = message;
    
    modal.style.display = 'flex';
}

function createMoveEffect() {
    const effects = ['✨', '⭐', '💫'];
    const effect = document.createElement('div');
    effect.innerHTML = effects[Math.floor(Math.random() * effects.length)];
    effect.style.position = 'fixed';
    effect.style.left = Math.random() * 100 + 'vw';
    effect.style.top = Math.random() * 100 + 'vh';
    effect.style.fontSize = '1.5rem';
    effect.style.animation = 'moveEffect 1s ease-out forwards';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '1000';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

function createFireworksEffect() {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#ff6b9d', '#8360c3', '#2ebf91', '#ffd93d', '#ff6b6b'];
    
    // Create firework particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 60
        });
    }
    
    function animateFireworks() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Gravity
            particle.life--;
            
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life / 60;
            ctx.fillRect(particle.x, particle.y, 3, 3);
            
            if (particle.life <= 0) {
                particles.splice(index, 1);
            }
        });
        
        if (particles.length > 0) {
            requestAnimationFrame(animateFireworks);
        } else {
            canvas.style.display = 'none';
        }
    }
    
    canvas.style.display = 'block';
    animateFireworks();
}

function updateMoves() {
    document.getElementById('moveCount').textContent = moves;
}

function updateTimer() {
    if (puzzleCompleted) return;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timeElapsed').textContent = formatTime(elapsed);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function resetPuzzle() {
    puzzle = [...solution];
    emptyIndex = 15;
    moves = 0;
    puzzleCompleted = false;
    startTime = Date.now();
    
    shufflePuzzle();
    renderPuzzle();
    updateMoves();
    
    // Hide completion modal
    document.getElementById('completionModal').style.display = 'none';
}

function giveHint() {
    if (puzzleCompleted) return;
    
    // Find a piece that's not in the correct position
    let hintIndex = -1;
    for (let i = 0; i < 15; i++) {
        if (puzzle[i] !== i) {
            hintIndex = i;
            break;
        }
    }
    
    if (hintIndex !== -1) {
        const tile = document.querySelector(`[data-index="${hintIndex}"]`);
        tile.classList.add('hint-highlight');
        setTimeout(() => {
            tile.classList.remove('hint-highlight');
        }, 2000);
        
        // Show hint message
        showHintMessage(hintIndex);
    }
}

function showHintMessage(index) {
    const hintDiv = document.createElement('div');
    hintDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 107, 157, 0.9);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            z-index: 1000;
            font-family: 'Dancing Script', cursive;
        ">
            💡 Hint: The highlighted piece needs to move!
        </div>
    `;
    
    document.body.appendChild(hintDiv);
    
    setTimeout(() => {
        hintDiv.remove();
    }, 3000);
}

function proceedToMessageWall() {
    window.location.href = 'games.html';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes moveEffect {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: scale(1.5) rotate(180deg);
        }
    }
    
    .invalid-move {
        animation: invalidShake 0.3s ease-in-out;
    }
    
    @keyframes invalidShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .hint-highlight {
        animation: hintPulse 2s ease-in-out infinite;
        box-shadow: 0 0 20px #ff6b9d !important;
    }
    
    @keyframes hintPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(style);

console.log('🚀 Puzzle page initialized');
