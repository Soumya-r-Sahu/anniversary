// Countdown and Celebration JavaScript - Mobile Optimized

// Background Music Control - Local Audio
let musicPlaying = false;

function initializeMusicControl() {
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    
    if (musicToggle && backgroundMusic) {
        // Set initial volume
        backgroundMusic.volume = 0.3; // 30% volume for background music
        
        // Auto-play music when page loads
        backgroundMusic.play().then(() => {
            musicToggle.innerHTML = '🎵';
            musicToggle.style.background = 'linear-gradient(135deg, #ff6b9d, #ffa8cc)';
            musicPlaying = true;
        }).catch(error => {
            console.log('Autoplay blocked by browser:', error);
            // Keep the muted icon if autoplay fails
            musicToggle.innerHTML = '🔇';
        });
        
        // Music toggle functionality
        musicToggle.addEventListener('click', function() {
            if (musicPlaying) {
                // Pause music
                backgroundMusic.pause();
                musicToggle.innerHTML = '🔇';
                musicToggle.style.background = 'linear-gradient(135deg, #666, #999)';
                musicPlaying = false;
            } else {
                // Play music
                backgroundMusic.play().then(() => {
                    musicToggle.innerHTML = '🎵';
                    musicToggle.style.background = 'linear-gradient(135deg, #ff6b9d, #ffa8cc)';
                    musicPlaying = true;                }).catch(error => {
                    console.log('Audio play failed:', error);
                    // Show user-friendly message
                    musicToggle.innerHTML = '❌';
                    musicToggle.title = 'Please check that song1.m4a is in the music folder';
                });
            }        });
        
        // Handle audio loading errors
        backgroundMusic.addEventListener('error', function() {
            musicToggle.innerHTML = '❌';
            musicToggle.title = 'Music file not found. Please check that song1.m4a is in the music folder';
            musicToggle.style.background = 'linear-gradient(135deg, #999, #666)';
        });
        
        // Handle audio loading success
        backgroundMusic.addEventListener('loadeddata', function() {
            musicToggle.title = 'Click to play/pause background music';
        });
    }
}

// Initialize AOS with mobile-friendly settings
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 50,
    disable: window.innerWidth < 768 ? 'mobile' : false // Disable on very small screens for performance
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

// Performance optimization variables
let animationFrameId;
let lastUpdateTime = 0;
const UPDATE_INTERVAL = 1000; // Update every second

// Check if anniversary has arrived
function checkAnniversary() {
    const now = new Date().getTime();
    return now >= anniversaryDate;
}

// Update countdown with performance optimization
function updateCountdown() {
    const now = Date.now();
    
    // Throttle updates for better mobile performance
    if (now - lastUpdateTime < UPDATE_INTERVAL) {
        return;
    }
    lastUpdateTime = now;
    
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
    
    // Update display with animation (mobile-optimized)
    animateNumber(daysElement, days);
    animateNumber(hoursElement, hours);
    animateNumber(minutesElement, minutes);
    animateNumber(secondsElement, seconds);
}

// Mobile-optimized number animation
function animateNumber(element, newValue) {
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    const formattedValue = newValue.toString().padStart(2, '0');
    
    if (currentValue !== newValue) {
        // Use CSS transitions instead of manual animation for better mobile performance
        element.style.transition = 'transform 0.2s ease, color 0.2s ease';
        element.style.transform = 'scale(1.1)';
        element.style.color = '#f72585';
        
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            element.textContent = formattedValue;
            
            requestAnimationFrame(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '#ec4899';
            });
        });
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

// Create mobile-optimized fireworks
function createFirework(x, y) {
    const colors = ['#ff6b9d', '#ffa8cc', '#ffb3d6', '#ff8fab', '#f72585', '#b5179e', '#gold', '#orange', '#red'];
    const fireworksContainer = document.getElementById('fireworks-container');
    
    if (!fireworksContainer) return;
    
    // Reduce particle count on mobile for better performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 30;
    
    // Create explosion particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * (isMobile ? 50 : 100) + 30;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        fireworksContainer.appendChild(particle);
        
        // Animate particle with CSS transforms for better mobile performance
        let posX = x;
        let posY = y;
        let opacity = 1;
        let frame = 0;
        const maxFrames = isMobile ? 30 : 50;
        
        const animateParticle = () => {
            frame++;
            posX += vx * 0.02;
            posY += vy * 0.02;
            opacity -= 1 / maxFrames;
            
            particle.style.transform = `translate(${posX - x}px, ${posY - y}px)`;
            particle.style.opacity = opacity;
            
            if (frame < maxFrames && opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                if (fireworksContainer.contains(particle)) {
                    fireworksContainer.removeChild(particle);
                }
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

// Create mobile-optimized sparkles
function createSparkles() {
    const sparklesContainer = document.body;
    const isMobile = window.innerWidth < 768;
    const sparkleCount = isMobile ? 3 : 5;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.position = 'fixed';
        sparkle.style.width = '6px';
        sparkle.style.height = '6px';
        sparkle.style.background = 'gold';
        sparkle.style.borderRadius = '50%';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.animationDelay = Math.random() * 1.5 + 's';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '2';
        sparkle.style.animation = 'sparkle 1.5s infinite';
        
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
    
    const heartsContainer = document.querySelector('.floating-hearts');
    if (heartsContainer) {
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 8000);
    }
}

// Enter button click handler with mobile touch support
if (enterBtn) {
    enterBtn.addEventListener('click', function() {
        // Add haptic feedback for mobile
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        
        // Redirect to main anniversary page
        window.location.href = 'anniversary.html';
    });
    
    // Add touch feedback
    enterBtn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(1.02)';
    }, { passive: true });
    
    enterBtn.addEventListener('touchend', function() {
        this.style.transform = '';
    }, { passive: true });
}

// Initialize with mobile optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize background music controls
    initializeMusicControl();
    
    // Check if anniversary has already arrived
    if (checkAnniversary()) {
        showCelebration();
    } else {
        // Start countdown with optimized timer
        updateCountdown();
        
        // Use more efficient interval for mobile
        const isMobile = window.innerWidth < 768;
        const intervalTime = isMobile ? 1000 : 500; // Update less frequently on mobile
        setInterval(updateCountdown, intervalTime);
    }
    
    // Create floating hearts with reduced frequency on mobile
    const isMobile = window.innerWidth < 768;
    const heartInterval = isMobile ? 4000 : 2000;
    setInterval(createFloatingHeart, heartInterval);
    
    // Initial hearts (fewer on mobile)
    const initialHearts = isMobile ? 3 : 8;
    for (let i = 0; i < initialHearts; i++) {
        setTimeout(createFloatingHeart, i * 500);
    }
    
    // Handle page visibility for battery optimization
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause animations when page is not visible
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations when page becomes visible
            document.body.style.animationPlayState = 'running';
        }
    });
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
