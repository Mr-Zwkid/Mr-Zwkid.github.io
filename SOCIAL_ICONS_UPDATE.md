# 社交媒体图标更新说明

**更新时间**: 2025年9月6日  
**参考网站**: https://richardcsuwandi.github.io/

## 更新内容

### 1. 替换社交媒体链接样式
- **之前**: 使用badges样式的文本链接
- **之后**: 使用现代化的圆形图标设计

### 2. 图标设计特点
- 圆形背景，简洁美观
- 悬停效果：向上平移 + 阴影加深
- 每个社交媒体平台有独特的品牌色彩
- 响应式设计，移动端适配

### 3. 包含的社交媒体平台
- **邮箱**: Gmail红色 (#ea4335)
- **Google Scholar**: 谷歌蓝色 (#4285f4)  
- **GitHub**: 深灰色 (#24292e)
- **LinkedIn**: LinkedIn蓝色 (#0a66c2)

### 4. 技术实现

#### HTML结构 (在 contents/home.md 中)
```html
<div class="social-icons">
    <a href="mailto:conquer.wkzhang@sjtu.edu.cn" class="social-icon" title="Email">
        <i class="bi bi-envelope-fill"></i>
    </a>
    <a href="https://scholar.google.com/citations?user=-WwtynYAAAAJ" class="social-icon" title="Google Scholar">
        <i class="bi bi-mortarboard-fill"></i>
    </a>
    <a href="https://github.com/Mr-Zwkid" class="social-icon" title="GitHub">
        <i class="bi bi-github"></i>
    </a>
    <a href="https://www.linkedin.com/in/wenkang-zhang" class="social-icon" title="LinkedIn">
        <i class="bi bi-linkedin"></i>
    </a>
</div>
```

#### CSS样式 (在 static/css/main.css 中)
- 基础样式：圆形背景，灰色图标
- 悬停效果：平移动画，品牌色彩变化
- 响应式设计：移动端尺寸调整

### 5. 视觉效果
- 图标尺寸: 48x48px (桌面), 44x44px (移动端)
- 间距: 1.2rem
- 阴影: 轻微阴影，悬停时加深
- 动画: 0.25s缓动过渡

### 6. 使用的图标库
- **Bootstrap Icons 1.5.0**: 已经在项目中引入
- 使用的图标类:
  - `bi-envelope-fill` (邮箱)
  - `bi-mortarboard-fill` (学者帽，代表Google Scholar)
  - `bi-github` (GitHub)
  - `bi-linkedin` (LinkedIn)

## 优势
1. **现代化设计**: 符合当前网页设计趋势
2. **用户体验**: 清晰的视觉反馈和交互效果
3. **品牌一致性**: 使用各平台官方品牌色彩
4. **响应式**: 在各种设备上都有良好显示效果
5. **可访问性**: 包含title属性提供辅助信息

## 文件修改列表
- `contents/home.md`: 替换社交媒体链接为HTML图标
- `static/css/main.css`: 添加社交媒体图标样式

参考Richard Cornelius Suwandi的网站设计，成功实现了现代化的社交媒体图标展示效果。
