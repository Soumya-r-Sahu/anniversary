
import React, { useState, useEffect, useRef } from 'react';
import '../css/bucket-list.css';

const BucketListPage = () => {
    const [itemsViewed, setItemsViewed] = useState(0);
    const [totalItems, setTotalItems] = useState(9);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [completedItems, setCompletedItems] = useState([]);
    const [todoItems, setTodoItems] = useState([]);
    const [viewedItems, setViewedItems] = useState(new Set());
    const floatingDreamsRef = useRef(null);

    const defaultCompletedItems = [
        {
            id: 1,
            icon: "🎬",
            title: "First Movie Date",
            description: "Our magical first movie date where we shared popcorn and stolen glances. The movie was good, but watching you was even better."
        },
        {
            id: 2,
            icon: "🌅",
            title: "Watch Sunrise Together",
            description: "That beautiful morning when we woke up early just to watch the sun rise together, holding hands in comfortable silence."
        },
        {
            id: 3,
            icon: "🍳",
            title: "Cook Together",
            description: "Our first attempt at cooking together - it was messy, chaotic, and absolutely perfect. The food was okay, but the memories were incredible."
        },
        {
            id: 4,
            icon: "💌",
            title: "Write Love Letters",
            description: "Handwritten letters expressing our deepest feelings - old-fashioned romance in a digital world. Each letter is a treasure."
        }
    ];

    const defaultTodoItems = [
        {
            id: 5,
            icon: "✈️",
            title: "Travel to Paris",
            description: "Walk along the Seine River, visit the Eiffel Tower at sunset, and share a kiss on the Pont des Arts bridge."
        },
        {
            id: 6,
            icon: "🏡",
            title: "Build Our Dream Home",
            description: "Create our perfect sanctuary with a garden, cozy reading nooks, and a kitchen where we'll make countless memories."
        },
        {
            id: 7,
            icon: "🌌",
            title: "Stargaze in the Desert",
            description: "Escape to a remote desert location to see the Milky Way in all its glory, just us and the infinite universe above."
        },
        {
            id: 8,
            icon: "🎭",
            title: "Learn to Dance",
            description: "Take dance lessons together - maybe salsa, waltz, or swing dancing. Creating magic through movement and music."
        },
        {
            id: 9,
            icon: "📚",
            title: "Write Our Love Story",
            description: "Document our journey from the very beginning - a book about us, for us, and maybe for the world to see how beautiful love can be."
        }
    ];

    useEffect(() => {
        initializeBucketList();
        createFloatingDreams();
        
        // Check completion status
        const completed = localStorage.getItem('bucketListCompleted') === 'true';
        setIsUnlocked(completed);
        
        // Load saved data
        loadSavedData();
    }, []);

    const initializeBucketList = () => {
        setCompletedItems(defaultCompletedItems);
        setTodoItems(defaultTodoItems);
        setTotalItems(defaultCompletedItems.length + defaultTodoItems.length);
    };

    const createFloatingDreams = () => {
        if (!floatingDreamsRef.current) return;

        const dreamEmojis = ['✨', '🌟', '💫', '🎯', '💭', '🌈', '⭐', '🎪', '🎨', '🎵'];
        
        const createDream = () => {
            const dream = document.createElement('div');
            dream.className = 'dream-item';
            dream.innerHTML = dreamEmojis[Math.floor(Math.random() * dreamEmojis.length)];
            dream.style.left = Math.random() * 100 + '%';
            dream.style.top = Math.random() * 100 + '%';
            dream.style.animationDelay = Math.random() * 8 + 's';
            dream.style.animationDuration = (Math.random() * 4 + 6) + 's';
            
            floatingDreamsRef.current?.appendChild(dream);
            
            setTimeout(() => {
                if (dream.parentNode) {
                    dream.remove();
                }
            }, 8000);
        };

        // Create initial dreams
        for (let i = 0; i < 30; i++) {
            setTimeout(createDream, i * 200);
        }
        
        // Continue creating dreams
        const dreamInterval = setInterval(createDream, 2000);
        
        return () => clearInterval(dreamInterval);
    };

    const viewItem = (itemId) => {
        if (!viewedItems.has(itemId)) {
            const newViewed = new Set(viewedItems);
            newViewed.add(itemId);
            setViewedItems(newViewed);
            setItemsViewed(newViewed.size);
            
            // Create sparkle effect
            createSparkleEffect(itemId);
            
            // Play success sound
            playSuccessSound();
            
            // Check if all items viewed
            if (newViewed.size >= totalItems) {
                enableUnlockButton();
            }
            
            // Save progress
            saveBucketListData(newViewed);
        }
    };

    const createSparkleEffect = (itemId) => {
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        if (!itemElement) return;
        
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: 1.5rem;
                color: #FFD700;
                animation: sparkleFloat 2s ease-out forwards;
                pointer-events: none;
                z-index: 100;
            `;
            
            itemElement.style.position = 'relative';
            itemElement.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 2000);
        }
    };

    const playSuccessSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Silent fail for audio
        }
    };

    const addCompletedItem = () => {
        const title = prompt('🎉 What amazing thing did you two accomplish together?');
        if (title && title.trim()) {
            const description = prompt('💫 Tell us more about this beautiful achievement:');
            if (description && description.trim()) {
                addNewItem('completed', title.trim(), description.trim(), '🎊');
            }
        }
    };

    const addTodoItem = () => {
        const title = prompt('🎯 What dream would you like to add to your bucket list?');
        if (title && title.trim()) {
            const description = prompt('✨ Describe this exciting future adventure:');
            if (description && description.trim()) {
                addNewItem('todo', title.trim(), description.trim(), '🌟');
            }
        }
    };

    const addNewItem = (type, title, description, icon) => {
        const newItem = {
            id: Date.now(),
            icon,
            title,
            description
        };
        
        if (type === 'completed') {
            setCompletedItems(prev => [...prev, newItem]);
        } else {
            setTodoItems(prev => [...prev, newItem]);
        }
        
        setTotalItems(prev => prev + 1);
        createSparkleEffect(newItem.id);
        playSuccessSound();
        saveBucketListData();
    };

    const enableUnlockButton = () => {
        setIsUnlocked(true);
        createCelebrationEffect();
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
        
        const celebrationEmojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎯', '💚', '🏆'];
        
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
        }, 5000);
    };

    const unlockNextPage = () => {
        if (itemsViewed >= totalItems) {
            localStorage.setItem('bucketListCompleted', 'true');
            localStorage.setItem('bucketListCompletionTime', new Date().toISOString());
            
            showSuccessMessage();
            
            setTimeout(() => {
                window.location.href = '/quiz';
            }, 2000);
        } else {
            alert(`🎯 Please explore all ${totalItems} bucket list items first! You've seen ${itemsViewed} so far.`);
        }
    };

    const showSuccessMessage = () => {
        const successOverlay = document.createElement('div');
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(102, 126, 234, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.5s ease-in-out;
        `;
        
        successOverlay.innerHTML = `
            <div style="text-align: center; color: white; font-family: 'Dancing Script', cursive;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎯✨</div>
                <h2 style="font-size: 3rem; margin-bottom: 1rem;">Bucket List Explored!</h2>
                <p style="font-size: 1.5rem; margin-bottom: 2rem;">Dreams reviewed and memories cherished!</p>
                <div style="font-size: 2rem;">Moving to Quiz... 🧠</div>
            </div>
        `;
        
        document.body.appendChild(successOverlay);
        
        setTimeout(() => {
            if (successOverlay.parentNode) {
                successOverlay.remove();
            }
        }, 2000);
    };

    const saveBucketListData = (viewed = viewedItems) => {
        const bucketListData = {
            completed: completedItems,
            todo: todoItems,
            viewProgress: {
                itemsViewed: viewed.size,
                totalItems,
                isUnlocked: isUnlocked,
                viewedItems: Array.from(viewed)
            },
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('bucketListData', JSON.stringify(bucketListData));
    };

    const loadSavedData = () => {
        try {
            const savedData = localStorage.getItem('bucketListData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                if (data.completed && data.completed.length > 4) {
                    setCompletedItems(data.completed);
                }
                
                if (data.todo && data.todo.length > 5) {
                    setTodoItems(data.todo);
                }
                
                if (data.viewProgress) {
                    setItemsViewed(data.viewProgress.itemsViewed || 0);
                    setIsUnlocked(data.viewProgress.isUnlocked || false);
                    setViewedItems(new Set(data.viewProgress.viewedItems || []));
                }
            }
        } catch (error) {
            console.warn('Failed to load saved bucket list data:', error);
        }
    };

    const updateStats = () => {
        const totalItemsCount = completedItems.length + todoItems.length;
        const percentage = totalItemsCount > 0 ? Math.round((completedItems.length / totalItemsCount) * 100) : 0;
        
        return {
            completedCount: completedItems.length,
            todoCount: todoItems.length,
            progressPercentage: percentage
        };
    };

    const { completedCount, todoCount, progressPercentage } = updateStats();

    return (
        <div className="bucket-list-hero">
            <div className="floating-dreams" ref={floatingDreamsRef}></div>
            
            <div className="bucket-list-container">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-dancing gradient-text mb-4 animate-float">
                        📝 Our Bucket List 📝
                    </h1>
                    <p className="text-xl text-white/90 font-dancing mb-8">
                        Dreams we've achieved and adventures still waiting for us
                    </p>
                    
                    {/* Progress Indicator */}
                    <div className="progress-indicator">
                        <div className="progress-text">
                            {itemsViewed}/{totalItems} Items Explored ({Math.round((itemsViewed / totalItems) * 100)}%)
                        </div>
                    </div>
                </div>
                
                {/* Dual Column Layout */}
                <div className="dual-column-layout">
                    {/* Already Done Column */}
                    <div className="bucket-column completed-column">
                        <div className="column-header">
                            <div className="column-title">✅ Already Done</div>
                            <div className="column-subtitle">Amazing memories we've created together</div>
                        </div>
                        
                        <div className="bucket-items">
                            {completedItems.map((item) => (
                                <div
                                    key={item.id}
                                    data-item-id={item.id}
                                    className={`bucket-item ${viewedItems.has(item.id) ? 'viewed' : ''}`}
                                    onClick={() => viewItem(item.id)}
                                >
                                    <span className="item-icon">{item.icon}</span>
                                    <div className="item-title">{item.title}</div>
                                    <div className="item-description">{item.description}</div>
                                    <div className="item-status">
                                        <span className="heart-check">💚</span>
                                        <span>Completed with so much joy!</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <button className="add-item-btn" onClick={addCompletedItem}>
                            ✨ Add Another Achievement ✨
                        </button>
                    </div>
                    
                    {/* To Do Column */}
                    <div className="bucket-column todo-column">
                        <div className="column-header">
                            <div className="column-title">🎯 To Do Together</div>
                            <div className="column-subtitle">Exciting adventures awaiting us</div>
                        </div>
                        
                        <div className="bucket-items">
                            {todoItems.map((item) => (
                                <div
                                    key={item.id}
                                    data-item-id={item.id}
                                    className={`bucket-item ${viewedItems.has(item.id) ? 'viewed' : ''}`}
                                    onClick={() => viewItem(item.id)}
                                >
                                    <span className="item-icon">{item.icon}</span>
                                    <div className="item-title">{item.title}</div>
                                    <div className="item-description">{item.description}</div>
                                    <div className="item-status">
                                        <span>💭</span>
                                        <span>Dream destination awaiting us!</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <button className="add-item-btn" onClick={addTodoItem}>
                            🎯 Add New Dream 🎯
                        </button>
                    </div>
                </div>
                
                {/* Progress Section */}
                <div className="progress-section">
                    <h3 className="text-2xl font-dancing text-white mb-4">
                        🎉 Our Bucket List Progress 🎉
                    </h3>
                    
                    <div className="progress-stats">
                        <div className="stat-card">
                            <div className="stat-number">{completedCount}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{todoCount}</div>
                            <div className="stat-label">To Do</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{progressPercentage}%</div>
                            <div className="stat-label">Progress</div>
                        </div>
                    </div>
                </div>
                
                {/* Unlock Next Page Section */}
                <div className="unlock-section">
                    <h3 className="text-2xl font-dancing text-white mb-4">
                        {isUnlocked ? '🌟 Bucket List Explored! 🌟' : '🎯 Explore All Items 🎯'}
                    </h3>
                    <p className="text-white/80 mb-6">
                        {isUnlocked 
                            ? "You've reviewed our dreams and achievements! Ready for a fun quiz about us?"
                            : "Click on each item to explore our bucket list!"
                        }
                    </p>
                    <button 
                        className={`unlock-btn ${isUnlocked ? 'enabled' : 'disabled'}`}
                        onClick={unlockNextPage}
                        disabled={!isUnlocked}
                    >
                        {isUnlocked ? '🧠 Continue to Quiz 🧠' : '🎯 Explore All Items First 🎯'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Add required CSS animations
const bucketListStyles = `
    @keyframes sparkleFloat {
        0% {
            opacity: 1;
            transform: scale(0.5) translateY(0);
        }
        100% {
            opacity: 0;
            transform: scale(1.5) translateY(-30px);
        }
    }
    
    @keyframes celebrationFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .bucket-item.viewed {
        border: 2px solid #FFD700 !important;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.4) !important;
        transform: scale(1.02);
    }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('bucket-list-animations')) {
    const style = document.createElement('style');
    style.id = 'bucket-list-animations';
    style.textContent = bucketListStyles;
    document.head.appendChild(style);
}

export default BucketListPage;
