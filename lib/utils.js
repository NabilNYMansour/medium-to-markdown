"use server";

var TurndownService = require('turndown').default
var cheerio = require('cheerio');

export default async function getMarkdownMD(url) {
  var turndownService = new TurndownService()
  turndownService.addRule('code blocks', {
    filter: 'pre',
    replacement: function (content) {
      return "```\n" + content + "\n```"
    }
  });

  turndownService.addRule('line breaks', {
    filter: 'br',
    replacement: function () {
      return '\n';
    }
  });

  // from https://github.com/dtesler/medium-to-markdown/blob/master/lib/convertFromUrl.js
  turndownService.addRule('mediumInlineLink', {
    filter: function (node, options) {
      return (
        options.linkStyle === 'inlined' &&
        node.nodeName === 'A' &&
        node.getAttribute('href')
      )
    },

    replacement: function (content, node) {
      var href = node.getAttribute('href')

      if (href.startsWith('/')) {
        href = "https://medium.com" + href
      }

      var title = node.title ? ' "' + node.title + '"' : ''
      return '[' + content + '](' + href + title + ')'
    }
  })

  turndownService.addRule('mediumFigure', {
    filter: 'figure',
    replacement: function (_, node) {
      var source = node.querySelector('source');
      var srcset = source ? source.getAttribute('srcset') : '';
      var caption = node.querySelector('figcaption')?.textContent;
      caption = caption ? caption : 'captionless image';

      if (srcset) {
        const srcList = srcset.split(" ");
        const bestQualityImgSrc = srcList[srcList.length - 2];
        return '![' + caption + '](' + bestQualityImgSrc + ')';
      } else {
        return "<b>[other]" + caption + "[/other]</b>";
      }
    }
  });

  turndownService.keep(['iframe']);

  // will use markdown for error messages
  try {
    const hostname = new URL(url).hostname;
    if (!hostname.includes("medium.com")) {
      return { error: true, markdown: "Invalid URL: Please use a medium.com URL." }
    }
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Referer': 'https://medium.com/',
        'Cache-Control': 'max-age=0'
      }
    }).then(res => res.text());
    const $ = cheerio.load(response);
    const articleHtml = $('article').html();
    const markdown = turndownService.turndown(articleHtml);
    let markdownCleaned = markdown.replace(/\\([^a-zA-Z0-9\s])/g, "$1");
    markdownCleaned = markdownCleaned.replace(/\[\n+/g, "[");
    markdownCleaned = markdownCleaned.replace(/\n+\]\(/g, "](");
    markdownCleaned = markdownCleaned.replace(/\[\]\(/g, "[nameless link](");
    return { error: false, markdown: markdownCleaned };
  } catch (error) {
    return { error: true, markdown: error?.message || "Error fetching the article" };
  }
}