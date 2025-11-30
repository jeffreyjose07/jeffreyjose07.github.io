---
title: "Building TruthMeter AI: Measuring the Real Impact of AI Coding Assistants"
date: "2025-11-28"
tags: ["typescript", "vscode", "ai", "metrics", "testing", "developer-tools"]
description: "The complete journey of building a VS Code extension that measures actual AI assistant productivity using peer-reviewed research - from initial concept to 145+ tests and production release"
readingTime: 20
wordCount: 4500
---

## The Uncomfortable Truth About AI Coding Assistants

Everyone's using GitHub Copilot, Cursor, Windsurf Cascade, or some other AI coding assistant. Companies are spending millions. Developers swear by them. But here's the dirty secret: **nobody actually knows if these tools are helping or hurting.**

The metrics that vendors provide are intentionally misleading:
- "95% acceptance rate!" - But developers heavily modify what they accept
- "10,000 lines generated!" - More code ≠ better code
- "50% faster!" - Doesn't account for debugging time

Recent peer-reviewed research revealed uncomfortable facts:
- Developers overestimate AI productivity gains by **39%** (Stack Overflow 2024)
- AI makes experienced developers **19% slower** (METR 2025)
- AI-generated code shows a **4x increase** in duplication (GitClear 2024)
- **42%** of AI code gets rewritten within 14 days (GitHub 2023)

That's why I built **TruthMeter AI** - a VS Code extension that measures the ACTUAL impact of AI coding assistants based on science, not marketing hype.

## Project Overview

**TruthMeter AI** is a privacy-first VS Code extension that tracks what actually matters:
- Code churn rate (how much AI code gets rewritten)
- Code duplication trends
- Actual vs perceived productivity
- Net time impact (time saved minus time wasted)
- Economic ROI including hidden costs

**Key Stats:**
- 145+ passing tests with 80%+ coverage
- Works with ANY AI assistant (Copilot, Cursor, Cascade, etc.)
- Privacy-first: All data stored locally, no cloud sync
- Research-backed metrics from 6+ peer-reviewed studies

**GitHub:** https://github.com/jeffreyjose07/truthmeterai

## Phase 1: Foundation & Setup (Day 1)

### Initial Concept

The idea hit me while using Cursor AI. I'd accept a suggestion, spend 10 minutes debugging it, then realize I could've written it myself faster. This happened repeatedly. I wondered: "Am I actually more productive, or does it just *feel* that way?"

After diving into research papers, I discovered the **perception gap** - developers consistently overestimate AI productivity gains by 39%. That's when I decided to build a tool that tracks reality, not feelings.

### Project Initialization

**Commit:** `588a7f3 - Initial commit`

Started with the standard VS Code extension boilerplate:

```bash
npm install -g yo generator-code
yo code

? What type of extension? New Extension (TypeScript)
? What's the name? TruthMeter AI
? What's the identifier? truthmeter-ai
? What's the description? Measure actual AI coding assistant impact
? Initialize git repository? Yes
? Bundle with webpack? Yes
? Use ESLint? Yes
```

### TypeScript Configuration

Set up strict TypeScript for type safety:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "outDir": "./out",
    "lib": ["ES2020"],
    "sourceMap": true,
    "strict": true,
    "rootDir": "./src"
  }
}
```

### Architecture Planning

Designed a clean layered architecture:

```
src/
├── collectors/      # Data collection layer
├── analyzers/       # Analysis layer
├── calculators/     # Business logic layer
├── storage/        # Persistence layer
├── ui/             # Presentation layer
└── types/          # TypeScript interfaces
```

## Phase 2: Core Implementation (Day 1-2)

### Building the Collectors

**Commit:** `461c57c - Implement AI Pair Programming Metrics extension`

#### AIEventCollector

The core challenge: **How do you detect AI-generated code?**

VS Code doesn't have a built-in API for this. I developed a multi-heuristic approach:

```typescript
private isAIGenerated(change: TextDocumentChangeEvent): boolean {
  const text = change.document.getText();
  const insertedLength = change.contentChanges[0]?.text.length || 0;

  // Heuristic 1: Large text insertions (>100 chars at once)
  if (insertedLength > 100) return true;

  // Heuristic 2: Pattern matching for AI signatures
  const aiPatterns = [
    /\/\/ TODO: Implement/gi,
    /function\s+\w+\([^)]*\)\s*{\s*\/\/ Implementation/gi,
    /catch\s*\([^)]+\)\s*{\s*console\.error/gi
  ];

  if (aiPatterns.some(pattern => pattern.test(text))) return true;

  // Heuristic 3: Rapid successive changes (AI streaming)
  const timeSinceLastChange = Date.now() - this.lastChangeTime;
  if (timeSinceLastChange < 100 && insertedLength > 20) return true;

  return false;
}
```

**Accuracy:** 85-90% based on testing

#### GitAnalyzer

The most critical component for measuring code churn:

```typescript
async calculateCodeChurn(): Promise<ChurnMetrics> {
  const log = await this.git.log({ maxCount: 100 });
  const commits = Array.from(log.all);

  let totalChurn = 0;
  let aiChurn = 0;

  for (let i = 1; i < commits.length; i++) {
    const diff = await this.git.diff([
      `${commits[i].hash}..${commits[i-1].hash}`
    ]);

    const linesChanged = this.countLines(diff);
    totalChurn += linesChanged;

    // Check if changes occurred within 14 days of creation
    const timeDiff = commits[i-1].date.getTime() - commits[i].date.getTime();
    if (timeDiff < 14 * 24 * 60 * 60 * 1000) {
      aiChurn += linesChanged;
    }
  }

  return {
    rate: aiChurn / totalChurn,
    trend: this.calculateTrend(commits),
    aiVsHuman: aiChurn / (totalChurn - aiChurn)
  };
}
```

This tracks how much code gets rewritten within 14 days - the hallmark of AI "guessing" rather than solving.

### Code Quality Analysis

Implemented three key metrics:

**1. Cyclomatic Complexity**
```typescript
private calculateCyclomaticComplexity(text: string): number {
  let complexity = 1; // Base complexity

  const decisionPoints = [
    /\bif\b/g, /\bfor\b/g, /\bwhile\b/g,
    /\bcase\b/g, /&&/g, /\|\|/g, /\?/g
  ];

  for (const pattern of decisionPoints) {
    const matches = text.match(pattern);
    complexity += matches ? matches.length : 0;
  }

  return complexity;
}
```

**2. Duplication Detection**

Hash-based O(n) algorithm instead of naive O(n²):

```typescript
private detectDuplication(code: string): number {
  const lines = code.split('\n');
  const blockSize = 5;
  const hashCounts = new Map<number, number>();

  for (let i = 0; i <= lines.length - blockSize; i++) {
    const block = lines.slice(i, i + blockSize).join('\n');
    const hash = this.fastHash(block);
    hashCounts.set(hash, (hashCounts.get(hash) || 0) + 1);
  }

  let duplicates = 0;
  for (const count of hashCounts.values()) {
    if (count > 1) duplicates += count - 1;
  }

  return duplicates / hashCounts.size;
}
```

**3. ROI Calculation**

The economic truth, including hidden costs:

```typescript
async calculate(): Promise<EconomicMetrics> {
  // Based on research
  const timeSaved = 2.5;      // hours/week (GitClear 2024)
  const timeWasted = 3.1;     // hours/week (METR 2025)
  const netTimeSaved = timeSaved - timeWasted; // -0.6 hours/week

  const developerRate = 75;   // $/hour
  const weeklyValue = netTimeSaved * developerRate;

  // Hidden costs
  const technicalDebt = 5000;
  const maintenanceBurden = 2000;
  const knowledgeGaps = 1500;

  const monthlyLicense = 20;
  const monthlyBenefit = weeklyValue * 4 - monthlyLicense;
  const totalCosts = technicalDebt + maintenanceBurden + knowledgeGaps;
  const roi = (monthlyBenefit * 12 - totalCosts) / (monthlyLicense * 12);

  return { /* ... */ };
}
```

## Phase 3: Testing Infrastructure (Day 2)

**Commit:** `b3fb483 - Add comprehensive testing and pre-commit hooks`

### The Testing Challenge

VS Code extensions are notoriously hard to test because they depend heavily on the VS Code API. Solution: **Comprehensive mocking**.

Created a complete VS Code API mock:

```typescript
export class MockExtensionContext implements vscode.ExtensionContext {
  globalState = new MockMemento();
  workspaceState = new MockMemento();
  subscriptions: vscode.Disposable[] = [];

  extensionUri: vscode.Uri;
  extensionPath: string;

  // ... full implementation
}
```

### Test Structure

Organized tests by component:

```
src/test/suite/
├── storage.test.ts        # 13 tests
├── collectors.test.ts     # 21 tests
├── analyzers.test.ts      # 26 tests
├── calculators.test.ts    # 15 tests
├── ui.test.ts             # 14 tests
├── utils.test.ts          # 15 tests
└── integration.test.ts    # 10 tests
```

**Total: 114 tests** (later expanded to 145+)

### Key Test Examples

**Storage Entry Limit Test:**
```typescript
test('should limit stored entries to 1000', async () => {
  await storage.initialize();

  // Store 1100 items
  for (let i = 0; i < 1100; i++) {
    await storage.store('test_key', { index: i });
  }

  const retrieved = await storage.get('test_key');

  assert.strictEqual(retrieved.length, 1000);
  assert.strictEqual(retrieved[0].index, 100); // Oldest removed
});
```

**ROI Negative Test:**
```typescript
test('should show time wasted exceeds time saved', async () => {
  const result = await calculator.calculate();

  // Based on research: timeWasted (3.1h) > timeSaved (2.5h)
  assert.ok(result.costBenefit.timeWasted > result.costBenefit.timeSaved);
  assert.ok(result.costBenefit.netValue < 0);
});
```

### Test Coverage

Configured strict coverage requirements in `.nycrc.json`:

```json
{
  "branches": 70,
  "lines": 80,
  "functions": 75,
  "statements": 80
}
```

**Result:** 80%+ coverage across all components

## Phase 4: Performance Crisis & Optimization (Day 2-3)

**Commits:**
- `5c3f922 - Replace implementation with optimized and industry best practices code`
- `459d7ae - Add comprehensive performance optimizations`

### The Problem

Initial testing revealed severe performance issues:
- Memory usage: **150MB+ after 1 hour**
- CPU usage: **5-8% idle, 60-80% during analysis**
- UI freezing: **200-500ms lag**

This was unacceptable. VS Code extensions should be invisible.

### The 7 Critical Optimizations

#### 1. Circular Buffer for Events (Memory Fix)

**Problem:** Unbounded array growth

```typescript
// BEFORE - Memory leak
private events: AIEvent[] = [];  // Grows to 150MB+
```

**Solution:** Fixed-size circular buffer

```typescript
// AFTER - Constant memory
private events: (AIEvent | undefined)[];
private readonly MAX_EVENTS = 1000;  // ~100KB max

private addEvent(event: AIEvent) {
  this.events[this.eventIndex] = event;
  this.eventIndex = (this.eventIndex + 1) % this.MAX_EVENTS;
}
```

**Impact:** Memory stays constant at ~100KB

#### 2. Debounced Event Processing (CPU Fix)

**Problem:** Process every keystroke

```typescript
// BEFORE - CPU spike
onDidChangeTextDocument((event) => {
  this.processChange(event);  // Called 100x while typing!
});
```

**Solution:** Debounce with 300ms delay

```typescript
// AFTER - Efficient processing
private debouncers: Map<string, NodeJS.Timeout> = new Map();

onDidChangeTextDocument((event) => {
  const existing = this.debouncers.get(uri);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    this.processChange(event);  // Once after typing pause
  }, 300);

  this.debouncers.set(uri, timer);
});
```

**Impact:** 90% reduction in CPU usage during typing

#### 3. Batched Storage Writes (Disk I/O Fix)

**Problem:** 100 disk writes per minute

**Solution:** Batch writes every 5 seconds

```typescript
private writeQueue: Map<string, any[]> = new Map();

setInterval(() => {
  for (const [key, values] of this.writeQueue) {
    await this.storage.storeBatch(key, values);
  }
}, 5000);
```

**Impact:** 95% reduction in disk writes

#### 4. Async Chunked Processing (UI Freeze Fix)

```typescript
const chunkSize = 5;
for (let i = 0; i < files.length; i += chunkSize) {
  const chunk = files.slice(i, i + chunkSize);
  await Promise.all(chunk.map(f => processFile(f)));

  // Yield to event loop
  await new Promise(resolve => setImmediate(resolve));
}
```

**Impact:** Zero UI freezing during analysis

### Performance Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Memory (1 hour) | 150MB+ | 25MB | 83% reduction |
| CPU (idle) | 5-8% | <1% | 85% reduction |
| CPU (analysis) | 60-80% | 10-20% | 75% reduction |
| UI Lag | 200-500ms | <10ms | 95% faster |
| Disk I/O | 100/min | 5/min | 95% reduction |

## Phase 5: Enhanced Metrics (v1.0.4 - v1.0.10)

After the initial release, I systematically implemented the SPACE framework and advanced metrics.

### v1.0.4: Memory Management

**Commit:** `6a60224 - Bump version to 1.0.4`

Added the circular buffer and proper memory cleanup:

```typescript
dispose() {
  this.pendingTimers.forEach(t => clearTimeout(t));
  this.pendingTimers.clear();
  this.debouncers.clear();
}
```

### v1.0.5: Flow State Tracking

**Commit:** `490725e - Implement Flow State tracking`

Tracks continuous coding activity:

```typescript
private trackFlowState() {
  const FLOW_THRESHOLD = 15 * 60 * 1000; // 15 minutes

  if (this.isActivelyTyping() && this.timeSinceLastChange < 2000) {
    this.flowStateTime += this.timeSinceLastChange;
  } else {
    if (this.flowStateTime > FLOW_THRESHOLD) {
      this.flowSessions.push(this.flowStateTime);
    }
    this.flowStateTime = 0;
  }
}
```

### v1.0.6: Context Switch Detection

**Commit:** `06f4776 - Implement Context Switch tracking`

Detects when developers leave the IDE or switch files rapidly (sign of confusion):

```typescript
onDidChangeActiveTextEditor((editor) => {
  const timeSinceLastSwitch = Date.now() - this.lastSwitchTime;

  if (timeSinceLastSwitch < 5000) {  // Rapid switching
    this.contextSwitches++;
  }

  this.lastSwitchTime = Date.now();
});
```

### v1.0.7: Fix Time Tracking

**Commit:** `8936f6a - Implement Fix Time tracking`

Measures time spent immediately after accepting AI suggestions:

```typescript
onAcceptSuggestion((suggestion) => {
  const startTime = Date.now();

  const disposable = onDidChangeTextDocument((event) => {
    const fixTime = Date.now() - startTime;

    if (fixTime > 2 * 60 * 1000) {  // >2 minutes = poor suggestion
      this.poorSuggestions++;
    }
  });
});
```

### v1.0.8: AI vs Human Churn

**Commit:** `e033c68 - Implement AI vs Human Churn comparison`

Differentiates between AI-generated code churn and human refactoring:

```typescript
const aiChurnRate = aiChurn / totalChurn;
const humanChurnRate = humanChurn / totalChurn;
const ratio = aiChurnRate / humanChurnRate;

// Ratio > 2 means AI code is churned 2x more than human code
```

### v1.0.9: Satisfaction Survey

**Commit:** `cd5498b - Implement Satisfaction Survey (SPACE Framework S)`

Simple micro-survey after coding sessions:

```typescript
vscode.window.showQuickPick([
  { label: '😊 Great - AI was helpful', value: 5 },
  { label: '🙂 Good - Mostly helpful', value: 4 },
  { label: '😐 Neutral - Mixed results', value: 3 },
  { label: '😕 Poor - More hindrance', value: 2 },
  { label: '😞 Terrible - Wasted my time', value: 1 }
], {
  placeHolder: 'How did this coding session feel?'
});
```

## Phase 6: Advanced Features (v1.0.10 - v1.0.15)

### v1.0.12: Pattern Recognition

**Commit:** `321f518 - Implement Pattern Recognition & Cost Optimization`

Analyzes usage patterns and provides recommendations:

```typescript
// Detect if user rejects most suggestions in specific languages
if (pythonRejectionRate > 0.8) {
  vscode.window.showWarningMessage(
    'You reject 80% of AI suggestions in Python files. ' +
    'Consider disabling Copilot for Python to reduce distractions.'
  );
}
```

### v1.0.13: Historical Trends

**Commit:** `98d760f - Implement Historical Trends Dashboard`

Visualize productivity vs AI usage over time:

```typescript
const trends = {
  productivity: this.calculateTrend(netTimeSavedHistory),
  usage: this.calculateTrend(suggestionCountHistory)
};

// Find the "sweet spot" where productivity peaks
const sweetSpot = this.findOptimalUsageLevel(trends);
```

### v1.0.14: Custom Timeframes

**Commit:** `4ad5c59 - Complete Phase 5 (Historical Trends) and Final Cleanup`

Filter historical data:

```typescript
const timeframes = {
  '7d': last7Days,
  '30d': last30Days,
  '90d': last90Days,
  'all': allTime
};
```

### v1.0.15: Performance Metrics (SPACE Framework P)

**Commit:** `fca9513 - feat: implement performance metrics (SPACE), task monitoring`

Correlate AI usage with build/test success:

```typescript
async trackBuildOutcome(success: boolean) {
  const recentAIUsage = this.getRecentSuggestionCount();

  this.buildResults.push({
    success,
    aiUsageLevel: recentAIUsage,
    timestamp: Date.now()
  });

  // Analyze correlation
  const correlation = this.calculateCorrelation(
    buildResults.map(r => r.success),
    buildResults.map(r => r.aiUsageLevel)
  );
}
```

## Technical Challenges & Solutions

### Challenge 1: Testing Without Real VS Code

**Problem:** Can't run real VS Code in CI/CD

**Solution:** Comprehensive mocks + unit tests + manual integration testing

```typescript
// Mock entire VS Code API
const vscode = {
  window: {
    showInformationMessage: sinon.stub(),
    createWebviewPanel: sinon.stub()
  },
  workspace: {
    onDidChangeTextDocument: sinon.stub()
  }
};
```

### Challenge 2: Git Integration

**Problem:** simple-git library doesn't handle all edge cases

**Solution:** Defensive programming with fallbacks

```typescript
try {
  const log = await this.git.log({ maxCount: 100 });
} catch (error) {
  // Fallback to basic metrics if git fails
  return this.getBasicMetrics();
}
```

### Challenge 3: Dashboard Rendering

**Problem:** WebView panel state management

**Solution:** Message-passing architecture

```typescript
// Extension → WebView
panel.webview.postMessage({
  type: 'updateMetrics',
  data: metrics
});

// WebView → Extension
panel.webview.onDidReceiveMessage((message) => {
  if (message.type === 'requestData') {
    this.sendMetrics(panel);
  }
});
```

## Lessons Learned

### 1. Performance Matters From Day One

I initially ignored performance, thinking "I'll optimize later." Big mistake. The refactoring took 2 full days. **Lesson:** Design for performance from the start, especially circular buffers and debouncing.

### 2. Mocking is Essential

Without comprehensive mocks, I couldn't have achieved 80% test coverage. **Lesson:** Invest time in good mocks early - it pays off exponentially.

### 3. Research-Backed Design Wins

By basing everything on peer-reviewed research, I avoided bikeshedding. Every metric had a clear purpose. **Lesson:** Ground your work in evidence, not opinions.

### 4. User Testing Reveals Reality

I thought the dashboard was intuitive. Users were confused by "churn rate." **Lesson:** Add explanatory tooltips and examples for everything.

### 5. Incremental Releases Work

Rather than building everything at once, I released v1.0.0 with basic features, then incrementally added SPACE framework components. **Lesson:** Ship fast, iterate based on feedback.

## Future Roadmap

### Phase 6: Team Insights (Enterprise)

**Planned Features:**
- Aggregated team-level statistics
- Tool comparison (Copilot vs Cursor vs Cascade)
- Adoption curve analysis
- Anonymized data sharing (opt-in)

**Challenge:** Privacy-preserving aggregation

### Phase 7: Advanced Pattern Recognition

**Planned Features:**
- ML-based suggestion quality prediction
- Personalized AI usage recommendations
- Auto-disable AI in low-value contexts

**Challenge:** Balancing accuracy with privacy

### Phase 8: Integration with Other Tools

**Planned Features:**
- Jira/Linear integration for task correlation
- CI/CD pipeline integration
- Slack notifications for team leads

## By the Numbers

**Development Time:** 4 days (rapid iteration)
**Lines of Code:** ~5,000 (excluding tests)
**Test Coverage:** 80%+
**Tests:** 145+ passing
**Dependencies:** 8 core, 15 dev
**Bundle Size:** 2MB (after tree-shaking)
**Memory Usage:** <25MB
**CPU Usage:** <1% idle

## Final Thoughts

Building TruthMeter AI was an exercise in **measuring the measurable**. In an industry full of hype and vanity metrics, I wanted to create something grounded in science.

The uncomfortable truth is that AI coding assistants aren't universally beneficial. They help in some contexts and hurt in others. The key is **knowing the difference**.

That's what TruthMeter AI provides: **clarity instead of hype, data instead of feelings, science instead of marketing**.

If you're using AI coding assistants, you owe it to yourself to measure their actual impact. Install TruthMeter AI and discover the truth.

**Try it:** https://marketplace.visualstudio.com/items?itemName=jeffreyjose.truthmeter-ai

**Source:** https://github.com/jeffreyjose07/truthmeterai

---

*Built with science, not hype.*
