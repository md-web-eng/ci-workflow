module.exports = {
  '**/*.{ts,tsx}': ['yarn lint:es', 'git add --force'],
  '**/*.scss': ['yarn lint:style', 'git add --force'],
  '**/*.{js,json,css}': ['yarn prettier', 'git add --force'],
};
