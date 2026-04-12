package grpctransport

import (
	"fmt"
	"net"

	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/health"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"
	"google.golang.org/grpc/reflection"
)

// Run starts gRPC server with built-in health service.
func Run(addr string, logger *zap.Logger) error {
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		return fmt.Errorf("failed to listen on %s: %w", addr, err)
	}

	srv := grpc.NewServer()
	healthSrv := health.NewServer()
	healthSrv.SetServingStatus("", healthpb.HealthCheckResponse_SERVING)
	healthpb.RegisterHealthServer(srv, healthSrv)
	reflection.Register(srv)

	if logger != nil {
		logger.Info("grpc server listening", zap.String("addr", addr))
	}

	return srv.Serve(lis)
}
