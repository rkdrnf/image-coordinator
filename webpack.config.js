// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
let path = require("path");
let webpack = require("webpack");
const {
  CheckerPlugin
} = require('awesome-typescript-loader')

const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = (env) => {
  let plugins = [
    new webpack.DefinePlugin({
      HTTP_PROTOCOL: JSON.stringify(env.production ? 'https' : 'http'),
      WEBSOCKET_PROTOCOL: JSON.stringify(env.production ? 'wss' : 'ws'),
    }),
    new CheckerPlugin(),
    new CopyWebpackPlugin([{
      from: "views/*.html",
      flatten: true
    }, {
      from: "resources/**/*",
    }]),
  ];

  return {
    entry: './scripts/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.bundle.js'
    },

    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    devServer: {
      contentBase: [path.join(__dirname, "images"), path.join(__dirname, "views"), path.join(__dirname, "dist")],
      compress: true,
      port: 9001,
      index: 'index.html',
      historyApiFallback: {
        index: 'index.html'
      }
    },

    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',

    // Add the loader for .ts files.
    module: {
      rules: [{
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader'
        },
        {
          test: /\.(scss|css)$/,
          use: [{
            loader: "style-loader" // creates style nodes from JS strings
          }, {
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }],
        },
        {
          test: /\.(png|jpg|gif|cur)$/,
          use: [{
            loader: 'file-loader',
            options: {}
          }]
        }
      ]
    },
    plugins: plugins

  };
}

module.exports = config;