const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// チェック対象のディレクトリ
const directoryPath = path.resolve(process.cwd(), 'dist');

// コマンドライン引数でチェック項目を指定
const args = process.argv.slice(2);
const selectedChecks = args.length > 0 ? args : ['basic', 'ogTags', 'twitterTags', 'structuredData', 'imageAlts', 'canonicalUrl'];

// 再帰的にディレクトリ内のすべてのHTMLファイルを取得
function getHtmlFiles(dir) {
  let htmlFiles = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      htmlFiles = htmlFiles.concat(getHtmlFiles(filePath));
    } else if (path.extname(file) === '.html') {
      htmlFiles.push(filePath);
    }
  }
  return htmlFiles;
}

// SEOチェック実行
(async () => {
  const htmlFiles = getHtmlFiles(directoryPath);
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const seoResults = [];

  for (const file of htmlFiles) {
    const page = await context.newPage();
    const fileUrl = `file://${file}`;
    console.log(`Checking file: ${fileUrl}`);
    await page.goto(fileUrl);

    const result = { file: file };

    // 選択されたチェック項目に応じて実行
    if (selectedChecks.includes('basic')) {
      result.basic = {
        title: await page.title(),
        metaDescription: await getMetaContent(page, 'description'),
        favicon: await getFaviconUrl(page),
      };
    }

    if (selectedChecks.includes('ogTags')) {
      const ogTags = ['og:locale', 'og:type', 'og:site_name', 'og:title', 'og:url', 'og:description', 'og:image'];
      result.ogTags = {};
      for (const tag of ogTags) {
        result.ogTags[tag] = await getMetaContent(page, tag, 'property');
      }
    }

    if (selectedChecks.includes('twitterTags')) {
      const twitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:url', 'twitter:image'];
      result.twitterTags = {};
      for (const tag of twitterTags) {
        result.twitterTags[tag] = await getMetaContent(page, tag, 'name');
      }
    }

    if (selectedChecks.includes('structuredData')) {
      result.structuredData = await checkStructuredData(page);
    }

    if (selectedChecks.includes('canonicalUrl')) {
      result.canonicalUrl = await getCanonicalUrl(page);
    }

    if (selectedChecks.includes('imageAlts')) {
      result.imageAlts = await checkImageAlts(page);
    }

    seoResults.push(result);
    await page.close();
  }

  summarizeIssues(seoResults);

  await browser.close();
})();

// ------------------------------------------------------------
// 汎用関数
// ------------------------------------------------------------
async function getMetaContent(page, name, attribute = 'name') {
  try {
    const element = await page.$(`meta[${attribute}="${name}"]`);
    if (!element) return 'Not Found';
    return await element.getAttribute('content') || 'Not Found';
  } catch {
    return 'Not Found';
  }
}

async function getFaviconUrl(page) {
  try {
    const element = await page.$('link[rel="shortcut icon"]');
    if (!element) return 'Not Found';
    return await element.getAttribute('href') || 'Not Found';
  } catch {
    return 'Not Found';
  }
}

async function checkStructuredData(page) {
  const scripts = await page.$$eval('script[type="application/ld+json"]', els =>
    els.map(el => {
      try { return JSON.parse(el.textContent); }
      catch { return null; }
    }).filter(Boolean)
  );

  const results = {};
  scripts.forEach(data => {
    if (data['@type'] === 'BreadcrumbList') results.breadcrumb = data;
    if (['Article', 'NewsArticle', 'BlogPosting'].includes(data['@type'])) results.article = data;
    if (data['@type'] === 'Organization') results.organization = data;
  });
  return results;
}

async function getCanonicalUrl(page) {
  try {
    const element = await page.$('link[rel="canonical"]');
    if (!element) return 'Not Found';
    return await element.getAttribute('href') || 'Not Found';
  } catch {
    return 'Not Found';
  }
}

async function checkImageAlts(page) {
  return await page.$$eval('img', imgs =>
    imgs.map(img => ({
      src: img.src,
      alt: img.alt || 'Missing alt attribute'
    }))
  );
}

// ------------------------------------------------------------
// ⚠️ 問題点の要約とコンソール出力
// ------------------------------------------------------------
function summarizeIssues(results) {
  let totalIssues = 0;

  for (const result of results) {
    const errors = [];

    if (result.basic && !result.basic.title) errors.push('Missing <title>');
    if (result.basic && result.basic.metaDescription === 'Not Found') errors.push('Missing meta description');
    if (result.basic && result.basic.favicon === 'Not Found') errors.push('Missing favicon');

    if (result.ogTags) {
      for (const [tag, value] of Object.entries(result.ogTags)) {
        if (value === 'Not Found') errors.push(`Missing OG tag: ${tag}`);
      }
    }

    if (result.twitterTags) {
      for (const [tag, value] of Object.entries(result.twitterTags)) {
        if (value === 'Not Found') errors.push(`Missing Twitter tag: ${tag}`);
      }
    }

    if (result.canonicalUrl === 'Not Found') errors.push('Missing canonical URL');

    if (result.imageAlts) {
      const missingAlts = result.imageAlts.filter(img => img.alt === 'Missing alt attribute');
      if (missingAlts.length > 0) errors.push(`Images missing alt attributes: ${missingAlts.length}`);
    }

    if (errors.length > 0) {
      totalIssues++;
      console.log(`\n🔍 Issues found in: ${result.file}`);
      errors.forEach(e => console.log(` ⚠️ ${e}`));
    } else {
      console.log(`\n✅ No issues found in: ${result.file}`);
    }
  }

  console.log('\n============================');
  if (totalIssues === 0) {
    console.log('🎉 All files passed SEO checks with no major issues!');
  } else {
    console.log(`🚨 ${totalIssues} file(s) have SEO issues. Please check the details above.`);
  }
  console.log('============================\n');
}