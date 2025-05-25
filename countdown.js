// Countdown and Celebration JavaScript

// Initialize AOS
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true
});

// Set the anniversary date - June 16, 2025 at 12:00 AM
const anniversaryDate = new Date('2025-06-16T00:00:00').getTime();

// Get countdown elements
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const countdownSection = document.getElementById('countdown-section');
const celebrationSection = document.getElementById('celebration-section');
const enterBtn = document.getElementById('enter-btn');

// Check if anniversary has arrived
function checkAnniversary() {
    const now = new Date().getTime();
    return now >= anniversaryDate;
}

// Update countdown
function updateCountdown() {
    const now = new Date().getTime();
    const distance = anniversaryDate - now;
    
    if (distance < 0) {
        // Anniversary has arrived!
        showCelebration();
        return;
    }
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update display with animation
    animateNumber(daysElement, days);
    animateNumber(hoursElement, hours);
    animateNumber(minutesElement, minutes);
    animateNumber(secondsElement, seconds);
}

// Animate number changes
function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent);
    const formattedValue = newValue.toString().padStart(2, '0');
    
    if (currentValue !== newValue) {
        element.style.transform = 'scale(1.1)';
        element.style.color = '#f72585';
        
        setTimeout(() => {
            element.textContent = formattedValue;
            element.style.transform = 'scale(1)';
            element.style.color = '#ec4899';
        }, 150);
    }
}

// Show celebration with fireworks
function showCelebration() {
    // Hide countdown, show celebration
    countdownSection.classList.add('hidden');
    celebrationSection.classList.remove('hidden');
    
    // Trigger massive fireworks display
    launchCelebrationFireworks();
    
    // Play celebration sound effect (if available)
    playCelebrationSound();
    
    // Create continuous sparkles
    setInterval(createSparkles, 200);
}

// Create fireworks
function createFirework(x, y) {
    const colors = ['#ff6b9d', '#ffa8cc', '#ffb3d6', '#ff8fab', '#f72585', '#b5179e', '#gold', '#orange', '#red'];
    const fireworksContainer = document.getElementById('fireworks-container');
    
    // Create explosion particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        fireworksContainer.appendChild(particle);
        
        // Animate particle
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animateParticle = () => {
            posX += vx * 0.02;
            posY += vy * 0.02;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                fireworksContainer.removeChild(particle);
            }
        };
        
        requestAnimationFrame(animateParticle);
    }
}

// Launch celebration fireworks
function launchCelebrationFireworks() {
    const fireworksInterval = setInterval(() => {
        // Random positions across the screen
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.6) + 50;
        
        createFirework(x, y);
    }, 300);
    
    // Stop after 10 seconds
    setTimeout(() => {
        clearInterval(fireworksInterval);
    }, 10000);
    
    // Initial burst
    setTimeout(() => createFirework(window.innerWidth / 2, window.innerHeight / 3), 500);
    setTimeout(() => createFirework(window.innerWidth / 4, window.innerHeight / 4), 800);
    setTimeout(() => createFirework((window.innerWidth * 3) / 4, window.innerHeight / 4), 1100);
}

// Create sparkles
function createSparkles() {
    const sparklesContainer = document.body;
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.animationDelay = Math.random() * 1.5 + 's';
        
        sparklesContainer.appendChild(sparkle);
        
        // Remove after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1500);
    }
}

// Play celebration sound (placeholder)
function playCelebrationSound() {
    // You can add audio here if you have celebration sound files
    console.log('🎉 Celebration time! Playing celebration sounds! 🎉');
}

// Create floating hearts
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    document.querySelector('.floating-hearts').appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 8000);
}

// Enter button click handler
enterBtn.addEventListener('click', function() {
    // Redirect to main anniversary page
    window.location.href = 'anniversary.html';
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if anniversary has already arrived
    if (checkAnniversary()) {
        showCelebration();
    } else {
        // Start countdown
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Create floating hearts periodically
    setInterval(createFloatingHeart, 2000);
    
    // Initial hearts
    for (let i = 0; i < 8; i++) {
        setTimeout(createFloatingHeart, i * 500);
    }
});

// Add some fun interactions
document.addEventListener('click', function(e) {
    // Create firework at click position (only if celebration is active)
    if (!celebrationSection.classList.contains('hidden')) {
        createFirework(e.clientX, e.clientY);
    }
});

// Easter egg - Konami code for early unlock (for testing)
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiSequence.join('') && countdownSection && !countdownSection.classList.contains('hidden')) {
        console.log('🎮 Konami code activated! Early unlock! 🎮');
        showCelebration();
    }
});

console.log('⏰ Countdown to Anniversary initialized! ⏰');
console.log('💕 Anniversary Date: June 16, 2025 at 12:00 AM 💕');
console.log('🎆 Get ready for an amazing celebration! 🎆');
