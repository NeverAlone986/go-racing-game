let wasmGame;

function startWasmGame(trackId) {
    const go = new Go();
    WebAssembly.instantiateStreaming(fetch("/static/wasm/game.wasm"), go.importObject)
        .then(result => {
            wasmGame = result.instance;
            go.run(result.instance);
            
            // Start game with selected track
            goStartGame(trackId);
            
            // Set up keyboard controls
            document.addEventListener('keydown', (e) => {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                    goHandleKey(e.key);
                }
            });
        });
}

function updateCarPosition(x, y) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw track background
    const trackImg = new Image();
    trackImg.src = `/assets/images/track${trackId}.png`;
    ctx.drawImage(trackImg, 0, 0, canvas.width, canvas.height);
    
    // Draw car
    const carImg = new Image();
    carImg.src = '/assets/images/car.png';
    ctx.drawImage(carImg, x, y, 30, 50);
    
    // Draw obstacles (would be better to get from WASM)
    // In a real implementation, we'd get obstacle data from WASM
}

function updateScore(score) {
    document.getElementById('score').textContent = score;
}

function gameOver(score) {
    alert(`Игра окончена! Ваш счет: ${score}`);
    window.location.href = '/';
}

// Expose to WASM
window.updateCarPosition = updateCarPosition;
window.updateScore = updateScore;
window.gameOver = gameOver;
