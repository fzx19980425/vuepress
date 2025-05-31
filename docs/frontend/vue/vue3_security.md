 # Vue 3 安全最佳实践

Vue 3 项目安全同样需要关注 XSS、CSRF、依赖安全、CSP 等。这里对照 Vue2，介绍 Vue3 的安全最佳实践。

## 1. XSS 防护
- 使用 v-html 时务必过滤内容
- 推荐 DOMPurify 等库

## 2. CSRF 防护
- 后端设置 SameSite Cookie
- 前端请求携带 token

## 3. 依赖安全
- 定期 npm audit、升级依赖

## 4. CSP 配置
- 配置 Content-Security-Policy 响应头

## 5. 权限控制
- 路由守卫、按钮权限、后端校验

## 6. 数据加密
- 前端敏感数据加密，推荐 CryptoJS

## 7. 安全审计
- 使用 Snyk、npm audit、dependabot 等工具

## 8. 相关资源
- [Vue3 安全官方文档](https://cn.vuejs.org/guide/best-practices/security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)