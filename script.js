// Love Anniversary Website JavaScript

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Initialize Particles.js
particlesJS('particles-js', {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800
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
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: false
        },
        move: {
            enable: true,
            speed: 1,
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
                enable: true,
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
                distance: 100,
                size: 6,
                duration: 2,
                opacity: 0.8,
                speed: 3
            },
            repulse: {
                distance: 100,
                duration: 0.4
            }
        }
    },
    retina_detect: true
});

// Typed.js Animation
document.addEventListener('DOMContentLoaded', function() {
    const typed = new Typed('#typed-text', {        strings: [
            'You light up my world like nobody else... ✨',
            'Every moment with you is a treasure... 💎',
            'You are my today and all of my tomorrows... 🌅',
            'My heart beats only for you, Puja... 💓',
            'Forever grateful for my sweet Jerry... 🐒💕',
            'You are my greatest adventure... 🌟',
            'In your arms, I have found my home... 🏠💖'
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

// Gallery Functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.gallery-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentSlideIndex = index;
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

// Auto-advance gallery every 5 seconds
setInterval(nextSlide, 5000);

// Music Player Functionality
const musicPlayer = document.getElementById('background-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const volumeSlider = document.getElementById('volume-slider');
const youtubePlayer = document.getElementById('youtube-player');

let isPlaying = false;
let useYoutube = true; // Set to true to use YouTube player

// Initialize volume
musicPlayer.volume = 0.5;

playPauseBtn.addEventListener('click', function() {
    if (useYoutube) {
        // Toggle YouTube player
        if (!isPlaying) {
            // Start YouTube music
            youtubePlayer.src = youtubePlayer.src.replace('autoplay=0', 'autoplay=1');
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            isPlaying = true;
        } else {
            // Pause YouTube music (reload with autoplay=0)
            youtubePlayer.src = youtubePlayer.src.replace('autoplay=1', 'autoplay=0');
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            isPlaying = false;
        }
    } else {
        // Use HTML5 audio
        if (musicPlayer.paused) {
            musicPlayer.play().then(() => {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                isPlaying = true;
            }).catch(e => {
                console.log('Audio play failed:', e);
                // Fallback to YouTube
                useYoutube = true;
                playPauseBtn.click();
            });
        } else {
            musicPlayer.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            isPlaying = false;
        }
    }
});

volumeSlider.addEventListener('input', function() {
    if (!useYoutube) {
        musicPlayer.volume = this.value / 100;
    }
    // Note: YouTube embedded player volume control is limited due to API restrictions
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Surprise Button with Confetti
const surpriseBtn = document.getElementById('surprise-btn');
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Confetti particle class
class Confetti {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -10;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 + 1;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
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

function createConfetti() {
    for (let i = 0; i < 150; i++) {
        confettiParticles.push(new Confetti());
    }
}

function animateConfetti() {
    if (!confettiActive) return;
    
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
        requestAnimationFrame(animateConfetti);
    } else {
        confettiActive = false;
    }
}

function triggerConfetti() {
    confettiActive = true;
    createConfetti();
    animateConfetti();
}

// Surprise button event
surpriseBtn.addEventListener('click', function() {
    // Change button text
    const originalText = this.innerHTML;
    this.innerHTML = '🎉 Surprise! You are my everything! 🎉';
    this.style.background = 'linear-gradient(45deg, #ff6b9d, #f72585, #b5179e)';
    
    // Trigger confetti
    triggerConfetti();
      // Show surprise message
    setTimeout(() => {
        alert('🐒💕 Happy Anniversary, my sweet Jerry! You make every day magical! 💕🐒');
    }, 500);
    
    // Reset button after 3 seconds
    setTimeout(() => {
        this.innerHTML = originalText;
        this.style.background = '';
    }, 3000);
});

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

// Create floating hearts periodically
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

// Create new floating hearts every 3 seconds
setInterval(createFloatingHeart, 3000);

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

// Add touch support for mobile gallery
let touchStartX = 0;
let touchEndX = 0;

const galleryContainer = document.querySelector('.gallery-container');

galleryContainer.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

galleryContainer.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide(); // Swipe left - next slide
        } else {
            previousSlide(); // Swipe right - previous slide
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
