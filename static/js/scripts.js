

const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'publications', 'awards', 'blog']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
                
                // Initialize publication filters after content is loaded
                if (name === 'publications') {
                    initPublicationFilters();
                }
                // Load blog list after blog markdown is injected
                if (name === 'blog') {
                    loadBlogList();
                }
            })
            .catch(error => console.log(error));
    })

}); 

// Publication filters functionality
function initPublicationFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const publicationRows = document.querySelectorAll('.publications-table tr');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            publicationRows.forEach(row => {
                if (filter === 'all') {
                    row.style.display = '';
                } else {
                    // This is a simple implementation - you can enhance it based on your needs
                    // For now, show all rows when any filter is selected
                    row.style.display = '';
                }
            });
        });
    });
}

// Blog list rendering from YAML (contents/blog.yml)
function loadBlogList() {
    const blogListEl = document.getElementById('blog-list');
    if (!blogListEl) return;
    fetch(content_dir + 'blog.yml')
        .then(r => r.text())
        .then(text => {
            let posts = [];
            try {
                const yml = jsyaml.load(text) || [];
                posts = Array.isArray(yml) ? yml : (yml.posts || []);
            } catch (e) {
                console.log('Failed to parse blog.yml', e);
            }
            // sort by date desc if present
            posts.sort((a, b) => (new Date(b.date || 0)) - (new Date(a.date || 0)));
            blogListEl.innerHTML = posts.map(renderPostCard).join('') || '<p>No posts yet.</p>';
        })
        .catch(() => blogListEl.innerHTML = '<p>No posts yet.</p>');
}

function renderPostCard(p) {
    const title = escapeHtml(p.title || 'Untitled');
    const date = p.date ? new Date(p.date).toLocaleDateString() : '';
    const desc = escapeHtml(p.summary || p.excerpt || '');
    const tags = (p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
    const link = p.link || p.url || '#';
    return `
    <article class="blog-card">
        <div class="blog-card-body">
            <h3 class="blog-title"><a href="${link}" target="_blank" rel="noopener">${title}</a></h3>
            <div class="blog-meta">${date} ${tags ? '&middot; ' + tags : ''}</div>
            ${desc ? `<p class="blog-desc">${desc}</p>` : ''}
        </div>
    </article>`;
}

function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(str).replace(/[&<>"']/g, s => map[s]);
}
