package main

import (
	"context"
	"net/http"
	"time"

	"go.uber.org/zap"

	"gekaixing/backend-go/internal/cache"
	"gekaixing/backend-go/internal/config"
	"gekaixing/backend-go/internal/logger"
	httptransport "gekaixing/backend-go/internal/transport/http"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		panic(err)
	}

	l, err := logger.New(cfg.LogLevel)
	if err != nil {
		panic(err)
	}
	defer func() {
		_ = l.Sync()
	}()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	redisClient, err := cache.New(ctx, cache.Config{
		Addr:     cfg.RedisAddr,
		Password: cfg.RedisPass,
		DB:       cfg.RedisDB,
	})
	if err != nil {
		l.Fatal("failed to init redis", zap.Error(err))
	}
	defer func() {
		_ = redisClient.Raw.Close()
	}()

	r := httptransport.NewRouter(httptransport.RouterConfig{
		AuthSecret: cfg.AuthSecret,
		Logger:     l,
	})

	srv := &http.Server{
		Addr:              cfg.HTTPAddr,
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
	}

	l.Info("api server listening", zap.String("addr", cfg.HTTPAddr))
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		l.Fatal("api server failed", zap.Error(err))
	}
}
