const paths = require('./webpack.paths');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [paths.src + '/index.ts'],

  resolve: {
    extensions: ['.ts', '.js'],
  },

  output: {
    path: paths.build,
    filename: 'js/[name].bundle.js',
    publicPath: '/',
  },

  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        // static files
        {
          from: '**/*',
          context: paths.public,
          to: '.',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),

    // Generates an HTML file from a template
    new HtmlWebpackPlugin({
      template: paths.src + '/index.html',
    }),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // TypeScript files
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },

      // Styles: Inject Stylus into the head with source maps
      {
        test: /\.(css|styl)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },
};
