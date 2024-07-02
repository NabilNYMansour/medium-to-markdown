"use server";

var TurndownService = require('turndown').default
var cheerio = require('cheerio');
var axios = require('axios');


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
    if (new URL(url).hostname !== "medium.com") {
      return { error: true, markdown: "Invalid URL: Please use a medium.com URL." }
    }
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
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