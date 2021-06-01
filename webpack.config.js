const path = require('path');
require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const devMode = process.env.NODE_ENV === 'development';
const secret = process.env.SECRET;

console.log('secret', secret);

const webpackConfig = {
  mode: devMode ? 'development' : 'production',
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: devMode ? `[name].js` : `[name].[contenthash].js`,
  },
  devtool: devMode ? 'eval-source-map' : 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? `[name].css` : `[name].[contenthash].css`,
    }),
    new HtmlWebpackPlugin({
      title: devMode ? `development title` : `PALEONTOLOGY RADAR`,
      template: `./src/index.html`,
      minify: devMode,
      hash: !devMode,
      secret,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        // use: ['css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '/assets/[name].[ext]',
          esModule: false,
        },
      },
      {
        test: /\.tsx?$/i,
        loader: 'ts-loader',
      },
    ],
  },
  devServer: {
    watchContentBase: true,
    // writeToDisk: true,
    contentBase: path.join(__dirname, 'src'),
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
  optimization: {
    minimizer: [
      `...`, // needed to have js minified in production
    ],
  },
};

if (!devMode) {
  // slow down for about 1 second so use it only for production!
  webpackConfig.optimization.minimizer.push(new CssMinimizerPlugin());
}

module.exports = webpackConfig;
