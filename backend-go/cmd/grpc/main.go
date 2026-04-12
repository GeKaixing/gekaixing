package main

import (
	"go.uber.org/zap"

	"gekaixing/backend-go/internal/config"
	"gekaixing/backend-go/internal/logger"
	grpctransport "gekaixing/backend-go/internal/transport/grpc"
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

	if err := grpctransport.Run(cfg.GRPCAddr, l); err != nil {
		l.Fatal("grpc server failed", zap.Error(err))
	}
}
