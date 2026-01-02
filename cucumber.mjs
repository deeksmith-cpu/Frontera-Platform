export default {
  paths: ['tests/bdd/features/**/*.feature'],
  require: ['tests/bdd/step-definitions/**/*.ts', 'tests/bdd/support/**/*.ts'],
  requireModule: ['tsx'],
  format: [
    'progress-bar',
    ['html', 'cucumber-report.html'],
    ['json', 'cucumber-report.json'],
  ],
  formatOptions: {
    snippetInterface: 'async-await',
  },
  publishQuiet: true,
};
