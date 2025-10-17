module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Allow any types in database files for now
    '@typescript-eslint/no-explicit-any': 'off',
    // Allow unused variables in development
    '@typescript-eslint/no-unused-vars': 'warn',
    // Allow img elements for now
    '@next/next/no-img-element': 'warn',
    // Allow missing dependencies in useEffect
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: [
    'src/lib/database.ts',
    'src/lib/dbRetry.ts',
  ],
}
