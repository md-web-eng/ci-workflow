module.exports = {
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-recommended-scss',
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
  ],
  plugins: [
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-order',
    'stylelint-scss',
  ],
  rules: {
    // Standard CSS Rules
    'at-rule-no-unknown': null,
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-no-missing-generic-family-keyword': true,
    'function-calc-no-unspaced-operator': true,
    'length-zero-no-unit': true,
    'no-descending-specificity': true,
    'no-empty-source': true,
    'property-no-unknown': true,
    'selector-class-pattern':
      '^(([a-z0-9][a-z0-9-]+(__[a-z0-9-]+)*?)|((--[a-z0-9-]+)?))$',
    'selector-pseudo-element-colon-notation': 'double',
    'shorthand-property-no-redundant-values': true,
    'unit-no-unknown': true,
    'value-keyword-case': 'lower',

    // SCSS Specific Rules
    'scss/at-rule-no-unknown': true,
    'scss/dollar-variable-pattern': '^[A-Z0-9]+(_[A-Z0-9]+)*?$',
    'scss/operator-no-newline-after': null,

    // Plugin Rules
    'plugin/declaration-block-no-ignored-properties': true,

    // Order Rules
    'order/order': [['custom-properties', 'declarations']],
    'order/properties-alphabetical-order': true,

    // Function Rules
    'function-name-case': 'lower',
    'function-no-unknown': null,
  },
};
