module.exports = {
  tags: {
    allowUnknownTags: true,
  },
  source: {
    include: ['./fixtures', './README.md'],
  },
  plugins: ['plugins/markdown'],
  opts: {
    encoding: 'utf8',
    destination: 'docs',
    recurse: true,
    tutorials: './fixtures/tutorials',
    template: './src',
  },

  clean: {
    sections: [],
  },

  templates: {
    default: {
      staticFiles: {
        include: [],
        toFlattenPath: true,
      },
    },
  },

  markdown: {
    hardwrap: false,
    idInHeadings: true,
  },
};
