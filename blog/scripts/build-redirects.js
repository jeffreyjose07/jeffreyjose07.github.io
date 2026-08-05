#!/usr/bin/env node
/**
 * Rebuild `blog/redirects.json` — the record of retired post URLs.
 *
 * Slugs are derived from titles, so changing either the title or the slug
 * algorithm silently moves a published URL. This script diffs every historical
 * slug algorithm against the current one and records what moved, so build.js
 * can emit a redirect stub at the old path.
 *
 * The file is *merged*, never overwritten: entries from earlier moves must
 * survive, and an old URL that has already been retired once should keep
 * pointing at wherever the post lives now.
 *
 *   node blog/scripts/build-redirects.js          # write
 *   node blog/scripts/build-redirects.js --check  # fail if stale (CI)
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createCleanSlug, createLegacySlug, POSTS_DIR, REDIRECTS_PATH } from './build.js';

/**
 * Every slug algorithm this blog has published under, oldest first.
 *
 * Each entry is applied to every post; any result that differs from the post's
 * current slug is recorded as a retired URL.
 */
const HISTORICAL = [
    // The `substring(0, 50)` hard cut used through episode 035. Sliced 11 titles
    // mid-word ("...terminal-aesthet").
    { name: 'hard 50-char cut', fn: createLegacySlug },

    // Before an explicit `slug:` was added to some posts, the URL came from the
    // title. Those title-derived pages are still sitting in public/blog/ as
    // duplicates of the canonical page.
    { name: 'title-derived, ignoring frontmatter slug', fn: title => createCleanSlug(title) },
    { name: 'title-derived, ignoring frontmatter slug (50-char cut)', fn: title => createLegacySlug(title) },
];

/**
 * URLs that no algorithm can reproduce because the *title* itself changed after
 * publication. Recorded by hand, keyed old → current slug.
 */
const MANUAL = {
    // Episode 009 was published as "Deploying a Scalable Chat Platform to Render"
    'deploying-a-scalable-chat-platform-to-render': 'deploying-a-chat-platform-to-render',
};

function computeRedirects() {
    const existing = fs.existsSync(REDIRECTS_PATH)
        ? JSON.parse(fs.readFileSync(REDIRECTS_PATH, 'utf8'))
        : {};

    const files = fs.readdirSync(POSTS_DIR)
        .filter(f => f.endsWith('.md') && !f.startsWith('_'))
        .sort();

    const current = new Map();
    for (const file of files) {
        const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
        if (!data.title) continue;
        current.set(file, createCleanSlug(data.title, data.slug));
    }

    const merged = { ...existing, ...MANUAL };

    // Re-point any already-retired URL whose destination has since moved again.
    const liveSlugs = new Set(current.values());
    for (const [from, to] of Object.entries(merged)) {
        if (!liveSlugs.has(to)) {
            console.warn(`⚠️  existing redirect ${from} → ${to} no longer resolves to a live post`);
        }
    }

    for (const file of files) {
        const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
        if (!data.title) continue;
        const now = current.get(file);
        for (const { fn } of HISTORICAL) {
            const then = fn(data.title, data.slug);
            if (then && then !== now) merged[then] = now;
        }
    }

    // Never redirect a URL that is itself a live post.
    for (const from of Object.keys(merged)) {
        if (liveSlugs.has(from)) delete merged[from];
    }

    // Sorted so the file diffs cleanly.
    return Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
}

const redirects = computeRedirects();
const serialized = JSON.stringify(redirects, null, 2) + '\n';
const onDisk = fs.existsSync(REDIRECTS_PATH) ? fs.readFileSync(REDIRECTS_PATH, 'utf8') : '';

if (process.argv.includes('--check')) {
    if (serialized !== onDisk) {
        console.error('❌ blog/redirects.json is stale. Run: npm run blog:redirects');
        process.exit(1);
    }
    console.log(`✅ blog/redirects.json is current (${Object.keys(redirects).length} entries)`);
} else {
    fs.writeFileSync(REDIRECTS_PATH, serialized);
    console.log(`✅ Wrote ${Object.keys(redirects).length} redirect(s) to blog/redirects.json`);
    for (const [from, to] of Object.entries(redirects)) {
        console.log(`   /blog/${from}\n     → /blog/${to}`);
    }
}
