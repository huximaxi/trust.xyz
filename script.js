// ================================
// NYAN CAT ANIMATION
// ================================

let nyanClickCount = 0;
let totalPageClicks = 0;
let nyanDirection = 'normal';
let nyanAngle = 0;
let nyanCatElement = null;

// Create Nyan Cat element
function createNyanCat() {
    const nyanContainer = document.createElement('div');
    nyanContainer.className = 'nyan-cat';
    nyanCatElement = nyanContainer;
    
    const nyanBody = document.createElement('div');
    nyanBody.className = 'nyan-body';
    nyanBody.innerHTML = '🐱';
    nyanBody.style.fontSize = '40px';
    nyanBody.style.position = 'absolute';
    nyanBody.style.top = '0';
    nyanBody.style.left = '0';
    
    const nyanTrail = document.createElement('div');
    nyanTrail.className = 'nyan-trail';
    
    nyanContainer.appendChild(nyanTrail);
    nyanContainer.appendChild(nyanBody);
    document.body.appendChild(nyanContainer);
    
    // Add click handler to nyan cat
    nyanContainer.addEventListener('click', (e) => {
        e.stopPropagation(); // Don't trigger page click
        nyanClickCount++;
        
        // Visual feedback
        nyanContainer.style.transform = `scale(1.2) rotate(${nyanAngle}deg)`;
        setTimeout(() => {
            nyanContainer.style.transform = `scale(1) rotate(${nyanAngle}deg)`;
        }, 200);
        
        // At 210 clicks, drop hearts and poop
        if (nyanClickCount === 210) {
            dropSpecialEmojis(e.clientX, e.clientY);
            console.log('%c🎉 NYAN CAT ACHIEVEMENT UNLOCKED! 💕💩', 'color: #ff006e; font-size: 16px; font-weight: bold;');
        }
        
        console.log(`🐱 Nyan cat clicked ${nyanClickCount} times!`);
    });
    
    // Add matrix trail behind nyan cat
    addMatrixTrail(nyanContainer);
}

// Drop hearts and poop emojis
function dropSpecialEmojis(x, y) {
    const emojis = ['💕', '💖', '💗', '💓', '💩', '💩', '✨', '⭐'];
    const count = 20;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'special-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = (x + Math.random() * 200 - 100) + 'px';
            emoji.style.top = y + 'px';
            emoji.style.animationDelay = (Math.random() * 0.3) + 's';
            
            document.body.appendChild(emoji);
            
            // Add to pixel count (worth 10 pixels each!)
            totalPixelsGenerated += 10;
            pixelCountDisplay.textContent = totalPixelsGenerated;
            
            // Remove after animation
            setTimeout(() => {
                emoji.remove();
            }, 2500);
        }, i * 50);
    }
}

// Change nyan cat direction
function changeNyanDirection() {
    if (nyanDirection === 'normal') {
        nyanDirection = 'reverse';
        nyanCatElement.style.animationName = 'nyanFlyReverse';
        nyanCatElement.style.transform = `scaleX(-1) rotate(${nyanAngle}deg)`;
    } else {
        nyanDirection = 'normal';
        nyanCatElement.style.animationName = 'nyanFly';
        nyanCatElement.style.transform = `scaleX(1) rotate(${nyanAngle}deg)`;
    }
    console.log(`🔄 Nyan direction changed to: ${nyanDirection}`);
}

// Change nyan cat angle
function changeNyanAngle() {
    nyanAngle = (nyanAngle + 45) % 360;
    const scaleX = nyanDirection === 'reverse' ? -1 : 1;
    nyanCatElement.style.transform = `scaleX(${scaleX}) rotate(${nyanAngle}deg)`;
    console.log(`📐 Nyan angle changed to: ${nyanAngle}°`);
}

// Matrix trail effect
function addMatrixTrail(nyanElement) {
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-trail';
    document.body.appendChild(matrixContainer);
    
    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    
    setInterval(() => {
        const rect = nyanElement.getBoundingClientRect();
        
        // Only create trail if nyan cat is visible
        if (rect.left > 0 && rect.left < window.innerWidth) {
            // Create 3-5 matrix characters
            const numChars = Math.floor(Math.random() * 3) + 3;
            
            for (let i = 0; i < numChars; i++) {
                const char = document.createElement('span');
                char.className = 'matrix-char';
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = (rect.left - 20 + Math.random() * 40) + 'px';
                char.style.top = (rect.top + rect.height / 2 + Math.random() * 20 - 10) + 'px';
                char.style.animationDuration = (Math.random() * 1 + 1) + 's';
                
                matrixContainer.appendChild(char);
                
                // Remove after animation
                setTimeout(() => {
                    char.remove();
                }, 2000);
            }
        }
    }, 100);
}

// Initialize Nyan Cat
createNyanCat();

// ================================
// PIXEL CONFETTI ANIMATION
// ================================

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const pixelCountDisplay = document.getElementById('pixel-count');

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Pixel particle class
class Pixel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4; // Pixel size between 4-12px
        this.speedX = (Math.random() - 0.5) * 6;
        this.speedY = (Math.random() - 0.5) * 6;
        this.gravity = 0.15;
        this.friction = 0.98;
        this.opacity = 1;
        this.fadeSpeed = Math.random() * 0.02 + 0.01;
        
        // Multi-color palette
        const colors = [
            '#b794f6', // light purple
            '#9333ea', // main purple
            '#00d9ff', // cyan
            '#ff006e', // pink
            '#00ff88', // green
            '#ffea00', // yellow
            '#ffffff'  // white
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        // Apply physics
        this.speedY += this.gravity;
        this.speedX *= this.friction;
        this.speedY *= this.friction;
        
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Fade out
        this.opacity -= this.fadeSpeed;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        
        // Draw pixelated square
        ctx.fillRect(
            Math.floor(this.x), 
            Math.floor(this.y), 
            this.size, 
            this.size
        );
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
    }
    
    isDead() {
        return this.opacity <= 0;
    }
}

// Particle array
let pixels = [];
let totalPixelsGenerated = 0;

// Animation loop
function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    
    // Update and draw pixels
    for (let i = pixels.length - 1; i >= 0; i--) {
        pixels[i].update();
        pixels[i].draw();
        
        // Remove dead pixels
        if (pixels[i].isDead()) {
            pixels.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

// Start animation loop
animate();

// Create pixel explosion on click
document.addEventListener('click', (e) => {
    // Increment total page clicks
    totalPageClicks++;
    
    // Check for special click milestones
    if (totalPageClicks % 42 === 0) {
        changeNyanDirection();
    }
    
    if (totalPageClicks % 66 === 0) {
        changeNyanAngle();
    }
    
    const particleCount = 30; // Number of pixels per click
    
    for (let i = 0; i < particleCount; i++) {
        pixels.push(new Pixel(e.clientX, e.clientY));
        totalPixelsGenerated++;
    }
    
    // Update counter
    pixelCountDisplay.textContent = totalPixelsGenerated;
    
    // Add a flash effect with random color
    const flashColors = ['#1a1a2e', '#2d1b4e', '#1a2e3e', '#2e1a1a'];
    const randomColor = flashColors[Math.floor(Math.random() * flashColors.length)];
    document.body.style.transition = 'background-color 0.1s';
    document.body.style.backgroundColor = randomColor;
    setTimeout(() => {
        document.body.style.backgroundColor = '#000000';
    }, 100);
});

// ================================
// NAVIGATION ACTIVE STATE
// ================================

// Get current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Set active nav link
document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// ================================
// BACKGROUND STARS/PIXELS (optional ambient effect)
// ================================

function createAmbientPixels() {
    // Create some slow-moving background pixels
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const pixel = new Pixel(x, y);
        pixel.speedX = (Math.random() - 0.5) * 0.5;
        pixel.speedY = (Math.random() - 0.5) * 0.5;
        pixel.gravity = 0;
        pixel.fadeSpeed = 0.001;
        pixel.size = 3;
        pixels.push(pixel);
    }
}

// Add ambient pixels periodically
setInterval(createAmbientPixels, 2000);

// ================================
// CONSOLE MESSAGE (Easter egg)
// ================================

console.log('%c🔍 Digital Trust Explorations', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
console.log('%cWelcome, curious developer! 👋', 'color: #b794f6; font-size: 14px;');
console.log('%cClick anywhere on the page to generate pixel confetti!', 'color: #ff006e; font-size: 12px;');
console.log('%c🐱 Keep your eyes peeled for a special visitor...', 'color: #00ff88; font-size: 12px;');
console.log('%c💡 Hint: Every 42nd click does something special...', 'color: #ffea00; font-size: 11px;');
console.log('%c💡 Hint: Every 66th click changes the angle...', 'color: #ffea00; font-size: 11px;');
console.log('%c💡 Hint: Click the nyan cat 210 times for a surprise! 💕💩', 'color: #ff006e; font-size: 11px;');
