#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
静态网站构建脚本
将Markdown文件转换为HTML文件，支持Front Matter
作者：Wenkang Zhang
"""

import os
import re
import yaml
import logging
from pathlib import Path
from datetime import datetime

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def parse_front_matter(content):
    """
    解析YAML Front Matter
    
    Args:
        content (str): 文件内容
        
    Returns:
        tuple: (front_matter_dict, markdown_content)
    """
    if not content.startswith('---'):
        return {}, content
    
    try:
        parts = content.split('---', 2)
        if len(parts) >= 3:
            front_matter = yaml.safe_load(parts[1]) or {}
            markdown_content = parts[2].strip()
            return front_matter, markdown_content
    except yaml.YAMLError as e:
        logger.warning(f"YAML解析错误: {e}")
    except Exception as e:
        logger.error(f"Front matter解析失败: {e}")
    
    return {}, content

def markdown_to_html(markdown_text):
    """
    简单的Markdown转HTML转换器
    支持标题、列表、段落、粗体、斜体等基本格式
    
    Args:
        markdown_text (str): Markdown文本
        
    Returns:
        str: HTML内容
    """
    html = markdown_text
    
    # 标题转换
    html = re.sub(r'^# (.*)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.*)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^#### (.*)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    
    # 粗体和斜体
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    
    # 链接
    html = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', html)
    
    # 图片
    html = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img src="\2" alt="\1" />', html)
    
    # 代码块（简单处理）
    html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)
    
    # 无序列表
    html = re.sub(r'^[-*] (.*)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    
    # 处理段落和列表
    lines = html.split('\n')
    result_lines = []
    current_paragraph = []
    in_list = False
    
    for line in lines:
        line = line.strip()
        
        if not line:  # 空行
            if current_paragraph:
                result_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
                current_paragraph = []
            if in_list:
                result_lines.append('</ul>')
                in_list = False
        elif line.startswith('<li>'):  # 列表项
            if current_paragraph:
                result_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
                current_paragraph = []
            if not in_list:
                result_lines.append('<ul>')
                in_list = True
            result_lines.append(line)
        elif line.startswith('<h') or line.startswith('<div') or line.startswith('<img'):  # HTML标签
            if current_paragraph:
                result_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
                current_paragraph = []
            if in_list:
                result_lines.append('</ul>')
                in_list = False
            result_lines.append(line)
        else:  # 普通文本
            if in_list:
                result_lines.append('</ul>')
                in_list = False
            current_paragraph.append(line)
    
    # 处理剩余内容
    if current_paragraph:
        result_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
    if in_list:
        result_lines.append('</ul>')
    
    return '\n'.join(result_lines)

def html_template(title, date, content, description=''):
    """
    生成HTML页面模板
    
    Args:
        title (str): 页面标题
        date (str): 发布日期
        content (str): 页面内容
        description (str): 页面描述
        
    Returns:
        str: 完整的HTML页面
    """
    # 格式化日期
    date_str = ''
    if date:
        try:
            if isinstance(date, str):
                # 尝试解析不同的日期格式
                for fmt in ['%Y-%m-%d', '%Y/%m/%d', '%d/%m/%Y']:
                    try:
                        date_obj = datetime.strptime(date, fmt)
                        date_str = f'<div class="post-meta">{date_obj.strftime("%Y年%m月%d日")}</div>'
                        break
                    except ValueError:
                        continue
                else:
                    # 如果无法解析，直接使用原始字符串
                    date_str = f'<div class="post-meta">{date}</div>'
            else:
                date_str = f'<div class="post-meta">{date}</div>'
        except Exception as e:
            logger.warning(f"日期格式化失败: {e}")
            date_str = f'<div class="post-meta">{date}</div>' if date else ''
    
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
    """
    主函数 - 批量处理Markdown文件并生成HTML
    """
    posts_dir = Path('posts')
    
    if not posts_dir.exists():
        logger.error("posts目录不存在")
        return False
    
    # 获取所有markdown文件
    md_files = list(posts_dir.glob('*.md'))
    if not md_files:
        logger.warning("posts目录中没有找到Markdown文件")
        return True
    
    logger.info(f"找到 {len(md_files)} 个Markdown文件")
    
    success_count = 0
    error_count = 0
    
    # 处理每个markdown文件
    for md_file in md_files:
        try:
            logger.info(f"处理文件: {md_file.name}")
            
            # 读取markdown文件
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 解析front matter
            front_matter, markdown_content = parse_front_matter(content)
            
            # 转换为HTML
            html_content = markdown_to_html(markdown_content)
            
            # 获取元数据
            title = front_matter.get('title', md_file.stem.replace('-', ' ').title())
            date = front_matter.get('date', '')
            description = front_matter.get('summary', front_matter.get('description', ''))
            
            # 生成最终HTML
            final_html = html_template(title, date, html_content, description)
            
            # 写入HTML文件
            html_file = md_file.with_suffix('.html')
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(final_html)
            
            logger.info(f"成功生成: {html_file.name}")
            success_count += 1
            
        except Exception as e:
            logger.error(f"处理 {md_file.name} 时出错: {e}")
            error_count += 1
    
    # 输出总结
    logger.info(f"处理完成! 成功: {success_count}, 失败: {error_count}")
    return error_count == 0

if __name__ == '__main__':
    try:
        success = main()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        logger.info("用户中断了程序")
        exit(1)
    except Exception as e:
        logger.error(f"程序执行出错: {e}")
        exit(1)
