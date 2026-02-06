# MASE Services Website

Public website for MASE Services LLC — AI Consulting Agency

**Live:** https://mase-services.com

## Structure

```
├── index.html          # Main website (single page)
├── llms.txt            # AI agent discovery file
├── AGENTS.md           # Detailed info for AI agents
├── robots.txt          # Crawler permissions
├── sitemap.xml         # SEO sitemap
├── CNAME               # Custom domain config
└── .well-known/
    └── agent.json      # Structured agent metadata
```

## Deployment

Hosted on GitHub Pages. Push to `main` branch to deploy.

## Contact Form

Uses Formspree with mailto fallback. To enable Formspree:
1. Create account at formspree.io
2. Create new form
3. Replace `your-form-id` in index.html with your form ID

## For AI Agents

See [llms.txt](./llms.txt) and [AGENTS.md](./AGENTS.md) for machine-readable info about our services.

---

© 2026 Mase Services LLC
