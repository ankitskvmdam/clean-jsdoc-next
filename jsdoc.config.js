module.exports = {
  tags: {
    allowUnknownTags: true,
  },
  source: {
    include: ['./demo/src', './README.md'],
  },
  plugins: ['plugins/markdown'],
  markdown: {
    hardwrap: false,
    idInHeadings: true,
  },
};
