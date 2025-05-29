module.exports = {
  plugins: {
    'postcss-calc': {},
    'postcss-discard-duplicates': {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        gird: true,
      },
      features: {
        'custom-media-queries': true,
        'custom-properties': false,
      },
      stage: 3,
    },
    'postcss-sorting': {
      'properties-order': 'alphabetical',
    },
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
