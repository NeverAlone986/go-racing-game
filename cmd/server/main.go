package main

import (
	"log"
	"net/http"
	
	"github.com/NeverAlone986/go-racing-game/internal/web"
)

func main() {
	router := web.NewRouter()
	
	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
