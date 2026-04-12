FROM golang:1.26.1-alpine AS builder

WORKDIR /app
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOPROXY=https://proxy.golang.org,https://goproxy.cn,direct

COPY backend-go/go.mod ./go.mod
RUN go mod download

COPY backend-go/ ./
RUN go build -o /bin/backend-grpc ./cmd/grpc

FROM alpine:3.22
WORKDIR /app
RUN adduser -D -H -s /sbin/nologin appuser
COPY --from=builder /bin/backend-grpc /usr/local/bin/backend-grpc
USER appuser
EXPOSE 9090
ENTRYPOINT ["/usr/local/bin/backend-grpc"]
