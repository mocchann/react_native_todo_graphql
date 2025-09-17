import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3000/graphql',
  documents: [
    '**/*.{ts,tsx,graphql}',
    '!**/node_modules/**',
    '!**/ios/**',
    '!**/android/**',
    '!./generated/**',
  ],
  ignoreNoDocuments: true,
  generates: {
    './generated/': {
      preset: 'client',
      config: {
        avoidOptionals: true,
      },
    },
  },
};

export default config;
