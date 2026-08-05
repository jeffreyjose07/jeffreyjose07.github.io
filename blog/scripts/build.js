#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { Marked } from 'marked';
import markedShiki from 'marked-shiki';
import matter from 'gray-matter';
import { fileURLToPath, pathToFileURL } from 'url';
import { getHighlighter, highlightCode, SHIKI_THEME } from './syntax-highlight.js';
// import { generateThumbnails } from '../../scripts/thumbnail-generator/generate.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Shared Marked instance with semantic prose coloring + Shiki code fences. */
let markdown = null;

// Configuration
const CONFIG_PATH = path.join(__dirname, '../config.json');
const POSTS_DIR = path.join(__dirname, '../posts');
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const OUTPUT_DIR = path.join(__dirname, '../../public/blog');
const THUMBNAILS_DIR = path.join(__dirname, '../../public/assets/thumbnails');
const REDIRECTS_PATH = path.join(__dirname, '../redirects.json');
const REPO_ROOT = path.join(__dirname, '../..');

/** Canonical origin. The apex github.io host 301s here, so every absolute URL must use it. */
const SITE_URL = 'https://jeffreyjose07.is-a.dev';

/**
 * Drafts are visible locally and dropped from published builds — Eleventy's
 * preprocessor convention. `BLOG_INCLUDE_DRAFTS=true` forces them back in.
 */
const IS_CI = process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true';
const INCLUDE_DRAFTS = process.env.BLOG_INCLUDE_DRAFTS === 'true' || !IS_CI;

// Load configuration
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Semantic colorizer disabled — rainbow prose wraps read as AI chrome.
class SemanticColorizer {
    colorizeText(text) {
        return text;
    }
}

// Initialize semantic colorizer (no-op)
const colorizer = new SemanticColorizer();

async function initMarkdown() {
    if (markdown) return markdown;

    await getHighlighter();
    console.log(`🎨 Shiki ready (theme: ${SHIKI_THEME}) — IDE-style fences for any language`);

    markdown = new Marked({
        gfm: true,
        breaks: false,
        pedantic: false,
        smartLists: true,
        smartypants: false,
    });

    // Prose coloring + image/paragraph tweaks (does not touch fenced code)
    //
    // NOTE: since marked v9 every renderer method receives a single *token*
    // object rather than positional string arguments. Destructuring the token
    // (or re-parsing its inline children) is mandatory — interpolating the
    // token itself renders the literal string "[object Object]".
    markdown.use({
        renderer: {
            image({ href, title, text }) {
                const titleAttr = title ? ` title="${title}"` : '';
                const alt = (text || '').replace(/"/g, '&quot;');
                return `<figure class="post-figure"><img src="${href}" alt="${alt}" loading="lazy" decoding="async"${titleAttr}></figure>`;
            },
            paragraph(token) {
                const text = colorizer.colorizeText(this.parser.parseInline(token.tokens));
                if (String(text).trim().startsWith('<figure class="post-figure">')) {
                    return `${text}\n`;
                }
                return `<p>${text}</p>\n`;
            },
        },
    });

    // Fenced code → Shiki (VS Code TextMate grammars + Dark+ theme)
    markdown.use(
        markedShiki({
            highlight(code, lang) {
                return highlightCode(code, lang);
            },
        }),
    );

    return markdown;
}

// Sync profile photo into public/ for blog author cards
function syncProfileImage() {
    const profileSrc = path.join(__dirname, '../../src/assets/jeffrey-profile.jpg');
    const profileDest = path.join(__dirname, '../../public/jeffrey-profile.jpg');
    if (fs.existsSync(profileSrc)) {
        fs.copyFileSync(profileSrc, profileDest);
        console.log('📷 Synced profile image to public/jeffrey-profile.jpg');
    }
}

// Utility functions

/** Longest slug we will emit. Cut lands on a word boundary, never mid-word. */
const SLUG_MAX_LENGTH = 60;

function normalizeSlugSource(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')     // Remove special chars except spaces and hyphens
        .replace(/\s+/g, '-')             // Convert spaces to hyphens
        .replace(/-+/g, '-');             // Multiple hyphens to single
}

/**
 * The slug algorithm as it stood through episode 035: a hard `substring(0, 50)`.
 * It sliced 12 of 36 titles mid-word ("...terminal-aesthet"). Retained *only* so
 * `npm run blog:redirects` can recompute the historical URLs it produced — those
 * paths are live and carry inbound links. Never call this to mint a new slug.
 */
function createLegacySlug(title, customSlug) {
    if (customSlug) {
        return customSlug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    }
    return normalizeSlugSource(title)
        .substring(0, 50)
        .replace(/-$/, '');
}

function createCleanSlug(title, customSlug) {
    // Use custom slug if provided in frontmatter
    if (customSlug) {
        return customSlug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    }

    const full = normalizeSlugSource(title);
    if (full.length <= SLUG_MAX_LENGTH) return full.replace(/-$/, '');

    // Back off to the last complete word inside the budget rather than slicing a
    // word in half. Falls back to the hard cut only for a single absurdly long word.
    const clipped = full.substring(0, SLUG_MAX_LENGTH);
    const lastBoundary = clipped.lastIndexOf('-');
    const slug = lastBoundary > 0 ? clipped.substring(0, lastBoundary) : clipped;
    return slug.replace(/-$/, '');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

function estimateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

function countWords(text) {
    return text.split(/\s+/).length;
}

/** Escape for HTML *attribute* / text context. Titles carry quotes and ampersands. */
function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * String.replace treats `$&`, `$1`, `$'` in the *replacement* as capture-group
 * refs. A title containing `$&` would corrupt the page. Passing a function opts
 * out of that substitution entirely.
 */
function injectAll(template, replacements) {
    let out = template;
    for (const [token, value] of Object.entries(replacements)) {
        out = out.replace(new RegExp(`{{\\s*${token}\\s*}}`, 'g'), () => String(value ?? ''));
    }
    return out;
}

/**
 * Last commit date touching a file, as YYYY-MM-DD — Hugo's `enableGitInfo`
 * approach. Stamping the *build* date instead makes every rebuild rewrite the
 * sitemap and teaches crawlers that our lastmod is noise.
 *
 * Requires full history: a shallow CI clone reports the clone commit for every
 * file. deploy.yml already sets fetch-depth: 0.
 */
const gitDateCache = new Map();
function gitLastModified(relPath) {
    if (gitDateCache.has(relPath)) return gitDateCache.get(relPath);
    let result = null;
    try {
        const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', relPath], {
            cwd: REPO_ROOT,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(out)) result = out;
    } catch {
        result = null; // not a git checkout, or file never committed
    }
    gitDateCache.set(relPath, result);
    return result;
}

/**
 * Fail the build on malformed frontmatter instead of shipping `undefined` into
 * meta tags — the guarantee Astro's content collections give via Zod schemas.
 * Returns validated records; throws with every problem at once.
 */
function validatePosts(entries) {
    const errors = [];
    const warnings = [];
    const slugOwners = new Map();

    for (const { file, frontmatter, index } of entries) {
        const where = `blog/posts/${file}`;

        for (const field of ['title', 'date', 'description']) {
            if (!frontmatter[field] || String(frontmatter[field]).trim() === '') {
                errors.push(`${where}: missing required frontmatter "${field}"`);
            }
        }
        if (!Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
            errors.push(`${where}: "tags" must be a non-empty array`);
        }

        // gray-matter turns unquoted YAML dates into Date objects, which format
        // differently than the quoted strings every existing post uses.
        const rawDate = frontmatter.date;
        if (rawDate instanceof Date) {
            errors.push(`${where}: quote the date ("YYYY-MM-DD") — unquoted YAML parses it as a Date`);
        } else if (rawDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(rawDate).trim())) {
            errors.push(`${where}: date "${rawDate}" is not YYYY-MM-DD`);
        }

        // Episode numbers are the post's public identity (#012 is cited in prose
        // and in URLs elsewhere). They are derived from sort position, so a gap or
        // duplicate in the filename prefixes silently renumbers every later post.
        const prefix = /^(\d{3})-/.exec(file);
        if (!prefix) {
            errors.push(`${where}: filename must start with a zero-padded episode number, e.g. 036-`);
        } else if (Number(prefix[1]) !== index) {
            errors.push(
                `${where}: filename prefix ${prefix[1]} but sort position ${String(index).padStart(3, '0')} — ` +
                `renumbering would change published episode numbers`,
            );
        }

        if (frontmatter.title) {
            const slug = createCleanSlug(frontmatter.title, frontmatter.slug);
            if (slugOwners.has(slug)) {
                errors.push(`${where}: slug "${slug}" already used by ${slugOwners.get(slug)}`);
            }
            slugOwners.set(slug, where);
        }
    }

    if (warnings.length) {
        warnings.forEach(w => console.warn(`⚠️  ${w}`));
    }
    if (errors.length) {
        throw new Error(`Frontmatter validation failed:\n  - ${errors.join('\n  - ')}`);
    }
}

// Load template files
function loadTemplate(templateName) {
    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
    return fs.readFileSync(templatePath, 'utf8');
}

// Load site header template
const siteHeader = loadTemplate('header');
// Load shared styles
const styles = loadTemplate('styles');

// Process a single blog post
async function processPost(filename, episodeNumber, allPosts = []) {
    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContent);

    // Create post slug
    const slug = createCleanSlug(frontmatter.title, frontmatter.slug);

    // Determine thumbnail (default to generated terminal thumbnail)
    const thumbnail = frontmatter.thumbnail || frontmatter.image || `/assets/thumbnails/${slug}.png`;

    // Generate HTML content (Shiki highlights fences at build time)
    const md = await initMarkdown();
    const htmlContent = await md.parse(content);

    // Calculate metadata
    const wordCount = frontmatter.wordCount || countWords(content);
    const readingTime = frontmatter.readingTime || estimateReadingTime(content);


    // Format tags with colors and make them clickable
    const tagsFormatted = frontmatter.tags
        ? frontmatter.tags.map(tag => {
            const tagColorCategory = config.tagColors[tag] || 'neutral';
            return `<a href="/blog#tag-${tag}" class="tag ${tagColorCategory}" data-tag="${tag}">${tag}</a>`;
        }).join(', ')
        : '';

    // Generate navigation links
    const currentIndex = allPosts.findIndex(post => post.episodeNumber === episodeNumber);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    const navigationHtml = generatePostNavigation(prevPost, nextPost);

    // Process inline styles and scripts from frontmatter
    const inlineStyles = frontmatter.inlineStyles || '';
    const inlineScripts = frontmatter.inlineScripts || '';

    // Load and populate template
    const template = loadTemplate('post');
    const html = injectAll(template, {
        // Plain text — escaped, because titles carry quotes, ampersands and colons
        // and these land in <title> and meta content attributes.
        title: escapeHtml(frontmatter.title),
        description: escapeHtml(frontmatter.description || ''),
        // Pre-rendered HTML — must not be escaped
        content: htmlContent,
        tagsFormatted,
        navigation: navigationHtml,
        inlineStyles,
        inlineScripts,
        siteHeader,
        styles,
        // Scalars and URLs
        episodeNumber: episodeNumber.toString().padStart(3, '0'),
        date: formatDate(frontmatter.date),
        wordCount,
        readingTime,
        slug,
        thumbnail,
        githubUrl: config.social.github,
        linkedinUrl: config.social.linkedin,
        twitterUrl: config.social.twitter,
        emailUrl: config.social.email,
        resumeUrl: config.resumeUrl,
    });

    // Create output directory
    const outputDir = path.join(OUTPUT_DIR, slug);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write HTML file
    fs.writeFileSync(path.join(outputDir, 'index.html'), html);

    return {
        episodeNumber,
        title: frontmatter.title,
        slug,
        date: frontmatter.date,
        description: frontmatter.description,
        tags: frontmatter.tags || [],
        readingTime,
        wordCount,
        thumbnail,
        sourceFile: `blog/posts/${filename}`,
        // Kept in memory for the feed. Previously the RSS generator re-read the
        // built page off disk and shoved the entire document — <head>, inline
        // <style>, nav, footer, scripts — into <content:encoded>.
        bodyHtml: htmlContent,
    };
}

// Generate navigation HTML for posts
function generatePostNavigation(prevPost, nextPost) {
    let navHtml = '<nav class="post-navigation">';

    if (prevPost) {
        navHtml += `
            <div class="nav-previous panel-card">
                <a href="/blog/${prevPost.slug}">
                    <span class="nav-label">← previous</span>
                    <span class="nav-title">${prevPost.title}</span>
                </a>
            </div>`;
    }

    if (nextPost) {
        navHtml += `
            <div class="nav-next panel-card">
                <a href="/blog/${nextPost.slug}">
                    <span class="nav-label">next →</span>
                    <span class="nav-title">${nextPost.title}</span>
                </a>
            </div>`;
    }

    navHtml += '</nav>';
    return navHtml;
}

// Constants for pagination
const POSTS_PER_PAGE = 10;

// Generate blog index with tag filtering and pagination
function generateIndex(posts) {
    const allTags = [...new Set(posts.flatMap(post => post.tags))];
    const tagFiltersHtml = allTags.map(tag => {
        const tagColorCategory = config.tagColors[tag] || 'neutral';
        return `            <button class="tag-filter ${tagColorCategory}" data-tag="${tag}">${tag}</button>`;
    }).join('\n');

    // Sort a *copy*. Sorting `posts` in place made each generator depend on
    // whichever one ran before it — and since the feed only ran in CI, the
    // archive and sitemap came out in a different order locally than in CI.
    const sortedPosts = [...posts].sort((a, b) => b.episodeNumber - a.episodeNumber);
    const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

    for (let i = 0; i < totalPages; i++) {
        const pagePosts = sortedPosts.slice(i * POSTS_PER_PAGE, (i + 1) * POSTS_PER_PAGE);
        const template = loadTemplate('index');

        const postsHtml = pagePosts.map((post, index) => {
            const episodeNum = post.episodeNumber.toString().padStart(3, '0');
            const tagsAttr = post.tags.join(' ');

            let thumbnailHtml = '';
            // Eager load images for the first 3 posts on the first page, lazy load others
            const loadingAttr = (i === 0 && index < 3) ? 'eager' : 'lazy';
            
            if (post.thumbnail) {
                const thumbSrc = post.thumbnail.startsWith('http') || post.thumbnail.startsWith('/') ? post.thumbnail : `/blog/${post.thumbnail}`;
                thumbnailHtml = `<div class="post-thumbnail">
                    <img src="${thumbSrc}" alt="${escapeHtml(post.title)}" loading="${loadingAttr}" width="400" height="225">
                </div>`;
            } else {
                // Generate a deterministic gradient based on episode number
                const hue = (post.episodeNumber * 137.508) % 360;
                thumbnailHtml = `<div class="post-thumbnail" style="background: linear-gradient(135deg, hsl(${hue}, 60%, 20%), hsl(${hue + 40}, 60%, 10%))">
                    <div class="thumbnail-icon">📝</div>
                </div>`;
            }

            return `            <div class="post-item panel-card" data-tags="${escapeHtml(tagsAttr)}">
                <a href="/blog/${post.slug}">
                    ${thumbnailHtml}
                    <div class="post-content-wrapper">
                        <div class="post-meta-top">
                            <span class="episode-number">#${episodeNum}</span>
                            <span class="date">${formatDate(post.date)}</span>
                        </div>
                        <h3 class="post-title">${escapeHtml(post.title)}</h3>
                        <p class="post-description">${escapeHtml(post.description)}</p>
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    </div>
                </a>
            </div>`;
        }).join('\n');

        let paginationHtml = '<div class="pagination">';
        if (i > 0) {
            const prevLink = i === 1 ? '/blog/' : `/blog/page/${i}/`;
            paginationHtml += `<a href="${prevLink}" class="pagination-link">&laquo; Previous</a>`;
        }
        for (let j = 0; j < totalPages; j++) {
            const pageLink = j === 0 ? '/blog/' : `/blog/page/${j + 1}/`;
            paginationHtml += `<a href="${pageLink}" class="pagination-link ${i === j ? 'active' : ''}">${j + 1}</a>`;
        }
        if (i < totalPages - 1) {
            const nextLink = `/blog/page/${i + 2}/`;
            paginationHtml += `<a href="${nextLink}" class="pagination-link">Next &raquo;</a>`;
        }
        paginationHtml += '</div>';

        // Strip the in-memory article HTML before embedding — it is only needed
        // by the feed, and inlining 36 rendered posts would balloon every index page.
        const clientPosts = sortedPosts.map(({ bodyHtml, sourceFile, ...rest }) => rest);

        const html = injectAll(template, {
            title: escapeHtml(config.title),
            description: escapeHtml(config.description),
            tagFilters: tagFiltersHtml,
            posts: postsHtml,
            totalPosts: posts.length,
            pagination: paginationHtml,
            // `</script>` inside embedded JSON closes the host <script> element early.
            allPostsData: JSON.stringify(clientPosts).replace(/</g, '\\u003c'),
            githubUrl: config.social.github,
            linkedinUrl: config.social.linkedin,
            twitterUrl: config.social.twitter,
            emailUrl: config.social.email,
            resumeUrl: config.resumeUrl,
            siteHeader,
            styles,
        });

        if (i === 0) {
             fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
        } else {
            const pageDir = path.join(OUTPUT_DIR, 'page', (i + 1).toString());
            if (!fs.existsSync(pageDir)) {
                fs.mkdirSync(pageDir, { recursive: true });
            }
            fs.writeFileSync(path.join(pageDir, 'index.html'), html);
        }
    }
}

/** Number of items carried in the feed. Full bodies, so keep the file well under 1 MB. */
const FEED_ITEM_COUNT = 15;

function escapeXml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** CDATA cannot contain `]]>`; split the sequence across two sections. */
function cdata(value) {
    return `<![CDATA[${String(value ?? '').replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

/**
 * Feed readers resolve relative URLs inconsistently, so ship absolute ones.
 * Rewrites root-relative src/href only — protocol-relative and absolute URLs
 * and in-page anchors are left alone.
 */
function absolutizeUrls(html) {
    return String(html).replace(
        /(\s(?:src|href)=")(\/(?!\/)[^"]*)"/g,
        (_match, attr, urlPath) => `${attr}${SITE_URL}${urlPath}"`,
    );
}

// Generate RSS feed
function generateRSSfeed(posts) {
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestPosts = sortedPosts.slice(0, FEED_ITEM_COUNT);

    // RSS <author> must be an email address, optionally followed by a name in
    // parentheses. config.social.email is a mailto: URL, so strip the scheme.
    const authorEmail = String(config.social.email || '').replace(/^mailto:/, '');

    const rssItems = latestPosts.map(post => {
        const pubDate = new Date(post.date).toUTCString();
        const postUrl = `${SITE_URL}/blog/${post.slug}`;
        const tags = post.tags || [];
        const thumbUrl = post.thumbnail
            ? (post.thumbnail.startsWith('http') ? post.thumbnail : `${SITE_URL}${post.thumbnail}`)
            : '';

        // The article body only — not the surrounding page. Feed readers strip
        // <head>/<style>/<script> anyway, so shipping the whole document just
        // bloated the feed and leaked the site chrome into every reader.
        const body = absolutizeUrls(post.bodyHtml || '');

        return `    <item>
      <title>${cdata(post.title)}</title>
      <description>${cdata(post.description || '')}</description>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
${authorEmail ? `      <author>${escapeXml(`${authorEmail} (${config.author})`)}</author>\n` : ''}      <dc:creator>${cdata(config.author)}</dc:creator>
${tags.map(tag => `      <category>${cdata(tag)}</category>`).join('\n')}
${thumbUrl ? `      <media:thumbnail url="${escapeXml(thumbUrl)}" />\n` : ''}      <content:encoded>${cdata(body)}</content:encoded>
    </item>`;
    }).join('\n');

    // Derived from content, not from the clock. A wall-clock lastBuildDate made
    // the committed feed churn on every single build.
    const newestPostDate = latestPosts.length
        ? new Date(latestPosts[0].date).toUTCString()
        : new Date(0).toUTCString();

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(`${config.title} - ${config.author}`)}</title>
    <description>${escapeXml(config.description)}</description>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${newestPostDate}</lastBuildDate>
    <generator>Custom Node.js Blog Builder</generator>
    <copyright>${escapeXml(config.copyright || `Copyright ${new Date(newestPostDate).getFullYear()} ${config.author}`)}</copyright>
${rssItems}
  </channel>
</rss>`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'feed.xml'), rssXml);
}

/**
 * Generate sitemap.xml.
 *
 * `lastmod` comes from the last git commit that touched the post's Markdown,
 * falling back to the frontmatter date. It used to be the *build* date for the
 * static pages, so every rebuild rewrote the file and told crawlers four pages
 * had changed when nothing had. Google only honours lastmod when it is
 * verifiably accurate, so a date that moves on every build is worse than none.
 *
 * `changefreq` and `priority` are omitted deliberately: Google ignores both.
 */
function generateSitemap(posts) {
    // Adding a post changes the index, the archive and the homepage's recent-writing
    // list, so they legitimately share the newest post's date.
    const newestPostDate = posts
        .map(p => postLastModified(p))
        .sort()
        .pop() || new Date().toISOString().split('T')[0];

    const staticPages = [
        { url: `${SITE_URL}/`, lastmod: newestPostDate },
        { url: `${SITE_URL}/blog/`, lastmod: newestPostDate },
        { url: `${SITE_URL}/blog/archive.html`, lastmod: newestPostDate },
    ];

    const postUrls = [...posts]
        .sort((a, b) => a.episodeNumber - b.episodeNumber)
        .map(post => ({
            url: `${SITE_URL}/blog/${post.slug}`,
            lastmod: postLastModified(post),
        }));

    const allUrls = [...staticPages, ...postUrls];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(page => `  <url>
    <loc>${escapeXml(page.url)}</loc>
    <lastmod>${page.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    // Written to both the conventional root path — where crawlers and tooling
    // probe by default, and what robots.txt now declares — and the historical
    // /blog/ path, which is already indexed and may have been submitted.
    fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemapXml);
    fs.writeFileSync(path.join(OUTPUT_DIR, '..', 'sitemap.xml'), sitemapXml);
}

/** Git commit date for the post source, falling back to its published date. */
function postLastModified(post) {
    const fromGit = post.sourceFile ? gitLastModified(post.sourceFile) : null;
    return fromGit || new Date(post.date).toISOString().split('T')[0];
}

// Generate posts.json for analytics consumption
function generatePostsJson(posts) {

    // Create a clean data structure for analytics
    const postsData = posts.map(post => ({
        url: `/blog/${post.slug}`,
        title: post.title,
        episode: post.episodeNumber.toString().padStart(3, '0'),
        date: post.date,
        tags: post.tags || [],
        description: post.description || '',
        readingTime: post.readingTime || 5,
        wordCount: post.wordCount || 1000,
        slug: post.slug
    }));

    // Sort by episode number (newest first)
    postsData.sort((a, b) => parseInt(b.episode) - parseInt(a.episode));

    const postsJson = JSON.stringify(postsData, null, 2);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'posts.json'), postsJson);

    // Search index, in the same order, so a rebuild with no content change is a
    // no-op diff. It previously followed whatever order the last generator left.
    const searchIndex = [...posts]
        .sort((a, b) => b.episodeNumber - a.episodeNumber)
        .map(post => ({
            title: post.title,
            slug: post.slug,
            description: post.description,
            tags: post.tags,
            date: post.date,
            content: "" // We don't include full content to keep index small, can be added if needed
        }));
    fs.writeFileSync(path.join(OUTPUT_DIR, 'search.json'), JSON.stringify(searchIndex));
}

// Generate archive page
function generateArchive(posts) {
    const template = loadTemplate('archive');

    // Group posts by year
    const postsByYear = {};
    posts.forEach(post => {
        const year = new Date(post.date).getFullYear();
        if (!postsByYear[year]) {
            postsByYear[year] = [];
        }
        postsByYear[year].push(post);
    });

    // Sort years in descending order
    const years = Object.keys(postsByYear).sort((a, b) => b - a);

    // Generate year sections
    const yearSectionsHtml = years.map(year => {
        const yearPosts = postsByYear[year].sort((a, b) => new Date(b.date) - new Date(a.date));

        const postsHtml = yearPosts.map(post => {
            const episodeNum = post.episodeNumber.toString().padStart(3, '0');
            return `            <li class="panel-card" style="margin-bottom: 10px; padding: 10px 15px;">
                <a href="/blog/${post.slug}" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span class="post-number" style="color: var(--primary); margin-right: 10px;">#${episodeNum}</span>
                        <span class="post-title">${escapeHtml(post.title)}</span>
                    </div>
                    <span class="post-date" style="font-size: 0.9em; color: var(--muted-foreground);">${formatDate(post.date)}</span>
                </a>
            </li>`;
        }).join('\n');

        return `        <div class="year-section">
            <h2 class="year-title">${year}</h2>
            <ul class="post-list">
${postsHtml}
            </ul>
        </div>`;
    }).join('\n');

    // Populate template
    const html = injectAll(template, {
        archiveContent: yearSectionsHtml,
        totalPosts: posts.length,
        githubUrl: config.social.github,
        linkedinUrl: config.social.linkedin,
        twitterUrl: config.social.twitter,
        emailUrl: config.social.email,
        resumeUrl: config.resumeUrl,
        siteHeader,
        styles,
    });

    // Write archive file
    fs.writeFileSync(path.join(OUTPUT_DIR, 'archive.html'), html);
}

/**
 * Emit a stub at every retired URL.
 *
 * GitHub Pages serves static files only — there is no 301. A meta refresh plus
 * a canonical link is the best available substitute: browsers follow it and
 * search engines treat the canonical as the authority. `blog/redirects.json`
 * is the durable record, so a future slug change appends rather than replaces.
 */
function generateRedirects(posts) {
    if (!fs.existsSync(REDIRECTS_PATH)) return 0;

    const redirects = JSON.parse(fs.readFileSync(REDIRECTS_PATH, 'utf8'));
    const liveSlugs = new Set(posts.map(p => p.slug));
    let written = 0;

    for (const [from, to] of Object.entries(redirects)) {
        if (from === to) continue;
        if (!liveSlugs.has(to)) {
            console.warn(`⚠️  redirect ${from} → ${to} points at a slug no post owns; skipping`);
            continue;
        }
        if (liveSlugs.has(from)) {
            console.warn(`⚠️  redirect source ${from} is also a live post slug; skipping`);
            continue;
        }

        const target = `/blog/${to}`;
        const dir = path.join(OUTPUT_DIR, from);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="${SITE_URL}${target}">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${target}">
</head>
<body>
<p>This post moved to <a href="${target}">${escapeHtml(target)}</a>.</p>
<script>location.replace(${JSON.stringify(target)});</script>
</body>
</html>
`);
        written++;
    }
    return written;
}

/** Asset directories under public/blog/ that no post owns and must survive. */
const OUTPUT_KEEP_DIRS = new Set(['page', 'audio', 'images']);

/**
 * Remove build leftovers from public/blog/ — most importantly a draft that was
 * rendered by a local build and would otherwise stay published.
 *
 * Only *untracked* directories are deleted. A committed directory is a URL that
 * has been served before and may have inbound links; those must be retired
 * through blog/redirects.json, never silently removed. (An earlier version of
 * this function deleted by name alone and took out five live pages and an
 * images/ asset folder on its first run.)
 */
function pruneOrphanedOutput(posts, redirectSources) {
    const keep = new Set([...OUTPUT_KEEP_DIRS, ...posts.map(p => p.slug), ...redirectSources]);
    const candidates = fs.readdirSync(OUTPUT_DIR, { withFileTypes: true })
        .filter(entry => entry.isDirectory() && !keep.has(entry.name))
        .map(entry => entry.name);

    if (candidates.length === 0) return 0;

    let tracked = new Set();
    try {
        const out = execFileSync('git', ['ls-files', '--', 'public/blog/'], {
            cwd: REPO_ROOT,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        });
        tracked = new Set(
            out.split('\n')
                .map(line => /^public\/blog\/([^/]+)\//.exec(line.trim()))
                .filter(Boolean)
                .map(match => match[1]),
        );
    } catch {
        // Not a git checkout — refuse to delete anything we cannot verify.
        console.warn('⚠️  Skipping orphan prune: git is unavailable, cannot tell build leftovers from published URLs');
        return 0;
    }

    let removed = 0;
    for (const name of candidates) {
        if (tracked.has(name)) {
            console.warn(`⚠️  ${name}/ is published but no post or redirect owns it — add it to blog/redirects.json`);
            continue;
        }
        fs.rmSync(path.join(OUTPUT_DIR, name), { recursive: true, force: true });
        console.log(`🧹 Removed build leftover: ${name}/`);
        removed++;
    }
    return removed;
}

// Main build function
async function build() {
    console.log('🚀 Building blog with Shiki syntax highlighting...');
    syncProfileImage();
    await initMarkdown();

    // Get all markdown files (excluding template)
    const allFiles = fs.readdirSync(POSTS_DIR)
        .filter(file => file.endsWith('.md') && !file.startsWith('_'))
        .sort(); // Sort to ensure consistent episode numbering

    if (allFiles.length === 0) {
        console.log('📝 No blog posts found to build.');
        return;
    }

    // Read frontmatter once; every later stage reuses it.
    const parsed = allFiles.map((file, index) => {
        const { data: frontmatter } = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
        return { file, frontmatter, index };
    });

    // Validate before writing anything. A build that ships `undefined` into a
    // meta description is worse than a build that refuses to run.
    validatePosts(parsed);
    console.log(`✅ Validated frontmatter for ${parsed.length} posts`);

    // Drafts are dropped from published builds but kept locally. Episode numbers
    // come from position in the *full* list, so drafting a post never renumbers
    // the ones already published.
    const drafts = parsed.filter(p => p.frontmatter.draft === true);
    const included = INCLUDE_DRAFTS ? parsed : parsed.filter(p => p.frontmatter.draft !== true);
    if (drafts.length) {
        console.log(INCLUDE_DRAFTS
            ? `📝 Including ${drafts.length} draft(s) — local build`
            : `🚫 Excluding ${drafts.length} draft(s) from the published build`);
    }

    const files = included.map(p => p.file);

    // First pass: create post metadata for navigation
    const posts = included.map(({ file, frontmatter, index }) => ({
        episodeNumber: index, // Start from 000, keyed to position in the full list
        title: frontmatter.title,
        slug: createCleanSlug(frontmatter.title, frontmatter.slug),
        date: frontmatter.date,
        description: frontmatter.description,
        tags: frontmatter.tags || [],
        sourceFile: `blog/posts/${file}`,
    }));

    // Generate thumbnails
    if (process.env.SKIP_THUMBNAILS !== 'true') {
        // Ensure thumbnails directory exists
        if (!fs.existsSync(THUMBNAILS_DIR)) {
            fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
        }

        const thumbnailPosts = posts.map(post => ({
            title: post.title,
            tags: post.tags,
            description: post.description,
            outputPath: path.join(THUMBNAILS_DIR, `${post.slug}.png`),
        }));

        const { generateThumbnails } = await import('../../scripts/thumbnail-generator/generate.js');
        await generateThumbnails(thumbnailPosts);
    }

    // Second pass: process each post with navigation context.
    // `index` walks the included list; `episodeNumber` comes from the post's
    // position in the *full* list, so the two diverge once a draft is skipped.
    const failures = [];
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const episodeNumber = posts[index].episodeNumber;
        console.log(`📄 Processing ${file} as episode ${episodeNumber.toString().padStart(3, '0')}...`);

        try {
            const processedPost = await processPost(file, episodeNumber, posts);
            // Update the posts array with the complete processed data
            posts[index] = processedPost;
            console.log(`✅ Generated ${processedPost.slug}/index.html with navigation`);
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
            console.error(error.stack);
            failures.push(`${file}: ${error.message}`);
        }
    }

    // A post that threw leaves a metadata-only stub in `posts` — it would still
    // be listed on the index and in the feed, linking to a page that was never
    // written. Previously the build logged the error and exited 0.
    if (failures.length) {
        throw new Error(`${failures.length} post(s) failed to render:\n  - ${failures.join('\n  - ')}`);
    }

    // Generate index page
    console.log('📝 Generating blog index with tag filtering...');
    generateIndex(posts);
    console.log('✅ Generated blog index.html with tag filters');

    // The feed is a published artifact like any other page. Gating it on CI meant
    // a local build could never reproduce what shipped — and, combined with a
    // .gitignore entry, meant it silently vanished from deploys that skipped the
    // blog build. It 404'd in production for exactly that reason.
    console.log('📡 Generating RSS feed...');
    generateRSSfeed(posts);
    console.log('✅ Generated feed.xml');

    // Retired URLs → stubs pointing at the current slug
    const redirectSources = fs.existsSync(REDIRECTS_PATH)
        ? Object.keys(JSON.parse(fs.readFileSync(REDIRECTS_PATH, 'utf8')))
        : [];
    const redirectCount = generateRedirects(posts);
    if (redirectCount) console.log(`↪️  Generated ${redirectCount} redirect stub(s)`);

    pruneOrphanedOutput(posts, redirectSources);

    // Generate archive page
    console.log('📚 Generating archive page...');
    generateArchive(posts);
    console.log('✅ Generated archive.html');

    // Generate sitemap
    console.log('🗺️ Generating sitemap...');
    generateSitemap(posts);
    console.log('✅ Generated sitemap.xml');

    // Generate posts.json for analytics
    console.log('📊 Generating posts.json for analytics...');
    generatePostsJson(posts);
    console.log('✅ Generated posts.json');

    // Minify all HTML files (index + post subdirectories)
    console.log('🗜️ Minifying HTML output...');
    function minifyHtml(html) {
        return html
            .replace(/<!--(?!\[)[\s\S]*?-->/g, '')
            .replace(/\n\s*\n/g, '\n')
            .replace(/^\s+/gm, '')
            .replace(/>\s+</g, '> <');
    }
    function findHtmlFiles(dir) {
        let results = [];
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) results = results.concat(findHtmlFiles(full));
            else if (entry.name.endsWith('.html')) results.push(full);
        }
        return results;
    }
    const allHtmlFiles = findHtmlFiles(OUTPUT_DIR);
    let totalSaved = 0;
    for (const filePath of allHtmlFiles) {
        const original = fs.readFileSync(filePath, 'utf8');
        const minified = minifyHtml(original);
        fs.writeFileSync(filePath, minified, 'utf8');
        totalSaved += original.length - minified.length;
    }
    console.log(`✅ Minified ${allHtmlFiles.length} HTML files (saved ${(totalSaved / 1024).toFixed(1)} KB)`);

    console.log(`🎉 Blog build complete! Generated ${posts.length} posts with navigation, RSS feed, archive, sitemap, posts.json, and Shiki syntax highlighting.`);
}

// Run build if called directly.
//
// NOTE: compare URL-to-URL. `file://${process.argv[1]}` leaves the path
// unencoded, while import.meta.url percent-encodes it — so any checkout in a
// directory containing a space (or #, ?, %) failed this test, and the script
// exited 0 having built nothing at all.
// `process.argv[1]` is undefined under `node -e` / `node --eval`, where
// pathToFileURL throws — which made this module impossible to import from a
// one-liner. Guard before converting.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    build();
}

export { build, createCleanSlug, createLegacySlug, POSTS_DIR, REDIRECTS_PATH };