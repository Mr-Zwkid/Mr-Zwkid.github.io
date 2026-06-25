# 个人主页使用说明

这是一个基于 GitHub Pages 的轻量静态个人主页。

目前站点已经不依赖额外构建步骤：

- `index.html` 会在浏览器里直接读取 `contents/config.yml` 和 `contents/*.md`
- `blog.html` 会直接读取 `contents/blog.yml`
- `post.html` 会直接读取 `posts/<slug>.md`

也就是说，平时改主页内容、改头像、改博客，通常都不需要先运行 `build.py` 之类的脚本，启动本地静态服务器后刷新页面即可。

## 项目结构

```text
.
|-- index.html                # 主页
|-- blog.html                 # 博客列表页
|-- post.html                 # 博客详情页模板
|-- contents/
|   |-- config.yml            # 网站标题、页脚等公共配置
|   |-- home.md               # 首页介绍
|   |-- publications.md       # 论文列表
|   |-- awards.md             # 奖项列表
|   `-- blog.yml              # 博客卡片数据
|-- posts/
|   `-- *.md                  # 博客正文
`-- static/
    |-- assets/
    |   |-- CV_WenkangZhang.pdf
    |   `-- img/
    |       |-- avatar.png
    |       `-- ...
    |-- css/
    `-- js/
```

## 本地查看

### 用 Python 启动

在仓库根目录运行：

```powershell
python -m http.server 8000
```

然后打开：

```text
http://localhost:8000/
```

### 用 VS Code Live Server

如果你习惯用 VS Code，也可以直接对 `index.html` 启动 Live Server。

## 日常修改

### 1. 修改主页文案

常改的文件是：

- `contents/config.yml`
- `contents/home.md`
- `contents/publications.md`
- `contents/awards.md`

改完后刷新浏览器即可。

### 2. 修改头像

头像文件路径：

```text
static/assets/img/avatar.png
```

如果你已经替换了头像，但 `http://localhost:8000/` 里还是旧图，通常不是因为没构建，而是浏览器缓存了旧图片。

可以这样排查：

1. 先按 `Ctrl+F5` 强制刷新
2. 或者开一个无痕窗口再访问一次
3. 还不行的话，把图片文件改个名字，比如 `avatar-2026.png`，再同步修改 `index.html` 里的引用路径

当前头像引用在：

- `index.html`

### 3. 新增博客

先在 `posts/` 下新建一个 Markdown 文件，例如：

```text
posts/my-first-post.md
```

建议写成下面这种格式：

```md
---
title: 我的第一篇博客
date: 2026-06-25
summary: 这是一段会显示在博客列表里的摘要。
---

这里写正文。
```

然后在 `contents/blog.yml` 里加一条：

```yml
- title: 我的第一篇博客
  date: 2026-06-25
  summary: 这是一段会显示在博客列表里的摘要。
  tags: [Tag1, Tag2]
  slug: my-first-post
```

本地访问地址：

```text
http://localhost:8000/post.html?slug=my-first-post
```

## 部署

这个仓库面向 GitHub Pages，通常直接推送到 `main` 就可以。

常用命令：

```powershell
git add .
git commit -m "Update homepage"
git push origin main
```

如果仓库名是 `<username>.github.io`，GitHub Pages 一般会自动更新。

## 这次整理做了什么

- 删除了旧的 `build.py`
- 删除了旧的 `deploy.bat`
- 删除了重复的 `DEVELOPMENT.md`
- 删除了生成产物 `posts/gs-sim2real.html`
- 把博客链接从静态 `html` 改成了 `slug` 方式
- 把使用说明统一收敛到这份 `README.md`

## 额外说明

- `_config.yml` 先保留，因为 GitHub Pages 对直接访问 `posts/*.md` 仍然有帮助
- 现在博客正文的唯一源文件就是 `posts/*.md`
- 现在不再需要“先生成 HTML 再预览”的流程
