#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
// import { generateThumbnails } from '../../scripts/thumbnail-generator/generate.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG_PATH = path.join(__dirname, '../config.json');
const POSTS_DIR = path.join(__dirname, '../posts');
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const OUTPUT_DIR = path.join(__dirname, '../../public/blog');
const THUMBNAILS_DIR = path.join(__dirname, '../../public/assets/thumbnails');

// Load configuration
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Advanced semantic color detection
class SemanticColorizer {
    constructor(config) {
        this.config = config;
        this.semanticPatterns = this.buildPatterns();
        this.technicalPhrases = config.contextualRules.technicalPhrases;
        this.codePatternRegexes = this.buildCodePatterns();
    }

    buildPatterns() {
        const patterns = new Map();

        Object.entries(this.config.semanticCategories).forEach(([category, data]) => {
            data.patterns.forEach(pattern => {
                // Create case-insensitive regex for each pattern
                const regex = new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
                patterns.set(regex, category);
            });
        });

        return patterns;
    }

    buildCodePatterns() {
        return {
            camelCase: /\b[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*\b/g,
            snake_case: /\b[a-z][a-z0-9]*(_[a-z0-9]+)+\b/g,
            kebabCase: /\b[a-z][a-z0-9]*(-[a-z0-9]+)+\b/g,
            CONSTANT_CASE: /\b[A-Z][A-Z0-9]*(_[A-Z0-9]+)*\b/g,
            versions: /\b[a-zA-Z]+\s+\d+(\.\d+)*\b/g
        };
    }

    detectContextualCategory(text, matchedText) {
        // Check for technical phrases first (highest priority)
        const lowerText = text.toLowerCase();
        for (const [phrase, category] of Object.entries(this.technicalPhrases)) {
            if (lowerText.includes(phrase.toLowerCase())) {
                return category;
            }
        }

        // Check code patterns
        for (const [pattern, category] of Object.entries(this.config.contextualRules.codePatterns)) {
            if (this.codePatternRegexes[pattern] && this.codePatternRegexes[pattern].test(matchedText)) {
                return category;
            }
        }

        return null;
    }

    colorizeText(text) {
        let coloredText = text;
        const replacements = new Map();

        // First pass: collect all matches with their positions
        const matches = [];

        // Check technical phrases first (longer patterns have priority)
        Object.entries(this.technicalPhrases).forEach(([phrase, category]) => {
            const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            let match;
            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    category: category,
                    priority: phrase.length // Longer phrases get higher priority
                });
            }
        });

        // Then check individual semantic patterns
        this.semanticPatterns.forEach((category, regex) => {
            let match;
            regex.lastIndex = 0; // Reset regex state
            while ((match = regex.exec(text)) !== null) {
                // Check if this overlaps with any higher priority match
                const overlaps = matches.some(m =>
                    (match.index >= m.start && match.index < m.end) ||
                    (match.index + match[0].length > m.start && match.index + match[0].length <= m.end)
                );

                if (!overlaps) {
                    matches.push({
                        start: match.index,
                        end: match.index + match[0].length,
                        text: match[0],
                        category: category,
                        priority: 1
                    });
                }
            }
        });

        // Sort matches by position (reverse order for replacement)
        matches.sort((a, b) => b.start - a.start);

        // Apply replacements from end to start to maintain positions
        matches.forEach(match => {
            const before = coloredText.substring(0, match.start);
            const after = coloredText.substring(match.end);
            const colorClass = this.config.colors[match.category] ? match.category : 'neutral';
            coloredText = before + `<span class="${colorClass}">${match.text}</span>` + after;
        });

        return coloredText;
    }
}

// Initialize semantic colorizer
const colorizer = new SemanticColorizer(config);

// Custom markdown renderer with advanced color coding
const renderer = new marked.Renderer();

// Override text rendering to apply semantic color coding
const originalText = renderer.text;
renderer.text = function (text) {
    return colorizer.colorizeText(text);
};

// Configure marked options
marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

// Utility functions
function createCleanSlug(title, customSlug) {
    // Use custom slug if provided in frontmatter
    if (customSlug) {
        return customSlug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    }

    // Generate clean slug from title
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')     // Remove special chars except spaces and hyphens
        .replace(/\s+/g, '-')             // Convert spaces to hyphens
        .replace(/-+/g, '-')              // Multiple hyphens to single
        .substring(0, 50)                 // Max 50 characters
        .replace(/-$/, '');               // Remove trailing hyphen
}

// Legacy function for backward compatibility
function slugify(text) {
    return createCleanSlug(text);
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
function processPost(filename, episodeNumber, allPosts = []) {
    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContent);

    // Create post slug
    const slug = createCleanSlug(frontmatter.title, frontmatter.slug);

    // Determine thumbnail (default to generated terminal thumbnail)
    const thumbnail = frontmatter.thumbnail || frontmatter.image || `/assets/thumbnails/${slug}.png`;

    // Generate HTML content
    const htmlContent = marked(content);

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
    const html = template
        .replace(/{{title}}/g, frontmatter.title)
        .replace(/{{episodeNumber}}/g, episodeNumber.toString().padStart(3, '0'))
        .replace(/{{date}}/g, formatDate(frontmatter.date))
        .replace(/{{description}}/g, frontmatter.description || '')
        .replace(/{{content}}/g, () => htmlContent)
        .replace(/{{wordCount}}/g, wordCount)
        .replace(/{{readingTime}}/g, readingTime)
        .replace(/{{tagsFormatted}}/g, tagsFormatted)
        .replace(/{{navigation}}/g, navigationHtml)
        .replace(/{{slug}}/g, slug)
        .replace(/{{thumbnail}}/g, thumbnail)
        .replace(/{{githubUrl}}/g, config.social.github)
        .replace(/{{linkedinUrl}}/g, config.social.linkedin)
        .replace(/{{twitterUrl}}/g, config.social.twitter)
        .replace(/{{emailUrl}}/g, config.social.email)
        .replace(/{{resumeUrl}}/g, config.resumeUrl)
        .replace(/{{inlineStyles}}/g, () => inlineStyles)
        .replace(/{{inlineScripts}}/g, () => inlineScripts)
        .replace(/{{siteHeader}}/g, siteHeader)
        .replace(/{{styles}}/g, styles);

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
        thumbnail
    };
}

// Generate navigation HTML for posts
function generatePostNavigation(prevPost, nextPost) {
    let navHtml = '<nav class="post-navigation">';

    if (prevPost) {
        navHtml += `
            <div class="nav-previous glass-card">
                <a href="/blog/${prevPost.slug}">
                    <span class="nav-label">← previous</span>
                    <span class="nav-title">${prevPost.title}</span>
                </a>
            </div>`;
    }

    if (nextPost) {
        navHtml += `
            <div class="nav-next glass-card">
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

    // Sort posts by episode number (descending for newest first)
    const sortedPosts = posts.sort((a, b) => b.episodeNumber - a.episodeNumber);
    const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

    for (let i = 0; i < totalPages; i++) {
        const pagePosts = sortedPosts.slice(i * POSTS_PER_PAGE, (i + 1) * POSTS_PER_PAGE);
        const template = loadTemplate('index');

        const postsHtml = pagePosts.map(post => {
            const episodeNum = post.episodeNumber.toString().padStart(3, '0');
            const tagsAttr = post.tags.join(' ');

            let thumbnailHtml = '';
            if (post.thumbnail) {
                const thumbSrc = post.thumbnail.startsWith('http') || post.thumbnail.startsWith('/') ? post.thumbnail : `/blog/${post.thumbnail}`;
                thumbnailHtml = `<div class="post-thumbnail" style="background-image: url('${thumbSrc}')"></div>`;
            } else {
                // Generate a deterministic gradient based on episode number
                const hue = (post.episodeNumber * 137.508) % 360;
                thumbnailHtml = `<div class="post-thumbnail" style="background: linear-gradient(135deg, hsl(${hue}, 60%, 20%), hsl(${hue + 40}, 60%, 10%))">
                    <div class="thumbnail-icon">📝</div>
                </div>`;
            }

            return `            <div class="post-item glass-card" data-tags="${tagsAttr}">
                <a href="/blog/${post.slug}">
                    ${thumbnailHtml}
                    <div class="post-content-wrapper">
                        <div class="post-meta-top">
                            <span class="episode-number">#${episodeNum}</span>
                            <span class="date">${formatDate(post.date)}</span>
                        </div>
                        <h3 class="post-title">${post.title}</h3>
                        <p class="post-description">${post.description}</p>
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
                        </div>
                    </div>
                </a>
            </div>`;
        }).join('\n');

        let paginationHtml = '<div class="pagination">';
        if (i > 0) {
            paginationHtml += `<a href="/blog/${i === 0 ? '' : `page${i + 1}.html`}" class="pagination-link">&laquo; Previous</a>`;
        }
        for (let j = 0; j < totalPages; j++) {
            const pageLink = j === 0 ? 'index.html' : `page${j + 1}.html`;
            paginationHtml += `<a href="/blog/${pageLink}" class="pagination-link ${i === j ? 'active' : ''}">${j + 1}</a>`;
        }
        if (i < totalPages - 1) {
            paginationHtml += `<a href="/blog/page${i + 2}.html" class="pagination-link">Next &raquo;</a>`;
        }
        paginationHtml += '</div>';

        const html = template
            .replace(/{{title}}/g, config.title)
            .replace(/{{description}}/g, config.description)
            .replace(/{{tagFilters}}/g, tagFiltersHtml)
            .replace(/{{posts}}/g, postsHtml)
            .replace(/{{totalPosts}}/g, posts.length)
            .replace(/{{pagination}}/g, paginationHtml) // Add pagination placeholder
            .replace(/{{\s*allPostsData\s*}}/g, JSON.stringify(sortedPosts)) // Embed all posts data for client-side filtering
            .replace(/{{githubUrl}}/g, config.social.github)
            .replace(/{{linkedinUrl}}/g, config.social.linkedin)
            .replace(/{{twitterUrl}}/g, config.social.twitter)
            .replace(/{{emailUrl}}/g, config.social.email)
            .replace(/{{emailUrl}}/g, config.social.email)
            .replace(/{{resumeUrl}}/g, config.resumeUrl)
            .replace(/{{siteHeader}}/g, siteHeader)
            .replace(/{{styles}}/g, styles);

        const outputFileName = i === 0 ? 'index.html' : `page${i + 1}.html`;
        fs.writeFileSync(path.join(OUTPUT_DIR, outputFileName), html);
    }
}

// Generate RSS feed
function generateRSSfeed(posts) {
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestPosts = sortedPosts.slice(0, 10); // Only include latest 10 posts

    const rssItems = latestPosts.map(post => {
        // Try to get the full HTML content for each post
        let htmlContent = '';
        try {
            const postPath = path.join(OUTPUT_DIR, post.slug, 'index.html');
            if (fs.existsSync(postPath)) {
                htmlContent = fs.readFileSync(postPath, 'utf8');
                // Optionally, extract only the <article>...</article> or main content if desired
            }
        } catch (e) {
            htmlContent = '';
        }
        const pubDate = new Date(post.date).toUTCString();
        const postUrl = `https://jeffreyjose07.is-a.dev/blog/${post.slug}`;
        const author = post.author || (config.authorEmail ? `${config.authorEmail} (${config.author})` : config.author) || '';
        const tags = post.tags || [];
        // Try to get image from frontmatter or first image in content (if available)
        let imageUrl = '';
        if (post.image) {
            imageUrl = post.image.startsWith('http') ? post.image : `https://jeffreyjose07.is-a.dev/blog/${post.image}`;
        }
        // Optionally, try to extract from post.content if desired
        // const imageMatch = post.content && post.content.match(/<img[^>]+src=["']([^"'>]+)["']/);
        // if (imageMatch) imageUrl = imageMatch[1];
        // Provide full HTML content if available
        const contentEncoded = htmlContent ? `<![CDATA[${htmlContent}]]>` : '';
        return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || ''}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${author}</author>
      <dc:creator>${config.author}</dc:creator>
${tags.map(tag => `      <category><![CDATA[${tag}]]></category>`).join('\n')}
${imageUrl ? `      <media:thumbnail url="${imageUrl}" />` : ''}
      <content:encoded>${contentEncoded}</content:encoded>
    </item>`;
    }).join('\n');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
    xmlns:atom="http://www.w3.org/2005/Atom" 
    xmlns:content="http://purl.org/rss/1.0/modules/content/" 
    xmlns:dc="http://purl.org/dc/elements/1.1/" 
    xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${config.title} - ${config.author}</title>
    <description>${config.description}</description>
    <link>https://jeffreyjose07.is-a.dev/blog</link>
    <atom:link href="https://jeffreyjose07.is-a.dev/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Custom Node.js Blog Builder</generator>
    <copyright>${config.copyright || `Copyright ${new Date().getFullYear()} ${config.author}`}</copyright>
${rssItems}
  </channel>
</rss>`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'feed.xml'), rssXml);
}

// Generate sitemap.xml
function generateSitemap(posts) {
    const baseUrl = 'https://jeffreyjose07.is-a.dev';
    const currentDate = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
        { url: `${baseUrl}/`, priority: '1.0', changefreq: 'monthly' },
        { url: `${baseUrl}/blog/`, priority: '0.9', changefreq: 'weekly' },
        { url: `${baseUrl}/blog/archive.html`, priority: '0.8', changefreq: 'weekly' },
        { url: `${baseUrl}/blog/feed.xml`, priority: '0.7', changefreq: 'daily' }
    ];

    // Blog posts
    const postUrls = posts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastmod: new Date(post.date).toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'monthly'
    }));

    const allUrls = [...staticPages, ...postUrls];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemapXml);
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

    // Generate search index for client-side search
    const searchIndex = posts.map(post => ({
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
            return `            <li class="glass-card" style="margin-bottom: 10px; padding: 10px 15px;">
                <a href="/blog/${post.slug}" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span class="post-number" style="color: var(--primary); margin-right: 10px;">#${episodeNum}</span>
                        <span class="post-title">${post.title}</span>
                    </div>
                    <span class="post-date" style="font-size: 0.9em; color: var(--muted-foreground);">${formatDate(post.date)}</span>
                </a>
            </li>`;
        }).join('\n');

        return `        <div class="year-section">
            <h2 class="year-title text-gradient-premium">${year}</h2>
            <ul class="post-list">
${postsHtml}
            </ul>
        </div>`;
    }).join('\n');

    // Populate template
    const html = template
        .replace(/{{archiveContent}}/g, yearSectionsHtml)
        .replace(/{{totalPosts}}/g, posts.length)
        .replace(/{{githubUrl}}/g, config.social.github)
        .replace(/{{linkedinUrl}}/g, config.social.linkedin)
        .replace(/{{twitterUrl}}/g, config.social.twitter)
        .replace(/{{emailUrl}}/g, config.social.email)
        .replace(/{{resumeUrl}}/g, config.resumeUrl)
        .replace(/{{siteHeader}}/g, siteHeader)
        .replace(/{{styles}}/g, styles);

    // Write archive file
    fs.writeFileSync(path.join(OUTPUT_DIR, 'archive.html'), html);
}

// Main build function
async function build() {
    console.log('🚀 Building blog with advanced semantic coloring...');

    // Get all markdown files (excluding template)
    const files = fs.readdirSync(POSTS_DIR)
        .filter(file => file.endsWith('.md') && !file.startsWith('_'))
        .sort(); // Sort to ensure consistent episode numbering

    if (files.length === 0) {
        console.log('📝 No blog posts found to build.');
        return;
    }

    // First pass: create post metadata for navigation
    const posts = [];
    files.forEach((file, index) => {
        const episodeNumber = index; // Start from 000
        const filePath = path.join(POSTS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontmatter } = matter(fileContent);

        posts.push({
            episodeNumber,
            title: frontmatter.title,
            slug: createCleanSlug(frontmatter.title, frontmatter.slug),
            date: frontmatter.date,
            description: frontmatter.description,
            tags: frontmatter.tags || []
        });
    });

    // Generate thumbnails
    if (process.env.SKIP_THUMBNAILS !== 'true') {
        console.log('🖼️ Generating terminal thumbnails...');

        // Ensure thumbnails directory exists
        if (!fs.existsSync(THUMBNAILS_DIR)) {
            fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
        }

        const thumbnailPosts = posts.map(post => ({
            title: post.title,
            tags: post.tags,
            description: post.description,
            outputPath: path.join(THUMBNAILS_DIR, `${post.slug}.png`)
        }));

        const { generateThumbnails } = await import('../../scripts/thumbnail-generator/generate.js');
        await generateThumbnails(thumbnailPosts);
    }

    // Second pass: process each post with navigation context
    files.forEach((file, index) => {
        const episodeNumber = index;
        console.log(`📄 Processing ${file} as episode ${episodeNumber.toString().padStart(3, '0')}...`);

        try {
            const processedPost = processPost(file, episodeNumber, posts);
            // Update the posts array with the complete processed data
            posts[index] = processedPost;
            console.log(`✅ Generated ${processedPost.slug}/index.html with navigation`);
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
        }
    });

    // Generate index page
    console.log('📝 Generating blog index with tag filtering...');
    generateIndex(posts);
    console.log('✅ Generated blog index.html with tag filters');

    // Only generate RSS feed during CI (GitHub Actions or CI env variable)
    if (process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true') {
        console.log('📡 Generating RSS feed (CI detected)...');
        generateRSSfeed(posts);
        console.log('✅ Generated feed.xml');
    } else {
        console.log('ℹ️ Skipping RSS feed generation (not running in CI).');
    }

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

    console.log(`🎉 Blog build complete! Generated ${posts.length} posts with navigation, RSS feed, archive, sitemap, posts.json, and semantic highlighting.`);
}

// Run build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    build();
}

export { build };