/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: [
    'next',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    '@nnmax/eslint-config-react',
    'prettier',
  ],
  rules: {
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks:
          '(useAsync|useAsyncFn|useAsyncRetry|useCustomCompareEffect|useDeepCompareEffect|useIsomorphicLayoutEffect)',
      },
    ],
    'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'always', children: 'always', propElementValues: 'always' },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'either',
        depth: 25,
      },
    ],
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
}

module.exports = config
