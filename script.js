// Love Anniversary Website JavaScript - Mobile Optimized

// Mobile detection and performance optimization
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowPerformance = isMobile || navigator.hardwareConcurrency <= 2;

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Battery optimization
let isPageVisible = true;
document.addEventListener('visibilitychange', function() {
    isPageVisible = !document.hidden;
});

// Initialize AOS (Animate On Scroll) with mobile optimizations
AOS.init({
    duration: isMobile ? 600 : 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    offset: isMobile ? 50 : 120,
    delay: isMobile ? 50 : 100
});

// Initialize Particles.js with mobile optimization
particlesJS('particles-js', {
    particles: {
        number: {
            value: isLowPerformance ? 25 : 50,
            density: {
                enable: true,
                value_area: isLowPerformance ? 1200 : 800
            }
        },
        color: {
            value: ["#ff6b9d", "#ffa8cc", "#ffb3d6"]
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            }
        },
        opacity: {
            value: 0.6,
            random: true,
            anim: {
                enable: !isLowPerformance,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: isMobile ? 2 : 3,
            random: true,
            anim: {
                enable: !isLowPerformance,
                speed: isLowPerformance ? 1 : 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: false
        },
        move: {
            enable: isPageVisible,
            speed: isLowPerformance ? 0.5 : 1,
            direction: "top",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: !isMobile,
                mode: "bubble"
            },
            onclick: {
                enable: true,
                mode: "repulse"
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: isMobile ? 80 : 100,
                size: isMobile ? 4 : 6,
                duration: 2,
                opacity: 0.8,
                speed: 3
            },
            repulse: {
                distance: isMobile ? 80 : 100,
                duration: 0.4
            }
        }
    },
    retina_detect: true
});

// Typed.js Animation
document.addEventListener('DOMContentLoaded', function() {    const typed = new Typed('#typed-text', {        strings: [
            'From your first smile emoji 😁 to forever... ✨',
            'You said "Love you" first on our 3-hour call... 💕',
            'October 13th gave us a new beginning... 🌅',
            'My heart beats only for you, Puja... 💓',
            'Forever grateful for my sweet Jerry... 🐒💕',
            'Our first meeting: "Tike agaku dekh"... 👀💖',
            'Best birthday ever: 1/1/2025 with you... 🎂❤️',
            'You never wanted to hurt me, and I love you for that... 🥺💕',
            'From Balia Store to forever in my heart... 🏪💖'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 1000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
});

// Gallery Functionality - Mobile Enhanced
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.gallery-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index]?.classList.add('active');
    }
    
    currentSlideIndex = index;
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator && isMobile) {
        navigator.vibrate(50);
    }
}

function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(nextIndex);
}

function previousSlide() {
    const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
}

function currentSlide(index) {
    showSlide(index - 1);
}

// Auto-advance gallery with performance consideration
let galleryInterval;
function startGalleryAutoAdvance() {
    if (galleryInterval) clearInterval(galleryInterval);
    galleryInterval = setInterval(() => {
        if (isPageVisible && !isLowPerformance) {
            nextSlide();
        }
    }, isMobile ? 6000 : 5000);
}

// Start auto-advance
startGalleryAutoAdvance();

// Pause auto-advance when user interacts
function pauseGalleryAutoAdvance() {
    if (galleryInterval) {
        clearInterval(galleryInterval);
        setTimeout(startGalleryAutoAdvance, 10000); // Restart after 10 seconds
    }
}

// Music Player Functionality - Enhanced Playlist System
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

let isPlaying = false;
let currentSongIndex = 0;
let playlist = ['music/song1.m4a']; // Start with main song
let currentAudio = null;

// Load playlist from queue directory
async function loadPlaylist() {
    try {
        // Try to load songs from queue_song directory (anniversary page)
        const queueSongs = [
            'music/queue_song/01-song.m4a',
            'music/queue_song/02-song.m4a', 
            'music/queue_song/03-song.m4a',
            'music/queue_song/01-song.mp3',
            'music/queue_song/02-song.mp3',
            'music/queue_song/03-song.mp3'
        ];
        
        // Check which songs exist and add them to playlist
        for (const song of queueSongs) {
            try {
                const audio = new Audio(song);
                audio.addEventListener('loadeddata', () => {
                    if (playlist.indexOf(song) === -1) {
                        playlist.push(song);
                    }
                });
                audio.addEventListener('error', () => {
                    // Song doesn't exist, skip it
                });
                audio.load();
            } catch (error) {
                // Skip songs that can't be loaded
            }
        }
    } catch (error) {
        console.log('Could not load queue songs, using main song only');
    }
}

// Enhanced Audio Context Management
let audioContext = null;

// Initialize Audio Context for better autoplay support
function initAudioContext() {
    try {
        // Create AudioContext if supported
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass && !audioContext) {
            audioContext = new AudioContextClass();
            console.log('🎵 AudioContext created:', audioContext.state);
            
            // Resume audio context if suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.log('✅ AudioContext resumed');
                }).catch(error => {
                    console.log('❌ Failed to resume AudioContext:', error);
                });
            }
        }
    } catch (error) {
        console.log('❌ AudioContext not supported:', error);
    }
}

// Enhanced createAudioElement with Web Audio API support
function createAudioElement(src) {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0.3;
    audio.crossOrigin = 'anonymous';
    
    // Add multiple source formats for better compatibility
    const sources = [
        { src: src, type: 'audio/mp4' },
        { src: src.replace('.m4a', '.mp3'), type: 'audio/mpeg' },
        { src: src.replace('.m4a', '.wav').replace('.mp3', '.wav'), type: 'audio/wav' }
    ];
    
    audio.src = src;
    
    // Connect to AudioContext if available
    if (audioContext && audioContext.state === 'running') {
        try {
            const source = audioContext.createMediaElementSource(audio);
            source.connect(audioContext.destination);
        } catch (error) {
            console.log('Could not connect to AudioContext:', error);
        }
    }
    
    return audio;
}

// Play current song in playlist
function playCurrentSong() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    const currentSong = playlist[currentSongIndex];
    currentAudio = createAudioElement(currentSong);
    
    // When song ends, play next song in playlist
    currentAudio.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        playCurrentSong();
    });
    
    // Handle errors by skipping to next song
    currentAudio.addEventListener('error', () => {
        console.log(`Error playing ${currentSong}, skipping to next`);
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        playCurrentSong();
    });
    
    return currentAudio.play();
}

// Enhanced Autoplay System - Bypass Browser Restrictions
let autoplayAttempted = false;
let userInteracted = false;

// Track user interaction globally
function enableAudioContext() {
    userInteracted = true;
    console.log('🎵 User interaction detected - audio context enabled');
    
    // Try to start music immediately after first interaction
    if (!autoplayAttempted && currentAudio) {
        attemptAutoplay();
    }
}

// Aggressive autoplay attempt with multiple fallback strategies
function attemptAutoplay() {
    if (autoplayAttempted) return;
    autoplayAttempted = true;
    
    console.log('🎵 Attempting aggressive autoplay...');
    
    // Strategy 1: Direct play attempt
    playCurrentSong().then(() => {
        console.log('✅ Autoplay successful!');
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        isPlaying = true;    }).catch(error => {
        console.log('❌ Direct autoplay failed:', error);
        
        // Strategy 2: Silent audio trick - for now, just log the failure
        console.log('🔇 Autoplay blocked by browser policy');
    });
}

// Initialize music control
function initializeMusicControl() {
    if (playPauseBtn) {
        // Load playlist first
        loadPlaylist();
        
        // Initialize first audio element
        currentAudio = createAudioElement(playlist[0]);
        
        // Enhanced autoplay attempt
        setTimeout(() => {
            attemptAutoplay();
        }, 500); // Small delay to ensure page is ready
        
        // Music toggle functionality
        playPauseBtn.addEventListener('click', function() {
            if (isPlaying) {
                // Pause music
                if (currentAudio) {
                    currentAudio.pause();
                }
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                isPlaying = false;
            } else {
                // Play music
                if (currentAudio) {
                    currentAudio.play().then(() => {
                        playIcon.classList.add('hidden');
                        pauseIcon.classList.remove('hidden');
                        isPlaying = true;
                    }).catch(error => {
                        console.log('Audio play failed:', error);
                        // Show user-friendly message
                        playIcon.classList.remove('hidden');
                        pauseIcon.classList.add('hidden');
                    });
                } else {
                    // Restart playlist if no current audio
                    playCurrentSong().then(() => {
                        playIcon.classList.add('hidden');
                        pauseIcon.classList.remove('hidden');
                        isPlaying = true;
                    }).catch(error => {
                        console.log('Audio play failed:', error);
                        playIcon.classList.remove('hidden');
                        pauseIcon.classList.add('hidden');
                    });
                }
            }
        });
        
        // Handle loading success
        if (playPauseBtn) {
            playPauseBtn.title = 'Click to play/pause background music playlist';
        }
    }
}

// Initialize music control when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMusicControl();
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Surprise Button with Confetti - Mobile Optimized
const surpriseBtn = document.getElementById('surprise-btn');
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

// Set canvas size with performance optimization
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = confettiCanvas.getBoundingClientRect();
    
    confettiCanvas.width = rect.width * (isMobile ? 1 : dpr);
    confettiCanvas.height = rect.height * (isMobile ? 1 : dpr);
    
    if (!isMobile) {
        ctx.scale(dpr, dpr);
    }
}

const throttledResize = throttle(resizeCanvas, 250);
window.addEventListener('resize', throttledResize);
resizeCanvas();

// Confetti particle class - Mobile optimized
class Confetti {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -10;
        this.size = Math.random() * (isMobile ? 2 : 3) + (isMobile ? 1.5 : 2);
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 + 1;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * (isMobile ? 5 : 10) - (isMobile ? 2.5 : 5);
    }
    
    getRandomColor() {
        const colors = ['#ff6b9d', '#ffa8cc', '#ffb3d6', '#ff8fab', '#f72585', '#b5179e'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.1; // gravity
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

let confettiParticles = [];
let confettiActive = false;
let confettiAnimationId;

function createConfetti() {
    const particleCount = isMobile ? 75 : 150;
    for (let i = 0; i < particleCount; i++) {
        confettiParticles.push(new Confetti());
    }
}

function animateConfetti() {
    if (!confettiActive || !isPageVisible) return;
    
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const particle = confettiParticles[i];
        particle.update();
        particle.draw();
        
        // Remove particles that have fallen off screen
        if (particle.y > confettiCanvas.height + 10) {
            confettiParticles.splice(i, 1);
        }
    }
    
    if (confettiParticles.length > 0) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
        confettiActive = false;
    }
}

function triggerConfetti() {
    if (confettiActive) return; // Prevent multiple simultaneous confetti
    
    confettiActive = true;
    createConfetti();
    animateConfetti();
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator && isMobile) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Surprise button event - Mobile Enhanced
surpriseBtn?.addEventListener('click', function() {
    // Prevent multiple rapid clicks
    if (this.disabled) return;
    this.disabled = true;
    
    // Change button text
    const originalText = this.innerHTML;
    this.innerHTML = '🎉 Surprise! You are my everything! 🎉';
    this.style.background = 'linear-gradient(45deg, #ff6b9d, #f72585, #b5179e)';
    
    // Trigger confetti
    triggerConfetti();
    
    // Show surprise message with mobile-friendly alert
    setTimeout(() => {
        if (isMobile) {
            // Use a more mobile-friendly notification
            const message = '🐒💕 Happy Anniversary, my sweet Jerry! You make every day magical! 💕🐒';
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Anniversary Surprise!', { body: message, icon: '💕' });
            } else {
                alert(message);
            }
        } else {
            alert('🐒💕 Happy Anniversary, my sweet Jerry! You make every day magical! 💕🐒');
        }
    }, 500);
    
    // Reset button after 3 seconds
    setTimeout(() => {
        this.innerHTML = originalText;
        this.style.background = '';
        this.disabled = false;
    }, 3000);
});

// Request notification permission on mobile
if (isMobile && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Navigation smooth scroll
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Add scroll spy for navigation
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-pink-800', 'font-semibold');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-pink-800', 'font-semibold');
        }
    });
});

// Create floating hearts periodically - Mobile Optimized
function createFloatingHeart() {
    if (!isPageVisible || isLowPerformance) return;
    
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + (isMobile ? 6 : 5)) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    const heartsContainer = document.querySelector('.floating-hearts');
    if (heartsContainer) {
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation with mobile-optimized timing
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, isMobile ? 9000 : 8000);
    }
}

// Create new floating hearts with mobile consideration
let heartInterval;
function startHeartAnimation() {
    if (heartInterval) clearInterval(heartInterval);
    
    const interval = isMobile ? 4000 : 3000;
    heartInterval = setInterval(() => {
        if (isPageVisible && !document.hidden) {
            createFloatingHeart();
        }
    }, interval);
}

// Start heart animation
startHeartAnimation();

// Pause hearts when page is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (heartInterval) clearInterval(heartInterval);
    } else {
        startHeartAnimation();
    }
});

// Preload images with placeholder
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create a placeholder for missing images
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmNlN2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2VjNDg5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBob3RvIE1lbW9yeSAyODE+PC90ZXh0Pjwvc3ZnPg==';
            this.alt = 'Beautiful Memory ❤️';
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    
    // Add some initial floating hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingHeart, i * 1000);
    }
});

// Add touch support for mobile gallery - Enhanced
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;

const galleryContainer = document.querySelector('.gallery-container');

if (galleryContainer) {
    galleryContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = Date.now();
        pauseGalleryAutoAdvance();
    }, { passive: true });

    galleryContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    // Add click event listeners to gallery buttons
    const prevBtn = document.querySelector('button[onclick="previousSlide()"]');
    const nextBtn = document.querySelector('button[onclick="nextSlide()"]');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            pauseGalleryAutoAdvance();
            if ('vibrate' in navigator) navigator.vibrate(30);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            pauseGalleryAutoAdvance();
            if ('vibrate' in navigator) navigator.vibrate(30);
        });
    }
}

function handleSwipe() {
    const swipeThreshold = 50;
    const timeThreshold = 300; // Maximum time for a swipe
    const verticalThreshold = 100; // Maximum vertical movement for horizontal swipe
    
    const timeDiff = Date.now() - touchStartTime;
    const horizontalDiff = touchStartX - touchEndX;
    const verticalDiff = Math.abs(touchStartY - touchEndY);
    
    // Only process if it's a quick swipe and mostly horizontal
    if (timeDiff < timeThreshold && 
        Math.abs(horizontalDiff) > swipeThreshold && 
        verticalDiff < verticalThreshold) {
        
        if (horizontalDiff > 0) {
            nextSlide(); // Swipe left - next slide
        } else {
            previousSlide(); // Swipe right - previous slide
        }
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
}

// Add some easter eggs
let clickCount = 0;
document.addEventListener('click', function(e) {
    clickCount++;
    if (clickCount % 20 === 0) {
        triggerConfetti();
        console.log('🐒💕 You found an easter egg! Keep exploring! 💕🐒');
    }
});

// Performance optimization: Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe timeline items for better performance
document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

console.log('💕 Love Anniversary Website Loaded Successfully! 💕');
console.log('🐒 Special message for Jerry: You are loved beyond words! 💕');
console.log('💕 From your loving Mankada (Soumya) with all my heart! 🐒');
