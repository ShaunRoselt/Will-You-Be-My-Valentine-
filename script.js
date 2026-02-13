// Get elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionScreen = document.getElementById('question-screen');
const successScreen = document.getElementById('success-screen');
const encouragement = document.getElementById('encouragement');
const heartsContainer = document.getElementById('hearts-container');
const attemptCounter = document.getElementById('attempt-counter');

// Encouragement messages with phases
const messages = [
    // Phase 1: Gentle persuasion
    "Are you sure? 🥺",
    "Please think about it... 💭",
    "I promise I'll be nice! 😇",
    "Come on, give me a chance! 🙏",
    "You're making this hard... 😅",
    // Phase 2: More desperate
    "I believe in us! 💪",
    "Don't break my heart! 💔",
    "Pretty please? 🥹",
    "I made this website just for you! 💻",
    "You know you want to say yes! 😏",
    // Phase 3: Playful challenges
    "Nice try! 😆",
    "So close! But not quite! 😜",
    "Oops! Missed again! 🙈",
    "You're good at this game! 🎮",
    "Getting tired yet? 😴",
    // Phase 4: Fun taunts
    "I'm too quick for you! ⚡",
    "Catch me if you can! 🏃",
    "Nope! Try again! 🎯",
    "This is actually fun! 😄",
    "You almost had me there! 🤏",
];

let messageIndex = 0;
let noBtnClicks = 0;
let isMoving = false;
let gamePhase = 0; // Track game progression

// Track if device has touch support (more reliable than user agent)
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Yes button click handler
yesBtn.addEventListener('click', () => {
    showSuccess();
});

// No button strategies - more creative and game-like
const strategies = [
    // Strategy 1: Quick teleport
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        const container = document.querySelector('.buttons-container').getBoundingClientRect();
        const maxX = container.width - noBtn.offsetWidth;
        const maxY = container.height - noBtn.offsetHeight;
        
        noBtn.style.transition = 'all 0.15s ease-out';
        noBtn.style.left = Math.random() * maxX + 'px';
        noBtn.style.top = Math.random() * maxY + 'px';
        
        setTimeout(() => { isMoving = false; }, 200);
    },
    
    // Strategy 2: Shrink and relocate
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        noBtn.classList.add('shrinking');
        
        setTimeout(() => {
            const container = document.querySelector('.buttons-container').getBoundingClientRect();
            const maxX = container.width - noBtn.offsetWidth;
            const maxY = container.height - noBtn.offsetHeight;
            
            noBtn.style.left = Math.random() * maxX + 'px';
            noBtn.style.top = Math.random() * maxY + 'px';
            noBtn.classList.remove('shrinking');
            isMoving = false;
        }, 300);
    },
    
    // Strategy 3: Spin and teleport
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        noBtn.classList.add('spinning');
        
        const container = document.querySelector('.buttons-container').getBoundingClientRect();
        const maxX = container.width - noBtn.offsetWidth;
        const maxY = container.height - noBtn.offsetHeight;
        
        noBtn.style.left = Math.random() * maxX + 'px';
        noBtn.style.top = Math.random() * maxY + 'px';
        
        setTimeout(() => {
            noBtn.classList.remove('spinning');
            isMoving = false;
        }, 500);
    },
    
    // Strategy 4: Fade out and reappear elsewhere
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        noBtn.classList.add('fading');
        
        setTimeout(() => {
            const container = document.querySelector('.buttons-container').getBoundingClientRect();
            const maxX = container.width - noBtn.offsetWidth;
            const maxY = container.height - noBtn.offsetHeight;
            
            noBtn.style.left = Math.random() * maxX + 'px';
            noBtn.style.top = Math.random() * maxY + 'px';
            noBtn.classList.remove('fading');
            isMoving = false;
        }, 400);
    },
    
    // Strategy 5: Shake and dodge
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        noBtn.classList.add('shaking');
        
        setTimeout(() => {
            const container = document.querySelector('.buttons-container').getBoundingClientRect();
            const maxX = container.width - noBtn.offsetWidth;
            const maxY = container.height - noBtn.offsetHeight;
            
            noBtn.style.left = Math.random() * maxX + 'px';
            noBtn.style.top = Math.random() * maxY + 'px';
            
            noBtn.classList.remove('shaking');
            isMoving = false;
        }, 300);
    },
    
    // Strategy 6: Bounce to corner
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        const container = document.querySelector('.buttons-container').getBoundingClientRect();
        const corners = [
            { x: 0, y: 0 },
            { x: container.width - noBtn.offsetWidth, y: 0 },
            { x: 0, y: container.height - noBtn.offsetHeight },
            { x: container.width - noBtn.offsetWidth, y: container.height - noBtn.offsetHeight }
        ];
        
        const corner = corners[Math.floor(Math.random() * corners.length)];
        noBtn.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        noBtn.style.left = corner.x + 'px';
        noBtn.style.top = corner.y + 'px';
        
        setTimeout(() => { 
            noBtn.style.transition = 'all 0.2s ease';
            isMoving = false; 
        }, 350);
    },
    
    // Strategy 7: Clone fake - disappear and reappear
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        noBtn.style.opacity = '0';
        noBtn.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            const container = document.querySelector('.buttons-container').getBoundingClientRect();
            const maxX = container.width - noBtn.offsetWidth;
            const maxY = container.height - noBtn.offsetHeight;
            
            noBtn.style.left = Math.random() * maxX + 'px';
            noBtn.style.top = Math.random() * maxY + 'px';
            noBtn.style.opacity = '1';
            noBtn.style.transform = 'scale(1)';
            isMoving = false;
        }, 300);
    },
    
    // Strategy 8: Rapid multiple teleports
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        const container = document.querySelector('.buttons-container').getBoundingClientRect();
        let teleports = 0;
        
        const teleportInterval = setInterval(() => {
            const maxX = container.width - noBtn.offsetWidth;
            const maxY = container.height - noBtn.offsetHeight;
            
            noBtn.style.left = Math.random() * maxX + 'px';
            noBtn.style.top = Math.random() * maxY + 'px';
            
            teleports++;
            if (teleports >= 3) {
                clearInterval(teleportInterval);
                isMoving = false;
            }
        }, 100);
    },
];

// Handle no button interactions with game progression
function handleNoButtonInteraction(e) {
    e.preventDefault();
    
    noBtnClicks++;
    
    // Update attempt counter
    attemptCounter.textContent = `Escape Attempts: ${noBtnClicks} 🎮`;
    
    // Update game phase based on clicks
    if (noBtnClicks >= 15) {
        gamePhase = 3; // Expert mode - rapid teleports, corners
        attemptCounter.textContent = `Escape Attempts: ${noBtnClicks} 🔥 EXPERT MODE!`;
    } else if (noBtnClicks >= 10) {
        gamePhase = 2; // Hard mode - faster, more unpredictable
        attemptCounter.textContent = `Escape Attempts: ${noBtnClicks} ⚡ HARD MODE!`;
    } else if (noBtnClicks >= 5) {
        gamePhase = 1; // Medium mode - multiple strategies
        attemptCounter.textContent = `Escape Attempts: ${noBtnClicks} 💪 MEDIUM MODE!`;
    }
    
    // Show encouragement message
    if (messageIndex < messages.length) {
        encouragement.textContent = messages[messageIndex];
        messageIndex++;
    } else {
        encouragement.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Make Yes button bigger and more attractive
    const currentScale = 1 + (noBtnClicks * 0.12);
    yesBtn.style.transform = `scale(${Math.min(currentScale, 2.5)})`;
    
    // Add a glow effect to Yes button as it grows
    if (noBtnClicks > 5) {
        yesBtn.style.boxShadow = `0 0 ${noBtnClicks * 2}px rgba(245, 87, 108, 0.6)`;
    }
    
    // Make No button smaller as attempts increase
    const noScale = Math.max(0.5, 1 - (noBtnClicks * 0.03));
    noBtn.style.transform = `scale(${noScale})`;
    
    // Select strategy based on game phase
    let strategyIndex;
    if (gamePhase === 3) {
        // Expert: prefer rapid teleports and corners (strategies 6, 7, 8)
        strategyIndex = 5 + Math.floor(Math.random() * 3);
    } else if (gamePhase === 2) {
        // Hard: use all strategies except the easiest
        strategyIndex = Math.floor(Math.random() * strategies.length);
    } else if (gamePhase === 1) {
        // Medium: mix of strategies
        strategyIndex = Math.floor(Math.random() * 6);
    } else {
        // Easy: basic strategies
        strategyIndex = Math.floor(Math.random() * 4);
    }
    
    strategies[strategyIndex](e);
}

// Prevent all click events on No button - make it truly impossible to click
noBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNoButtonInteraction(e);
}, true);

noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNoButtonInteraction(e);
}, true);

noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNoButtonInteraction(e);
}, { passive: false, capture: true });

noBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
}, { passive: false, capture: true });

// Additional hover behavior for desktop
noBtn.addEventListener('mouseenter', (e) => {
    if (!isMobile) {
        handleNoButtonInteraction(e);
    }
});

// Prevent pointer events from registering
noBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNoButtonInteraction(e);
}, true);

// Additional mouse move tracking for desktop - "chase" mechanic
if (!isMobile) {
    let lastMoveTime = Date.now();
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Throttle to avoid too many movements
        if (now - lastMoveTime < 200) return;
        
        const rect = noBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) +
            Math.pow(e.clientY - centerY, 2)
        );
        
        // Dynamic detection radius based on game phase
        const detectionRadius = gamePhase === 3 ? 150 : gamePhase === 2 ? 120 : 100;
        
        // If mouse gets close to button, move it away intelligently
        if (distance < detectionRadius && !isMoving) {
            isMoving = true;
            lastMoveTime = now;
            
            const container = document.querySelector('.buttons-container').getBoundingClientRect();
            const maxX = container.width - noBtn.offsetWidth;
            const maxY = container.height - noBtn.offsetHeight;
            
            // Calculate direction away from mouse
            const angle = Math.atan2(centerY - e.clientY, centerX - e.clientX);
            
            // Move farther away in higher phases
            const moveDistance = gamePhase === 3 ? 200 : gamePhase === 2 ? 150 : 120;
            
            let newX = (rect.left - container.left) + Math.cos(angle) * moveDistance;
            let newY = (rect.top - container.top) + Math.sin(angle) * moveDistance;
            
            // Keep within bounds with some randomness in higher phases
            if (gamePhase >= 2) {
                newX += (Math.random() - 0.5) * 50;
                newY += (Math.random() - 0.5) * 50;
            }
            
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';
            
            // Add a "scared" effect
            if (gamePhase >= 2) {
                noBtn.style.transform = `scale(${Math.max(0.5, 1 - (noBtnClicks * 0.03))}) rotate(${Math.random() * 20 - 10}deg)`;
                setTimeout(() => {
                    noBtn.style.transform = `scale(${Math.max(0.5, 1 - (noBtnClicks * 0.03))})`;
                }, 200);
            }
            
            setTimeout(() => { isMoving = false; }, 250);
        }
    });
}

// Show success screen
function showSuccess() {
    questionScreen.classList.remove('active');
    successScreen.classList.add('active');
    
    // Create floating hearts
    createHearts();
    
    // Play celebration animation
    setTimeout(() => {
        createHearts();
    }, 1000);
    
    setTimeout(() => {
        createHearts();
    }, 2000);
}

// Create floating hearts animation
function createHearts() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = ['❤️', '💕', '💖', '💗', '💝', '💞'][Math.floor(Math.random() * 6)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 0.5 + 's';
            heartsContainer.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 100);
    }
}

// Initialize no button position
window.addEventListener('load', () => {
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    
    // Position No button to the right initially
    const initialX = containerRect.width / 2 + 20;
    const initialY = containerRect.height / 2 - noBtn.offsetHeight / 2;
    
    noBtn.style.left = initialX + 'px';
    noBtn.style.top = initialY + 'px';
});
