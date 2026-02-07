# MASE Services Website TODO

## Priority 1: Critical (Launch Blockers)

### Content
- [ ] **Write remaining 34 articles** (use CONTENT-OUTLINES.md)
  - Style: Use analogies (AI = employee, training = hiring, etc.)
  - Target: Layman can understand every concept
  - Each article needs 2-4 clean infographics
- [ ] **Regenerate infographics** in clean, citation-worthy style
  - White backgrounds, no branding, minimal design
  - Goal: Get cited by other publications for backlinks

### Site Structure  
- [x] Track index pages (/learn/fundamentals, /strategy, etc.)
- [ ] Update sitemap.xml with all new pages
- [ ] Add 404 page
- [ ] Add robots.txt update for new sections

### Research Hub
- [ ] Benchmark methodology page (/research/benchmark/methodology)
- [ ] Archive structure for monthly reports (/research/state-of-ai/)
- [ ] Research library page (/research/library) with curated external sources

---

## Priority 2: High (Before Marketing Push)

### SEO & Discoverability
- [ ] Schema.org markup for articles (Article, HowTo)
- [ ] Open Graph images per article (or generic fallbacks)
- [ ] Meta descriptions for all pages
- [ ] Internal linking strategy between articles

### Functionality
- [ ] Newsletter signup (integrate with email provider)
- [ ] Contact form working (Formspree or alternative)
- [ ] Search functionality (simple JS search or Algolia)

### Content Expansion
- [ ] Case studies page with real client examples (when available)
- [ ] About page (/about)
- [ ] Pricing page with clear tiers

---

## Priority 3: Medium (Growth Phase)

### Lead Generation
- [ ] Gated content (downloadable PDFs of reports)
- [ ] Assessment tool ("AI Readiness Quiz")
- [ ] ROI calculator widget

### Advanced Features
- [ ] Blog/Articles RSS feed
- [ ] Print-friendly article versions
- [ ] Article sharing buttons

### Industry Landing Pages
- [ ] /industries/manufacturing
- [ ] /industries/financial-services
- [ ] /industries/professional-services
- [ ] /industries/distribution

---

## Priority 4: Nice to Have

- [ ] Dark/light mode toggle
- [ ] Reading progress indicator on articles
- [ ] Related articles suggestions
- [ ] Comments or discussion (probably skip)
- [ ] Multi-language support (future)

---

## Infographics To Regenerate (Clean Style)

### For Published Articles
| Current | Status | Regenerate |
|---------|--------|------------|
| AI vs Traditional Software | Too neon | Yes - white bg, simple comparison |
| How LLMs Work | Has branding | Yes - clean pipeline diagram |
| AI Spectrum | Too sci-fi | Yes - simple progression |
| Real vs Fake AI | Has branding | Yes - clean two-column |
| Scale Emergence chart | Too stylized | Yes - clean line chart |
| Three Waves | Too complex | Yes - simple three-stage |
| Pilot Success Rates | OK but dark | Yes - light bg bar chart |
| Benchmark Comparison | OK but dark | Yes - light bg bar chart |
| Category Radar | Has branding | Yes - clean radar chart |
| ROI Concentration | Has branding | Yes - simple bar chart |
| Five Value Levers | Too busy | Yes - clean 5-box layout |
| Build/Buy/Partner | Has branding | Yes - clean 3-column |

### New Infographics Needed
- [ ] Training vs Inference (for F-03)
- [ ] AI Vendor Landscape Map (for F-04)
- [ ] What AI Can vs Cannot Do matrix (for F-06)
- [ ] AI ROI Framework (for S-01)
- [ ] 90-Day Pilot Timeline (for I-01)
- [ ] Data Quality Checklist (for I-02)

---

## Article Writing Guidelines

### Style
- **Use analogies constantly**
  - AI training = teaching a new employee
  - Model = employee with specific skills
  - Fine-tuning = specialized training for your company
  - Hallucination = confident employee making stuff up
  - Context window = employee's working memory
  - API = phone line to the AI employee

### Structure (per article)
1. Hook with business relevance
2. Plain-English explanation with analogy
3. Visual aid (clean infographic)
4. Real-world example with numbers
5. What this means for your business
6. Key takeaways (5-7 bullets)
7. Next steps / related reading

### Tone
- Direct, not academic
- Confident but not arrogant  
- Acknowledge uncertainty honestly
- No jargon without explanation
- "Here's what the data shows" not "We believe"

---

## Build System Improvements

- [ ] Auto-generate sitemap from content.json
- [ ] Article date/updated tracking
- [ ] Reading time auto-calculation
- [ ] Better prev/next navigation
- [ ] Auto-generate track index pages from content.json

---

## Metrics to Track

Once live:
- [ ] Google Analytics / Plausible
- [ ] Search Console setup
- [ ] Backlink monitoring
- [ ] Newsletter signup rate
- [ ] Contact form submissions
- [ ] Time on page by article
