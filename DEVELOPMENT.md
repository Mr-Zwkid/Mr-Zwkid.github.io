# 开发者指南

本文档为Wenkang Zhang个人网站的开发者提供详细的技术说明和维护指南。

## 🏗️ 架构说明

### 构建系统
网站使用Python脚本 `build.py` 作为核心构建工具：

1. **输入**: `posts/*.md` Markdown文件
2. **处理**: 解析Front Matter，转换Markdown为HTML
3. **输出**: `posts/*.html` 静态HTML文件

### 文件流程
```
posts/article.md -> build.py -> posts/article.html
```

## 📋 Front Matter格式

每个Markdown文件应以YAML Front Matter开头：

```yaml
---
title: "文章标题"
date: "2025-01-01"  # 支持格式: YYYY-MM-DD, YYYY/MM/DD, DD/MM/YYYY
summary: "文章摘要"  # 可选，用于SEO description
description: "页面描述"  # summary的别名
---
```

## 🔧 构建脚本详解

### build.py 功能模块

1. **parse_front_matter()**: 解析YAML前置信息
2. **markdown_to_html()**: Markdown转HTML转换器
3. **html_template()**: HTML页面模板生成器
4. **main()**: 主处理流程

### 支持的Markdown语法

- 标题 (H1-H4): `# ## ### ####`
- 粗体: `**text**` -> `<strong>text</strong>`
- 斜体: `*text*` -> `<em>text</em>`
- 链接: `[text](url)` -> `<a href="url">text</a>`
- 图片: `![alt](src)` -> `<img src="src" alt="alt" />`
- 内联代码: `\`code\`` -> `<code>code</code>`
- 无序列表: `- item` -> `<ul><li>item</li></ul>`

## 🚀 部署流程

### 自动部署 (deploy.bat)

1. **构建检查**: 验证Python环境
2. **HTML生成**: 运行 `build.py`
3. **Git操作**: 
   - 检查仓库状态
   - 添加所有更改
   - 提交更改（支持自定义提交信息）
   - 推送到GitHub

### 手动部署步骤

```bash
# 1. 生成HTML文件
python build.py

# 2. Git操作
git add .
git commit -m "更新内容"
git push origin main
```

## 🎨 样式定制

### CSS文件结构
- `static/css/styles.css`: Bootstrap主题样式
- `static/css/main.css`: 自定义样式

### 关键CSS类
- `.post-container`: 文章容器
- `.post-title`: 文章标题
- `.post-meta`: 文章元信息（日期等）
- `.post-body`: 文章内容

## 📊 性能优化建议

### 图片优化
1. 使用WebP格式提高加载速度
2. 为图片添加适当的alt文本
3. 考虑使用CDN托管大型媒体文件

### 代码优化
1. 压缩CSS和JavaScript文件
2. 启用Gzip压缩
3. 优化字体加载策略

## 🐛 常见问题

### 构建失败
1. **Python环境**: 确保Python 3.x已安装
2. **编码问题**: 确保所有文件使用UTF-8编码
3. **YAML格式**: 检查Front Matter语法

### Git推送失败
1. 检查网络连接
2. 验证GitHub认证信息
3. 确保有仓库写入权限

## 🧪 测试

### 本地测试
```bash
# 构建测试
python build.py

# 本地预览
# 可以使用VS Code Live Server或其他本地服务器
```

### 验证清单
- [ ] 构建脚本无错误执行
- [ ] 生成的HTML文件格式正确
- [ ] 数学公式正确渲染
- [ ] 响应式布局正常
- [ ] 所有链接有效

## 🔄 版本控制

### 分支策略
- `main`: 生产分支，直接部署到GitHub Pages
- `develop`: 开发分支（如需要）
- `feature/*`: 功能分支

### 提交信息规范
```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建工具或依赖更新
```

## 📝 维护计划

### 定期检查
- [ ] 依赖项安全更新
- [ ] 链接有效性检查
- [ ] 性能监控
- [ ] 备份重要数据

### 功能扩展建议
1. 添加标签系统
2. 实现搜索功能
3. 集成评论系统
4. 添加RSS订阅
5. 实现暗黑模式

---

*最后更新: 2025年9月6日*
