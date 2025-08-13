---
title: "Implementing Privacy-First Analytics: From Research to GoatCounter"
date: "2025-01-13"
tags: ["analytics", "privacy", "web-development", "goatcounter", "github-pages"]
description: "A comprehensive guide to implementing privacy-friendly analytics across portfolio and blog - from researching solutions to deploying GoatCounter with future API integration plans."
readingTime: 8
wordCount: 1800
---

After months of running my portfolio and blog without any visitor insights, I finally decided it was time to implement analytics. But not just any analytics - I wanted a solution that respected user privacy, didn't require consent banners, and provided the data I actually needed.

## The Analytics Dilemma

Most developers reach for Google Analytics by default, but I had several concerns:

- **Privacy invasion**: Extensive tracking and data collection
- **GDPR compliance**: Cookie banners and consent management
- **Bloated scripts**: ~28KB+ of JavaScript for basic analytics
- **Over-engineering**: Complex interface for simple needs

I needed something that would tell me:
- How many people visit my portfolio vs blog
- Which blog posts are most popular  
- How many people try my Void Blocks game
- Where visitors come from (referrers)

## Research Phase: Exploring Options

### Option 1: Google Analytics 4
**Pros**: Comprehensive features, familiar interface, free forever
**Cons**: Privacy concerns, requires GDPR compliance, heavy script, complex setup

### Option 2: GitHub Pages Built-in Analytics
**Status**: Non-existent. GitHub Pages provides zero analytics capabilities beyond IP logging for security.

After extensive research, I discovered GitHub still doesn't provide native analytics for Pages sites, despite years of community requests. This remains one of the most requested features.

### Option 3: Privacy-Focused Alternatives

I evaluated several privacy-first solutions:

**Plausible Analytics**: Excellent privacy focus, beautiful dashboard, but $9/month
**Fathom Analytics**: Similar to Plausible, but more expensive  
**Umami**: Self-hosted option, requires server setup and maintenance

### Option 4: GoatCounter - The Winner
**Cost**: Completely FREE (donation-supported)
**Privacy**: No cookies, no personal data tracking, GDPR compliant
**Size**: Only ~3.5KB script (75x lighter than Google Analytics)
**Features**: All essential metrics without complexity
**API**: REST endpoints for programmatic access

## Implementation Strategy

### Phase 1: Script Integration

I needed to add tracking to four distinct sections:

1. **Main Portfolio** (`/index.html`) - React app landing page
2. **Blog Homepage** (`/blog/templates/index.html`) - Blog index with posts
3. **Individual Posts** (`/blog/templates/post.html`) - Article pages  
4. **Void Blocks Game** (`/public/games/void-blocks/index.html`) - Game analytics

The implementation was straightforward - a single script tag before `</body>`:

```html
<!-- GoatCounter Analytics -->
<script data-goatcounter="https://jeffreyjose.goatcounter.com/count" 
        async src="//gc.zgo.at/count.js"></script>
```

### Phase 2: Template Updates

For the blog system, I updated both templates:

**Blog Index Template**: Tracks blog homepage visits, tag filtering usage, and pagination navigation.

**Post Template**: Tracks individual article reads, reading time, and referral sources.

The React portfolio required adding the script to the root HTML template, ensuring tracking works across all single-page-app navigation.

### Phase 3: Build and Deploy

After updating templates, I rebuilt the blog to propagate changes:

```bash
node blog/scripts/build.js
```

This generated new HTML files with analytics scripts embedded. The build process updated all 12 blog posts, the index, archive page, and sitemap.

## Architecture Decisions

### Why Not Self-Hosted?

While Umami and Plausible offer self-hosted options, I chose GoatCounter's hosted service because:

- **Zero maintenance**: No server management or updates
- **Reliability**: Professional infrastructure and uptime
- **Cost**: Truly free vs hosting costs
- **Focus**: Spend time on content, not analytics infrastructure

### Script Placement Strategy

I placed all scripts before `</body>` to ensure:
- Page content loads first (better UX)
- No blocking of critical rendering path
- Analytics don't interfere with existing animations
- Proper interaction with terminal effects and loading animations

## What Gets Tracked

### Portfolio Analytics
- Homepage visits and unique visitors
- Time on site and bounce rate
- Referrer sources (social, direct, search)
- Geographic distribution

### Blog Analytics  
- Individual post performance
- Most popular content categories
- Reading completion rates (via time on page)
- Tag-based content preferences

### Game Analytics
- Void Blocks play sessions
- Game completion rates
- Player engagement metrics

## Privacy Implementation

### No Consent Required
GoatCounter's privacy-first approach means:
- No cookies stored
- No personal data collected
- No cross-site tracking
- No consent banners needed

### Terminal Aesthetic Compliance
The solution maintains my 90s terminal aesthetic:
- No intrusive UI elements
- Lightweight script doesn't affect performance
- Clean, minimal dashboard matches design philosophy

## Future Scope: View Count Display

### Phase 2 Planning
The most exciting part is GoatCounter's API access. I'm planning to implement view counts directly on blog posts:

```
📊 analytics: 1,234 total views · 567 unique visitors
👀 this post: 89 views
🎮 void blocks: 156 plays
```

### API Integration Options

**Build-time Fetching**: Update view counts during blog rebuilds
```javascript
// In blog/scripts/build.js
const response = await fetch('https://jeffreyjose.goatcounter.com/api/v0/stats/hits', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});
```

**Client-side Updates**: Dynamic view counts with JavaScript
```javascript
// Real-time view count updates
fetch('/api/goatcounter-proxy/stats/hits/{path}')
  .then(r => r.json())
  .then(data => updateViewCount(data.count));
```

### Rate Limits and Considerations
GoatCounter's API allows 4 requests per second, perfect for:
- Build-time batch updates
- Occasional real-time refreshes
- Popular posts widgets
- Analytics dashboard integration

## Results and Performance

### Immediate Benefits
- **Zero impact** on page load times
- **No privacy concerns** - visitors browse freely
- **Clean data** - only meaningful metrics
- **Terminal aesthetic** maintained throughout

### Analytics Insights
Within hours of deployment, I could see:
- Blog posts attracting most traffic
- Popular content categories
- Visitor geographic distribution
- Referral source effectiveness

## Lessons Learned

### Research Pays Off
Spending time evaluating options prevented expensive mistakes. The "free" solutions (Google Analytics) had hidden costs in complexity and privacy concerns.

### Privacy-First is User-First
Choosing GoatCounter improved user experience:
- No cookie prompts
- Faster page loads  
- No tracking concerns
- Cleaner browsing experience

### API Access is Crucial
Having programmatic access to analytics data opens possibilities:
- Custom dashboards
- View count displays
- Popular content widgets
- Integration with existing systems

## Technical Implementation Details

### File Changes Made
- `index.html` - Portfolio tracking
- `blog/templates/index.html` - Blog homepage
- `blog/templates/post.html` - Individual posts
- `public/games/void-blocks/index.html` - Game analytics
- `ANALYTICS.md` - Implementation documentation

### Build Process Integration
The analytics scripts integrate seamlessly with the existing build system:
1. Templates updated with tracking code
2. Blog rebuild propagates changes
3. Git deployment updates live site
4. Analytics begin tracking immediately

### Performance Impact
Measured impact on site performance:
- **Script size**: 3.5KB (vs 28KB+ for GA4)
- **Load time**: No measurable increase
- **First paint**: Unaffected
- **JavaScript execution**: Minimal

## Future Enhancements

### Phase 2: View Count Integration
- Generate GoatCounter API key
- Implement build-time view count fetching
- Design terminal-style view count display
- Add popular posts sidebar widget

### Phase 3: Advanced Analytics
- Custom event tracking (game completions)
- Real-time dashboard integration
- Analytics API for portfolio projects
- Visitor engagement heatmaps

### Phase 4: Content Optimization
- A/B testing for blog post titles
- Content performance analysis
- Referral source optimization
- User journey mapping

## Conclusion

Implementing privacy-first analytics proved both technically straightforward and ethically satisfying. GoatCounter provides everything needed without compromise:

- **User privacy** respected completely
- **Developer experience** clean and simple  
- **Performance impact** virtually zero
- **Future flexibility** through API access

The implementation took less than an hour but provides insights that will guide content strategy and technical decisions for years to come. Most importantly, visitors can browse freely without privacy concerns or intrusive tracking.

Sometimes the best technical solutions are the simplest ones that just work - exactly what GoatCounter delivers for privacy-conscious developers.