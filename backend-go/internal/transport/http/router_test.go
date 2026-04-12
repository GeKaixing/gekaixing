package httptransport_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/require"

	httptransport "gekaixing/backend-go/internal/transport/http"
)

func TestHealthz(t *testing.T) {
	r := httptransport.NewRouter(httptransport.RouterConfig{AuthSecret: "secret"})

	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	require.Equal(t, http.StatusOK, w.Code)
	require.Contains(t, w.Body.String(), "ok")
}

func TestWhoAmI(t *testing.T) {
	r := httptransport.NewRouter(httptransport.RouterConfig{AuthSecret: "secret"})

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"sub": "u_001"})
	signed, err := token.SignedString([]byte("secret"))
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/whoami", nil)
	req.Header.Set("Authorization", "Bearer "+signed)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	require.Equal(t, http.StatusOK, w.Code)
	require.Contains(t, w.Body.String(), "u_001")
}
