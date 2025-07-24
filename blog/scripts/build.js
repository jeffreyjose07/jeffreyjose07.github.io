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
renderer.text = function(text) {
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
    
    // Format tags with colors
    const tagsFormatted = frontmatter.tags
        ? frontmatter.tags.map(tag => {
            const tagColorCategory = config.tagColors[tag] || 'neutral';
            return `<span class="tag ${tagColorCategory}">${tag}</span>`;
        }).join(', ')
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

// Generate blog index with tag filtering
function generateIndex(posts) {
    const template = loadTemplate('index');
    
    // Sort posts by episode number (descending for newest first)
    const sortedPosts = posts.sort((a, b) => b.episodeNumber - a.episodeNumber);
    
    // Collect all unique tags
    const allTags = [...new Set(posts.flatMap(post => post.tags))];
    
    // Generate tag filter buttons
    const tagFiltersHtml = allTags.map(tag => {
        const tagColorCategory = config.tagColors[tag] || 'neutral';
        return `            <button class="tag-filter ${tagColorCategory}" data-tag="${tag}">${tag}</button>`;
    }).join('\n');
    
    // Generate posts HTML with tag data attributes
    const postsHtml = sortedPosts.map(post => {
        const episodeNum = post.episodeNumber.toString().padStart(3, '0');
        const tagsAttr = post.tags.join(' ');
        return `            <li class="post-item" data-tags="${tagsAttr}">
                <a href="/blog/${post.slug}">
                    <span class="episode-number">${episodeNum}</span><span class="episode-title">: ${post.title}</span><span class="date">${formatDate(post.date)}</span>
                </a>
            </li>`;
    }).join('\n');
    
    // Populate template
    const html = template
        .replace(/{{title}}/g, config.title)
        .replace(/{{description}}/g, config.description)
        .replace(/{{tagFilters}}/g, tagFiltersHtml)
        .replace(/{{posts}}/g, postsHtml)
        .replace(/{{totalPosts}}/g, posts.length);
    
    // Write index file
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
}

// Main build function
function build() {
    console.log('🚀 Building blog with advanced semantic coloring...');
    
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
            console.log(`✅ Generated ${post.slug}/index.html with semantic coloring`);
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
        }
    });
    
    // Generate index page
    console.log('📝 Generating blog index with tag filtering...');
    generateIndex(posts);
    console.log('✅ Generated blog index.html with tag filters');
    
    console.log(`🎉 Blog build complete! Generated ${posts.length} posts with advanced semantic highlighting.`);
}

// Run build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    build();
}

export { build };