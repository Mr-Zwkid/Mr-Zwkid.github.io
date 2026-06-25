const contentDir = "contents/";
const configFile = "config.yml";
const homeSectionNames = ["home", "publications", "awards"];

window.addEventListener("DOMContentLoaded", () => {
    initializeNavigation();
    configureMarked();
    loadSiteConfig();
    loadHomeSections();
    loadBlogIntro();
    loadBlogList();
    loadPostPage();
});

function initializeNavigation() {
    const mainNav = document.body.querySelector("#mainNav");
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: "#mainNav",
            offset: 74
        });
    }

    const navbarToggler = document.body.querySelector(".navbar-toggler");
    if (!navbarToggler) {
        return;
    }

    const responsiveNavItems = [].slice.call(
        document.querySelectorAll("#navbarResponsive .nav-link")
    );

    responsiveNavItems.forEach((responsiveNavItem) => {
        responsiveNavItem.addEventListener("click", () => {
            if (window.getComputedStyle(navbarToggler).display !== "none") {
                navbarToggler.click();
            }
        });
    });
}

function configureMarked() {
    if (window.marked) {
        marked.use({ mangle: false, headerIds: false });
    }
}

function loadSiteConfig() {
    fetchText(contentDir + configFile)
        .then((text) => {
            const yml = jsyaml.load(text) || {};
            Object.keys(yml).forEach((key) => {
                const el = document.getElementById(key);
                if (el) {
                    el.innerHTML = yml[key];
                }
            });
        })
        .catch((error) => console.log(error));
}

function loadHomeSections() {
    homeSectionNames.forEach((name) => {
        const container = document.getElementById(name + "-md");
        if (!container) {
            return;
        }

        fetchText(contentDir + name + ".md")
            .then((markdown) => {
                container.innerHTML = marked.parse(markdown);
            })
            .then(() => {
                renderMath(container);
                if (name === "publications") {
                    initPublicationFilters();
                }
            })
            .catch((error) => console.log(error));
    });
}

function loadBlogIntro() {
    const container = document.getElementById("blog-md");
    if (!container) {
        return;
    }

    fetchText(contentDir + "blog.md")
        .then((markdown) => {
            container.innerHTML = marked.parse(markdown);
        })
        .then(() => renderMath(container))
        .catch(() => {
            // Keep fallback HTML already present in blog.html.
        });
}

function loadBlogList() {
    const blogListEl = document.getElementById("blog-list");
    if (!blogListEl) {
        return;
    }

    fetchText(contentDir + "blog.yml")
        .then((text) => {
            let entries = [];
            try {
                const yml = jsyaml.load(text) || [];
                entries = Array.isArray(yml) ? yml : (yml.posts || []);
            } catch (error) {
                console.log("Failed to parse blog.yml", error);
            }

            return Promise.all(entries.map(resolveBlogEntry));
        })
        .then((posts) => {
            posts.sort((a, b) => compareDates(b.date, a.date));
            blogListEl.innerHTML = posts.map(renderPostCard).join("") || "<p>No posts yet.</p>";
        })
        .catch((error) => {
            console.log(error);
            blogListEl.innerHTML = "<p>No posts yet.</p>";
        });
}

function loadPostPage() {
    const bodyEl = document.getElementById("body-el");
    if (!bodyEl) {
        return;
    }

    const slug = getQueryParam("slug");
    if (!slug) {
        bodyEl.innerHTML = "<p>Missing slug parameter.</p>";
        return;
    }

    fetchPostBySlug(slug)
        .then((post) => {
            const titleEl = document.getElementById("title-el");
            const metaEl = document.getElementById("meta-el");
            const subtitleEl = document.getElementById("post-subtitle-el");
            const tagsEl = document.getElementById("post-tags-el");

            if (titleEl) {
                titleEl.textContent = post.title || "Untitled";
            }
            document.title = `${post.title || "Post"} | Wenkang Zhang`;

            if (metaEl) {
                metaEl.textContent = formatDate(post.date);
            }

            if (subtitleEl && post.summary) {
                subtitleEl.textContent = post.summary;
                subtitleEl.hidden = false;
            }

            if (tagsEl && Array.isArray(post.tags) && post.tags.length > 0) {
                tagsEl.innerHTML = post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
                tagsEl.hidden = false;
            }

            bodyEl.innerHTML = marked.parse(post.content);
            renderMath(bodyEl);
        })
        .catch((error) => {
            console.error("Error loading post:", error);
            bodyEl.innerHTML = `<p>Error loading post: ${escapeHtml(error.message)}</p>`;
        });
}

function resolveBlogEntry(entry) {
    if (!entry) {
        return Promise.resolve(emptyPost());
    }

    if (entry.slug) {
        return fetchPostBySlug(entry.slug)
            .then((post) => mergePostData(post, entry))
            .catch(() => mergePostData(emptyPost(), entry));
    }

    return Promise.resolve(normalizePost(entry));
}

function fetchPostBySlug(slug) {
    return fetchText(`posts/${encodeURIComponent(slug)}.md`).then((text) => {
        const parsed = parseMarkdownDocument(text);
        return normalizePost({
            slug,
            ...parsed.meta,
            content: parsed.content
        });
    });
}

function parseMarkdownDocument(text) {
    const normalized = text.replace(/\r\n/g, "\n");
    if (!normalized.startsWith("---")) {
        return { meta: {}, content: normalized };
    }

    const end = normalized.indexOf("\n---", 3);
    if (end === -1) {
        return { meta: {}, content: normalized };
    }

    const frontMatter = normalized.slice(3, end).trim();
    const content = normalized.slice(end + 4).trim();

    try {
        return {
            meta: jsyaml.load(frontMatter) || {},
            content
        };
    } catch (error) {
        console.error("YAML error:", error);
        return { meta: {}, content };
    }
}

function mergePostData(post, overrides) {
    const merged = {
        ...post,
        ...overrides
    };

    merged.slug = overrides.slug || post.slug || "";
    merged.title = overrides.title || post.title || "Untitled";
    merged.date = overrides.date || post.date || "";
    merged.summary = overrides.summary || post.summary || createExcerpt(post.content);
    merged.tags = normalizeTags(overrides.tags || post.tags);
    merged.content = post.content || overrides.content || "";
    merged.link = overrides.link || post.link || buildPostLink(merged);

    return merged;
}

function normalizePost(post) {
    return {
        slug: post.slug || "",
        title: post.title || "Untitled",
        date: post.date || "",
        summary: post.summary || createExcerpt(post.content || ""),
        tags: normalizeTags(post.tags),
        content: post.content || "",
        link: post.link || buildPostLink(post)
    };
}

function normalizeTags(tags) {
    if (!Array.isArray(tags)) {
        return [];
    }
    return tags.filter(Boolean);
}

function buildPostLink(post) {
    if (post.url) {
        return post.url;
    }
    if (post.link) {
        return post.link;
    }
    if (post.slug) {
        return `post.html?slug=${encodeURIComponent(post.slug)}`;
    }
    return "#";
}

function renderPostCard(post) {
    const title = escapeHtml(post.title);
    const date = formatDate(post.date);
    const desc = escapeHtml(post.summary || "");
    const tags = post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const link = buildPostLink(post);

    return `
    <article class="blog-card">
        <div class="blog-card-body">
            <h3 class="blog-title"><a href="${link}">${title}</a></h3>
            <div class="blog-meta">${date}${tags ? ` &middot; ${tags}` : ""}</div>
            ${desc ? `<p class="blog-desc">${desc}</p>` : ""}
        </div>
    </article>`;
}

function createExcerpt(content) {
    if (!content) {
        return "";
    }

    const plain = content
        .replace(/^---[\s\S]*?---/m, "")
        .replace(/!\[[^\]]*]\([^)]+\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[`#>*_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (plain.length <= 140) {
        return plain;
    }

    return plain.slice(0, 137).trimEnd() + "...";
}

function formatDate(date) {
    if (!date) {
        return "";
    }

    const value = new Date(date);
    if (Number.isNaN(value.getTime())) {
        return String(date);
    }

    return value.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function compareDates(left, right) {
    return parseDateValue(left) - parseDateValue(right);
}

function parseDateValue(date) {
    if (!date) {
        return 0;
    }

    const value = new Date(date);
    return Number.isNaN(value.getTime()) ? 0 : value.getTime();
}

function renderMath(element) {
    if (!window.MathJax) {
        return;
    }

    if (typeof window.MathJax.typesetPromise === "function") {
        window.MathJax.typesetPromise(element ? [element] : undefined).catch((error) => console.error(error));
        return;
    }

    if (typeof window.MathJax.typeset === "function") {
        window.MathJax.typeset(element ? [element] : undefined);
    }
}

function fetchText(path) {
    return fetch(path).then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to load ${path}`);
        }
        return response.text();
    });
}

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function initPublicationFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const publicationRows = document.querySelectorAll(".publications-table tr");

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterBtns.forEach((item) => item.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");
            publicationRows.forEach((row) => {
                row.style.display = filter === "all" ? "" : "";
            });
        });
    });
}

function emptyPost() {
    return {
        slug: "",
        title: "Untitled",
        date: "",
        summary: "",
        tags: [],
        content: "",
        link: "#"
    };
}

function escapeHtml(str) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
    return String(str).replace(/[&<>"']/g, (char) => map[char]);
}
