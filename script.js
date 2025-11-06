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
        
        // Purple color palette
        const colors = [
            '#b794f6', // light purple
            '#9333ea', // main purple
            '#a78bfa', // accent cyan-purple
            '#c4b5fd', // dim purple
            '#6b21a8'  // dark purple
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
    const particleCount = 30; // Number of pixels per click
    
    for (let i = 0; i < particleCount; i++) {
        pixels.push(new Pixel(e.clientX, e.clientY));
        totalPixelsGenerated++;
    }
    
    // Update counter
    pixelCountDisplay.textContent = totalPixelsGenerated;
    
    // Add a flash effect
    document.body.style.transition = 'background-color 0.1s';
    document.body.style.backgroundColor = '#2d1b4e';
    setTimeout(() => {
        document.body.style.backgroundColor = '#1a0b2e';
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

console.log('%c🔍 Digital Trust Explorations', 'color: #9333ea; font-size: 20px; font-weight: bold;');
console.log('%cWelcome, curious developer! 👋', 'color: #b794f6; font-size: 14px;');
console.log('%cClick anywhere on the page to generate pixel confetti!', 'color: #a78bfa; font-size: 12px;');
