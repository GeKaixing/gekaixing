package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// Client wraps go-redis for dependency-injected usage.
type Client struct {
	Raw *redis.Client
}

// Config defines Redis client options.
type Config struct {
	Addr     string
	Password string
	DB       int
}

// New creates a Redis client and verifies connectivity.
func New(ctx context.Context, cfg Config) (*Client, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:         cfg.Addr,
		Password:     cfg.Password,
		DB:           cfg.DB,
		ReadTimeout:  2 * time.Second,
		WriteTimeout: 2 * time.Second,
	})

	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("redis ping failed: %w", err)
	}

	return &Client{Raw: rdb}, nil
}
