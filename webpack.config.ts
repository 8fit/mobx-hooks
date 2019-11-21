import path from 'path';
import { Configuration, EnvironmentPlugin } from 'webpack';

const publicPath = '/';
const fromRoot = path.resolve.bind(null, __dirname);
const isProduction = process.env.NODE_ENV === 'production';

const configuration: Configuration = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    app: ['./src/index.ts'],
  },
  output: {
    publicPath,
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    path: fromRoot('dist'),
  },
  module: {
    rules: [
      {
        test: /\.[jt]s?$/,
        exclude: fromRoot('node_modules'),
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },
  plugins: [new EnvironmentPlugin({ NODE_ENV: 'development' })],
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

export default configuration;
