//go:build js && wasm

package main

import (
	"syscall/js"
	"time"
)

type Game struct {
	carX, carY float64
	speed      float64
	track      int
	obstacles  []Obstacle
	score      int
}

type Obstacle struct {
	x, y, width, height float64
}

func main() {
	game := NewGame(1) // Default track
	
	// Expose game functions to JS
	js.Global().Set("goStartGame", js.FuncOf(game.startGame))
	js.Global().Set("goHandleKey", js.FuncOf(game.handleKey))
	
	// Keep the game running
	select {}
}

func NewGame(track int) *Game {
	g := &Game{
		carX:   50,
		carY:   300,
		speed:  3,
		track:  track,
		score:  0,
	}
	
	// Initialize obstacles based on track
	switch track {
	case 1:
		g.obstacles = []Obstacle{
			{100, 250, 50, 50},
			{300, 200, 50, 50},
			{500, 300, 50, 50},
		}
	case 2:
		g.obstacles = []Obstacle{
			{150, 280, 50, 50},
			{350, 220, 50, 50},
			{550, 320, 50, 50},
		}
	case 3:
		g.obstacles = []Obstacle{
			{200, 260, 50, 50},
			{400, 240, 50, 50},
			{600, 310, 50, 50},
		}
	}
	
	return g
}

func (g *Game) startGame(this js.Value, args []js.Value) interface{} {
	trackID := args[0].Int()
	g.track = trackID
	
	go g.gameLoop()
	return nil
}

func (g *Game) gameLoop() {
	for {
		// Move car forward
		g.carX += g.speed
		
		// Check collisions
		for _, obs := range g.obstacles {
			if g.checkCollision(obs) {
				js.Global().Call("gameOver", g.score)
				return
			}
		}
		
		// Update score
		g.score++
		js.Global().Call("updateScore", g.score)
		
		// Update car position in UI
		js.Global().Call("updateCarPosition", g.carX, g.carY)
		
		time.Sleep(16 * time.Millisecond) // ~60 FPS
	}
}

func (g *Game) handleKey(this js.Value, args []js.Value) interface{} {
	key := args[0].String()
	
	switch key {
	case "ArrowUp":
		g.carY -= 10
	case "ArrowDown":
		g.carY += 10
	case "ArrowLeft":
		g.carX -= 5
	case "ArrowRight":
		g.carX += 5
	}
	
	return nil
}

func (g *Game) checkCollision(obs Obstacle) bool {
	carWidth, carHeight := 30.0, 50.0
	
	return g.carX < obs.x+obs.width &&
		g.carX+carWidth > obs.x &&
		g.carY < obs.y+obs.height &&
		g.carY+carHeight > obs.y
}
