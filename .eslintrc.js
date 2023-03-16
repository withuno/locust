const javascriptRules = {
  // Core ESLint
  'no-console': 'off',
  'func-names': 'off',
  'guard-for-in': 'off',
  'prefer-const': 'off',
  'no-multi-assign': 'off',
  'no-return-assign': 'off',
  'no-param-reassign': 'off',
  'no-nested-ternary': 'off',
  'no-underscore-dangle': 'off',
  'no-unused-expressions': 'off',
  'no-restricted-globals': 'off',
  'no-inner-declarations': 'off',
  'no-useless-constructor': 'off',

  // Imports
  'import/no-extraneous-dependencies': 'off',
  'unused-imports/no-unused-imports': 'warn',
  'unused-imports/no-unused-vars': 'off',

  // Prettier
  'prettier/prettier': ['error', {}, { usePrettierrc: true }],
};

const typescriptRules = {
  ...javascriptRules,
  'no-shadow': 'off', // Breaks with enums :(
  '@typescript-eslint/no-shadow': 'error',

  'consistent-return': 'off', // TypeScript effectively obsoletes this rule with static type inference
  '@typescript-eslint/comma-dangle': 'off', // Avoid conflict between ESLint and Prettier

  // Disable TypeScript rules that are too strict, too opinionated, or just noisy...
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/no-redeclare': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-for-in-array': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/restrict-template-expressions': 'off',
};

module.exports = {
  plugins: ['unused-imports'],
  extends: [
    '@ikscodes/eslint-config/rules/airbnb',
    '@ikscodes/eslint-config/rules/eslint',
    '@ikscodes/eslint-config/rules/prettier',
  ],
  rules: javascriptRules,

  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint', 'unused-imports'],
      extends: [
        '@ikscodes/eslint-config/rules/airbnb',
        '@ikscodes/eslint-config/rules/typescript',
        '@ikscodes/eslint-config/rules/eslint',
        '@ikscodes/eslint-config/rules/prettier',
      ],
      rules: typescriptRules,
      parserOptions: {
        project: '**/tsconfig.json',
      },
    },
  ],
};
