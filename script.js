// Get elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionScreen = document.getElementById('question-screen');
const successScreen = document.getElementById('success-screen');
const encouragement = document.getElementById('encouragement');
const heartsContainer = document.getElementById('hearts-container');
const attemptCounter = document.getElementById('attempt-counter');
const scoreCounter = document.getElementById('score-counter');
const comboCounter = document.getElementById('combo-counter');
const modeIndicator = document.getElementById('mode-indicator');
const achievementsContainer = document.getElementById('achievements');
const gameArea = document.getElementById('game-area');
const timerDisplay = document.getElementById('timer-display');
const keyboardHint = document.querySelector('.keyboard-hint');

// Heart emojis for celebration
const HEART_EMOJIS = ['❤️', '💕', '💖', '💗', '💝', '💞'];

// Particle emojis for effects
const PARTICLE_EMOJIS = ['✨', '💫', '⭐', '🌟', '💥', '🎯', '🎪', '🎨'];

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
let gamePhase = 0;
let score = 0;
let combo = 1;
let lastClickTime = 0;
let comboTimer = null;
const COMBO_TIMEOUT = 1500; // 1.5 seconds to maintain combo
let totalMisses = 0;
let fastestClick = Infinity;
let unlockedAchievements = new Set();
let gameStartTime = null;
let timerInterval = null;

// Track if device has touch support (more reliable than user agent)
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Hide keyboard hint on mobile devices
if (isMobile && keyboardHint) {
    keyboardHint.style.display = 'none';
}

// Timer functions
function startTimer() {
    if (!gameStartTime) {
        gameStartTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

// Create particle effect at position
function createParticles(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const angle = (Math.PI * 2 * i) / count;
        const distance = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Show combo text
function showComboText(x, y, comboValue) {
    const comboText = document.createElement('div');
    comboText.className = 'combo-text';
    comboText.textContent = `COMBO x${comboValue}!`;
    comboText.style.left = x + 'px';
    comboText.style.top = y + 'px';
    document.body.appendChild(comboText);
    setTimeout(() => comboText.remove(), 1000);
}

// Show miss text
function showMissText(x, y) {
    const missText = document.createElement('div');
    missText.className = 'miss-text';
    missText.textContent = 'MISS!';
    missText.style.left = x + 'px';
    missText.style.top = y + 'px';
    document.body.appendChild(missText);
    setTimeout(() => missText.remove(), 800);
}

// Update score with animation
function updateScore(points) {
    score += points;
    scoreCounter.textContent = score;
    scoreCounter.classList.add('flash');
    setTimeout(() => scoreCounter.classList.remove('flash'), 300);
}

// Update combo
function updateCombo() {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;
    
    if (timeSinceLastClick < COMBO_TIMEOUT && noBtnClicks > 0) {
        combo++;
        if (combo % 5 === 0) {
            const rect = noBtn.getBoundingClientRect();
            showComboText(rect.left + rect.width / 2, rect.top);
        }
    } else {
        combo = 1;
    }
    
    comboCounter.textContent = `x${combo}`;
    if (combo > 1) {
        comboCounter.classList.add('flash');
        setTimeout(() => comboCounter.classList.remove('flash'), 300);
    }
    
    lastClickTime = now;
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
        combo = 1;
        comboCounter.textContent = 'x1';
    }, COMBO_TIMEOUT);
}

// Check and award achievements
function checkAchievements() {
    const achievements = [
        { id: 'first_attempt', condition: noBtnClicks === 1, text: '🎯 First Try!' },
        { id: 'persistent', condition: noBtnClicks === 10, text: '💪 Persistent!' },
        { id: 'determined', condition: noBtnClicks === 25, text: '🔥 Determined!' },
        { id: 'unstoppable', condition: noBtnClicks === 50, text: '⚡ Unstoppable!' },
        { id: 'combo_master', condition: combo === 10, text: '🎮 Combo Master!' },
        { id: 'speed_demon', condition: fastestClick < 200, text: '⚡ Speed Demon!' },
        { id: 'score_hunter', condition: score >= 500, text: '💎 Score Hunter!' },
        { id: 'score_legend', condition: score >= 1000, text: '👑 Score Legend!' },
    ];
    
    achievements.forEach(achievement => {
        if (achievement.condition && !unlockedAchievements.has(achievement.id)) {
            unlockedAchievements.add(achievement.id);
            showAchievement(achievement.text);
        }
    });
}

// Show achievement notification
function showAchievement(text) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.textContent = '🏆 ' + text;
    achievementsContainer.appendChild(achievement);
    setTimeout(() => achievement.remove(), 3000);
}

// Update mode indicator
function updateModeIndicator() {
    const modes = ['Easy', 'Medium', 'Hard', 'Expert'];
    modeIndicator.textContent = modes[gamePhase] || 'Easy';
    modeIndicator.classList.add('flash');
    setTimeout(() => modeIndicator.classList.remove('flash'), 300);
}

// Screen shake effect
function shakeScreen() {
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 300);
}

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
    
    const now = Date.now();
    const clickSpeed = now - lastClickTime;
    if (clickSpeed > 0 && clickSpeed < fastestClick) {
        fastestClick = clickSpeed;
    }
    
    noBtnClicks++;
    
    // Start timer on first click
    if (noBtnClicks === 1) {
        startTimer();
    }
    
    // Get button position for effects
    const rect = noBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Create particle effects
    createParticles(x, y, 12);
    
    // Update combo
    updateCombo();
    
    // Calculate score (base points * combo multiplier * phase multiplier)
    const basePoints = 10;
    const phaseMultiplier = 1 + gamePhase * 0.5;
    const points = Math.floor(basePoints * combo * phaseMultiplier);
    updateScore(points);
    
    // Update game phase based on clicks
    const oldPhase = gamePhase;
    if (noBtnClicks >= 15) {
        gamePhase = 3; // Expert mode
    } else if (noBtnClicks >= 10) {
        gamePhase = 2; // Hard mode
    } else if (noBtnClicks >= 5) {
        gamePhase = 1; // Medium mode
    }
    
    // Update mode indicator if phase changed
    if (oldPhase !== gamePhase) {
        updateModeIndicator();
        shakeScreen();
    }
    
    // Update attempt counter
    attemptCounter.textContent = noBtnClicks;
    attemptCounter.classList.add('flash');
    setTimeout(() => attemptCounter.classList.remove('flash'), 300);
    
    // Check achievements
    checkAchievements();
    
    // Special milestone effects
    if (noBtnClicks % 10 === 0) {
        shakeScreen();
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

// Click handler for game area (miss detection)
gameArea.addEventListener('click', (e) => {
    if (e.target === gameArea || e.target.classList.contains('buttons-container')) {
        totalMisses++;
        showMissText(e.clientX, e.clientY);
        combo = 1;
        comboCounter.textContent = 'x1';
        clearTimeout(comboTimer);
    }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && questionScreen.classList.contains('active')) {
        e.preventDefault();
        // Try to click the No button
        const rect = noBtn.getBoundingClientRect();
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2
        });
        noBtn.dispatchEvent(clickEvent);
    } else if (e.code === 'Enter' && questionScreen.classList.contains('active')) {
        e.preventDefault();
        // Click Yes button
        yesBtn.click();
    }
});

// Show success screen
function showSuccess() {
    stopTimer();
    
    questionScreen.classList.remove('active');
    successScreen.classList.add('active');
    
    // Show final stats
    const finalTime = timerDisplay.textContent;
    const successMessage = document.querySelector('.success-message');
    successMessage.innerHTML = `I'm so happy! You've made my day! 💖<br><br>
        <strong>Final Stats:</strong><br>
        Attempts: ${noBtnClicks}<br>
        Score: ${score}<br>
        Time: ${finalTime}<br>
        Best Combo: ${Math.max(...Array.from({length: noBtnClicks}, (_, i) => combo))}x`;
    
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
            heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
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
