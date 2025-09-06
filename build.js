const fs = require('fs');
const path = require('path');

// 简单的Markdown解析器
function parseMarkdown(content) {
  // 解析front matter
  let frontMatter = {};
  let markdown = content;
  
  if (content.startsWith('---')) {
    const endIndex = content.indexOf('\n---', 3);
    if (endIndex !== -1) {
      const fmString = content.slice(3, endIndex);
      markdown = content.slice(endIndex + 4);
      
      // 简单解析YAML front matter
      fmString.split('\n').forEach(line => {
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          let value = valueParts.join(':').trim();
          if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(s => s.trim());
          }
          frontMatter[key.trim()] = value;
        }
      });
    }
  }
  
  // 简单的Markdown转HTML
  let html = markdown
    // 标题
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    // 列表
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    // 段落
    .split('\n\n')
    .map(para => para.trim())
    .filter(para => para && !para.startsWith('<'))
    .map(para => `<p>${para}</p>`)
    .join('\n');
  
  // 修复嵌套标签
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  
  return { frontMatter, html };
}

// HTML模板
const template = (title, date, content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>${title} | Wenkang Zhang</title>
  <link rel="icon" type="image/x-icon" href="../static/assets/favicon.ico" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
  <link type="text/css" href="../static/css/styles.css" rel="stylesheet" />
  <link type="text/css" href="../static/css/main.css" rel="stylesheet" />
  <style>
    .post-container{max-width:900px;margin:8rem auto 4rem;padding:0 1.25rem;}
    .post-title{font-size:2.1rem;margin-bottom:.5rem}
    .post-meta{color:#666;margin-bottom:1.5rem}
    .post-body{font-size:1.15rem;line-height:1.7}
  </style>
</head>
<body>
  <nav class="header navbar navbar-expand-lg navbar-light fixed-top shadow-sm">
    <div class="container px-5">
      <a class="navbar-brand fw-bold" href="../index.html">Wenkang Zhang</a>
      <div class="navbar-nav ms-auto">
        <a class="nav-link" href="../index.html">ABOUT</a>
        <a class="nav-link" href="../blog.html">BLOG</a>
        <a class="nav-link" href="../static/assets/CV_WenkangZhang.pdf">CV</a>
      </div>
    </div>
  </nav>
  <main class="post-container">
    <h1 class="post-title">${title}</h1>
    ${date ? `<div class="post-meta">${date}</div>` : ''}
    <article class="post-body">${content}</article>
  </main>
</body>
</html>`;

// 处理所有markdown文件
const postsDir = './posts';
fs.readdirSync(postsDir)
  .filter(file => file.endsWith('.md'))
  .forEach(file => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const { frontMatter, html } = parseMarkdown(content);
    
    const htmlFile = file.replace('.md', '.html');
    const finalHTML = template(
      frontMatter.title || 'Untitled',
      frontMatter.date,
      html
    );
    
    fs.writeFileSync(path.join(postsDir, htmlFile), finalHTML);
    console.log(`Generated: ${htmlFile}`);
  });

console.log('完成！');
