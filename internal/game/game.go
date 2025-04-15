package game

type Game struct {
	CarX      float64
	CarY      float64
	Speed     float64
	Track     int
	Obstacles []Obstacle
	Score     int
}

type Obstacle struct {
	X      float64
	Y      float64
	Width  float64
	Height float64
}

func NewGame(track int) *Game {
	g := &Game{
		CarX:  50,
		CarY:  300,
		Speed: 3,
		Track: track,
		Score: 0,
	}
	
	g.initObstacles()
	return g
}

func (g *Game) initObstacles() {
	switch g.Track {
	case 1:
		g.Obstacles = []Obstacle{
			{100, 250, 50, 50},
			{300, 200, 50, 50},
			{500, 300, 50, 50},
		}
	case 2:
		g.Obstacles = []Obstacle{
			{150, 280, 50, 50},
			{350, 220, 50, 50},
			{550, 320, 50, 50},
		}
	case 3:
		g.Obstacles = []Obstacle{
			{200, 260, 50, 50},
			{400, 240, 50, 50},
			{600, 310, 50, 50},
		}
	}
}

func (g *Game) CheckCollision(obs Obstacle) bool {
	carWidth, carHeight := 30.0, 50.0
	return g.CarX < obs.X+obs.Width &&
		g.CarX+carWidth > obs.X &&
		g.CarY < obs.Y+obs.Height &&
		g.CarY+carHeight > obs.Y
}
