const NUM_PARTICLES = 5;
const particles = [];
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const statusDiv = document.createElement('div');
statusDiv.style.position = 'absolute';
statusDiv.style.top = '10px';
statusDiv.style.left = '10px';
statusDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
statusDiv.style.padding = '10px';
statusDiv.style.borderRadius = '5px';
statusDiv.style.fontFamily = 'Arial, sans-serif';
statusDiv.style.fontSize = '14px';
document.body.appendChild(statusDiv);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let frame = 0;
let isStable = false;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
    }

    update() {
        particles.forEach((other) => {
            if (other === this) return;

            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                // Gravity-like attraction
                const gravityForce = 0.05;
                this.vx += (dx / distance) * gravityForce;
                this.vy += (dy / distance) * gravityForce;

                // Repulsion at close distances
                if (distance < 100) {
                    const repulsionForce = (100 - distance) / 100;
                    this.vx -= (dx / distance) * repulsionForce;
                    this.vy -= (dy / distance) * repulsionForce;
                }
            }
        });

        // Apply damping to reduce kinetic energy
        this.vx *= 0.99; // Reduce velocity by 1%
        this.vy *= 0.99; // Reduce velocity by 1%

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    kineticEnergy() {
        return 0.5 * (this.vx * this.vx + this.vy * this.vy);
    }
}

// Initialize particles
for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
}

function calculateTotalEnergy() {
    return particles.reduce((total, particle) => total + particle.kineticEnergy(), 0);
}

function updateStatus(totalEnergy) {
    statusDiv.innerHTML = `
        <strong>System Status:</strong><br>
        Frame: ${frame}<br>
        Particles: ${particles.length}<br>
        Total Energy: ${totalEnergy.toFixed(2)}<br>
        Stability: ${isStable ? 'Stable' : 'Unstable'}
    `;
}

function animate() {
    if (isStable) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    const totalEnergy = calculateTotalEnergy();
    updateStatus(totalEnergy);

    if (totalEnergy < 0.01) {
        isStable = true;
        updateStatus(totalEnergy);
        return;
    }

    frame++;
    requestAnimationFrame(animate);
}

animate();
