// Get elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionScreen = document.getElementById('question-screen');
const successScreen = document.getElementById('success-screen');

let isMoving = false;

// Yes button click handler - show success screen
yesBtn.addEventListener('click', () => {
    questionScreen.classList.remove('active');
    successScreen.classList.add('active');
});

// No button hover handler - move to random position
noBtn.addEventListener('mouseenter', () => {
    if (isMoving) return;
    moveNoButton();
});

// Move No button to random position across the entire page
function moveNoButton() {
    isMoving = true;
    
    const yesRect = yesBtn.getBoundingClientRect();
    const noWidth = noBtn.offsetWidth;
    const noHeight = noBtn.offsetHeight;
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate available space
    const maxX = viewportWidth - noWidth - 20; // 20px margin
    const maxY = viewportHeight - noHeight - 20;
    
    // Buffer zone around Yes button to ensure no overlap
    const bufferZone = 50; // 50px buffer
    
    let randomX, randomY;
    let attempts = 0;
    const maxAttempts = 100;
    
    // Keep trying until we find a position that doesn't overlap with Yes button
    do {
        randomX = Math.random() * maxX;
        randomY = Math.random() * maxY;
        attempts++;
        
        // Calculate the bounds of the No button at this position
        const noLeft = randomX;
        const noRight = randomX + noWidth;
        const noTop = randomY;
        const noBottom = randomY + noHeight;
        
        // Calculate Yes button bounds with buffer zone
        const yesLeft = yesRect.left - bufferZone;
        const yesRight = yesRect.right + bufferZone;
        const yesTop = yesRect.top - bufferZone;
        const yesBottom = yesRect.bottom + bufferZone;
        
        // Check if No button would overlap with Yes button (including buffer)
        const wouldOverlap = !(
            noRight < yesLeft ||    // No button is completely to the left
            noLeft > yesRight ||     // No button is completely to the right
            noBottom < yesTop ||     // No button is completely above
            noTop > yesBottom        // No button is completely below
        );
        
        // If no overlap, we found a good position
        if (!wouldOverlap || attempts >= maxAttempts) {
            break;
        }
    } while (true);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    setTimeout(() => {
        isMoving = false;
    }, 300);
}

// Track mouse movement to change button size based on proximity
document.addEventListener('mousemove', (e) => {
    const rect = noBtn.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to button center
    const distance = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) +
        Math.pow(e.clientY - buttonCenterY, 2)
    );
    
    // Define proximity threshold
    const proximityThreshold = 150;
    
    if (distance < proximityThreshold) {
        // Mouse is getting close - GROW the button (reverse of previous behavior)
        const scale = Math.min(2.0, 1.0 + (1.0 - distance / proximityThreshold));
        noBtn.style.transform = `scale(${scale})`;
        
        // Also move the button if mouse gets too close
        if (distance < 80 && !isMoving) {
            moveNoButton();
        }
    } else {
        // Mouse is far - return to normal size
        noBtn.style.transform = 'scale(1)';
    }
});

// Initialize no button position
window.addEventListener('load', () => {
    const yesRect = yesBtn.getBoundingClientRect();
    
    // Position No button to the right of Yes button initially
    noBtn.style.position = 'fixed';
    noBtn.style.left = (yesRect.right + 100) + 'px';
    noBtn.style.top = yesRect.top + 'px';
});
