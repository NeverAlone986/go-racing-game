package web

import (
	"html/template"
	"net/http"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles(
		"templates/base.html",
		"templates/index.html",
	))
	tmpl.ExecuteTemplate(w, "base", nil)
}

func TracksHandler(w http.ResponseWriter, r *http.Request) {
	tracks := []struct {
		ID   int
		Name string
	}{
		{1, "Городская трасса"},
		{2, "Горный серпантин"},
		{3, "Пустыня"},
	}

	tmpl := template.Must(template.ParseFiles(
		"templates/base.html",
		"templates/tracks.html",
	))
	tmpl.ExecuteTemplate(w, "base", tracks)
}

func GameHandler(w http.ResponseWriter, r *http.Request) {
	trackID := r.URL.Query().Get("track")
	
	data := struct {
		TrackID string
	}{
		TrackID: trackID,
	}

	tmpl := template.Must(template.ParseFiles(
		"templates/base.html",
		"templates/game.html",
	))
	tmpl.ExecuteTemplate(w, "base", data)
}
