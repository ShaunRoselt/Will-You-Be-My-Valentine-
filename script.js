// Get elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionScreen = document.getElementById('question-screen');
const successScreen = document.getElementById('success-screen');
const encouragement = document.getElementById('encouragement');
const heartsContainer = document.getElementById('hearts-container');

// Encouragement messages
const messages = [
    "Are you sure? 🥺",
    "Please think about it... 💭",
    "I promise I'll be nice! 😇",
    "Come on, give me a chance! 🙏",
    "You're making this hard... 😅",
    "I believe in us! 💪",
    "Don't break my heart! 💔",
    "Pretty please? 🥹",
    "I made this website just for you! 💻",
    "You know you want to say yes! 😏",
];

let messageIndex = 0;
let noBtnClicks = 0;
let isMoving = false;

// Track if device has touch support (more reliable than user agent)
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Yes button click handler
yesBtn.addEventListener('click', () => {
    showSuccess();
});

// No button strategies
const strategies = [
    // Strategy 1: Move away from mouse/touch
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        const rect = noBtn.getBoundingClientRect();
        const container = document.querySelector('.buttons-container').getBoundingClientRect();
        
        // Get random position within container
        const maxX = container.width - noBtn.offsetWidth;
        const maxY = container.height - noBtn.offsetHeight;
        
        let newX = Math.random() * maxX;
        let newY = Math.random() * maxY;
        
        // Ensure button moves away from current position
        const currentX = rect.left - container.left;
        const currentY = rect.top - container.top;
        
        if (Math.abs(newX - currentX) < 100) {
            newX = currentX > maxX / 2 ? 0 : maxX;
        }
        
        noBtn.style.left = newX + 'px';
        noBtn.style.top = newY + 'px';
        
        setTimeout(() => { isMoving = false; }, 300);
    },
    
    // Strategy 2: Shrink
    (e) => {
        noBtn.classList.add('shrinking');
        setTimeout(() => {
            noBtn.classList.remove('shrinking');
        }, 300);
    },
    
    // Strategy 3: Spin away
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        noBtn.classList.add('spinning');
        
        const rect = noBtn.getBoundingClientRect();
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
    
    // Strategy 4: Fade out temporarily
    (e) => {
        noBtn.classList.add('fading');
        setTimeout(() => {
            noBtn.classList.remove('fading');
        }, 500);
    },
    
    // Strategy 5: Shake and move
    (e) => {
        if (isMoving) return;
        isMoving = true;
        
        noBtn.classList.add('shaking');
        
        setTimeout(() => {
            const rect = noBtn.getBoundingClientRect();
            const container = document.querySelector('.buttons-container').getBoundingClientRect();
            
            const maxX = container.width - noBtn.offsetWidth;
            const maxY = container.height - noBtn.offsetHeight;
            
            noBtn.style.left = Math.random() * maxX + 'px';
            noBtn.style.top = Math.random() * maxY + 'px';
            
            noBtn.classList.remove('shaking');
            isMoving = false;
        }, 300);
    },
];

// Handle no button interactions
function handleNoButtonInteraction(e) {
    e.preventDefault();
    
    noBtnClicks++;
    
    // Show encouragement message
    if (messageIndex < messages.length) {
        encouragement.textContent = messages[messageIndex];
        messageIndex++;
    } else {
        encouragement.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Make Yes button bigger
    const currentScale = 1 + (noBtnClicks * 0.1);
    yesBtn.style.transform = `scale(${Math.min(currentScale, 2)})`;
    
    // Apply random strategy
    const strategyIndex = Math.floor(Math.random() * strategies.length);
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

// Additional mouse move tracking for desktop
if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        const rect = noBtn.getBoundingClientRect();
        const distance = Math.sqrt(
            Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
            Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
        );
        
        // If mouse gets close to button, move it away
        if (distance < 100 && !isMoving) {
            isMoving = true;
            
            const container = document.querySelector('.buttons-container').getBoundingClientRect();
            const maxX = container.width - noBtn.offsetWidth;
            const maxY = container.height - noBtn.offsetHeight;
            
            // Calculate direction away from mouse
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(centerY - e.clientY, centerX - e.clientX);
            
            let newX = (rect.left - container.left) + Math.cos(angle) * 150;
            let newY = (rect.top - container.top) + Math.sin(angle) * 150;
            
            // Keep within bounds
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';
            
            setTimeout(() => { isMoving = false; }, 300);
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
