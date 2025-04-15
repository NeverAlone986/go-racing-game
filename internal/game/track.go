package game

type Track struct {
	ID        int
	Name      string
	Obstacles []Obstacle
}

func GetAvailableTracks() []Track {
	return []Track{
		{
			ID:   1,
			Name: "Трасса 1",
			Obstacles: []Obstacle{
				{100, 250, 50, 50},
				{300, 200, 50, 50},
				{500, 300, 50, 50},
			},
		},
		{
			ID:   2,
			Name: "Трасса 2",
			Obstacles: []Obstacle{
				{150, 280, 50, 50},
				{350, 220, 50, 50},
				{550, 320, 50, 50},
			},
		},
		{
			ID:   3,
			Name: "Трасса 3",
			Obstacles: []Obstacle{
				{200, 260, 50, 50},
				{400, 240, 50, 50},
				{600, 310, 50, 50},
			},
		},
	}
}
