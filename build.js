#!/usr/bin/env node
/**
 * MASE Services Site Builder
 * 
 * Reads content.json and markdown files, outputs HTML pages.
 * Agent-friendly: just update content.json and run `node build.js`
 */

const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter (no dependencies)
function markdownToHtml(md) {
  let html = md;
  
  // Remove frontmatter if present
  html = html.replace(/^---[\s\S]*?---\n*/m, '');
  
  // Escape HTML in code blocks first (protect them)
  const codeBlocks = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    codeBlocks.push({ lang, code: code.trim() });
    return `__CODEBLOCK_${codeBlocks.length - 1}__`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  
  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-8 mb-3">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-10 mb-4">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-12 mb-6">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-8">$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="accent hover:underline">$1</a>');
  
  // Blockquotes (pull quotes)
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-accent pl-6 py-2 my-8 text-xl italic text-gray-300">$1</blockquote>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-white/10 my-12">');
  
  // Unordered lists
  html = html.replace(/^(\s*)[-*] (.+)$/gm, '$1<li class="ml-4">$2</li>');
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-2 my-4 text-gray-300">$&</ul>');
  
  // Ordered lists
  html = html.replace(/^(\s*)\d+\. (.+)$/gm, '$1<li class="ml-4">$2</li>');
  
  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
    const cells = content.split('|').map(c => c.trim());
    if (cells.every(c => /^[-:]+$/.test(c))) {
      return '__TABLE_SEP__';
    }
    return '<tr>' + cells.map(c => `<td class="border border-white/10 px-4 py-2">${c}</td>`).join('') + '</tr>';
  });
  html = html.replace(/__TABLE_SEP__\n?/g, '');
  html = html.replace(/(<tr>.*<\/tr>\n?)+/g, '<div class="overflow-x-auto my-8"><table class="w-full border-collapse">$&</table></div>');
  
  // Paragraphs (must come last)
  html = html.replace(/^(?!<[a-z]|__CODEBLOCK)(.+)$/gm, '<p class="text-gray-300 leading-relaxed my-4">$1</p>');
  
  // Restore code blocks
  html = html.replace(/__CODEBLOCK_(\d+)__/g, (_, i) => {
    const { lang, code } = codeBlocks[parseInt(i)];
    const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre class="bg-black/50 border border-white/10 rounded-lg p-4 overflow-x-auto my-6"><code class="text-sm text-gray-300">${escaped}</code></pre>`;
  });
  
  // Clean up empty paragraphs
  html = html.replace(/<p class="[^"]*"><\/p>\n?/g, '');
  
  return html;
}

// HTML template for articles
function articleTemplate(content, meta) {
  const prevNext = meta.prevNext || { prev: null, next: null };
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>${meta.title} | ${meta.section} | MASE Services</title>
    <meta name="description" content="${meta.subtitle || meta.title}">
    <meta name="robots" content="index, follow">
    
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.subtitle || meta.title}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://mase-services.com${meta.url}">
    
    <link rel="canonical" href="https://mase-services.com${meta.url}">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root { --accent: #00f3ff; --bg: #030305; }
        body { background-color: var(--bg); color: white; font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; }
        .accent { color: var(--accent); }
        .btn-primary { background: white; color: black; font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 6px; transition: all 0.3s; text-decoration: none; display: inline-block; }
        .btn-primary:hover { background: var(--accent); }
        .inline-code { background: rgba(255,255,255,0.1); padding: 0.125rem 0.375rem; border-radius: 4px; font-family: monospace; font-size: 0.875em; }
        article a { color: var(--accent); }
        article a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <!-- Nav -->
    <nav class="border-b border-white/10 px-6 py-4">
        <div class="max-w-4xl mx-auto flex justify-between items-center">
            <a href="/" class="text-2xl font-bold tracking-tighter font-mono">MASE<span class="accent">_</span></a>
            <div class="flex items-center gap-6">
                <a href="/research" class="text-sm text-gray-400 hover:text-white transition">Research</a>
                <a href="/learn" class="text-sm text-gray-400 hover:text-white transition">Learn</a>
                <a href="/#section-contact" class="btn-primary text-sm py-2 px-4">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Breadcrumb -->
    <div class="border-b border-white/10 px-6 py-3">
        <div class="max-w-4xl mx-auto">
            <nav class="text-sm text-gray-400">
                <a href="/" class="hover:text-white">Home</a>
                <span class="mx-2">/</span>
                <a href="${meta.sectionUrl}" class="hover:text-white">${meta.section}</a>
                ${meta.track ? `<span class="mx-2">/</span><a href="${meta.trackUrl}" class="hover:text-white">${meta.track}</a>` : ''}
                <span class="mx-2">/</span>
                <span class="text-white">${meta.title}</span>
            </nav>
        </div>
    </div>

    <!-- Article Header -->
    <header class="py-12 px-6 border-b border-white/10">
        <div class="max-w-4xl mx-auto">
            ${meta.track ? `<div class="text-sm font-mono mb-4" style="color: ${meta.trackColor}">${meta.track.toUpperCase()}</div>` : ''}
            <h1 class="text-4xl md:text-5xl font-bold mb-4">${meta.title}</h1>
            ${meta.subtitle ? `<p class="text-xl text-gray-400 mb-6">${meta.subtitle}</p>` : ''}
            <div class="flex items-center gap-6 text-sm text-gray-400">
                ${meta.readTime ? `<span class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4"></i>${meta.readTime} min read</span>` : ''}
                ${meta.date ? `<span class="flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i>${meta.date}</span>` : ''}
            </div>
        </div>
    </header>

    <!-- Article Content -->
    <article class="py-12 px-6">
        <div class="max-w-4xl mx-auto prose-lg">
            ${content}
        </div>
    </article>

    <!-- Prev/Next Navigation -->
    ${prevNext.prev || prevNext.next ? `
    <nav class="border-t border-white/10 py-8 px-6">
        <div class="max-w-4xl mx-auto flex justify-between">
            ${prevNext.prev ? `
            <a href="${prevNext.prev.url}" class="group">
                <div class="text-sm text-gray-400 mb-1">Previous</div>
                <div class="text-lg font-bold group-hover:text-accent transition">${prevNext.prev.title}</div>
            </a>
            ` : '<div></div>'}
            ${prevNext.next ? `
            <a href="${prevNext.next.url}" class="group text-right">
                <div class="text-sm text-gray-400 mb-1">Next</div>
                <div class="text-lg font-bold group-hover:text-accent transition">${prevNext.next.title}</div>
            </a>
            ` : '<div></div>'}
        </div>
    </nav>
    ` : ''}

    <!-- CTA -->
    <section class="py-16 px-6 border-t border-white/10">
        <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-2xl font-bold mb-4">Need Help Implementing This?</h2>
            <p class="text-gray-400 mb-6">MASE Learn is free. If you need hands-on help with AI, that's what we do.</p>
            <a href="/#section-contact" class="btn-primary">Book a Strategy Session</a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/10 py-8 px-6">
        <div class="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-sm text-gray-500">2026 Mase Services LLC</div>
            <div class="flex items-center gap-6 text-sm text-gray-500">
                <a href="/" class="hover:text-white transition">Home</a>
                <a href="/research" class="hover:text-white transition">Research</a>
                <a href="/learn" class="hover:text-white transition">Learn</a>
            </div>
        </div>
    </footer>

    <script>lucide.createIcons();</script>
</body>
</html>`;
}

// Main build function
function build() {
  console.log('🔨 Building MASE Services site...\n');
  
  const contentPath = path.join(__dirname, 'content.json');
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  
  let built = 0;
  let skipped = 0;
  
  // Build Learn articles
  for (const track of content.learn.tracks) {
    const publishedArticles = track.articles.filter(a => a.status === 'published');
    
    for (let i = 0; i < track.articles.length; i++) {
      const article = track.articles[i];
      
      if (article.status !== 'published') {
        skipped++;
        continue;
      }
      
      const mdPath = path.join(__dirname, article.file);
      if (!fs.existsSync(mdPath)) {
        console.log(`⚠️  Missing: ${article.file}`);
        skipped++;
        continue;
      }
      
      const markdown = fs.readFileSync(mdPath, 'utf8');
      const html = markdownToHtml(markdown);
      
      // Find prev/next among published articles
      const publishedIndex = publishedArticles.findIndex(a => a.id === article.id);
      const prevArticle = publishedIndex > 0 ? publishedArticles[publishedIndex - 1] : null;
      const nextArticle = publishedIndex < publishedArticles.length - 1 ? publishedArticles[publishedIndex + 1] : null;
      
      const meta = {
        title: article.title,
        subtitle: article.subtitle,
        readTime: article.readTime,
        section: 'Learn',
        sectionUrl: '/learn',
        track: track.title,
        trackUrl: `/learn/${track.id}`,
        trackColor: track.color,
        url: `/learn/${track.id}/${article.id}`,
        prevNext: {
          prev: prevArticle ? { title: prevArticle.title, url: `/learn/${track.id}/${prevArticle.id}` } : null,
          next: nextArticle ? { title: nextArticle.title, url: `/learn/${track.id}/${nextArticle.id}` } : null
        }
      };
      
      const output = articleTemplate(html, meta);
      const outputDir = path.join(__dirname, 'learn', track.id, article.id);
      const outputPath = path.join(outputDir, 'index.html');
      
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(outputPath, output);
      
      console.log(`✅ Built: /learn/${track.id}/${article.id}`);
      built++;
    }
  }
  
  // Build Research reports
  for (const section of content.research.sections) {
    for (const report of section.reports) {
      if (report.status !== 'published') {
        skipped++;
        continue;
      }
      
      const mdPath = path.join(__dirname, report.file);
      if (!fs.existsSync(mdPath)) {
        console.log(`⚠️  Missing: ${report.file}`);
        skipped++;
        continue;
      }
      
      const markdown = fs.readFileSync(mdPath, 'utf8');
      const html = markdownToHtml(markdown);
      
      const meta = {
        title: report.title,
        subtitle: section.title,
        date: report.date,
        section: 'Research',
        sectionUrl: '/research',
        url: `/research/${section.id}/${report.id}`
      };
      
      const output = articleTemplate(html, meta);
      const outputDir = path.join(__dirname, 'research', section.id, report.id);
      const outputPath = path.join(outputDir, 'index.html');
      
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(outputPath, output);
      
      console.log(`✅ Built: /research/${section.id}/${report.id}`);
      built++;
    }
  }
  
  console.log(`\n📦 Done! Built ${built} pages, skipped ${skipped} drafts.`);
}

build();
