package config

import (
	"fmt"
	"strings"

	"github.com/spf13/viper"
)

// Config stores runtime configuration loaded by Viper from env/file.
type Config struct {
	AppName     string `mapstructure:"APP_NAME"`
	AppEnv      string `mapstructure:"APP_ENV"`
	HTTPAddr    string `mapstructure:"HTTP_ADDR"`
	GRPCAddr    string `mapstructure:"GRPC_ADDR"`
	AuthSecret  string `mapstructure:"AUTH_SECRET"`
	DatabaseURL string `mapstructure:"DATABASE_URL"`
	RedisAddr   string `mapstructure:"REDIS_ADDR"`
	RedisPass   string `mapstructure:"REDIS_PASSWORD"`
	RedisDB     int    `mapstructure:"REDIS_DB"`
	LogLevel    string `mapstructure:"LOG_LEVEL"`
	GoProxy     string `mapstructure:"GOPROXY"`
}

// Load returns a validated configuration object.
func Load() (Config, error) {
	v := viper.New()
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	setDefaults(v)
	bindEnv(v)

	cfg := Config{}
	if err := v.Unmarshal(&cfg); err != nil {
		return Config{}, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	if cfg.AuthSecret == "" {
		return Config{}, fmt.Errorf("AUTH_SECRET is required")
	}
	if cfg.DatabaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}

	return cfg, nil
}

func setDefaults(v *viper.Viper) {
	v.SetDefault("APP_NAME", "gekaixing-api")
	v.SetDefault("APP_ENV", "development")
	v.SetDefault("HTTP_ADDR", ":8080")
	v.SetDefault("GRPC_ADDR", ":9090")
	v.SetDefault("REDIS_ADDR", "localhost:6379")
	v.SetDefault("REDIS_PASSWORD", "")
	v.SetDefault("REDIS_DB", 0)
	v.SetDefault("LOG_LEVEL", "info")
	v.SetDefault("GOPROXY", "https://proxy.golang.org,https://goproxy.cn,direct")
}

func bindEnv(v *viper.Viper) {
	keys := []string{
		"APP_NAME",
		"APP_ENV",
		"HTTP_ADDR",
		"GRPC_ADDR",
		"AUTH_SECRET",
		"DATABASE_URL",
		"REDIS_ADDR",
		"REDIS_PASSWORD",
		"REDIS_DB",
		"LOG_LEVEL",
		"GOPROXY",
	}
	for _, key := range keys {
		_ = v.BindEnv(key)
	}
}
