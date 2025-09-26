---
title: "adding custom domain: jeffreyjose07.is-a.dev"
date: "2025-01-24"
tags: ["domain", "github-pages", "deployment", "infrastructure"]
description: "How I configured a custom domain for my portfolio and blog, moving from jeffreyjose07.github.io to jeffreyjose07.is-a.dev"
readingTime: 4
wordCount: 800
---

The journey from a default **GitHub Pages** subdomain to a custom domain is a rite of passage for any developer's portfolio. Today, I'm documenting how I successfully migrated my site from `jeffreyjose07.github.io` to `jeffreyjose07.is-a.dev` - a cleaner, more professional URL that better represents my digital presence.

## why a custom domain matters

A custom domain isn't just vanity - it's about **professionalism** and **branding**. When someone sees `jeffreyjose07.is-a.dev`, they immediately understand this is a developer's personal site. The `.is-a.dev` TLD specifically signals technical expertise, which aligns perfectly with my portfolio's **terminal aesthetic** and technical focus.

Beyond aesthetics, custom domains provide:
- **SEO benefits** - cleaner URLs are more memorable and shareable
- **Professional credibility** - shows attention to detail and technical competence  
- **Future flexibility** - easier to migrate hosting providers if needed
- **Brand consistency** - matches the minimalist, technical approach of the site

## choosing the right domain

I selected `jeffreyjose07.is-a.dev` for several strategic reasons:

**Technical alignment**: The `.is-a.dev` TLD immediately communicates that this is a developer's site, perfectly matching my portfolio's **terminal aesthetic** and technical content.

**Memorability**: Shorter than the default GitHub subdomain, easier to type and remember.

**Availability**: Unlike `.com` domains, `.is-a.dev` had my preferred username available without compromise.

**Cost efficiency**: More affordable than premium `.com` domains while maintaining professional credibility.

## the technical setup process

### step 1: is-a.dev subdomain registration

Unlike traditional domain registration, **is-a.dev** operates as a community-driven service. I submitted a pull request to their [GitHub repository](https://github.com/is-a-dev/register) with a domain configuration file.

**Domain file structure** (`domains/jeffreyjose07.json`):
```json
{
    "owner": {
        "username": "jeffreyjose07",
        "email": "jeffreyjose07@example.com"
    },
    "records": {
        "CNAME": "jeffreyjose07.github.io"
    }
}
```

This **JSON configuration** tells the is-a.dev DNS system to point `jeffreyjose07.is-a.dev` to my **GitHub Pages** repository.

### step 2: github pages configuration

After the pull request was merged, I configured **GitHub Pages**:

1. **Settings** → **Pages** → **Custom domain**
2. Added `jeffreyjose07.is-a.dev` in the custom domain field
3. **Enforce HTTPS** checkbox enabled for security

**Important**: Only configure the custom domain in **GitHub Pages** *after* the is-a.dev pull request is merged, otherwise you'll see 404 errors.

### step 3: domain verification process

**GitHub Pages** requires domain verification through a **TXT record**. The process involves:

1. **Get verification string**: In GitHub Pages settings, click "Add a domain" and enter `jeffreyjose07.is-a.dev`
2. **Copy hostname and verification code** provided by GitHub
3. **Create verification file**: Submit another pull request to is-a.dev with:

```json
{
    "owner": {
        "username": "jeffreyjose07", 
        "email": "jeffreyjose07@example.com"
    },
    "records": {
        "TXT": "github-verification-string-here"
    }
}
```

4. **Wait for DNS propagation** (can take up to 24 hours)
5. **Verify domain** in GitHub Pages settings

### step 4: dns propagation and testing

The **is-a.dev** service handles all DNS configuration automatically. Once the pull requests are merged:

- **CNAME record** points `jeffreyjose07.is-a.dev` → `jeffreyjose07.github.io`
- **TXT record** provides domain verification for GitHub
- **HTTPS certificate** is automatically provisioned by GitHub Pages

I monitored the setup using online **DNS checker** tools to verify propagation across different global locations.

## the migration experience

### dns propagation

The most nerve-wracking part was waiting for **DNS propagation**. Changes can take up to 24 hours, but mine propagated within 2 hours. I used online **DNS checker** tools to monitor progress across different global locations.

### https enforcement

Once the domain was verified, I enabled **HTTPS enforcement** in **GitHub Pages** settings. This ensures all traffic is encrypted and provides the security padlock that users expect.

### testing the migration

I thoroughly tested:
- **Root domain** access (`jeffreyjose07.is-a.dev`)
- **WWW subdomain** redirects
- **HTTPS** enforcement and certificate validity
- **All existing URLs** and internal links
- **Mobile responsiveness** on the new domain

## lessons learned

### community-driven domain service

**is-a.dev** operates differently from traditional domain registrars. The process involves:
- **Pull request workflow** instead of automated registration
- **Community review** of domain requests
- **Free service** supported by donations and community contributions
- **Developer-focused** TLD that signals technical expertise

### timing is critical

The order of operations matters significantly:
1. **First**: Submit is-a.dev pull request and wait for merge
2. **Then**: Configure custom domain in GitHub Pages
3. **Finally**: Submit verification TXT record pull request

Doing these steps out of order results in 404 errors and verification failures.

### dns patience required

**DNS propagation** through is-a.dev can take longer than traditional registrars:
- **Initial setup**: 2-6 hours for pull request merge
- **DNS propagation**: Up to 24 hours for global availability
- **Verification**: Additional 24 hours for GitHub domain verification

### github actions compatibility

My existing **GitHub Actions** workflow continued working seamlessly. The build process automatically detected the custom domain and updated all generated URLs accordingly.

### seo considerations

**GitHub Pages** automatically handles redirects from the old subdomain, preserving **SEO value** and ensuring existing bookmarks continue working.

### monitoring and maintenance

**is-a.dev** handles DNS management, while **GitHub Pages** manages HTTPS certificates. Both services provide reliable uptime and automatic renewal.

## the result

The migration was successful and transparent. My portfolio now lives at `https://jeffreyjose07.is-a.dev/` with:

- **Faster perceived loading** due to cleaner URLs
- **Professional credibility** from the custom domain
- **Maintained functionality** - all features work identically
- **Enhanced branding** that aligns with the technical aesthetic

The **terminal aesthetic** of the site now has a domain that matches its technical sophistication. The `.is-a.dev` TLD perfectly complements the minimalist, developer-focused design philosophy.

## the is-a.dev community

**is-a.dev** is more than just a domain service - it's a community of developers who value:
- **Open source principles** with transparent domain management
- **Developer-first approach** with technical TLDs
- **Community support** through GitHub-based workflows
- **Accessibility** with free subdomains for developers

The pull request process ensures quality control and prevents domain squatting, while the community-driven approach aligns perfectly with the **open source** nature of my portfolio and blog.

## next steps

With the custom domain in place, I'm considering:
- **Email setup** using the domain for professional communication
- **Subdomain experiments** for different projects or experiments  
- **Analytics optimization** to track the impact of the domain change
- **Community contribution** back to the is-a.dev project

The custom domain represents more than just a URL change - it's a commitment to professional presentation, technical excellence, and community participation that matches the quality of the content and design.

*The site is now live at [https://jeffreyjose07.is-a.dev/](https://jeffreyjose07.is-a.dev/) - a cleaner, more professional home for my technical thoughts and projects, powered by the developer community.*
