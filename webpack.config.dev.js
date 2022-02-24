const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = {
  // hot reload
  //entry: ['react-hot-loader/patch', './src/index.js'],
  entry: { home: './src/index.js', header: './src/header/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,

    // Los archivos separados por ejemplo los lazy loading
    chunkFilename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@context': path.resolve(__dirname, 'src/context/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@containers': path.resolve(__dirname, 'src/containers/'),
      '@routes': path.resolve(__dirname, 'src/routes/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css|.styl$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.(png|jpg)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/images/[name].[contenthash][ext][query]', // Directorio de salida
        },
      },
      {
        /* Agregar TypeScript */
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules',
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: true,
    },
    port: 3005,
    //hot: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      /* Minimizar imagenes .png*/
      /* npm i image-minimizer-webpack-plugin imagemin imagemin-optipng -D */
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [['optipng', { optimizationLevel: 5 }]],
          },
        },
      }),
    ],

    // Permite establecer las configuraciones que queremos separar
    splitChunks: {
      chunks: 'all',
    },
  },
};
