package httptransport

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"gekaixing/backend-go/internal/middleware"
)

// RouterConfig wires Gin router dependencies.
type RouterConfig struct {
	AuthSecret string
	Logger     *zap.Logger
}

// NewRouter builds API routes.
func NewRouter(cfg RouterConfig) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(requestLogger(cfg.Logger))

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := r.Group("/api/v1")
	api.Use(middleware.RequireJWT(cfg.AuthSecret))
	api.GET("/whoami", func(c *gin.Context) {
		userID, _ := middleware.UserIDFromContext(c)
		c.JSON(http.StatusOK, gin.H{"userId": userID})
	})

	return r
}

func requestLogger(l *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		if l == nil {
			return
		}
		l.Info("http_request",
			zap.String("method", c.Request.Method),
			zap.String("path", c.FullPath()),
			zap.Int("status", c.Writer.Status()),
		)
	}
}
