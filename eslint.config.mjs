import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// Phase 0 quality gates, expressed as lint rules.
const gates = {
  'max-lines-per-function': ['error', { max: 20, skipBlankLines: true, skipComments: true, IIFEs: true }],
  'max-params': ['error', 3],
  'max-depth': ['error', 2],
  'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
  'max-statements': ['error', 15],
  complexity: ['error', 12],
};

// Same gates downgraded to warnings for JSX-heavy app code (markup legitimately
// makes components longer than pure-logic functions).
const softGates = Object.fromEntries(
  Object.entries(gates).map(([rule, cfg]) => [rule, ['warn', ...cfg.slice(1)]]),
);

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/*.config.*',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Pure shared logic — gates enforced as errors.
  {
    files: ['packages/shared/src/**/*.ts'],
    ignores: ['**/__tests__/**', '**/*.test.ts'],
    rules: gates,
  },
  // Client/server source — gates as warnings.
  {
    files: ['apps/**/src/**/*.{ts,tsx}'],
    rules: softGates,
  },
  // Tests — length gates relaxed.
  {
    files: ['**/__tests__/**', '**/*.test.ts'],
    rules: {
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'max-statements': 'off',
    },
  },
);
