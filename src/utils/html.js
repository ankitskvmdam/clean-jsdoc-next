const { parse } = require('node-html-parser');

const HTML_SIGNATURE = '$HTML_FOUND$';

function hasAnchorElement(text) {
  if (!text) return false;

  return /<a.*href.*>*\/a>/.test(text);
}

function extractURLFromAnchorElement(text) {
  if (!text) return false;

  return text
    .replace(/.*<a/, '<a')
    .replace(/<\/a>.*/, '</a>')
    .replace('<a href="', '')
    .replace(/">.*/, '');
}

function replaceAnchorElementWithLinkElement(text) {
  if (typeof text !== 'string') return text;

  return text.replace(/<a.*href/g, '<Link href').replace(/<\/a>/g, '</Link>');
}

function doesStringContainHTML(text) {
  if (typeof text !== 'string' || text.length === 0) return false;

  let isHTML = /<.*>.*<\/.*>/.test(text);

  if (!isHTML) {
    // This will test for <br/>, <hr/> like elements
    isHTML = /<.*\/>/.test(text);
  }

  if (isHTML) {
    try {
      parse(text);
    } catch (e) {
      /**
       * If text is not parsable then it is safe to
       * return false and treat text as string.
       */
      return false;
    }
  }
  return isHTML;
}

function addHTMLHookIfValueIsHTML(value) {
  return `${HTML_SIGNATURE}${value}${HTML_SIGNATURE}`;
}

function dataStringifyReplacer(key, value, helper) {
  if (typeof key !== 'string' && typeof key !== 'number') return value;
  /**
   * We don't need comment.
   */
  if (key === 'comment') return undefined;
  /**
   * No processing for type, code and meta
   */
  if (key === 'type' || key === 'code' || key == 'meta') return value;

  if (typeof value !== 'string') return value;

  let updatedValue = value.replace(/\n/g, '');

  if (/@link/.test(updatedValue)) {
    updatedValue = helper.resolveLinks(updatedValue);
  }

  if (doesStringContainHTML(updatedValue)) {
    updatedValue = updatedValue
      .replaceAll(/{/g, '&#123;')
      .replaceAll(/}/g, '&#125;');
    updatedValue = replaceAnchorElementWithLinkElement(updatedValue);
    return addHTMLHookIfValueIsHTML(updatedValue);
  }
  return value;
}

function stringifyData(data, helper) {
  const stringData = JSON.stringify(data, (key, value) =>
    dataStringifyReplacer(key, value, helper)
  );

  return stringData
    .replaceAll(`"${HTML_SIGNATURE}`, '<>')
    .replaceAll(`${HTML_SIGNATURE}"`, '</>')
    .replaceAll(/\\"/g, "'");
}

module.exports = {
  hasAnchorElement,
  extractURLFromAnchorElement,
  stringifyData,
  replaceAnchorElementWithLinkElement,
  doesStringContainHTML,
  addHTMLHookIfValueIsHTML,
};
