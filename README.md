# Wenkang Zhang's Personal Homepage

这是Wenkang Zhang的个人学术主页项目，基于Bootstrap构建，支持Markdown文件作为内容输入。

## ✨ 特性

- 📝 支持Markdown文件编写博客文章
- 🎨 基于Bootstrap的现代化设计
- 📱 响应式布局，支持各种设备
- 🔢 内置MathJax，完美支持LaTeX数学公式
- 🚀 自动化构建和部署脚本
- 🎯 SEO友好的静态网站

## 📁 项目结构

```
.
├── _config.yml          # GitHub Pages配置文件
├── index.html          # 主页面
├── blog.html           # 博客列表页面
├── post.html           # 文章页面模板
├── build.py            # Python构建脚本
├── deploy.bat          # 自动部署脚本
├── LICENSE             # 开源协议
├── README.md           # 项目说明
├── contents/           # 页面内容配置
│   ├── config.yml      # 网站配置
│   ├── home.md         # 首页内容
│   ├── blog.md         # 博客页面内容
│   ├── awards.md       # 奖项信息
│   └── publications.md # 发表论文
├── posts/              # 博客文章（Markdown格式）
│   ├── *.md           # Markdown源文件
│   └── *.html         # 自动生成的HTML文件
└── static/             # 静态资源
    ├── assets/         # 资源文件
    │   ├── img/       # 图片资源
    │   └── *.pdf      # PDF文件
    ├── css/           # 样式文件
    └── js/            # JavaScript文件
```

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/Mr-Zwkid/Mr-Zwkid.github.io.git
cd Mr-Zwkid.github.io
```

### 2. 编辑内容

#### 修改网站配置
编辑 `contents/config.yml` 文件来自定义网站标题、副标题等信息。

#### 编辑页面内容
- `contents/home.md` - 首页内容
- `contents/publications.md` - 发表论文列表
- `contents/awards.md` - 获奖情况

#### 添加博客文章
在 `posts/` 目录下创建新的Markdown文件，格式如下：

```markdown
---
title: "文章标题"
date: "2025-01-01"
summary: "文章摘要"
---

文章内容...
```

### 3. 构建和部署

#### 手动构建
```bash
python build.py
```

#### 自动部署
双击运行 `deploy.bat` 文件，或在命令行中执行：
```bash
deploy.bat
```

## 📝 写作指南

### Markdown语法支持

- ✅ 标题 (H1-H4)
- ✅ 段落和换行
- ✅ **粗体** 和 *斜体*
- ✅ [链接](URL)
- ✅ 图片 ![alt](src)
- ✅ `内联代码`
- ✅ 无序列表
- ✅ LaTeX数学公式

### 数学公式示例

内联公式：`$E = mc^2$`

块级公式：
```
$$
\frac{d}{dx}\int_{a}^{x} f(t)dt = f(x)
$$
```

## 🔧 技术栈

- **前端**: Bootstrap 5, HTML5, CSS3, JavaScript
- **构建工具**: Python 3.x
- **数学渲染**: MathJax 3
- **托管平台**: GitHub Pages
- **版本控制**: Git

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

本项目基于以下开源项目构建：
- [Bootstrap](https://getbootstrap.com/)
- [MathJax](https://www.mathjax.org/)
- 原始模板来源：[github.com/SenLi1073](https://github.com/SenLi1073)

---

© 2023-2025 Wenkang Zhang. All Rights Reserved.


### 3. Enjoy

Fire up a browser and go to `https://<username>.github.io`



## License

Copyright Sen Li, 2023. Licensed under an MIT license. You can copy and mess with this template.
