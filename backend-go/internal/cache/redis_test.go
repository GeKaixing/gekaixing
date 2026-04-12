package cache_test

import (
	"context"
	"testing"

	"github.com/alicebob/miniredis/v2"
	"github.com/stretchr/testify/require"

	"gekaixing/backend-go/internal/cache"
)

func TestNewRedisClient(t *testing.T) {
	mredis, err := miniredis.Run()
	require.NoError(t, err)
	defer mredis.Close()

	client, err := cache.New(context.Background(), cache.Config{
		Addr: mredis.Addr(),
		DB:   0,
	})
	require.NoError(t, err)
	require.NotNil(t, client)

	pong, err := client.Raw.Ping(context.Background()).Result()
	require.NoError(t, err)
	require.Equal(t, "PONG", pong)
}
