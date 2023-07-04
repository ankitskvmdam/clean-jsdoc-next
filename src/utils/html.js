const HTML_SIGNATURE = '$HTML_FOUND$';

function hasAnchorElement(text) {
  if (!text) return false;

  return /<a.*href.*>*\/a>/.test(text);
}

function extractURLFromAnchorElement(text) {
  if (!text) return false;

  return text.replace('<a href="', '').replace(/">.*/, '').replace('.html', '');
}

function replaceAnchorElementWithLinkElement(text) {
  if (typeof text !== 'string') return text;

  return text.replace(/<a.*href/g, '<Link href').replace(/<\/a>/g, '</Link>');
}

function doesStringContainHTML(text) {
  if (typeof text !== 'string' || text.length === 0) return false;
  return /(\<(\/)?(\w)*(\d)?\>)/.test(text);
}

function addHTMLHookIfValueIsHTML(value) {
  return `${HTML_SIGNATURE}${value}${HTML_SIGNATURE}`;
}

function dataStringifyReplacer(key, value, helper) {
  if (typeof key !== 'string' && typeof key !== 'number') return value;
  if (key === 'comment') return '';
  if (typeof value !== 'string') return value;

  let updatedValue = value;

  if (/{@link .*}/.test(updatedValue)) {
    updatedValue = helper.resolveLinks(updatedValue);
  }

  if (doesStringContainHTML(updatedValue)) {
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
    .replaceAll(/href=\\"/g, 'href="')
    .replaceAll(/\\"/g, '"');
}

module.exports = {
  hasAnchorElement,
  extractURLFromAnchorElement,
  stringifyData,
  replaceAnchorElementWithLinkElement,
  doesStringContainHTML,
  addHTMLHookIfValueIsHTML,
};
