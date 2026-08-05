import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Records the inputs each PNG was rendered from. Existence alone is not a valid
 * cache key: editing a post's title or description used to leave the old
 * thumbnail in place forever, because the only check was `fs.existsSync`.
 */
const MANIFEST_PATH = path.join(__dirname, '../../public/assets/thumbnails/.manifest.json');

function readManifest() {
    try {
        return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch {
        return {};
    }
}

/** Hash of everything that affects the rendered image, template included. */
function thumbnailFingerprint(post, templateContent) {
    return crypto
        .createHash('sha256')
        .update(JSON.stringify({
            title: post.title,
            description: post.description ?? '',
            tags: post.tags ?? [],
            template: templateContent,
        }))
        .digest('hex')
        .slice(0, 16);
}

const blogConfigPath = path.join(__dirname, '../../blog/config.json');
const blogConfig = JSON.parse(fs.readFileSync(blogConfigPath, 'utf8'));

// Helper to determine the main tag category for content generation
function getPrimaryTagCategory(postTags) {
    if (!postTags || postTags.length === 0) {
        return 'default';
    }

    // Prioritize certain tags or just take the first one
    const priorityTags = ['backend', 'frontend', 'system-design', 'ai-tools', 'personal', 'tutorials', 'gamedev', 'devops', 'database'];
    for (const pTag of priorityTags) {
        if (postTags.includes(pTag)) {
            return pTag;
        }
    }

    return postTags[0]; // Fallback to the first tag
}

// Function to generate terminal content based on tags
function getTerminalContent(postTitle, postTags, postDescription) {
    const primaryCategory = getPrimaryTagCategory(postTags);
    let commandHtml = '';
    let outputHtml = '';

    const escapedTitle = postTitle.replace(/"/g, '&quot;'); // Escape double quotes for HTML
    const escapedDescription = postDescription.replace(/"/g, '&quot;'); // Escape double quotes for HTML

    // Helper to truncate text for display
    const truncate = (text, length) => text.length > length ? text.substring(0, length - 3) + '...' : text;

    switch (primaryCategory) {
        case 'backend':
            commandHtml = `<span class="prompt"><span class="input-command">curl -X POST /api/v1/deploy</span></span>`;
            outputHtml = `<span class="color-success">{"status": &quot;success&quot;, "message": &quot;Deployment initiated for ${truncate(postTitle, 40)}&quot;}</span>`;
            break;
        case 'frontend':
            commandHtml = `<span class="prompt"><span class="input-command">npm run build</span></span>`;
            outputHtml = `<span class="color-success">Compiled successfully.</span>\n<span class="color-comment">Project ready for ${truncate(postTitle, 40)}</span>`;
            break;
        case 'system-design':
            commandHtml = `<span class="prompt"><span class="input-command">kubectl get pods --namespace system-design</span></span>`;
            outputHtml = '<span class="color-success">pod/' + truncate(postTitle, 30).toLowerCase().replace(/\s/g, '-') + 'xyz-123 Ready</span>';
            break;
        case 'ai-tools':
            commandHtml = `<span class="prompt"><span class="input-command">python train_model.py --post "${truncate(postTitle, 40)}"</span></span>`;
            outputHtml = `<span class="color-success">Epoch 10/10 - Loss: 0.05 - Accuracy: 0.98</span>`;
            break;
        case 'personal':
            commandHtml = '<span class="prompt"><span class="input-command">cat ~/journal/' + truncate(postTitle, 30).toLowerCase().replace(/\s/g, '-') + '.md</span></span>';
            outputHtml = `<span class="color-comment">Reflecting on:</span>\n<span class="color-command">&quot;${truncate(postDescription, 70)}&quot;</span>`;
            break;
        case 'tutorials':
            commandHtml = `<span class="prompt"><span class="input-command">man ${truncate(postTitle.toLowerCase().split(' ')[0], 20)}</span></span>`;
            outputHtml = `<span class="color-comment">Showing manual page for ${truncate(postTitle.toLowerCase().split(' ')[0], 20)}...</span>`;
            break;
        case 'gamedev':
            commandHtml = `<span class="prompt"><span class="input-command">cargo run --release</span></span>`;
            outputHtml = `<span class="color-success">Building game "${truncate(postTitle, 40)}"... Done!</span>`;
            break;
        case 'devops':
            commandHtml = `<span class="prompt"><span class="input-command">git push origin main</span></span>`;
            outputHtml = `<span class="color-success">To github.com:jeffreyjose07/blog.git</span>\n<span class="color-success">Done: ${truncate(postTitle, 40)}</span>`;
            break;
        case 'database':
            commandHtml = `<span class="prompt"><span class="input-command">psql -c "SELECT * FROM posts LIMIT 1;"</span></span>`;
            outputHtml = `<span class="color-success">id | title | description</span>\n<span class="color-command">1 | ${truncate(postTitle, 40)} | ...</span>`;
            break;
        default:
            commandHtml = `<span class="prompt"><span class="input-command">echo "${truncate(postTitle, 50)}"</span></span>`;
            outputHtml = `<span class="color-success">Thumbnail generated for:</span>\n<span class="color-command">&quot;${truncate(postDescription, 70)}&quot;</span>`;
            break;
    }

    return `
        ${commandHtml}
        <br>
        ${outputHtml}
        <br>
        <span class="color-prompt">_</span>
    `;
}

/**
 * Batch generate thumbnails for multiple posts using a single browser instance
 * @param {Array<{title: string, tags: string[], description: string, outputPath: string}>} posts 
 */
async function generateThumbnails(posts) {
    if (!posts || posts.length === 0) return;

    const templatePath = path.join(__dirname, 'template.html');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const manifest = readManifest();

    // Decide the work list *before* launching a browser. The staleness check used
    // to live inside the render loop, so every build paid for a full Chromium
    // launch — several seconds in CI — even when all 36 thumbnails were current.
    const stale = posts.filter(post => {
        const key = path.basename(post.outputPath);
        const fingerprint = thumbnailFingerprint(post, templateContent);
        const unchanged = manifest[key] === fingerprint && fs.existsSync(post.outputPath);
        if (!unchanged) post._fingerprint = fingerprint;
        return !unchanged;
    });

    if (stale.length === 0) {
        console.log(`🖼️  Thumbnails up to date (${posts.length} posts) — skipping browser launch`);
        return;
    }

    console.log(`🖼️  Rendering ${stale.length} of ${posts.length} thumbnail(s)...`);
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 630 });

        for (const post of stale) {
            const { title, tags, description, outputPath } = post;

            console.log(`Generating: ${title}`);

            const windowTitle = `~/blog/posts/${title.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}...`;
            const terminalContent = getTerminalContent(title, tags, description);

            let htmlContent = templateContent.replace('{{windowTitle}}', windowTitle);
            htmlContent = htmlContent.replace('{{terminalContent}}', terminalContent);

            await page.setContent(htmlContent, { waitUntil: 'load' });

            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            await page.screenshot({ path: outputPath, fullPage: false });
            manifest[path.basename(outputPath)] = post._fingerprint;
        }
    } finally {
        await browser.close();
    }

    // Drop entries for thumbnails that no longer belong to any post, so a renamed
    // title does not leave its fingerprint behind forever.
    const liveKeys = new Set(posts.map(p => path.basename(p.outputPath)));
    for (const key of Object.keys(manifest)) {
        if (!liveKeys.has(key)) delete manifest[key];
    }

    fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
    fs.writeFileSync(
        MANIFEST_PATH,
        JSON.stringify(Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))), null, 2) + '\n',
    );
    console.log('✨ Batch generation complete!');
}

// Wrapper for single generation (legacy support)
async function generateThumbnail(postTitle, postTags, postDescription, outputPath) {
    await generateThumbnails([{ 
        title: postTitle,
        tags: postTags,
        description: postDescription,
        outputPath
    }]);
}

// Example usage (for testing).
// Compare URL-to-URL: `file://${process.argv[1]}` leaves the path unencoded
// while import.meta.url percent-encodes it, so any checkout under a directory
// with a space in its name never matched. Same trap that made build.js a silent
// no-op before episode 034.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const testPosts = [
        {
            title: "Building a Scalable Chat Platform with Claude",
            tags: ["backend", "claude", "system-design"],
            description: "How I built a scalable chat platform using Claude AI.",
            outputPath: path.join(__dirname, '../../public/assets/thumbnails', 'test-thumbnail.png')
        },
        {
            title: "The Revelations of a BTech Student",
            tags: ["personal", "education"],
            description: "My journey from failing semester exams to achieving GATE rank 170.",
            outputPath: path.join(__dirname, '../../public/assets/thumbnails', 'personal-thumbnail.png')
        },
        {
            title: "Optimizing Blog Interactivity and UX",
            tags: ["frontend", "ux", "javascript"],
            description: "Enhancing user experience with interactive elements.",
            outputPath: path.join(__dirname, '../../public/assets/thumbnails', 'frontend-thumbnail.png')
        }
    ];

    generateThumbnails(testPosts)
        .catch(err => console.error('Error running test:', err));
}

export { generateThumbnail, generateThumbnails };