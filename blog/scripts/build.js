#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG_PATH = path.join(__dirname, '../config.json');
const POSTS_DIR = path.join(__dirname, '../posts');
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const OUTPUT_DIR = path.join(__dirname, '../../public/blog');

// Load configuration
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Custom markdown renderer with color coding
const renderer = new marked.Renderer();

// Override text rendering to apply automatic color coding
const originalText = renderer.text;
renderer.text = function(text) {
    let coloredText = text;
    
    // Apply automatic color coding based on config
    Object.entries(config.autoColorTerms).forEach(([term, colorClass]) => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        coloredText = coloredText.replace(regex, `<span class="${colorClass}">${term}</span>`);
    });
    
    return coloredText;
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
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0].replace(/-/g, '.');
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

// Process a single blog post
function processPost(filename, episodeNumber) {
    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContent);
    
    // Generate HTML content
    const htmlContent = marked(content);
    
    // Calculate metadata
    const wordCount = frontmatter.wordCount || countWords(content);
    const readingTime = frontmatter.readingTime || estimateReadingTime(content);
    
    // Format tags
    const tagsFormatted = frontmatter.tags
        ? frontmatter.tags.map(tag => `<span class="tag">${tag}</span>`).join(', ')
        : '';
    
    // Load and populate template
    const template = loadTemplate('post');
    const html = template
        .replace(/{{title}}/g, frontmatter.title)
        .replace(/{{episodeNumber}}/g, episodeNumber.toString().padStart(3, '0'))
        .replace(/{{date}}/g, formatDate(frontmatter.date))
        .replace(/{{description}}/g, frontmatter.description || '')
        .replace(/{{content}}/g, htmlContent)
        .replace(/{{wordCount}}/g, wordCount)
        .replace(/{{readingTime}}/g, readingTime)
        .replace(/{{tagsFormatted}}/g, tagsFormatted);
    
    // Create post slug and output directory
    const slug = frontmatter.slug || slugify(frontmatter.title);
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
        tags: frontmatter.tags || []
    };
}

// Generate blog index
function generateIndex(posts) {
    const template = loadTemplate('index');
    
    // Sort posts by episode number (descending for newest first)
    const sortedPosts = posts.sort((a, b) => b.episodeNumber - a.episodeNumber);
    
    // Generate posts HTML
    const postsHtml = sortedPosts.map(post => {
        const episodeNum = post.episodeNumber.toString().padStart(3, '0');
        return `            <li>
                <a href="/blog/${post.slug}">
                    <span class="episode-number">${episodeNum}</span><span class="episode-title">: ${post.title}</span><span class="date">${formatDate(post.date)}</span>
                </a>
            </li>`;
    }).join('\n');
    
    // Populate template
    const html = template
        .replace(/{{title}}/g, config.title)
        .replace(/{{description}}/g, config.description)
        .replace(/{{posts}}/g, postsHtml)
        .replace(/{{totalPosts}}/g, posts.length);
    
    // Write index file
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
}

// Main build function
function build() {
    console.log('🚀 Building blog...');
    
    // Get all markdown files (excluding template)
    const files = fs.readdirSync(POSTS_DIR)
        .filter(file => file.endsWith('.md') && !file.startsWith('_'))
        .sort(); // Sort to ensure consistent episode numbering
    
    if (files.length === 0) {
        console.log('📝 No blog posts found to build.');
        return;
    }
    
    const posts = [];
    
    // Process each post
    files.forEach((file, index) => {
        const episodeNumber = index + 1;
        console.log(`📄 Processing ${file} as episode ${episodeNumber.toString().padStart(3, '0')}...`);
        
        try {
            const post = processPost(file, episodeNumber);
            posts.push(post);
            console.log(`✅ Generated ${post.slug}/index.html`);
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
        }
    });
    
    // Generate index page
    console.log('📝 Generating blog index...');
    generateIndex(posts);
    console.log('✅ Generated blog index.html');
    
    console.log(`🎉 Blog build complete! Generated ${posts.length} posts.`);
}

// Run build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    build();
}

export { build };