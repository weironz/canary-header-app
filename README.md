# Canary Flow - 基于请求头的灰度发布系统

这是一个使用 Kong API 网关实现的基于请求头的灰度发布演示系统。

## 系统架构

```
前端 (8080) → Kong API Gateway (8000) → Backend v1 (3001) / Backend v2 (3002)
```

## 灰度规则

系统使用简单的基于请求头的灰度规则：

### 请求头规则
- **请求头**: `X-App-Version`
- **值**: `v1` 或 `v2`
- **规则**: 
  - 当请求头为 `X-App-Version: v2` 时，路由到 Backend v2
  - 其他情况（无请求头或值为 v1）路由到 Backend v1

## 快速开始

### 1. 启动服务

```bash
docker-compose up -d
```

### 2. 访问前端

打开浏览器访问: http://localhost:8080

### 3. 测试灰度规则

前端页面提供了测试按钮来验证灰度规则：

- **默认请求 (v1)**: 不添加任何请求头
- **使用 v2 版本**: 添加 `X-App-Version: v2`
- **强制使用 v1**: 添加 `X-App-Version: v1`

## API 测试

你也可以直接使用 curl 命令测试：

```bash
# 默认请求（路由到 v1）
curl http://localhost:8000/admin

# 使用 v2 版本
curl -H "X-App-Version: v2" http://localhost:8000/admin

# 强制使用 v1
curl -H "X-App-Version: v1" http://localhost:8000/admin
```

## 配置说明

### Kong 配置 (kong/kong.yml)

主要配置包括：

1. **两个服务**: 
   - `backend-service`: 指向 backend-v1
   - `backend-service-gray`: 指向 backend-v2

2. **两个路由**:
   - `backend-route-gray`: 匹配 `X-App-Version: v2` 的路由到 v2
   - `backend-route`: 默认路由到 v1

3. **CORS 配置**: 允许必要的请求头

### 路由逻辑

```yaml
# 灰度路由（v2）
- name: backend-route-gray
  service: backend-service-gray
  paths: ["/admin"]
  headers:
    X-App-Version: ["v2"]

# 默认路由（v1）
- name: backend-route
  service: backend-service
  paths: ["/admin"]
```

## 测试

运行测试脚本验证功能：

```bash
chmod +x test-canary.sh
./test-canary.sh
```

## 监控和日志

Kong 会记录所有请求的日志，你可以在 Kong 的日志中看到路由信息：

```bash
docker-compose logs kong
```

## 故障排除

1. **确保 Kong 服务正常运行**:
   ```bash
   docker-compose ps
   ```

2. **检查 Kong 日志**:
   ```bash
   docker-compose logs kong
   ```

3. **验证后端服务**:
   ```bash
   curl http://localhost:3001/admin  # v1
   curl http://localhost:3002/admin  # v2
   ```

## 注意事项

1. 灰度规则是在 Kong 网关层面实现的，不需要修改后端代码
2. 路由优先级：Kong 会按配置顺序匹配路由，先匹配到灰度路由，再匹配默认路由
3. 在生产环境中，建议添加监控和告警机制
4. 配置修改需要重启 Kong 服务才能生效
