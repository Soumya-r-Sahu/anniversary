/**
 * Challenges Page Manager - Enhanced Interactive Challenges System
 * Handles challenge tracking, filtering, creation, and 3D effects
 */

export class ChallengesManager {
    constructor() {
        this.challenges = [
            {
                id: 1,
                title: "Deep Conversation Challenge",
                category: "communication",
                description: "Share one meaningful story from your past each day for a week",
                progress: 43,
                progressText: "3/7 days completed",
                status: "active",
                icon: "💬",
                difficulty: "medium",
                duration: 7,
                reward: "Special dinner date"
            },
            {
                id: 2,
                title: "Explore New Places",
                category: "adventure",
                description: "Visit 5 new places in our city we've never been to before",
                progress: 20,
                progressText: "1/5 places visited",
                status: "pending",
                icon: "🗺️",
                difficulty: "easy",
                duration: 30,
                reward: "Weekend getaway"
            },
            {
                id: 3,
                title: "Create Together",
                category: "creative",
                description: "Make something beautiful together - art, music, or craft project",
                progress: 100,
                progressText: "Completed! ✨",
                status: "completed",
                icon: "🎨",
                difficulty: "medium",
                duration: 14,
                reward: "Gallery display"
            },
            {
                id: 4,
                title: "Love Language Week",
                category: "romantic",
                description: "Express love in each other's love language for one week",
                progress: 71,
                progressText: "5/7 days completed",
                status: "active",
                icon: "💕",
                difficulty: "easy",
                duration: 7,
                reward: "Spa day together"
            },
            {
                id: 5,
                title: "Game Night Marathon",
                category: "fun",
                description: "Play 10 different games together over the next month",
                progress: 0,
                progressText: "0/10 games played",
                status: "pending",
                icon: "🎪",
                difficulty: "easy",
                duration: 30,
                reward: "Gaming setup upgrade"
            },
            {
                id: 6,
                title: "Gratitude Exchange",
                category: "communication",
                description: "Share three things you're grateful for about each other daily",
                progress: 60,
                progressText: "6/10 days completed",
                status: "active",
                icon: "💭",
                difficulty: "easy",
                duration: 10,
                reward: "Memory book creation"
            }
        ];
        
        this.templates = {
            'love-letter': {
                title: "Love Letter Challenge",
                category: "romantic",
                description: "Write heartfelt letters to each other expressing your deepest feelings",
                duration: 7,
                difficulty: "easy",
                reward: "Letter reading ceremony"
            },
            'photo': {
                title: "Photo Challenge",
                category: "creative",
                description: "Capture beautiful moments together with daily photo themes",
                duration: 14,
                difficulty: "easy",
                reward: "Photo album creation"
            },
            'cooking': {
                title: "Cooking Challenge",
                category: "fun",
                description: "Cook new recipes from different cuisines together",
                duration: 21,
                difficulty: "medium",
                reward: "Cooking class together"
            },
            'kindness': {
                title: "Acts of Kindness",
                category: "romantic",
                description: "Perform random acts of love and kindness for each other",
                duration: 14,
                difficulty: "easy",
                reward: "Kindness celebration dinner"
            }
        };
        
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        this.initializeParticleSystem();
        this.initialize3DEffects();
        this.initializeFilterSystem();
        this.initializeFormHandlers();
        this.initializeTemplateHandlers();
        this.initializeChallengeActions();
        this.renderChallenges();
        this.showWelcomeMessage();
        
        console.log('🎮 Challenges Manager initialized with enhanced 3D effects');
    }
    
    initializeParticleSystem() {
        const container = document.getElementById('challengesParticles');
        if (!container) return;
        
        const gameEmojis = ['🎮', '🏆', '🎯', '🎲', '🃏', '🎪', '🎨', '🏅', '⭐', '🎊'];
        
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 25 + 15}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${Math.random() * 0.8 + 0.2};
                pointer-events: none;
                z-index: 1;
                animation: challengeParticleFloat ${Math.random() * 10 + 8}s ease-in-out infinite;
                transform-style: preserve-3d;
            `;
            particle.textContent = gameEmojis[Math.floor(Math.random() * gameEmojis.length)];
            particle.style.filter = `drop-shadow(0 0 15px rgba(16, 185, 129, 0.6)) brightness(1.3)`;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 15000);
        };
        
        // Create initial particles
        for (let i = 0; i < 25; i++) {
            setTimeout(() => createParticle(), i * 200);
        }
        
        // Continuous particle generation
        setInterval(createParticle, 800);
        
        this.addParticleAnimations();
    }
    
    addParticleAnimations() {
        if (!document.querySelector('#challengeParticleStyle')) {
            const style = document.createElement('style');
            style.id = 'challengeParticleStyle';
            style.textContent = `
                @keyframes challengeParticleFloat {
                    0%, 100% { 
                        transform: translateY(0) rotateZ(0deg) scale(1);
                        filter: brightness(1) hue-rotate(0deg) drop-shadow(0 0 15px rgba(16, 185, 129, 0.6));
                    }
                    25% { 
                        transform: translateY(-30px) rotateZ(90deg) scale(1.2);
                        filter: brightness(1.4) hue-rotate(90deg) drop-shadow(0 0 20px rgba(59, 130, 246, 0.8));
                    }
                    50% { 
                        transform: translateY(-50px) rotateZ(180deg) scale(1.4);
                        filter: brightness(1.6) hue-rotate(180deg) drop-shadow(0 0 25px rgba(139, 92, 246, 1));
                    }
                    75% { 
                        transform: translateY(-30px) rotateZ(270deg) scale(1.2);
                        filter: brightness(1.4) hue-rotate(270deg) drop-shadow(0 0 20px rgba(59, 130, 246, 0.8));
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    initialize3DEffects() {
        const challengeCards = document.querySelectorAll('.challenge-card');
        challengeCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            
            card.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'perspective(1000px) rotateX(-10deg) rotateY(15deg) translateY(-20px) scale(1.08)';
                e.target.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.2)';
                this.createSparkleEffect(e.target);
            });
            
            card.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(0deg) translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('click', (e) => {
                e.target.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(720deg) scale(1.15)';
                setTimeout(() => {
                    e.target.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(0deg) scale(1)';
                }, 800);
                
                this.createAchievementEffect(e.target);
            });
        });
        
        // Mouse movement parallax effect
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.challenge-card');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            cards.forEach((card, index) => {
                const intensity = (index % 2 === 0) ? 1 : -1;
                const xRotation = (mouseY - 0.5) * 8 * intensity;
                const yRotation = (mouseX - 0.5) * 8 * intensity;
                
                if (!card.matches(':hover')) {
                    card.style.transform = `perspective(1000px) rotateX(${10 + xRotation}deg) rotateY(${yRotation}deg)`;
                }
            });
        });
    }
    
    initializeFilterSystem() {
        const filterButtons = document.querySelectorAll('.challenge-filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update current filter
                this.currentFilter = e.target.dataset.category;
                
                // Re-render challenges with filter
                this.renderChallenges();
                
                // Create filter effect
                this.createFilterEffect(e.target);
            });
        });
    }
    
    initializeFormHandlers() {
        const form = document.querySelector('.challenge-form');
        const descriptionTextarea = document.getElementById('challengeDescription');
        const descCounter = document.getElementById('descCounter');
        
        // Character counter for description
        if (descriptionTextarea && descCounter) {
            descriptionTextarea.addEventListener('input', (e) => {
                const length = e.target.value.length;
                descCounter.textContent = length;
                
                if (length > 450) {
                    descCounter.style.color = '#ef4444';
                } else if (length > 350) {
                    descCounter.style.color = '#f59e0b';
                } else {
                    descCounter.style.color = '#6b7280';
                }
            });
        }
        
        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleChallengeCreation();
            });
        }
    }
    
    initializeTemplateHandlers() {
        const templateButtons = document.querySelectorAll('.use-template');
        
        templateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const templateType = e.target.dataset.template;
                this.useTemplate(templateType);
                this.createTemplateEffect(e.target);
            });
        });
    }
    
    initializeChallengeActions() {
        // Event delegation for dynamically created buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('complete-challenge')) {
                this.completeChallenge(e.target);
            } else if (e.target.classList.contains('start-challenge')) {
                this.startChallenge(e.target);
            } else if (e.target.classList.contains('view-details')) {
                this.viewChallengeDetails(e.target);
            }
        });
    }
    
    renderChallenges() {
        const grid = document.querySelector('.challenges-grid');
        if (!grid) return;
        
        // Filter challenges
        const filteredChallenges = this.currentFilter === 'all' 
            ? this.challenges 
            : this.challenges.filter(challenge => challenge.category === this.currentFilter);
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Render filtered challenges
        filteredChallenges.forEach((challenge, index) => {
            const challengeCard = this.createChallengeCard(challenge);
            challengeCard.style.opacity = '0';
            challengeCard.style.transform = 'perspective(1000px) rotateX(60deg) translateY(80px) scale(0.8)';
            
            grid.appendChild(challengeCard);
            
            // Staggered animation
            setTimeout(() => {
                challengeCard.style.transition = 'all 1s ease-out';
                challengeCard.style.opacity = '1';
                challengeCard.style.transform = 'perspective(1000px) rotateX(10deg) translateY(0) scale(1)';
            }, index * 150);
        });
    }
    
    createChallengeCard(challenge) {
        const card = document.createElement('div');
        card.className = 'challenge-card';
        card.dataset.category = challenge.category;
        card.dataset.id = challenge.id;
        
        const statusClass = challenge.status;
        const statusText = challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1);
        
        card.innerHTML = `
            <div class="challenge-status">
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="challenge-icon">${challenge.icon}</div>
            <h3 class="challenge-title">${challenge.title}</h3>
            <p class="challenge-description">${challenge.description}</p>
            <div class="challenge-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${challenge.progress}%"></div>
                </div>
                <span class="progress-text">${challenge.progressText}</span>
            </div>
            <div class="challenge-actions">
                ${this.getChallengeActionButtons(challenge)}
            </div>
        `;
        
        return card;
    }
    
    getChallengeActionButtons(challenge) {
        switch (challenge.status) {
            case 'completed':
                return `
                    <button class="btn-success">Completed ✓</button>
                    <button class="btn-secondary view-details">View Details</button>
                `;
            case 'active':
                return `
                    <button class="btn-primary complete-challenge">Mark Complete</button>
                    <button class="btn-secondary view-details">View Details</button>
                `;
            case 'pending':
                return `
                    <button class="btn-primary start-challenge">Start Challenge</button>
                    <button class="btn-secondary view-details">View Details</button>
                `;
            default:
                return `
                    <button class="btn-secondary view-details">View Details</button>
                `;
        }
    }
    
    handleChallengeCreation() {
        const formData = new FormData(document.querySelector('.challenge-form'));
        const challengeData = Object.fromEntries(formData);
        
        // Create new challenge
        const newChallenge = {
            id: this.challenges.length + 1,
            title: challengeData.challengeTitle || 'New Challenge',
            category: challengeData.challengeCategory || 'fun',
            description: challengeData.challengeDescription || 'No description provided',
            progress: 0,
            progressText: '0% completed',
            status: 'pending',
            icon: this.getCategoryIcon(challengeData.challengeCategory),
            difficulty: challengeData.challengeDifficulty || 'easy',
            duration: parseInt(challengeData.challengeDuration) || 7,
            reward: challengeData.challengeReward || 'Special celebration'
        };
        
        this.challenges.push(newChallenge);
        this.renderChallenges();
        
        // Clear form
        document.querySelector('.challenge-form').reset();
        document.getElementById('descCounter').textContent = '0';
        
        // Show success message
        this.showNotification('success', 'Challenge Created!', 'Your new challenge has been added successfully!');
        
        // Create celebration effect
        this.createCelebrationEffect();
    }
    
    useTemplate(templateType) {
        const template = this.templates[templateType];
        if (!template) return;
        
        // Fill form with template data
        document.getElementById('challengeTitle').value = template.title;
        document.getElementById('challengeCategory').value = template.category;
        document.getElementById('challengeDescription').value = template.description;
        document.getElementById('challengeDuration').value = template.duration;
        document.getElementById('challengeDifficulty').value = template.difficulty;
        document.getElementById('challengeReward').value = template.reward;
        
        // Update character counter
        const descCounter = document.getElementById('descCounter');
        if (descCounter) {
            descCounter.textContent = template.description.length;
        }
        
        // Scroll to form
        document.querySelector('.challenge-creator').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        this.showNotification('info', 'Template Applied!', `${template.title} template has been loaded into the form.`);
    }
    
    getCategoryIcon(category) {
        const icons = {
            communication: '💬',
            adventure: '🗺️',
            creative: '🎨',
            romantic: '💕',
            fun: '🎪'
        };
        return icons[category] || '🌟';
    }
    
    completeChallenge(button) {
        const card = button.closest('.challenge-card');
        const challengeId = parseInt(card.dataset.id);
        const challenge = this.challenges.find(c => c.id === challengeId);
        
        if (challenge) {
            challenge.status = 'completed';
            challenge.progress = 100;
            challenge.progressText = 'Completed! ✨';
            
            this.renderChallenges();
            this.createCompletionEffect(card);
            this.showNotification('success', 'Challenge Completed!', `Congratulations on completing "${challenge.title}"!`);
        }
    }
    
    startChallenge(button) {
        const card = button.closest('.challenge-card');
        const challengeId = parseInt(card.dataset.id);
        const challenge = this.challenges.find(c => c.id === challengeId);
        
        if (challenge) {
            challenge.status = 'active';
            
            this.renderChallenges();
            this.createStartEffect(card);
            this.showNotification('info', 'Challenge Started!', `Good luck with "${challenge.title}"!`);
        }
    }
    
    viewChallengeDetails(button) {
        const card = button.closest('.challenge-card');
        const challengeId = parseInt(card.dataset.id);
        const challenge = this.challenges.find(c => c.id === challengeId);
        
        if (challenge) {
            this.showChallengeModal(challenge);
        }
    }
    
    showChallengeModal(challenge) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'challenge-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
        
        modal.innerHTML = `
            <div class="challenge-modal" style="
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
                backdrop-filter: blur(20px);
                border-radius: 2rem;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                text-align: center;
                border: 2px solid rgba(255, 255, 255, 0.5);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${challenge.icon}</div>
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #374151; font-family: 'Dancing Script', cursive;">${challenge.title}</h2>
                <p style="color: #6b7280; margin-bottom: 1.5rem; line-height: 1.6;">${challenge.description}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; text-align: left;">
                    <div>
                        <strong style="color: #374151;">Category:</strong><br>
                        <span style="color: #6b7280;">${challenge.category}</span>
                    </div>
                    <div>
                        <strong style="color: #374151;">Duration:</strong><br>
                        <span style="color: #6b7280;">${challenge.duration} days</span>
                    </div>
                    <div>
                        <strong style="color: #374151;">Difficulty:</strong><br>
                        <span style="color: #6b7280;">${challenge.difficulty}</span>
                    </div>
                    <div>
                        <strong style="color: #374151;">Reward:</strong><br>
                        <span style="color: #6b7280;">${challenge.reward}</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <div style="background: rgba(156, 163, 175, 0.3); height: 10px; border-radius: 10px; overflow: hidden; margin-bottom: 0.5rem;">
                        <div style="height: 100%; background: linear-gradient(90deg, #10b981, #059669); border-radius: 10px; width: ${challenge.progress}%; transition: width 0.8s ease;"></div>
                    </div>
                    <span style="color: #6b7280; font-weight: 500;">${challenge.progressText}</span>
                </div>
                
                <button onclick="this.closest('.challenge-modal-overlay').remove()" style="
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Effect Methods
    createSparkleEffect(element) {
        const sparkles = ['🌟', '⭐', '✨', '🎊', '🎉'];
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.cssText = `
                    position: fixed;
                    left: ${rect.left + Math.random() * rect.width}px;
                    top: ${rect.top + Math.random() * rect.height}px;
                    font-size: ${Math.random() * 20 + 15}px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: sparkleFloat 2s ease-out forwards;
                `;
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 2000);
            }, i * 80);
        }
        
        this.addSparkleAnimations();
    }
    
    createAchievementEffect(element) {
        const achievements = ['🏆', '🏅', '🎖️', '👑', '🥇'];
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const popup = document.createElement('div');
        popup.innerHTML = `
            <div style="font-size: 3rem;">${achievements[Math.floor(Math.random() * achievements.length)]}</div>
            <div style="font-size: 1rem; color: #10b981; font-weight: bold;">CHALLENGE ACCEPTED!</div>
        `;
        popup.style.cssText = `
            position: fixed;
            left: ${centerX - 75}px;
            top: ${centerY - 50}px;
            width: 150px;
            height: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
            backdrop-filter: blur(20px);
            border: 2px solid rgba(16, 185, 129, 0.5);
            border-radius: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: achievementPop 3s ease-out forwards;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 3000);
        
        this.addAchievementAnimations();
    }
    
    createCompletionEffect(element) {
        const confetti = ['🎉', '🎊', '✨', '🌟', '🎈'];
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const piece = document.createElement('div');
                piece.textContent = confetti[Math.floor(Math.random() * confetti.length)];
                const angle = (i * 18) * Math.PI / 180;
                const distance = 200;
                
                piece.style.cssText = `
                    position: fixed;
                    left: ${rect.left + rect.width / 2}px;
                    top: ${rect.top + rect.height / 2}px;
                    font-size: 25px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: confettiBlast 3s ease-out forwards;
                    --end-x: ${Math.cos(angle) * distance}px;
                    --end-y: ${Math.sin(angle) * distance}px;
                `;
                
                document.body.appendChild(piece);
                
                setTimeout(() => {
                    if (piece.parentNode) {
                        piece.parentNode.removeChild(piece);
                    }
                }, 3000);
            }, i * 50);
        }
        
        this.addConfettiAnimations();
    }
    
    createCelebrationEffect() {
        const celebration = ['🎉', '🎊', '🎈', '🎁', '🌟'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const element = document.createElement('div');
                element.textContent = celebration[Math.floor(Math.random() * celebration.length)];
                element.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 100}vw;
                    top: -50px;
                    font-size: ${Math.random() * 30 + 20}px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: celebrationFall 4s ease-out forwards;
                `;
                
                document.body.appendChild(element);
                
                setTimeout(() => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                }, 4000);
            }, i * 100);
        }
        
        this.addCelebrationAnimations();
    }
    
    addSparkleAnimations() {
        if (!document.querySelector('#sparkleAnimations')) {
            const style = document.createElement('style');
            style.id = 'sparkleAnimations';
            style.textContent = `
                @keyframes sparkleFloat {
                    0% { opacity: 1; transform: scale(0) rotate(0deg); filter: brightness(1); }
                    50% { opacity: 1; transform: scale(1.5) rotate(180deg); filter: brightness(1.5) hue-rotate(180deg); }
                    100% { opacity: 0; transform: scale(0) rotate(360deg) translateY(-80px); filter: brightness(2) hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addAchievementAnimations() {
        if (!document.querySelector('#achievementAnimations')) {
            const style = document.createElement('style');
            style.id = 'achievementAnimations';
            style.textContent = `
                @keyframes achievementPop {
                    0% { opacity: 0; transform: scale(0) rotateY(0deg); }
                    20% { opacity: 1; transform: scale(1.2) rotateY(180deg); }
                    80% { opacity: 1; transform: scale(1) rotateY(360deg); }
                    100% { opacity: 0; transform: scale(0.8) rotateY(720deg) translateY(-100px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addConfettiAnimations() {
        if (!document.querySelector('#confettiAnimations')) {
            const style = document.createElement('style');
            style.id = 'confettiAnimations';
            style.textContent = `
                @keyframes confettiBlast {
                    0% { opacity: 1; transform: scale(1) translate(0, 0) rotate(0deg); filter: brightness(1); }
                    50% { opacity: 1; transform: scale(1.3) translate(calc(var(--end-x) * 0.7), calc(var(--end-y) * 0.7)) rotate(360deg); filter: brightness(1.5) hue-rotate(180deg); }
                    100% { opacity: 0; transform: scale(0.7) translate(var(--end-x), var(--end-y)) rotate(720deg); filter: brightness(2) hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addCelebrationAnimations() {
        if (!document.querySelector('#celebrationAnimations')) {
            const style = document.createElement('style');
            style.id = 'celebrationAnimations';
            style.textContent = `
                @keyframes celebrationFall {
                    0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createFilterEffect(button) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(147, 51, 234, 0.6), transparent);
            pointer-events: none;
            z-index: 1000;
            animation: rippleEffect 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
        
        if (!document.querySelector('#rippleAnimations')) {
            const style = document.createElement('style');
            style.id = 'rippleAnimations';
            style.textContent = `
                @keyframes rippleEffect {
                    0% { width: 0; height: 0; opacity: 1; }
                    100% { width: 200px; height: 200px; margin: -100px 0 0 -100px; opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createTemplateEffect(button) {
        const rect = button.getBoundingClientRect();
        const magic = ['✨', '🌟', '⭐', '💫'];
        
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = magic[Math.floor(Math.random() * magic.length)];
                sparkle.style.cssText = `
                    position: fixed;
                    left: ${rect.left + Math.random() * rect.width}px;
                    top: ${rect.top + Math.random() * rect.height}px;
                    font-size: 20px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: magicSparkle 1.5s ease-out forwards;
                `;
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1500);
            }, i * 100);
        }
        
        if (!document.querySelector('#magicAnimations')) {
            const style = document.createElement('style');
            style.id = 'magicAnimations';
            style.textContent = `
                @keyframes magicSparkle {
                    0% { opacity: 1; transform: scale(1) translateY(0); }
                    100% { opacity: 0; transform: scale(1.5) translateY(-50px) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createStartEffect(element) {
        const startSymbols = ['🚀', '⚡', '🔥', '💪', '🎯'];
        const rect = element.getBoundingClientRect();
        
        const symbol = document.createElement('div');
        symbol.textContent = startSymbols[Math.floor(Math.random() * startSymbols.length)];
        symbol.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2 - 25}px;
            top: ${rect.top + rect.height / 2 - 25}px;
            font-size: 50px;
            pointer-events: none;
            z-index: 1000;
            animation: startPulse 2s ease-out forwards;
        `;
        
        document.body.appendChild(symbol);
        
        setTimeout(() => {
            if (symbol.parentNode) {
                symbol.parentNode.removeChild(symbol);
            }
        }, 2000);
        
        if (!document.querySelector('#startAnimations')) {
            const style = document.createElement('style');
            style.id = 'startAnimations';
            style.textContent = `
                @keyframes startPulse {
                    0% { transform: scale(0) rotate(0deg); opacity: 1; }
                    50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
                    100% { transform: scale(0.5) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    showNotification(type, title, message) {
        if (window.notificationManager) {
            window.notificationManager.show(type, title, message);
        }
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification(
                'info',
                'Welcome to Challenges! 🎮',
                'Track your progress, create new challenges, and celebrate your achievements together!'
            );
        }, 1500);
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.challengesManager = new ChallengesManager();
});

// Export for use in other modules
export default ChallengesManager;
