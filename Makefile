.PHONY: build run clean wasm

build:
	go build -o bin/server ./cmd/server

run: build
	./bin/server

wasm:
	GOOS=js GOARCH=wasm go build -o static/wasm/game.wasm ./internal/web/wasm

clean:
	rm -rf bin
	rm -f static/wasm/game.wasm

serve: wasm build run
