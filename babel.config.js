module.exports = ({ env }) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        shippedProposals: true,
        ...(() => {
          if (env('test')) return { modules: 'commonjs', useBuiltIns: false };
          if (env('production')) return { modules: false, useBuiltIns: false };

          return { modules: false, useBuiltIns: 'usage', corejs: 3 };
        })(),
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    // For mobx
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    [
      'babel-plugin-module-resolver',
      { alias: { '~': './src' }, extensions: ['.ts', '.js'] },
    ],
  ],
});
