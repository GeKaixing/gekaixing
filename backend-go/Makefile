APP_NAME ?= gekaixing-api
GOPROXY_MAINLAND ?= https://goproxy.cn,direct
GOPROXY_GLOBAL ?= https://proxy.golang.org,https://goproxy.cn,direct

.PHONY: deps deps-cn tidy test run-api run-grpc ent-generate

deps:
	GOPROXY=$(GOPROXY_GLOBAL) go mod download

deps-cn:
	GOPROXY=$(GOPROXY_MAINLAND) go mod download

tidy:
	GOPROXY=$(GOPROXY_GLOBAL) go mod tidy

test:
	GOPROXY=$(GOPROXY_GLOBAL) go test ./...

run-api:
	GOPROXY=$(GOPROXY_GLOBAL) go run ./cmd/api

run-grpc:
	GOPROXY=$(GOPROXY_GLOBAL) go run ./cmd/grpc

ent-generate:
	GOPROXY=$(GOPROXY_GLOBAL) go run entgo.io/ent/cmd/ent generate ./ent/schema
