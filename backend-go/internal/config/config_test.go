package config_test

import (
	"os"
	"testing"

	"github.com/stretchr/testify/require"

	"gekaixing/backend-go/internal/config"
)

func TestLoadSuccess(t *testing.T) {
	t.Setenv("AUTH_SECRET", "test-secret")
	t.Setenv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/gekaixing?sslmode=disable")

	cfg, err := config.Load()
	require.NoError(t, err)
	require.Equal(t, "test-secret", cfg.AuthSecret)
	require.NotEmpty(t, cfg.HTTPAddr)
}

func TestLoadFailWhenRequiredMissing(t *testing.T) {
	_ = os.Unsetenv("AUTH_SECRET")
	_ = os.Unsetenv("DATABASE_URL")

	_, err := config.Load()
	require.Error(t, err)
}
