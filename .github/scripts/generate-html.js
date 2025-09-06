const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const yaml = require('js-yaml');

// HTML template
const htmlTemplate = (title, date, content, description = '') => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="${description}" />
  <title>${title} | Wenkang Zhang</title>
  <link rel="icon" type="image/x-icon" href="../static/assets/favicon.ico" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,600;1,600&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
  <link type="text/css" href="../static/css/styles.css" rel="stylesheet" />
  <link type="text/css" href="../static/css/main.css" rel="stylesheet" />
  <script>
    MathJax = { tex: { inlineMath: [['$','$'], ['\\\\(','\\\\)']], displayMath: [['$$','$$'], ['\\\\[','\\\\]']] } };
  </script>
  <script type="text/javascript" id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
  <style>
    .post-container{max-width:900px;margin:8rem auto 4rem;padding:0 1.25rem;}
    .post-title{font-size:2.1rem;color:var(--h-title-color);margin-bottom:.5rem}
    .post-meta{color:#666;margin-bottom:1.5rem}
    .post-body{font-size:1.15rem;line-height:1.7}
    .post-body img{max-width:100%;height:auto}
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
    <h1 class="post-title">${title}</h1>
    ${date ? `<div class="post-meta">${new Date(date).toLocaleDateString('zh-CN')}</div>` : ''}
    <article class="post-body">
      ${content}
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
    if (window.MathJax && window.MathJax.typeset) {
      window.MathJax.typeset();
    }
  </script>
</body>
</html>`;

// Parse front matter from markdown
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (match) {
    try {
      const frontMatter = yaml.load(match[1]) || {};
      return {
        frontMatter,
        content: match[2]
      };
    } catch (e) {
      console.warn('Failed to parse front matter:', e);
      return { frontMatter: {}, content };
    }
  }
  
  return { frontMatter: {}, content };
}

// Main function
function generateHTMLFiles() {
  const postsDir = path.join(__dirname, '../../posts');
  
  if (!fs.existsSync(postsDir)) {
    console.log('Posts directory not found');
    return;
  }
  
  const markdownFiles = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'));
  
  console.log(`Found ${markdownFiles.length} markdown files`);
  
  markdownFiles.forEach(file => {
    const mdPath = path.join(postsDir, file);
    const htmlPath = path.join(postsDir, file.replace('.md', '.html'));
    
    console.log(`Processing: ${file}`);
    
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const { frontMatter, content } = parseFrontMatter(mdContent);
    
    // Convert markdown to HTML
    const htmlContent = marked.parse(content);
    
    // Generate final HTML
    const finalHTML = htmlTemplate(
      frontMatter.title || 'Untitled',
      frontMatter.date,
      htmlContent,
      frontMatter.summary || frontMatter.description || ''
    );
    
    fs.writeFileSync(htmlPath, finalHTML);
    console.log(`Generated: ${file.replace('.md', '.html')}`);
  });
  
  console.log('HTML generation complete!');
}

// Run the generator
generateHTMLFiles();
