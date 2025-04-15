// Хранилище рекордов для каждой трассы
const highScores = JSON.parse(localStorage.getItem('racingHighScores')) || {
    1: 0,
    2: 0,
    3: 0
};

function startWasmGame(trackId) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    trackId = parseInt(trackId);
    
    // Game assets
    const assets = {
        track: new Image(),
        car: new Image(),
        obstacles: [
            new Image(), new Image(), new Image()
        ],
        loaded: 0,
        total: 5 // track + car + 3 obstacles
    };
    
    assets.track.src = `/assets/images/track${trackId}.png`;
    assets.car.src = '/assets/images/car.png';
    assets.obstacles[0].src = '/assets/images/obstacle1.png';
    assets.obstacles[1].src = '/assets/images/obstacle2.png';
    assets.obstacles[2].src = '/assets/images/obstacle3.png';
    
    // Game state
    const game = {
        car: {
            x: canvas.width / 2 - 15,
            y: canvas.height - 100,
            width: 30,
            height: 50,
            speed: 5
        },
        score: 0,
        highScore: highScores[trackId] || 0,
        gameOver: false,
        obstacles: [],
        obstacleSpeed: 3,
        obstacleSpawnRate: 100,
        frameCount: 0,
        trackId: trackId
    };
    
    // Key states
    const keys = {
        ArrowLeft: false,
        ArrowRight: false
    };
    
    // Obstacle types
    const obstacleTypes = [
        { width: 50, height: 50, speedMod: 1.0, score: 10 },
        { width: 70, height: 40, speedMod: 1.2, score: 15 },
        { width: 60, height: 60, speedMod: 0.8, score: 20 }
    ];
    
    // Create obstacles
    function spawnObstacle() {
        const typeIndex = Math.floor(Math.random() * obstacleTypes.length);
        const type = obstacleTypes[typeIndex];
        const width = type.width + Math.random() * 30;
        const x = Math.random() * (canvas.width - width);
        
        game.obstacles.push({
            x: x,
            y: -100,
            width: width,
            height: type.height,
            passed: false,
            type: typeIndex,
            speedMod: type.speedMod,
            scoreValue: type.score
        });
    }
    
    // Check if all assets are loaded
    function checkAssetsLoaded() {
        assets.loaded++;
        if (assets.loaded === assets.total) {
            initGame();
        }
    }
    
    // Initialize game
    function initGame() {
        // Reset game state
        game.car.x = canvas.width / 2 - 15;
        game.obstacles = [];
        game.score = 0;
        game.gameOver = false;
        game.obstacleSpeed = 3;
        game.obstacleSpawnRate = 100;
        game.frameCount = 0;
        
        // Start game loop
        gameLoop();
    }
    
    // Save high score
    function saveHighScore() {
        if (game.score > highScores[game.trackId]) {
            highScores[game.trackId] = game.score;
            localStorage.setItem('racingHighScores', JSON.stringify(highScores));
        }
    }
    
    // Restart game
    function restartGame() {
        saveHighScore();
        initGame();
    }
    
    // Return to tracks menu
    function returnToMenu() {
        saveHighScore();
        window.location.href = '/tracks';
    }
    
    // Game loop
    function update() {
        if (game.gameOver) return;
        
        game.frameCount++;
        
        // Spawn new obstacles
        if (game.frameCount % game.obstacleSpawnRate === 0) {
            spawnObstacle();
            // Increase difficulty
            if (game.obstacleSpawnRate > 30) game.obstacleSpawnRate--;
            if (game.frameCount % 500 === 0) game.obstacleSpeed += 0.5;
        }
        
        // Move car
        if (keys.ArrowLeft) game.car.x = Math.max(0, game.car.x - game.car.speed);
        if (keys.ArrowRight) game.car.x = Math.min(canvas.width - game.car.width, game.car.x + game.car.speed);
        
        // Move obstacles
        game.obstacles = game.obstacles.filter(obs => {
            obs.y += game.obstacleSpeed * obs.speedMod;
            
            // Check if passed player
            if (!obs.passed && obs.y > game.car.y + game.car.height) {
                obs.passed = true;
                game.score += obs.scoreValue;
            }
            
            // Remove if off screen
            return obs.y < canvas.height;
        });
        
        // Check collisions
        const carRect = game.car;
        if (game.obstacles.some(obs => checkCollision(carRect, obs))) {
            game.gameOver = true;
            saveHighScore();
        }
    }
    
    function render() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw track (static background)
        ctx.drawImage(assets.track, 0, 0, canvas.width, canvas.height);
        
        // Draw obstacles
        game.obstacles.forEach(obs => {
            if (assets.obstacles[obs.type].complete) {
                // Draw textured obstacle
                ctx.save();
                ctx.beginPath();
                ctx.rect(obs.x, obs.y, obs.width, obs.height);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(
                    assets.obstacles[obs.type], 
                    0, 0, assets.obstacles[obs.type].width, assets.obstacles[obs.type].height,
                    obs.x, obs.y, obs.width, obs.height
                );
                ctx.restore();
            } else {
                // Fallback if texture not loaded
                const colors = ['#ff0000', '#00ff00', '#0000ff'];
                ctx.fillStyle = colors[obs.type % colors.length];
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            }
        });
        
        // Draw car
        ctx.drawImage(assets.car, game.car.x, game.car.y, game.car.width, game.car.height);
        
        // Draw score
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${game.score}`, 20, 30);
        ctx.fillText(`High Score: ${highScores[game.trackId]}`, 20, 60);
        
        // Game over screen
        if (game.gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'red';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 80);
            
            ctx.font = '24px Arial';
            ctx.fillText(`Score: ${game.score}`, canvas.width/2, canvas.height/2 - 30);
            ctx.fillText(`High Score: ${highScores[game.trackId]}`, canvas.width/2, canvas.height/2 + 10);
            
            // Restart button
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(canvas.width/2 - 220, canvas.height/2 + 60, 200, 50);
            ctx.fillStyle = '#2196F3';
            ctx.fillRect(canvas.width/2 + 20, canvas.height/2 + 60, 200, 50);
            
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Restart', canvas.width/2 - 120, canvas.height/2 + 90);
            ctx.fillText('Back to Menu', canvas.width/2 + 120, canvas.height/2 + 90);
        }
    }
    
    function gameLoop() {
        update();
        render();
        
        if (!game.gameOver) {
            requestAnimationFrame(gameLoop);
        } else {
            // Setup click handlers when game ends
            canvas.onclick = (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Restart button
                if (x >= canvas.width/2 - 220 && x <= canvas.width/2 - 20 &&
                    y >= canvas.height/2 + 60 && y <= canvas.height/2 + 110) {
                    canvas.onclick = null;
                    restartGame();
                }
                
                // Menu button
                if (x >= canvas.width/2 + 20 && x <= canvas.width/2 + 220 &&
                    y >= canvas.height/2 + 60 && y <= canvas.height/2 + 110) {
                    canvas.onclick = null;
                    returnToMenu();
                }
            };
        }
    }
    
    // Asset load callbacks
    assets.track.onload = checkAssetsLoaded;
    assets.car.onload = checkAssetsLoaded;
    assets.obstacles.forEach(obs => obs.onload = checkAssetsLoaded);
    
    // Error handling for assets
    assets.track.onerror = () => console.error("Failed to load track image");
    assets.car.onerror = () => console.error("Failed to load car image");
    assets.obstacles.forEach((obs, i) => {
        obs.onerror = () => console.error(`Failed to load obstacle image ${i+1}`);
    });
    
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
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}
