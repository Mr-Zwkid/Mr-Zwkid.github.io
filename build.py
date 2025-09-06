#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re
import yaml
from pathlib import Path

def parse_front_matter(content):
    """解析front matter"""
    if not content.startswith('---'):
        return {}, content
    
    try:
        parts = content.split('---', 2)
        if len(parts) >= 3:
            front_matter = yaml.safe_load(parts[1]) or {}
            markdown_content = parts[2].strip()
            return front_matter, markdown_content
    except:
        pass
    
    return {}, content

def markdown_to_html(markdown):
    """简单的Markdown转HTML转换"""
    html = markdown
    
    # 标题
    html = re.sub(r'^# (.*)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.*)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    
    # 列表项
    html = re.sub(r'^- (.*)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    
    # 包装连续的<li>为<ul>
    html = re.sub(r'(<li>.*?</li>(\s*<li>.*?</li>)*)', r'<ul>\1</ul>', html, flags=re.DOTALL)
    
    # 段落 - 将非标签行转为段落
    lines = html.split('\n')
    result_lines = []
    current_paragraph = []
    
    for line in lines:
        line = line.strip()
        if not line:
            if current_paragraph:
                result_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
                current_paragraph = []
        elif line.startswith('<'):
            if current_paragraph:
                result_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
                current_paragraph = []
            result_lines.append(line)
        else:
            current_paragraph.append(line)
    
    if current_paragraph:
        result_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
    
    return '\n'.join(result_lines)

def html_template(title, date, content, description=''):
    """HTML模板"""
    date_str = ''
    if date:
        try:
            from datetime import datetime
            if isinstance(date, str):
                date_obj = datetime.strptime(date, '%Y-%m-%d')
                date_str = f'<div class="post-meta">{date_obj.strftime("%Y年%m月%d日")}</div>'
        except:
            date_str = f'<div class="post-meta">{date}</div>'
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="{description}" />
  <title>{title} | Wenkang Zhang</title>
  <link rel="icon" type="image/x-icon" href="../static/assets/favicon.ico" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,600;1,600&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
  <link type="text/css" href="../static/css/styles.css" rel="stylesheet" />
  <link type="text/css" href="../static/css/main.css" rel="stylesheet" />
  <script>
    MathJax = {{ tex: {{ inlineMath: [['$','$'], ['\\\\(','\\\\)']], displayMath: [['$$','$$'], ['\\\\[','\\\\]']] }} }};
  </script>
  <script type="text/javascript" id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
  <style>
    .post-container{{max-width:900px;margin:8rem auto 4rem;padding:0 1.25rem;}}
    .post-title{{font-size:2.1rem;color:var(--h-title-color);margin-bottom:.5rem}}
    .post-meta{{color:#666;margin-bottom:1.5rem}}
    .post-body{{font-size:1.15rem;line-height:1.7}}
    .post-body img{{max-width:100%;height:auto}}
    .post-body ul{{margin-left:1.5rem;}}
    .post-body li{{margin-bottom:0.5rem;}}
  </style>
</head>
<body>
  <nav class="header navbar navbar-expand-lg navbar-light fixed-top shadow-sm" id="mainNav">
    <div class="container px-5">
      <a class="navbar-brand fw-bold" href="../index.html#page-top">Wenkang Zhang</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">MENU <i class="bi-list"></i></button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ms-auto me-4 my-3 my-lg-0">
          <li class="nav-item"><a class="nav-link me-lg-3" href="../index.html#page-top">ABOUT</a></li>
          <li class="nav-item"><a class="nav-link me-lg-3" href="../blog.html">BLOG</a></li>
          <li class="nav-item"><a class="nav-link me-lg-3" href="../static/assets/CV_WenkangZhang.pdf" target="_blank">CV</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <main class="post-container">
    <h1 class="post-title">{title}</h1>
    {date_str}
    <article class="post-body">
      {content}
    </article>
  </main>

  <footer class="bg-bottom text-center py-5">
    <div class="container px-5">
      <div class="text-white-50 small">
        <div class="mb-2">© 2025 Wenkang Zhang</div>
        <a href="https://github.com/Mr-Zwkid">Github</a>
        <span class="mx-1">&middot;</span>
        <a href="../LICENSE">License</a>
      </div>
    </div>
  </footer>
  
  <script>
    // Re-render MathJax after content loads
    if (window.MathJax && window.MathJax.typeset) {{
      window.MathJax.typeset();
    }}
  </script>
</body>
</html>"""

def main():
    """主函数"""
    posts_dir = Path('posts')
    
    if not posts_dir.exists():
        print("posts目录不存在")
        return
    
    # 处理所有markdown文件
    for md_file in posts_dir.glob('*.md'):
        print(f"处理文件: {md_file.name}")
        
        # 读取markdown文件
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 解析front matter
        front_matter, markdown_content = parse_front_matter(content)
        
        # 转换为HTML
        html_content = markdown_to_html(markdown_content)
        
        # 生成最终HTML
        title = front_matter.get('title', 'Untitled')
        date = front_matter.get('date', '')
        description = front_matter.get('summary', front_matter.get('description', ''))
        
        final_html = html_template(title, date, html_content, description)
        
        # 写入HTML文件
        html_file = md_file.with_suffix('.html')
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(final_html)
        
        print(f"生成文件: {html_file.name}")
    
    print("HTML生成完成！")

if __name__ == '__main__':
    main()
