/**
 * Star Map Page Manager
 * Handles interactive star chart with constellation animations
 */

class StarMapManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.stars = [];
        this.constellations = [];
        this.currentDate = new Date();
        this.isPlaying = false;
        this.playInterval = null;
        this.zoom = 1;
        this.brightness = 1;
        this.showConstellations = false;
        this.selectedStar = null;
        this.mousePos = { x: 0, y: 0 };
        
        this.audioManager = {
            ambient: null,
            starClick: null,
            constellation: null
        };

        this.memories = [
            {
                date: '2023-02-14',
                title: 'First Valentine\'s Day',
                description: 'Under the constellation of Orion, we shared our first Valentine\'s Day together. The stars seemed to shine brighter that night.',
                pattern: 'orion'
            },
            {
                date: '2023-06-15',
                title: 'Anniversary Night',
                description: 'The summer stars witnessed our anniversary celebration. Cassiopeia watched over us as we danced under the night sky.',
                pattern: 'cassiopeia'
            },
            {
                date: '2023-12-25',
                title: 'Christmas Together',
                description: 'The winter constellations sparkled like Christmas lights as we celebrated our first Christmas together.',
                pattern: 'ursa_major'
            }
        ];

        this.init();
    }

    init() {
        this.setupCanvas();
        this.generateStars();
        this.setupConstellations();
        this.setupEventListeners();
        this.initializeAudio();
        this.startAnimation();
        this.hideLoading();
    }

    setupCanvas() {
        this.canvas = document.getElementById('starCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    generateStars() {
        const numStars = 800;
        this.stars = [];

        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                brightness: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
                name: this.generateStarName(),
                magnitude: Math.random() * 6,
                constellation: null
            });
        }
    }

    generateStarName() {
        const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
        const suffixes = ['Centauri', 'Draconis', 'Lyrae', 'Aquilae', 'Orionis', 'Ursae'];
        return prefixes[Math.floor(Math.random() * prefixes.length)] + ' ' + 
               suffixes[Math.floor(Math.random() * suffixes.length)];
    }

    setupConstellations() {
        this.constellations = [
            {
                name: 'Love\'s Triangle',
                description: 'A constellation representing the eternal triangle of love, trust, and commitment.',
                stars: this.getRandomStars(3),
                color: '#ff69b4',
                visible: false
            },
            {
                name: 'Heart of the Sky',
                description: 'The celestial heart that beats in rhythm with lovers\' hearts.',
                stars: this.getRandomStars(5),
                color: '#ffd700',
                visible: false
            },
            {
                name: 'Eternal Bond',
                description: 'Two stars forever circling each other, like souls destined to be together.',
                stars: this.getRandomStars(2),
                color: '#87ceeb',
                visible: false
            },
            {
                name: 'Promise Ring',
                description: 'A perfect circle of stars symbolizing unbroken promises.',
                stars: this.getRandomStars(8),
                color: '#dda0dd',
                visible: false
            }
        ];
    }

    getRandomStars(count) {
        const selectedStars = [];
        for (let i = 0; i < count; i++) {
            const star = this.stars[Math.floor(Math.random() * this.stars.length)];
            selectedStars.push(star);
            star.constellation = selectedStars;
        }
        return selectedStars;
    }

    setupEventListeners() {
        // Date picker toggle
        const datePickerBtn = document.getElementById('datePickerBtn');
        const dateOverlay = document.getElementById('dateOverlay');
        const closeDateOverlay = document.getElementById('closeDateOverlay');

        if (datePickerBtn && dateOverlay) {
            datePickerBtn.addEventListener('click', () => {
                dateOverlay.classList.add('active');
            });
        }

        if (closeDateOverlay && dateOverlay) {
            closeDateOverlay.addEventListener('click', () => {
                dateOverlay.classList.remove('active');
            });
        }

        // Special date buttons
        document.querySelectorAll('.special-date-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const date = e.target.dataset.date;
                this.setDate(new Date(date));
                this.showMemoryForDate(date);
                dateOverlay.classList.remove('active');
            });
        });

        // Constellation toggle
        const constellationToggle = document.getElementById('constellationToggle');
        if (constellationToggle) {
            constellationToggle.addEventListener('click', () => {
                this.toggleConstellations();
            });
        }

        // Time controls
        this.setupTimeControls();

        // View controls
        this.setupViewControls();

        // Feature buttons
        this.setupFeatureButtons();

        // Canvas interactions
        this.setupCanvasInteractions();
    }

    setupTimeControls() {
        const timeBack = document.getElementById('timeBack');
        const timePlay = document.getElementById('timePlay');
        const timeForward = document.getElementById('timeForward');

        if (timeBack) {
            timeBack.addEventListener('click', () => {
                this.adjustTime(-1);
            });
        }

        if (timePlay) {
            timePlay.addEventListener('click', () => {
                this.toggleTimeAnimation();
            });
        }

        if (timeForward) {
            timeForward.addEventListener('click', () => {
                this.adjustTime(1);
            });
        }
    }

    setupViewControls() {
        const zoomSlider = document.getElementById('zoomSlider');
        const brightnessSlider = document.getElementById('brightnessSlider');

        if (zoomSlider) {
            zoomSlider.addEventListener('input', (e) => {
                this.zoom = parseFloat(e.target.value);
            });
        }

        if (brightnessSlider) {
            brightnessSlider.addEventListener('input', (e) => {
                this.brightness = parseFloat(e.target.value);
            });
        }
    }

    setupFeatureButtons() {
        const loveConstellationBtn = document.getElementById('loveConstellationBtn');
        const shootingStarsBtn = document.getElementById('shootingStarsBtn');
        const planetaryBtn = document.getElementById('planetaryBtn');

        if (loveConstellationBtn) {
            loveConstellationBtn.addEventListener('click', () => {
                this.showLoveConstellation();
            });
        }

        if (shootingStarsBtn) {
            shootingStarsBtn.addEventListener('click', () => {
                this.createShootingStars();
            });
        }

        if (planetaryBtn) {
            planetaryBtn.addEventListener('click', () => {
                this.showPlanets();
            });
        }
    }

    setupCanvasInteractions() {
        if (!this.canvas) return;

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos.x = e.clientX - rect.left;
            this.mousePos.y = e.clientY - rect.top;
            
            this.checkStarHover();
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            this.handleStarClick(clickX, clickY);
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    checkStarHover() {
        const hoveredStar = this.getStarAt(this.mousePos.x, this.mousePos.y);
        
        if (hoveredStar && hoveredStar !== this.selectedStar) {
            this.selectedStar = hoveredStar;
            this.showTooltip(hoveredStar);
        } else if (!hoveredStar && this.selectedStar) {
            this.selectedStar = null;
            this.hideTooltip();
        }
    }

    getStarAt(x, y) {
        for (const star of this.stars) {
            const distance = Math.sqrt(
                Math.pow(x - star.x * this.zoom, 2) + 
                Math.pow(y - star.y * this.zoom, 2)
            );
            
            if (distance < star.size * this.zoom + 5) {
                return star;
            }
        }
        return null;
    }

    showTooltip(star) {
        const tooltip = document.getElementById('starTooltip');
        if (!tooltip) return;

        const titleEl = document.getElementById('tooltipTitle');
        const descEl = document.getElementById('tooltipDescription');
        const coordsEl = document.getElementById('tooltipCoords');

        if (titleEl) titleEl.textContent = star.name;
        if (descEl) descEl.textContent = `Magnitude: ${star.magnitude.toFixed(2)} | Brightness: ${(star.brightness * 100).toFixed(0)}%`;
        if (coordsEl) coordsEl.textContent = `X: ${star.x.toFixed(0)}, Y: ${star.y.toFixed(0)}`;

        tooltip.style.left = this.mousePos.x + 10 + 'px';
        tooltip.style.top = this.mousePos.y - 50 + 'px';
        tooltip.classList.add('active');
    }

    hideTooltip() {
        const tooltip = document.getElementById('starTooltip');
        if (tooltip) {
            tooltip.classList.remove('active');
        }
    }

    handleStarClick(x, y) {
        const clickedStar = this.getStarAt(x, y);
        
        if (clickedStar) {
            this.playSound('starClick');
            this.createStarClickEffect(clickedStar);
            
            if (clickedStar.constellation) {
                this.showConstellationInfo(clickedStar.constellation);
            }
        }
    }

    createStarClickEffect(star) {
        // Create ripple effect
        const ripple = {
            x: star.x,
            y: star.y,
            radius: 0,
            maxRadius: 50,
            opacity: 1,
            growing: true
        };

        const animateRipple = () => {
            if (ripple.growing) {
                ripple.radius += 2;
                ripple.opacity -= 0.02;
                
                if (ripple.radius >= ripple.maxRadius) {
                    ripple.growing = false;
                }
            }

            this.drawRipple(ripple);

            if (ripple.opacity > 0) {
                requestAnimationFrame(animateRipple);
            }
        };

        animateRipple();
    }

    drawRipple(ripple) {
        if (!this.ctx) return;

        this.ctx.save();
        this.ctx.globalAlpha = ripple.opacity;
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(ripple.x * this.zoom, ripple.y * this.zoom, ripple.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    toggleConstellations() {
        this.showConstellations = !this.showConstellations;
        
        this.constellations.forEach(constellation => {
            constellation.visible = this.showConstellations;
        });

        if (this.showConstellations) {
            this.playSound('constellation');
        }

        const toggle = document.getElementById('constellationToggle');
        if (toggle) {
            toggle.style.background = this.showConstellations ? 
                'rgba(255, 215, 0, 0.5)' : 'rgba(255, 215, 0, 0.2)';
        }
    }

    setDate(date) {
        this.currentDate = date;
        this.updateTimeDisplay();
        this.updateStarPositions();
    }

    adjustTime(hours) {
        this.currentDate.setHours(this.currentDate.getHours() + hours);
        this.updateTimeDisplay();
        this.updateStarPositions();
    }

    toggleTimeAnimation() {
        const playBtn = document.getElementById('timePlay');
        if (!playBtn) return;

        if (this.isPlaying) {
            clearInterval(this.playInterval);
            this.isPlaying = false;
            playBtn.textContent = '▶️ Play';
            playBtn.dataset.playing = 'false';
        } else {
            this.playInterval = setInterval(() => {
                this.adjustTime(0.1);
            }, 100);
            this.isPlaying = true;
            playBtn.textContent = '⏸️ Pause';
            playBtn.dataset.playing = 'true';
        }
    }

    updateTimeDisplay() {
        const timeDisplay = document.getElementById('currentTime');
        if (timeDisplay) {
            timeDisplay.textContent = this.currentDate.toLocaleString();
        }
    }

    updateStarPositions() {
        // Simulate star movement based on time
        const timeOffset = (this.currentDate.getTime() - Date.now()) / 3600000; // hours
        
        this.stars.forEach(star => {
            star.twinklePhase += timeOffset * 0.01;
        });
    }

    showLoveConstellation() {
        const loveConstellation = {
            name: 'Our Love',
            description: 'A special constellation just for us, formed by the stars that witnessed our love story.',
            stars: this.getRandomStars(7),
            color: '#ff1493',
            visible: true
        };

        this.constellations.push(loveConstellation);
        this.showConstellations = true;
        this.playSound('constellation');
        
        // Show info panel
        this.showConstellationInfo(loveConstellation);
    }

    createShootingStars() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createShootingStar();
            }, i * 500);
        }
    }

    createShootingStar() {
        const shootingStar = {
            x: Math.random() * this.canvas.width,
            y: 0,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            trail: [],
            life: 100
        };

        const animateShootingStar = () => {
            shootingStar.x += shootingStar.vx;
            shootingStar.y += shootingStar.vy;
            shootingStar.life--;

            // Add to trail
            shootingStar.trail.push({ x: shootingStar.x, y: shootingStar.y });
            if (shootingStar.trail.length > 10) {
                shootingStar.trail.shift();
            }

            this.drawShootingStar(shootingStar);

            if (shootingStar.life > 0 && shootingStar.y < this.canvas.height) {
                requestAnimationFrame(animateShootingStar);
            }
        };

        animateShootingStar();
    }

    drawShootingStar(shootingStar) {
        if (!this.ctx) return;

        this.ctx.save();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = shootingStar.life / 100;

        this.ctx.beginPath();
        for (let i = 0; i < shootingStar.trail.length - 1; i++) {
            const current = shootingStar.trail[i];
            const next = shootingStar.trail[i + 1];
            
            this.ctx.moveTo(current.x, current.y);
            this.ctx.lineTo(next.x, next.y);
        }
        this.ctx.stroke();
        this.ctx.restore();
    }

    showPlanets() {
        // Add some "planets" (larger, colored dots)
        const planets = [
            { name: 'Venus', color: '#ffc649', size: 8 },
            { name: 'Mars', color: '#ff6b6b', size: 6 },
            { name: 'Jupiter', color: '#f39c12', size: 12 }
        ];

        planets.forEach((planet, index) => {
            const planetObj = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: planet.size,
                color: planet.color,
                name: planet.name,
                isPlanet: true
            };

            this.stars.push(planetObj);
        });
    }

    showConstellationInfo(constellation) {
        const infoPanel = document.getElementById('constellationInfo');
        const nameEl = document.getElementById('constellationName');
        const descEl = document.getElementById('constellationDescription');
        const starCountEl = document.getElementById('starCount');
        const brightnessEl = document.getElementById('brightness');

        if (!infoPanel) return;

        if (nameEl) nameEl.textContent = constellation.name;
        if (descEl) descEl.textContent = constellation.description;
        if (starCountEl) starCountEl.textContent = constellation.stars.length;
        if (brightnessEl) {
            const avgBrightness = constellation.stars.reduce((sum, star) => sum + star.brightness, 0) / constellation.stars.length;
            brightnessEl.textContent = (avgBrightness * 100).toFixed(0) + '%';
        }

        infoPanel.classList.add('active');

        // Hide after 5 seconds
        setTimeout(() => {
            infoPanel.classList.remove('active');
        }, 5000);
    }

    showMemoryForDate(dateStr) {
        const memory = this.memories.find(m => m.date === dateStr);
        if (!memory) return;

        const overlay = document.getElementById('memoryOverlay');
        const titleEl = document.getElementById('memoryTitle');
        const descEl = document.getElementById('memoryDescription');
        const dateEl = document.getElementById('memoryDate');

        if (!overlay) return;

        if (titleEl) titleEl.textContent = memory.title;
        if (descEl) descEl.textContent = memory.description;
        if (dateEl) dateEl.textContent = new Date(memory.date).toLocaleDateString();

        overlay.classList.add('active');

        // Close button
        const closeBtn = document.getElementById('closeMemory');
        if (closeBtn) {
            closeBtn.onclick = () => overlay.classList.remove('active');
        }
    }

    initializeAudio() {
        try {
            this.audioManager.ambient = document.getElementById('ambientSound');
            this.audioManager.starClick = document.getElementById('starClickSound');
            this.audioManager.constellation = document.getElementById('constellationSound');

            // Set volumes
            Object.values(this.audioManager).forEach(audio => {
                if (audio) {
                    audio.volume = 0.3;
                }
            });

            // Start ambient sound (if user has interacted)
            document.addEventListener('click', () => {
                if (this.audioManager.ambient && this.audioManager.ambient.paused) {
                    this.audioManager.ambient.play().catch(() => {});
                }
            }, { once: true });

        } catch (error) {
            console.log('Audio initialization failed:', error);
        }
    }

    playSound(type) {
        try {
            const audio = this.audioManager[type];
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => {});
            }
        } catch (error) {
            console.log('Sound play failed:', error);
        }
    }

    startAnimation() {
        const animate = () => {
            this.clearCanvas();
            this.drawStars();
            this.drawConstellations();
            requestAnimationFrame(animate);
        };
        animate();
    }

    clearCanvas() {
        if (!this.ctx) return;
        
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStars() {
        if (!this.ctx) return;

        this.stars.forEach(star => {
            const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinklePhase);
            const currentBrightness = (star.brightness + twinkle * 0.3) * this.brightness;
            
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, Math.min(1, currentBrightness));
            
            if (star.isPlanet) {
                this.ctx.fillStyle = star.color;
            } else {
                this.ctx.fillStyle = '#ffffff';
            }
            
            this.ctx.beginPath();
            this.ctx.arc(
                star.x * this.zoom, 
                star.y * this.zoom, 
                star.size * this.zoom, 
                0, 
                Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawConstellations() {
        if (!this.ctx || !this.showConstellations) return;

        this.constellations.forEach(constellation => {
            if (!constellation.visible) return;

            this.ctx.save();
            this.ctx.strokeStyle = constellation.color;
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = 0.6;

            const stars = constellation.stars;
            
            // Draw lines between stars
            this.ctx.beginPath();
            for (let i = 0; i < stars.length; i++) {
                const current = stars[i];
                const next = stars[(i + 1) % stars.length];
                
                if (i === 0) {
                    this.ctx.moveTo(current.x * this.zoom, current.y * this.zoom);
                }
                this.ctx.lineTo(next.x * this.zoom, next.y * this.zoom);
            }
            this.ctx.stroke();
            this.ctx.restore();
        });
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const progressBar = document.getElementById('loadingProgress');
        
        if (progressBar) {
            let progress = 0;
            const updateProgress = () => {
                progress += 2;
                progressBar.style.width = progress + '%';
                
                if (progress < 100) {
                    setTimeout(updateProgress, 50);
                } else {
                    setTimeout(() => {
                        if (loadingOverlay) {
                            loadingOverlay.classList.add('hidden');
                        }
                    }, 500);
                }
            };
            updateProgress();
        } else if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 2000);
        }
    }
}

// Initialize the star map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const starMapManager = new StarMapManager();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StarMapManager;
}
