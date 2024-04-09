// @ts-check
/**
 * @typedef {Object} Answers
 * @property {'query' | 'mutation'} [type]
 * @property {string} [url]
 * @property {string} [name]
 * @property {boolean} [withPage]
 * @property {boolean} [withArrayResult]
 * @property {string} [description]
 */

export default function plopfile(
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  plop.setGenerator('api hooks', {
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'Query or Mutation?',
        choices: ['query', 'mutation'],
        default: 'query',
      },
      {
        type: 'confirm',
        name: 'suspense',
        message: 'Suspense?',
        default: false,
        when: (/** @type {Answers} */ data) => {
          return data.type === 'query'
        },
      },
      {
        type: 'input',
        name: 'url',
        message: `API URL`,
      },
      {
        type: 'input',
        name: 'name',
        message: `API Name`,
      },
      {
        type: 'list',
        name: 'method',
        message: 'HTTP Method',
        choices: ['GET', 'POST'],
        default: 'GET',
      },
      {
        type: 'confirm',
        name: 'withArray',
        message: 'With Array?',
        default: false,
        when: (/** @type {Answers} */ data) => {
          return data.type === 'query'
        },
      },
    ],
    actions: (/** @type {Answers | undefined} */ data) => {
      if (!data) throw new Error('data is required')
      /** @type {import('plop').ActionType[]} */
      const actions = [
        {
          type: 'add',
          path: `src/api/${data.type}/{{name}}.ts`,
          templateFile: `src/api/templates/${data.type}.ts.hbs`,
        },
        {
          type: 'append',
          path: `src/api/${data.type}/index.ts`,
          template: `export * from './{{name}}';`,
        },
      ]

      return actions
    },
  })
}
