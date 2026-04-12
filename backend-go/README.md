# backend-go

Go backend for `gekaixing 2.0`.

## Stack

- Web: Gin
- ORM: Ent
- DB: PostgreSQL
- Cache: Redis (`go-redis`)
- RPC: gRPC
- Logger: Zap
- Config: Viper

## Versions (checked on 2026-04-05)

- Go: `1.26.1`
- gin: `v1.12.0`
- ent: `v0.14.6`
- go-redis: `v9.18.0`
- grpc: `v1.80.0`
- zap: `v1.27.1`
- viper: `v1.21.0`

## Quick Start

```bash
cp .env.example .env

# Mainland China fallback:
# export GOPROXY=https://goproxy.cn,direct

go mod tidy
go test ./...
go run ./cmd/api
# new terminal
go run ./cmd/grpc
```

## JWT Contract

- Auth.js issues HS256 JWT.
- `sub` must be `user.id`.
- Gin middleware validates token and injects `userID` into request context.

## Ent

Schemas are in `ent/schema`.

```bash
go run entgo.io/ent/cmd/ent generate ./ent/schema
```
