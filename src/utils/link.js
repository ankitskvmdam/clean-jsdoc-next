function hasAnchorElement(text) {
  if (!text) return false;

  return /<a.*href.*>*\/a>/.test(text);
}

function extractURLFromAnchorElement(text) {
  if (!text) return false;

  return text.replace('<a href="', '').replace(/">.*/, '').replace('.html', '');
}

module.exports = {
  hasAnchorElement,
  extractURLFromAnchorElement,
};
