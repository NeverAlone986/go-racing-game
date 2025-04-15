package main

import (
	"log"
	"net/http"
)

func main() {
	// Маршрутизация без сторонних библиотек
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("./assets"))))
	
	// Обработчики страниц
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/tracks", tracksHandler)
	http.HandleFunc("/game", gameHandler)
	
	log.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./templates/index.html")
}

func tracksHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./templates/tracks.html")
}

func gameHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./templates/game.html")
}
