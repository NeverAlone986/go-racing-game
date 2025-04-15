package web

import (
	//"net/http"
	
	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	r := mux.NewRouter()
	
	r.HandleFunc("/", HomeHandler).Methods("GET")
	r.HandleFunc("/tracks", TracksHandler).Methods("GET")
	r.HandleFunc("/game", GameHandler).Methods("GET")
	
	return r
}
