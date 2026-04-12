# Gekaixing 部署手册（中文）

本文档用于 `gekaixing` 当前架构的部署：
- 前端/BFF：Next.js
- 后端：Go API（Gin）+ gRPC
- 数据库：PostgreSQL
- 缓存：Redis
- 认证：Auth.js + JWT
- 编排：Docker Compose / Kubernetes

## 1. 部署前准备

## 1.1 基础要求

- Node.js 20+
- npm 10+
- Go 1.26+
- Docker / Docker Compose
- kubectl（K8s 部署时）

## 1.2 关键目录

- 前端：`/`
- Go 后端：`/backend-go`
- Docker：`/deploy/docker`
- Kubernetes：`/deploy/k8s/base`

## 2. 环境变量

## 2.1 前端 `.env.local`

先复制：

```bash
cp .env.example .env.local
```

至少配置：

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_URL`
- `GO_API_BASE_URL`

说明：
- `AUTH_SECRET` / `NEXTAUTH_SECRET` 必须使用强随机字符串。
- 生产环境中 `NEXTAUTH_URL` 必须是公网 HTTPS 域名。

## 2.2 Go 后端 `backend-go/.env`

先复制：

```bash
cp backend-go/.env.example backend-go/.env
```

至少配置：

- `HTTP_ADDR`
- `GRPC_ADDR`
- `AUTH_SECRET`（应与前端一致）
- `DATABASE_URL`
- `REDIS_ADDR`

中国大陆网络建议：

```bash
export GOPROXY=https://goproxy.cn,direct
```

## 3. 本地联调启动

## 3.1 初始化数据库和静态存储

```bash
npx prisma generate
npx prisma migrate dev
npm run init:storage
```

## 3.2 启动服务

终端 1：

```bash
npm run dev
```

终端 2：

```bash
cd backend-go && go run ./cmd/api
```

终端 3：

```bash
cd backend-go && go run ./cmd/grpc
```

## 3.3 验证

```bash
npx tsc --noEmit
npm run test
cd backend-go && go test ./...
```

## 4. Docker Compose 部署

进入目录：

```bash
cd deploy/docker
```

启动：

```bash
docker compose up --build
```

相关文件：

- `frontend.Dockerfile`
- `backend.api.Dockerfile`
- `backend.grpc.Dockerfile`
- `docker-compose.yml`

建议：
- 首次发布前先本地 `docker compose up` 验证跨服务连通。
- 所有敏感变量通过环境注入，不写入镜像层。

## 5. Kubernetes 部署

## 5.1 修改配置

K8s 基础清单位于：`deploy/k8s/base`

上线前至少检查：

- `configmap.yaml`
- `secret.example.yaml`（复制并改为真实 secret）
- `ingress.yaml`
- `postgres-statefulset.yaml`
- `redis-deployment.yaml`
- `frontend-deployment.yaml`
- `api-deployment.yaml`
- `grpc-deployment.yaml`

## 5.2 应用清单

```bash
kubectl apply -k deploy/k8s/base
```

## 5.3 健康检查

```bash
kubectl get pods -n gekaixing
kubectl get svc -n gekaixing
kubectl get ingress -n gekaixing
```

若启动异常，先看日志：

```bash
kubectl logs -n gekaixing <pod-name>
```

## 6. 发布检查清单

上线前必做：

1. `npx tsc --noEmit` 通过
2. `npm run test` 通过
3. `cd backend-go && go test ./...` 通过
4. Auth.js 登录、登出、会话刷新可用
5. 文件上传与删除（`/api/storage/*`）可用
6. 前后端都使用同一 `AUTH_SECRET`
7. 数据库迁移已执行且无报错

## 7. 常见问题

## 7.1 登录后接口 401

优先检查：
- `NEXTAUTH_URL` 是否正确
- 前后端 `AUTH_SECRET` 是否一致
- 反向代理是否透传 cookie/header

## 7.2 上传失败

优先检查：
- `public/uploads` 目录是否可写
- 上传接口是否可达：`/api/storage/upload`
- Nginx/Ingress 是否限制请求体大小

## 7.3 Go 服务连不上 PostgreSQL/Redis

优先检查：
- `backend-go/.env` 中 `DATABASE_URL` / `REDIS_ADDR`
- K8s Service 名称与端口
- 网络策略/防火墙

## 8. 安全建议

- 不要提交 `.env.local`、`backend-go/.env`。
- Secret 统一由平台注入（K8s Secret / CI Secret）。
- 生产环境必须使用 HTTPS。
- 定期轮换 `AUTH_SECRET`、第三方 API Key。

