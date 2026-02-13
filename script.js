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

// Move No button to random position
function moveNoButton() {
    isMoving = true;
    
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    
    // Calculate random position within the container
    const maxX = containerRect.width - noBtn.offsetWidth;
    const maxY = containerRect.height - noBtn.offsetHeight;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
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
        // Mouse is getting close - shrink the button
        const scale = Math.max(0.3, distance / proximityThreshold);
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
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    
    // Position No button to the right initially
    const initialX = containerRect.width / 2 + 20;
    const initialY = 0;
    
    noBtn.style.left = initialX + 'px';
    noBtn.style.top = initialY + 'px';
});
