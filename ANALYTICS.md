# Analytics Implementation

## GoatCounter Setup

### Current Status: ✅ IMPLEMENTED
- **Service**: GoatCounter (https://jeffreyjose.goatcounter.com)
- **Domain**: jeffreyjose07.is-a.dev (updated from jeffreyjose07.github.io)
- **Cost**: FREE (donation-supported)
- **Script Size**: ~3.5KB (privacy-friendly)

### Tracking Locations
- ✅ Blog posts (`/blog/templates/post.html`)
- ✅ Blog index (`/blog/templates/index.html`) 
- ✅ Main portfolio (`/index.html`)
- ✅ Void Blocks game (`/public/games/void-blocks/index.html`)

### Next Steps for Setup
1. **Sign up at goatcounter.com**
2. **Choose subdomain**: `jeffreyjose.goatcounter.com`
3. **Generate API key** in settings for future view count integration

---

## View Count Display (Future Feature)

### API Endpoints Available
- `GET /api/v0/stats/hits` - All page statistics
- `GET /api/v0/stats/hits/{path_id}` - Individual page stats
- `GET /api/v0/stats/total` - Total site counts

### Authentication
- **Method**: Bearer token in `Authorization` header
- **Rate Limit**: 4 requests per second
- **API Docs**: https://www.goatcounter.com/help/api

### Implementation Options

#### Option A: Build-time Integration (Recommended)
```javascript
// Modify blog/scripts/build.js to fetch view counts
const response = await fetch('https://jeffreyjose.goatcounter.com/api/v0/stats/hits', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});
const stats = await response.json();
```

#### Option B: Client-side Integration
```javascript
// Add to blog templates for dynamic counts
fetch('/api/goatcounter-proxy/stats/hits/{path}')
  .then(r => r.json())
  .then(data => updateViewCount(data.count));
```

### Display Format (Terminal Aesthetic)
```
📊 analytics: 1,234 total views · 567 unique visitors
👀 this post: 89 views · 45 unique
🎮 void blocks: 156 plays
```

### Integration Locations
- **Blog post footer**: Individual post view counts
- **Blog index**: Total blog views
- **Portfolio header**: Total portfolio views  
- **Game page**: Total game plays

---

## Technical Details

### Current Script Implementation
```html
<!-- GoatCounter Analytics -->
<script data-goatcounter="https://jeffreyjose.goatcounter.com/count" 
        async src="//gc.zgo.at/count.js"></script>
```

### Privacy Features
- ✅ No cookies required
- ✅ GDPR compliant 
- ✅ No personal data tracking
- ✅ Lightweight script
- ✅ No consent banners needed

### Dashboard Access
- **Owner**: Full analytics dashboard
- **Public**: Optional (can make stats public)
- **API**: Programmatic access with API key

---

## Development Timeline

### Phase 1: Analytics Setup ✅ COMPLETE
- [x] Add tracking scripts to all pages
- [x] Rebuild blog with analytics
- [x] Document implementation

### Phase 2: View Count Integration (Next)
- [ ] Generate GoatCounter API key
- [ ] Modify build script to fetch view counts
- [ ] Add view count display to templates
- [ ] Style view counts for terminal aesthetic

### Phase 3: Advanced Features (Future)
- [ ] Real-time view count updates
- [ ] Popular posts widget
- [ ] Analytics dashboard page
- [ ] Custom event tracking (game completion, etc.)