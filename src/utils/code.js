const hljs = require('./hljs');

const BREAK_LINE_REGEXP = /\r\n|\r|\n/g;
const TABLE_NAME = 'hljs-ln';
const LINE_NAME = 'hljs-ln-line';
const CODE_BLOCK_NAME = 'hljs-ln-code';
const NUMBERS_BLOCK_NAME = 'hljs-ln-numbers';
const NUMBER_LINE_NAME = 'hljs-ln-n';
const DATA_ATTR_NAME = 'data-line-number';

function getLines(text) {
  if (text.length === 0) return [];
  return text.split(BREAK_LINE_REGEXP);
}

/**
 * {@link https://wcoder.github.io/notes/string-format-for-string-formating-in-javascript}
 * @param {string} format
 * @param {array} args
 */
function format(format, args) {
  return format.replace(/\{(\d+)\}/g, function (m, n) {
    return args[n] !== undefined ? args[n] : m;
  });
}

function addLineNumbersBlockFor(inputHtml, options = {}) {
  var lines = getLines(inputHtml);

  // if last line contains only carriage return remove it
  if (lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  if (lines.length > 1 || options.singleLine) {
    var html = '';

    for (var i = 0, l = lines.length; i < l; i++) {
      html += format(
        '<tr>' +
          '<td class="{0} {1}" {3}="{5}">' +
          '<div id="{5}" class="{2}" {3}="{5}">{5}</div>' +
          '</td>' +
          '<td class="{0} {4}" {3}="{5}">' +
          '{6}' +
          '</td>' +
          '</tr>',
        [
          LINE_NAME,
          NUMBERS_BLOCK_NAME,
          NUMBER_LINE_NAME,
          DATA_ATTR_NAME,
          CODE_BLOCK_NAME,
          i + 1,
          lines[i].length > 0 ? lines[i] : ' ',
        ]
      );
    }

    return format('<table class="{0}">{1}</table>', [TABLE_NAME, html]);
  }

  return inputHtml;
}

/**
 * To highlight code.
 *
 * @param {string} code Code block
 * @param {string} language target language
 * @param {boolean} addLineNumber if true then line number will be added.
 * @returns {string} highlighted code
 */
function highlightCode(code, language, addLineNumber) {
  let value = '';

  if (language) {
    value = hljs.highlight(code, { language }).value;
  } else {
    value = hljs.highlightAuto(code).value;
  }

  if (addLineNumber) {
    value = addLineNumbersBlockFor(value);
  }

  return value;
}

module.exports = {
  highlightCode,
};
