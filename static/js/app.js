function startWasmGame(trackId) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game state
    const car = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 100,
        width: 30,
        height: 50,
        speed: 5
    };
    
    let score = 0;
    let gameOver = false;
    let obstacles = [];
    let obstacleSpeed = 3;
    let obstacleSpawnRate = 100; // frames
    let frameCount = 0;
    
    // Load assets
    const trackImg = new Image();
    trackImg.src = `/assets/images/track${trackId}.png`;
    
    const carImg = new Image();
    carImg.src = '/assets/images/car.png';
    
    // Key states
    const keys = {
        ArrowLeft: false,
        ArrowRight: false
    };
    
    // Create obstacles
    function spawnObstacle() {
        const width = 50 + Math.random() * 50;
        const x = Math.random() * (canvas.width - width);
        obstacles.push({
            x: x,
            y: -100,
            width: width,
            height: 50,
            passed: false
        });
    }
    
    // Game loop
    function update() {
        if (gameOver) return;
        
        frameCount++;
        
        // Spawn new obstacles
        if (frameCount % obstacleSpawnRate === 0) {
            spawnObstacle();
            // Increase difficulty
            if (obstacleSpawnRate > 30) obstacleSpawnRate--;
            if (frameCount % 500 === 0) obstacleSpeed += 0.5;
        }
        
        // Move car
        if (keys.ArrowLeft) car.x = Math.max(0, car.x - car.speed);
        if (keys.ArrowRight) car.x = Math.min(canvas.width - car.width, car.x + car.speed);
        
        // Move obstacles
        obstacles = obstacles.filter(obs => {
            obs.y += obstacleSpeed;
            
            // Check if passed player
            if (!obs.passed && obs.y > car.y + car.height) {
                obs.passed = true;
                score += 10;
            }
            
            // Remove if off screen
            return obs.y < canvas.height;
        });
        
        // Check collisions
        const carRect = car;
        if (obstacles.some(obs => checkCollision(carRect, obs))) {
            gameOver = true;
        }
    }
    
    function render() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw track (static background)
        if (trackImg.complete) {
            ctx.drawImage(trackImg, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw obstacles
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
        
        // Draw car
        if (carImg.complete) {
            ctx.drawImage(carImg, car.x, car.y, car.width, car.height);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(car.x, car.y, car.width, car.height);
        }
        
        // Draw score
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 20, 30);
        
        // Game over screen
        if (gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'red';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 40);
            
            ctx.font = '24px Arial';
            ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2);
            
            // Restart button
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(canvas.width/2 - 100, canvas.height/2 + 40, 200, 50);
            
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Restart', canvas.width/2, canvas.height/2 + 70);
            
            // Add click handler for restart
            canvas.onclick = (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                if (x >= canvas.width/2 - 100 && x <= canvas.width/2 + 100 &&
                    y >= canvas.height/2 + 40 && y <= canvas.height/2 + 90) {
                    restartGame();
                }
            };
        }
    }
    
    function gameLoop() {
        update();
        render();
        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    function restartGame() {
        // Reset game state
        car.x = canvas.width / 2 - 15;
        obstacles = [];
        score = 0;
        gameOver = false;
        obstacleSpeed = 3;
        obstacleSpawnRate = 100;
        frameCount = 0;
        
        // Remove click handler
        canvas.onclick = null;
        
        // Start new game
        gameLoop();
    }
    
    // Key listeners
    document.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
            e.preventDefault();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
            e.preventDefault();
        }
    });
    
    // Start game
    trackImg.onload = () => {
        gameLoop();
    };
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}
