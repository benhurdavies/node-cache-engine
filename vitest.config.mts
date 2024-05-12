// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'cobertura'],
    },
    reporters: ['verbose', 'junit'],
    outputFile: './junit.xml',
    exclude: ['node_modules', 'build', '.idea', '.git', '.cache'],
    passWithNoTests: true,
  },
});
